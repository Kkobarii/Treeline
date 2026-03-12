<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import { getLocale, translate } from '$lib/i18n';

	import { getSortingAlgorithm } from '../misc/registry';
	import type { SortingAlgorithmId } from '../misc/types';
	import { createShuffledArray } from '../misc/utils';
	import type { SortStep } from '../steps/stepTypes';
	import { ItemHighlightType } from '../steps/traceBuilder';

	const locale = getLocale();
	const t = (key: string, params?: Record<string, string | number>) => translate(locale, key, params);

	let { algorithmId }: { algorithmId: SortingAlgorithmId } = $props();
	const algorithm = getSortingAlgorithm(algorithmId);

	const initialArray = createShuffledArray(100);
	let baseArray = $state(initialArray);
	let steps = $state<SortStep[]>(algorithm.generateSteps(initialArray));
	let currentStepIndex = $state(0);
	let isPlaying = $state(false);
	let stepDelayMs = $state(40);
	let timer: ReturnType<typeof setInterval> | null = null;
	const stepDelayStorageKey = 'sortingFirstViewStepDelayMs';
	let hasHydratedPreferences = $state(false);

	let currentStep = $derived(steps[currentStepIndex]);
	let displayedArray = $derived(currentStep ? currentStep.array : []);
	let stepLabel = $derived(currentStep ? currentStep.label : t('sorting.noSteps'));
	let barTransitionMs = $derived(isPlaying ? stepDelayMs : 120);

	function clearTimer() {
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
	}

	onMount(() => {
		const storedDelay = Number(sessionStorage.getItem(stepDelayStorageKey));
		if (Number.isFinite(storedDelay) && storedDelay >= 10 && storedDelay <= 120) {
			stepDelayMs = storedDelay;
		}
		hasHydratedPreferences = true;
	});

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

	$effect(() => {
		if (!hasHydratedPreferences || typeof window === 'undefined') {
			return;
		}

		sessionStorage.setItem(stepDelayStorageKey, String(stepDelayMs));
	});

	onDestroy(() => {
		clearTimer();
	});
</script>

<div class="treeline-card flex flex-col gap-4">
	<div class="flex flex-wrap items-center gap-2">
		<button onclick={regenerateArray}>{t('sorting.controls.shuffle', { count: 100 })}</button>
		<button onclick={runOrPause}>{isPlaying ? t('common.pause') : t('common.run')}</button>
		<button
			onclick={stepBackward}
			disabled={!steps.length || currentStepIndex === 0}>{t('sorting.controls.stepBack')}</button>
		<button
			onclick={stepForward}
			disabled={!steps.length || currentStepIndex >= steps.length - 1}>{t('sorting.controls.stepForward')}</button>
		<label
			class="ml-2"
			for="speed-slider">{t('common.speed')}</label>
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
		<span>{t('common.step')} {steps.length ? currentStepIndex + 1 : 0}/{steps.length}</span>
		<span>{stepLabel}</span>
	</div>

	<div class="bars-wrapper">
		{#each displayedArray as item}
			<div
				class="sort-bar"
				class:bar-compared={item.highlightType === ItemHighlightType.Compare}
				class:bar-moved={item.highlightType === ItemHighlightType.Move}
				class:bar-sorted={item.highlightType === ItemHighlightType.Sorted}
				style={`height: ${Math.max(item.value, 1)}%; transition: height ${barTransitionMs}ms linear, background-color ${barTransitionMs}ms ease;`}>
			</div>
		{/each}
	</div>
</div>

<style lang="postcss">
	@reference "../../../app.css";

	.bars-wrapper {
		@apply grid h-[26rem] items-end gap-[2px] rounded-xl border p-3;
		grid-template-columns: repeat(100, minmax(0, 1fr));
		background-color: var(--color-white);
		border: 1px solid var(--color-gray-200);
	}

	.sort-bar {
		@apply rounded-sm;
		background-color: var(--color-green-300);
	}

	.bar-compared {
		background-color: var(--color-green-600);
	}

	.bar-moved {
		background-color: var(--color-green-800);
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
