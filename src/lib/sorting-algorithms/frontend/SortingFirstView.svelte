<script lang="ts">
	import { onDestroy } from 'svelte';

	import {
		createShuffledArray,
		getSortingAlgorithm,
		sortingAlgorithms,
		type SortingAlgorithmId,
		type SortStep,
	} from '$lib/sorting-algorithms/backend';

	let { algorithmId }: { algorithmId: SortingAlgorithmId } = $props();
	const algorithm = getSortingAlgorithm(algorithmId);

	let baseArray = $state(createShuffledArray(100));
	let steps = $state<SortStep[]>([]);
	let currentStepIndex = $state(0);
	let isPlaying = $state(false);
	let stepDelayMs = $state(40);
	let timer: ReturnType<typeof setInterval> | null = null;

	let currentStep = $derived(steps[currentStepIndex]);
	let displayedArray = $derived(currentStep ? currentStep.array : baseArray);
	let activeIndices = $derived(currentStep ? currentStep.activeIndices : []);
	let movedIndices = $derived(currentStep ? currentStep.movedIndices : []);
	let sortedIndices = $derived(currentStep ? currentStep.sortedIndices : []);
	let stepLabel = $derived(currentStep ? currentStep.label : 'Press "Generate Steps" or "Run" to start.');

	function clearTimer() {
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
	}

	function regenerateArray() {
		clearTimer();
		isPlaying = false;
		baseArray = createShuffledArray(100);
		steps = [];
		currentStepIndex = 0;
	}

	function generateSteps() {
		clearTimer();
		isPlaying = false;
		steps = algorithm.generateSteps(baseArray);
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
		if (!steps.length) {
			generateSteps();
		}

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

	function resetPlayback() {
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
		timer = setInterval(() => {
			tickForward();
		}, stepDelayMs);

		return () => clearTimer();
	});

	onDestroy(() => {
		clearTimer();
	});
</script>

<h1 class="page-title">{algorithm.name} — Big picture</h1>

<p
	class="mb-3 text-sm"
	style="color: var(--color-text);">
	{algorithm.description}
</p>

<div class="treeline-card sorting-card">
	<div class="sorting-controls">
		<button onclick={regenerateArray}>Shuffle 100 Keys</button>
		<button onclick={generateSteps}>Generate Steps</button>
		<button onclick={runOrPause}>{isPlaying ? 'Pause' : 'Run'}</button>
		<button
			onclick={stepBackward}
			disabled={!steps.length || currentStepIndex === 0}>Step Back</button>
		<button
			onclick={stepForward}
			disabled={!steps.length || currentStepIndex >= steps.length - 1}>Step Forward</button>
		<button
			onclick={resetPlayback}
			disabled={!steps.length}>Reset</button>
		<label
			class="speed-label"
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

	<div class="step-meta">
		<span>Step {steps.length ? currentStepIndex + 1 : 0}/{steps.length}</span>
		<span>{stepLabel}</span>
	</div>

	<div class="bars-wrapper">
		{#each displayedArray as value, index}
			<div
				class="sort-bar"
				class:bar-active={activeIndices.includes(index)}
				class:bar-moved={movedIndices.includes(index)}
				class:bar-sorted={sortedIndices.includes(index)}
				style={`height: ${Math.max(value, 1)}%;`}>
			</div>
		{/each}
	</div>
</div>

<style>
	.sorting-card {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.sorting-controls {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		align-items: center;
	}

	.bars-wrapper {
		height: 26rem;
		display: grid;
		grid-template-columns: repeat(100, minmax(0, 1fr));
		align-items: end;
		gap: 2px;
		padding: 0.75rem;
		border-radius: 0.75rem;
		background-color: var(--color-tertiary-ultra-light);
		border: 1px solid var(--color-tertiary);
	}

	.sort-bar {
		border-radius: 0.125rem;
		background-color: var(--color-primary-light);
		transition:
			height 120ms linear,
			background-color 120ms ease;
	}

	.bar-active {
		background-color: var(--color-primary);
	}

	.bar-moved {
		background-color: var(--color-secondary-dark);
	}

	.bar-sorted {
		background-color: var(--color-green-700);
	}

	.step-meta {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		font-size: 0.85rem;
		color: var(--color-text);
	}

	.speed-label {
		margin-left: 0.5rem;
	}

	@media (max-width: 768px) {
		.bars-wrapper {
			height: 18rem;
			gap: 1px;
		}
	}
</style>
