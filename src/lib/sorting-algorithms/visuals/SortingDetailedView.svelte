<script lang="ts">
	import hljs from 'highlight.js';
	import { onDestroy } from 'svelte';
	import { cubicInOut } from 'svelte/easing';

	import { getCodeTemplate } from '../misc/codeTemplates';
	import { getSortingAlgorithm } from '../misc/registry';
	import type { SortingAlgorithmId } from '../misc/types';
	import { createShuffledArray } from '../misc/utils';
	import type { CodeLanguage, DetailedSortStep } from '../steps/stepTypes';

	let { algorithmId }: { algorithmId: SortingAlgorithmId } = $props();
	const algorithm = getSortingAlgorithm(algorithmId);
	const codeTemplate = getCodeTemplate(algorithmId);

	let language = $state<CodeLanguage>('python');
	let codeLines = $derived(codeTemplate[language]);
	let highlightedCodeLines = $derived(
		codeLines.map(line => ({
			...line,
			highlightedText: hljs.highlight(line.text, { language }).value,
		})),
	);

	let baseArray = $state(createShuffledArray(16));
	let steps = $state<DetailedSortStep[]>([]);
	let currentStepIndex = $state(0);
	let isPlaying = $state(false);
	let delayMs = $state(450);
	let timer: ReturnType<typeof setInterval> | null = null;

	let currentStep = $derived(steps[currentStepIndex]);
	let currentArray = $derived(currentStep ? currentStep.array : baseArray);
	let indicesHighlighted = $derived(currentStep ? currentStep.indicesHighlighted : []);
	let movedIndices = $derived(currentStep ? currentStep.movedIndices : []);
	let sortedIndices = $derived(currentStep ? currentStep.sortedIndices : []);
	let currentCodePartId = $derived(currentStep ? currentStep.codePartId : '');
	let isCompareStep = $derived(currentCodePartId.includes('compare'));
	let stepLabel = $derived(currentStep ? currentStep.label : 'Generate steps to start the detailed simulation.');
	let variables = $derived(currentStep ? currentStep.variables : {});
	let flipDurationMs = $derived(Math.max(100, Math.floor(delayMs * 0.85)));
	let arcHeightFactor = $state(0.1);

	function curvedFlip(
		_: Element,
		{ from, to }: { from: DOMRect; to: DOMRect },
		{
			duration,
			easing,
		}: {
			duration: number;
			easing: (t: number) => number;
		},
	) {
		const dx = from.left - to.left;
		const dy = from.top - to.top;
		const direction = dx === 0 ? 0 : dx > 0 ? -1 : 1;
		const arcHeight = direction === 0 ? 0 : Math.min(36, Math.max(10, Math.abs(dx) * arcHeightFactor));

		return {
			duration,
			easing,
			css: (t: number, u: number) => {
				const curvedOffsetY = direction * arcHeight * Math.sin(Math.PI * t);
				return `transform: translate(${u * dx}px, ${u * dy + curvedOffsetY}px);`;
			},
		};
	}

	function clearTimer() {
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
	}

	function shuffleArray() {
		clearTimer();
		isPlaying = false;
		baseArray = createShuffledArray(16);
		steps = [];
		currentStepIndex = 0;
	}

	function generateDetailedSteps() {
		clearTimer();
		isPlaying = false;
		steps = algorithm.generateDetailedSteps(baseArray);
		currentStepIndex = 0;
	}

	function stepForward() {
		if (!steps.length) {
			return;
		}
		if (currentStepIndex < steps.length - 1) {
			currentStepIndex += 1;
		} else {
			isPlaying = false;
			clearTimer();
		}
	}

	function stepBack() {
		clearTimer();
		isPlaying = false;
		currentStepIndex = Math.max(0, currentStepIndex - 1);
	}

	function runOrPause() {
		if (!steps.length) {
			generateDetailedSteps();
		}
		isPlaying = !isPlaying;
	}

	function reset() {
		clearTimer();
		isPlaying = false;
		currentStepIndex = 0;
	}

	$effect(() => {
		if (!isPlaying) {
			clearTimer();
			return;
		}
		clearTimer();
		timer = setInterval(stepForward, delayMs);
		return () => clearTimer();
	});

	onDestroy(() => clearTimer());
</script>

<!-- <link
	rel="stylesheet"
	href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/default.min.css" /> -->
<link
	rel="stylesheet"
	href="//unpkg.com/@catppuccin/highlightjs@1.0.1/css/catppuccin-latte.css" />

<div class="detailed-layout">
	<div class="treeline-card flex flex-col gap-[0.85rem]">
		<div class="controls-row">
			<button onclick={shuffleArray}>Shuffle 16</button>
			<button onclick={generateDetailedSteps}>Generate</button>
			<button onclick={runOrPause}>{isPlaying ? 'Pause' : 'Run'}</button>
			<button
				onclick={stepBack}
				disabled={!steps.length || currentStepIndex === 0}>Back</button>
			<button
				onclick={stepForward}
				disabled={!steps.length || currentStepIndex >= steps.length - 1}>Next</button>
			<button
				onclick={reset}
				disabled={!steps.length}>Reset</button>
		</div>

		<div class="controls-row">
			<label for="delay">Speed</label>
			<input
				id="delay"
				type="range"
				min="180"
				max="1200"
				step="20"
				bind:value={delayMs} />
			<span class="text-xs">{delayMs}ms</span>
		</div>

		<div class="flex flex-col gap-[0.35rem] text-[0.85rem]">
			<div>Step {steps.length ? currentStepIndex + 1 : 0}/{steps.length}</div>
			<div>{stepLabel}</div>
		</div>

		<div class="array-row">
			{#each currentArray as value, index (value)}
				<div
					class="array-item"
					class:item-active={indicesHighlighted.includes(index) && !isCompareStep}
					class:item-compared={indicesHighlighted.includes(index) && isCompareStep}
					class:item-moved={movedIndices.includes(index)}
					class:item-sorted={sortedIndices.includes(index)}
					animate:curvedFlip={{
						duration: flipDurationMs,
						easing: cubicInOut,
					}}>
					<div class="value-marker-track">
						<div
							class="value-marker-fill"
							style={`height: ${(value / 16) * 100}%;`}>
						</div>
					</div>
					<div class="flex min-w-0 flex-1 flex-col p-[0.45rem] pl-[0.55rem]">
						<div class="flex items-center justify-center text-[0.78rem] opacity-90">[{index}]</div>
						<div class="flex w-full flex-1 items-center justify-center">
							<div class="text-base font-bold">{value}</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<div class="treeline-card flex flex-col gap-[0.85rem]">
		<div class="flex items-center justify-between">
			<h2>Algorithm Code</h2>
			<select bind:value={language}>
				<option value="python">Python</option>
				<option value="javascript">JavaScript</option>
				<option value="c">C</option>
			</select>
		</div>

		<div class="flex flex-col">
			{#each highlightedCodeLines as line, index (`${language}-${index}`)}
				<div
					class="code-line"
					class:code-line-active={line.codePartId === currentCodePartId}>
					<code
						class={`language-${language}`}
						style={`padding-left: ${line.indent * 12}px`}>{@html line.highlightedText}</code>
				</div>
			{/each}
		</div>

		<!-- <div class="pt-[0.3rem]">
			<h3>Variables</h3>
			{#if Object.keys(variables).length === 0}
				<div class="text-sm">No tracked variables for this step.</div>
			{:else}
				<div class="grid grid-cols-2 gap-[0.45rem]">
					{#each Object.entries(variables) as [key, value]}
						<div class="variable-entry">
							<span class="variable-key">{key}</span>
							<span class="variable-value">{value}</span>
						</div>
					{/each}
				</div>
			{/if}
		</div> -->
	</div>
</div>

<style lang="postcss">
	@reference "../../../app.css";

	.detailed-layout {
		@apply grid gap-4;
		grid-template-columns: minmax(0, 70%) minmax(0, 30%);
	}

	.controls-row {
		@apply flex flex-wrap items-center gap-[0.45rem];
	}

	.array-row {
		@apply grid w-full gap-[0.35rem];
		grid-template-columns: repeat(16, minmax(0, 1fr));
	}

	.array-item {
		@apply flex h-[92px] min-w-0 flex-row items-stretch gap-0 overflow-hidden border p-0;
		background: var(--color-tertiary-ultra-light);
		border: 1px solid var(--color-tertiary);
		transition: background-color 140ms ease;
	}

	.value-marker-track {
		@apply flex w-[10px] shrink-0 items-end overflow-hidden;
		background: var(--color-tertiary-ultra-light);
	}

	.value-marker-fill {
		@apply w-full;
		background: var(--color-primary);
	}

	.item-active {
		background: var(--color-primary-ultra-light);
	}

	.item-compared {
		background: var(--color-primary-light);
	}

	.item-moved {
		background: var(--color-secondary);
	}

	.item-sorted {
		border-color: var(--color-primary);
	}

	.code-line {
		@apply pr-1 pl-1 text-sm;
		background: var(--color-tertiary-ultra-light);
		min-height: 24px;
		display: flex;
		align-items: center;
	}

	.code-line code {
		display: block;
		width: 100%;
		white-space: pre-wrap;
	}

	.code-line-active {
		background: oklch(from var(--color-primary-light) l c h / 0.5);
	}

	@media (max-width: 1040px) {
		.detailed-layout {
			grid-template-columns: 1fr;
		}
	}
</style>
