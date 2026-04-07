<script lang="ts">
	import { onMount, tick } from 'svelte';

	import { getLocale, translate } from '$lib/i18n';
	import { getStoredStringOption, saveStringToStorage } from '$lib/utils/storageUtils';

	import SortingBars from '../components/SortingBars.svelte';
	import SortingPlaybackControls from '../components/SortingPlaybackControls.svelte';
	import { dataSets, DEFAULT_ARRAY_TYPE, getSortingAlgorithm } from '../misc/registry';
	import type { SortingAlgorithmId } from '../misc/types';
	import type { ArrayType } from '../misc/utils';
	import { createArrayByType } from '../misc/utils';
	import { createWaitForPaint, DEFAULT_PLAYBACK_INTERVAL } from '../misc/visualUtils';
	import { StepManager } from '../steps/stepManager.svelte';
	import type { SortStep } from '../steps/stepTypes';

	const locale = getLocale();
	const t = (key: string, params?: Record<string, string | number>) => translate(locale, key, params);

	let { algorithmId }: { algorithmId: SortingAlgorithmId } = $props();

	const algorithm = getSortingAlgorithm(algorithmId);
	let arraySize = $state(100);

	function updateArraySize() {
		arraySize = window.matchMedia('(max-width: 640px)').matches ? 50 : 100;
		regenerateArray();
	}

	const arrayConfig = {
		storageKey: 'sortingArrayType',
		validTypes: dataSets.map(ds => ds.type) as readonly ArrayType[],
	} as const;

	const playback = DEFAULT_PLAYBACK_INTERVAL;

	let stepManager: StepManager<SortStep> | undefined = $state();
	let baseArray = $state<number[]>([]);
	let arrayType = $state<ArrayType>(DEFAULT_ARRAY_TYPE);
	let delayMs = $state(playback.defaultDelayMs);
	let hasHydrated = $state(false);
	let hasInitialBarsReveal = $state(false);

	let currentStep = $derived(stepManager?.steps[stepManager?.currentStepIndex ?? 0]);
	let displayedArray = $derived(currentStep?.array ?? []);
	let stepLabel = $derived(currentStep ? t(currentStep.stepLabel.label, currentStep.stepLabel.params) : '');
	let barTransitionMs = $derived((stepManager?.isPlaying ?? false) ? delayMs : 120);

	onMount(() => {
		updateArraySize();
		const mediaQuery = window.matchMedia('(max-width: 640px)');
		mediaQuery.addEventListener('change', updateArraySize);

		stepManager = new StepManager<SortStep>([], {
			minDelay: playback.minDelayMs,
			maxDelay: playback.maxDelayMs,
			defaultDelay: playback.defaultDelayMs,
			delayStorageKey: playback.storageKey,
			timerType: 'interval',
		});

		arrayType = getStoredStringOption(arrayConfig.storageKey, arrayConfig.validTypes, DEFAULT_ARRAY_TYPE);
		delayMs = stepManager.delayMs;

		baseArray = createArrayByType(arrayType, arraySize);
		stepManager.setSteps(algorithm.generateSteps(baseArray));

		void tick().then(() => {
			void createWaitForPaint().then(() => {
				hasInitialBarsReveal = true;
				hasHydrated = true;
			});
		});

		return () => mediaQuery.removeEventListener('change', updateArraySize);
	});

	function regenerateArray() {
		stepManager?.stop();
		baseArray = createArrayByType(arrayType, arraySize);
		stepManager?.setSteps(algorithm.generateSteps(baseArray));
	}

	function changeArrayType(type: ArrayType) {
		arrayType = type;
		regenerateArray();
	}

	function onDelayChange(newDelay: number) {
		delayMs = newDelay;
		stepManager?.setDelay(newDelay);
	}

	$effect(() => {
		if (!hasHydrated) return;
		saveStringToStorage(arrayConfig.storageKey, arrayType);
	});
</script>

<div class="treeline-card flex flex-col gap-4">
	<SortingPlaybackControls
		playbackState={{
			stepDescription: stepLabel,
			currentStep: stepManager?.steps.length ? (stepManager?.currentStepIndex ?? 0) + 1 : 0,
			totalSteps: stepManager?.steps.length ?? 0,
			isPlaying: stepManager?.isPlaying ?? false,
			canStepBackward: (stepManager?.steps.length ?? 0) > 0 && (stepManager?.currentStepIndex ?? 0) > 0,
			canStepForward:
				(stepManager?.steps.length ?? 0) > 0 && (stepManager?.currentStepIndex ?? 0) < (stepManager?.steps.length ?? 0) - 1,
		}}
		delayConfig={{ ...playback, delayMs, onDelayChange }}
		arrayConfig={{ arrayType, onArrayTypeChange: changeArrayType, onShuffle: regenerateArray }}
		navigation={{
			onTogglePlay: () => stepManager?.toggle(),
			onStepBackward: () => void stepManager?.stepBackward(),
			onStepForward: () => void stepManager?.stepForward(),
		}} />

	<SortingBars
		items={displayedArray}
		hasReveal={hasInitialBarsReveal}
		transitionMs={barTransitionMs} />
</div>
