<script lang="ts">
	import hljs from 'highlight.js';
	import { onDestroy, tick } from 'svelte';
	import { cubicInOut } from 'svelte/easing';

	import { getCodeTemplate } from '../misc/codeTemplates';
	import { getSortingAlgorithm } from '../misc/registry';
	import type { SortingAlgorithmId } from '../misc/types';
	import { createShuffledArray } from '../misc/utils';
	import type { CodeLanguage, DetailedSortStep } from '../steps/stepTypes';
	import { ItemHighlightType } from '../steps/traceBuilder';

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

	const initialArray = createShuffledArray(16);
	let baseArray = $state(initialArray);
	let steps = $state<DetailedSortStep[]>(algorithm.generateDetailedSteps(initialArray));
	let currentStepIndex = $state(0);
	let isPlaying = $state(false);
	let delayMs = $state(450);
	let timer: number | null = null;
	let nextRunAt = $state(0);
	let lastStepAdvanceAt = $state(0);
	let fastAnimation = $state(false);

	let currentStep = $derived(steps[currentStepIndex]);
	let currentArray = $derived(currentStep ? currentStep.array : []);
	let currentRows = $derived(currentStep?.rows?.length ? currentStep.rows : currentArray.length ? [currentArray] : []);
	let gridColumns = $derived(currentArray.length);
	let gridCells = $derived(
		currentRows.flatMap((row, rowIndex) =>
			row.map((item, colIndex) => ({
				item,
				key: item ? `item-${item.value}` : `slot-${rowIndex}-${colIndex}`,
				indexLabel: item ? currentArray.findIndex(candidate => candidate.value === item.value) : -1,
			})),
		),
	);
	let currentCodePartId = $derived(currentStep ? currentStep.codePartId : '');
	let stepLabel = $derived(currentStep ? currentStep.label : 'No steps available for this array.');
	let variables = $derived(currentStep ? currentStep.variables : {});
	let useExpandedAnimationArea = $derived(algorithmId === 'merge' || algorithmId === 'quick');
	let normalFlipDurationMs = $derived(isPlaying ? Math.max(100, Math.floor(delayMs * 0.85)) : 300);
	let activeFlipDurationMs = $derived(fastAnimation ? Math.max(35, Math.floor(normalFlipDurationMs * 0.22)) : normalFlipDurationMs);
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
		if (timer !== null) {
			cancelAnimationFrame(timer);
			timer = null;
		}
	}

	function shuffleArray() {
		clearTimer();
		isPlaying = false;
		const nextArray = createShuffledArray(16);
		baseArray = nextArray;
		steps = algorithm.generateDetailedSteps(nextArray);
		currentStepIndex = 0;
	}

	async function stepForward(isManualStep = false) {
		if (!steps.length) {
			return;
		}
		if (currentStepIndex < steps.length - 1) {
			const now = performance.now();
			fastAnimation = isManualStep && now - lastStepAdvanceAt < normalFlipDurationMs;
			currentStepIndex += 1;
			lastStepAdvanceAt = now;
			if (fastAnimation) {
				await tick();
				fastAnimation = false;
			}
		} else {
			isPlaying = false;
			clearTimer();
		}
	}

	function stepForwardManual() {
		void stepForward(true);
	}

	async function stepBack(isManualStep = false) {
		clearTimer();
		isPlaying = false;
		if (currentStepIndex > 0) {
			const now = performance.now();
			fastAnimation = isManualStep && now - lastStepAdvanceAt < normalFlipDurationMs;
			currentStepIndex -= 1;
			lastStepAdvanceAt = now;
			if (fastAnimation) {
				await tick();
				fastAnimation = false;
			}
		}
	}

	function stepBackManual() {
		void stepBack(true);
	}

	function runOrPause() {
		isPlaying = !isPlaying;
	}

	$effect(() => {
		if (!isPlaying) {
			clearTimer();
			return;
		}
		clearTimer();
		nextRunAt = performance.now() + delayMs;

		const runLoop = (now: number) => {
			if (!isPlaying) {
				return;
			}
			if (now >= nextRunAt) {
				void stepForward(false);
				nextRunAt = now + delayMs;
			}
			timer = requestAnimationFrame(runLoop);
		};

		timer = requestAnimationFrame(runLoop);
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
			<button onclick={runOrPause}>{isPlaying ? 'Pause' : 'Run'}</button>
			<button
				onclick={stepBackManual}
				disabled={isPlaying || !steps.length || currentStepIndex === 0}>Back</button>
			<button
				onclick={stepForwardManual}
				disabled={isPlaying || !steps.length || currentStepIndex >= steps.length - 1}>Next</button>
		</div>

		<div class="controls-row">
			<label for="delay">Speed</label>
			<input
				id="delay"
				type="range"
				min="200"
				max="1200"
				step="20"
				bind:value={delayMs} />
			<span class="text-xs">{delayMs}ms</span>
		</div>

		<div class="flex flex-col gap-[0.35rem] text-[0.85rem]">
			<div>Step {steps.length ? currentStepIndex + 1 : 0}/{steps.length}</div>
			<div>{stepLabel}</div>
		</div>

		<div
			class="array-grid"
			class:array-grid-expanded={useExpandedAnimationArea}
			style={`grid-template-columns: repeat(${gridColumns || 1}, minmax(0, 1fr));`}>
			{#each gridCells as cell (cell.key)}
				<div
					class={cell.item ? 'array-item' : 'array-slot'}
					class:item-compared={cell.item?.highlightType === ItemHighlightType.Compare}
					class:item-moved={cell.item?.highlightType === ItemHighlightType.Move}
					class:item-sorted={cell.item?.highlightType === ItemHighlightType.Sorted}
					class:item-left={cell.item?.highlightType === ItemHighlightType.Left}
					class:item-right={cell.item?.highlightType === ItemHighlightType.Right}
					animate:curvedFlip={{
						duration: activeFlipDurationMs,
						easing: cubicInOut,
					}}>
					{#if cell.item}
						<div class="value-marker-track">
							<div
								class="value-marker-fill"
								style={`height: ${(cell.item.value / currentArray.length) * 100}%;`}>
							</div>
						</div>
						<div class="flex min-w-0 flex-1 flex-col p-[0.45rem] pl-[0.55rem]">
							<div class="flex items-center justify-center text-[0.78rem] opacity-90">
								[{cell.indexLabel}]
							</div>
							<div class="flex w-full flex-1 items-center justify-center">
								<div class="text-base font-bold">{cell.item.value}</div>
							</div>
						</div>
					{/if}
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

	.array-grid {
		@apply grid w-full gap-[0.35rem];
		contain: layout paint;
		align-content: start;
	}

	.array-grid-expanded {
		min-height: calc(92px * 5 + 0.35rem * 4);
	}

	.array-slot {
		@apply h-[92px] min-w-0;
	}

	.array-item {
		@apply flex h-[92px] min-w-0 flex-row items-stretch gap-0 overflow-hidden border p-0;
		background: var(--color-tertiary-ultra-light);
		border: 1px solid var(--color-tertiary);
		transition: background-color 140ms ease;
		will-change: transform;
		transform: translateZ(0);
		backface-visibility: hidden;
	}

	.value-marker-track {
		@apply flex w-[10px] shrink-0 items-end overflow-hidden;
		background: var(--color-tertiary-ultra-light);
	}

	.value-marker-fill {
		@apply w-full;
		background: var(--color-primary);
	}

	.item-compared {
		background: var(--color-primary-light);
	}

	.item-moved {
		background: var(--color-secondary);
	}

	.item-sorted {
		background: var(--color-primary-ultra-light);
	}

	.item-left {
		background: var(--color-gray-200);
	}

	.item-right {
		background: var(--color-gray-400);
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
