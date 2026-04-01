<script lang="ts">
	import { onDestroy, onMount, tick } from 'svelte';

	import { getLocale, translate } from '$lib/i18n';

	import SortingPlaybackControls from '../components/SortingPlaybackControls.svelte';
	import { getSortingAlgorithm } from '../misc/registry';
	import type { SortingAlgorithmId } from '../misc/types';
	import { createArrayByType } from '../misc/utils';
	import type { ArrayType } from '../misc/utils';
	import type { SortStep } from '../steps/stepTypes';
	import { ItemHighlightType } from '../steps/traceBuilder';

	const locale = getLocale();
	const t = (key: string, params?: Record<string, string | number>) => translate(locale, key, params);
	const stepDelayMinMs = 5;
	const stepDelayMaxMs = 120;
	const arraySize = 100;

	let { algorithmId }: { algorithmId: SortingAlgorithmId } = $props();
	const algorithm = getSortingAlgorithm(algorithmId);

	let baseArray = $state<number[]>([]);
	let steps = $state<SortStep[]>([]);
	let currentStepIndex = $state(0);
	let isPlaying = $state(false);
	let stepDelayMs = $state(40);
	let arrayType = $state<ArrayType>('shuffled');
	let timer: ReturnType<typeof setInterval> | null = null;
	const stepDelayStorageKey = 'sortingFirstViewStepDelayMs';
	const arrayTypeStorageKey = 'sortingArrayType';
	let hasHydratedPreferences = $state(false);
	let hasInitialBarsReveal = $state(false);

	let currentStep = $derived(steps[currentStepIndex]);
	let displayedArray = $derived(currentStep ? currentStep.array : []);
	let stepLabel = $derived(currentStep ? t(currentStep.stepLabel.label, currentStep.stepLabel.params) : '');
	let barTransitionMs = $derived(isPlaying ? stepDelayMs : 120);
	let maxValue = $derived(displayedArray.length > 0 ? Math.max(...displayedArray.map(item => item.value)) : 1);

	function clearTimer() {
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
	}

	const waitForHydrationPaint = () =>
		new Promise<void>(resolve => {
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					resolve();
				});
			});
		});

	const validArrayTypes: ArrayType[] = ['shuffled', 'almost-sorted', 'reverse', 'duplicates'];

	onMount(async () => {
		const storedDelay = Number(sessionStorage.getItem(stepDelayStorageKey));
		if (Number.isFinite(storedDelay) && storedDelay >= stepDelayMinMs && storedDelay <= stepDelayMaxMs) {
			stepDelayMs = storedDelay;
		}

		const storedArrayType = sessionStorage.getItem(arrayTypeStorageKey);
		if (storedArrayType && validArrayTypes.includes(storedArrayType as ArrayType)) {
			arrayType = storedArrayType as ArrayType;
		}

		const nextArray = createArrayByType(arrayType, arraySize);
		baseArray = nextArray;
		steps = algorithm.generateSteps(nextArray);
		currentStepIndex = 0;

		await tick();
		await waitForHydrationPaint();
		hasInitialBarsReveal = true;

		hasHydratedPreferences = true;
	});

	function regenerateArray() {
		clearTimer();
		isPlaying = false;
		const nextArray = createArrayByType(arrayType, arraySize);
		baseArray = nextArray;
		steps = algorithm.generateSteps(nextArray);
		currentStepIndex = 0;
	}

	function changeArrayType(type: ArrayType) {
		arrayType = type;
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
		sessionStorage.setItem(arrayTypeStorageKey, arrayType);
	});

	onDestroy(() => {
		clearTimer();
	});
</script>

<div class="treeline-card flex flex-col gap-4">
	<SortingPlaybackControls
		stepDescription={stepLabel}
		currentStep={steps.length ? currentStepIndex + 1 : 0}
		totalSteps={steps.length}
		{isPlaying}
		canStepBackward={steps.length > 0 && currentStepIndex > 0}
		canStepForward={steps.length > 0 && currentStepIndex < steps.length - 1}
		minDelay={stepDelayMinMs}
		maxDelay={stepDelayMaxMs}
		bind:delayMs={stepDelayMs}
		{arrayType}
		onShuffle={regenerateArray}
		onArrayTypeChange={changeArrayType}
		onTogglePlay={runOrPause}
		onStepBackward={stepBackward}
		onStepForward={stepForward} />

	<div class="bars-wrapper">
		{#each displayedArray as item}
			<div
				class="sort-bar"
				class:bar-compared={item.highlightType === ItemHighlightType.Compare}
				class:bar-moved={item.highlightType === ItemHighlightType.Move}
				class:bar-sorted={item.highlightType === ItemHighlightType.Sorted}
				style={`height: ${Math.max((item.value / maxValue) * 100, 1)}%; transform: scaleY(${hasInitialBarsReveal ? 1 : 0}); transition: transform 360ms ease-out, height ${barTransitionMs}ms linear, background-color ${barTransitionMs}ms ease;`}>
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
		background-color: var(--color-gray-500);
		transform-origin: bottom;
	}

	.bar-compared {
		background-color: var(--color-red-500);
	}

	.bar-moved {
		background-color: var(--color-blue-500);
	}

	.bar-sorted {
		background-color: var(--color-green-500);
	}

	@media (max-width: 768px) {
		.bars-wrapper {
			@apply h-72 gap-px;
		}
	}
</style>
