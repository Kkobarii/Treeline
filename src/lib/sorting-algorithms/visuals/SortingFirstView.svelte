<script lang="ts">
	import { onDestroy } from 'svelte';

	import { getSortingAlgorithm } from '../misc/registry';
	import type { SortingAlgorithmId } from '../misc/types';
	import { createShuffledArray } from '../misc/utils';
	import type { SortStep } from '../steps/stepTypes';
	import { ItemHighlightType } from '../steps/traceBuilder';

	let { algorithmId }: { algorithmId: SortingAlgorithmId } = $props();
	const algorithm = getSortingAlgorithm(algorithmId);

	const initialArray = createShuffledArray(100);
	let baseArray = $state(initialArray);
	let steps = $state<SortStep[]>(algorithm.generateSteps(initialArray));
	let currentStepIndex = $state(0);
	let isPlaying = $state(false);
	let stepDelayMs = $state(40);
	let timer: ReturnType<typeof setInterval> | null = null;

	let currentStep = $derived(steps[currentStepIndex]);
	let displayedArray = $derived(currentStep ? currentStep.array : []);
	let stepLabel = $derived(currentStep ? currentStep.label : 'No steps available for this array.');

	function clearTimer() {
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
	}

	function regenerateArray() {
		clearTimer();
		isPlaying = false;
		const nextArray = createShuffledArray(100);
		baseArray = nextArray;
		steps = algorithm.generateSteps(nextArray);
		currentStepIndex = 0;
	}

	function tickForward() {
		if (!steps.length) {
			return;
		}

		if (currentStepIndex >= steps.length - 1) {
			isPlaying = false;
			clearTimer();
			return;
		}

		currentStepIndex += 1;
	}

	function runOrPause() {
		isPlaying = !isPlaying;
	}

	function stepForward() {
		clearTimer();
		isPlaying = false;
		tickForward();
	}

	function stepBackward() {
		clearTimer();
		isPlaying = false;
		currentStepIndex = Math.max(0, currentStepIndex - 1);
	}

	$effect(() => {
		if (!isPlaying) {
			clearTimer();
			return;
		}

		clearTimer();
		timer = setInterval(() => {
			tickForward();
		}, stepDelayMs);

		return () => clearTimer();
	});

	onDestroy(() => {
		clearTimer();
	});
</script>

<p
	class="mb-3 text-sm"
	style="color: var(--color-text);">
	{algorithm.description}
</p>

<div class="treeline-card flex flex-col gap-4">
	<div class="flex flex-wrap items-center gap-2">
		<button onclick={regenerateArray}>Shuffle 100 Keys</button>
		<button onclick={runOrPause}>{isPlaying ? 'Pause' : 'Run'}</button>
		<button
			onclick={stepBackward}
			disabled={!steps.length || currentStepIndex === 0}>Step Back</button>
		<button
			onclick={stepForward}
			disabled={!steps.length || currentStepIndex >= steps.length - 1}>Step Forward</button>
		<label
			class="ml-2"
			for="speed-slider">Speed</label>
		<input
			id="speed-slider"
			type="range"
			min="10"
			max="120"
			step="5"
			bind:value={stepDelayMs} />
		<span class="text-xs">{stepDelayMs}ms</span>
	</div>

	<div
		class="flex flex-col gap-[0.4rem] text-[0.85rem]"
		style="color: var(--color-text);">
		<span>Step {steps.length ? currentStepIndex + 1 : 0}/{steps.length}</span>
		<span>{stepLabel}</span>
	</div>

	<div class="bars-wrapper">
		{#each displayedArray as item}
			<div
				class="sort-bar"
				class:bar-compared={item.highlightType === ItemHighlightType.Compare}
				class:bar-moved={item.highlightType === ItemHighlightType.Move}
				class:bar-sorted={item.highlightType === ItemHighlightType.Sorted}
				style={`height: ${Math.max(item.value, 1)}%;`}>
			</div>
		{/each}
	</div>
</div>

<style lang="postcss">
	@reference "../../../app.css";

	.bars-wrapper {
		@apply grid h-[26rem] items-end gap-[2px] rounded-xl border p-3;
		grid-template-columns: repeat(100, minmax(0, 1fr));
		background-color: var(--color-tertiary-ultra-light);
		border: 1px solid var(--color-tertiary);
	}

	.sort-bar {
		@apply rounded-sm;
		background-color: var(--color-green-300);
		transition:
			height 120ms linear,
			background-color 120ms ease;
	}

	.bar-compared {
		background-color: var(--color-green-600);
	}

	.bar-moved {
		background-color: var(--color-secondary-dark);
	}

	.bar-sorted {
		background-color: var(--color-green-400);
	}

	@media (max-width: 768px) {
		.bars-wrapper {
			@apply h-72 gap-px;
		}
	}
</style>
