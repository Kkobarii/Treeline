<script lang="ts">
	import { onMount, tick } from 'svelte';

	import { getLocale, translate } from '$lib/i18n';
	import { getStoredStringOption, saveStringToStorage } from '$lib/utils/storageUtils';

	import SortingBars from '../components/SortingBars.svelte';
	import SortingPlaybackControls from '../components/SortingPlaybackControls.svelte';
	import { dataSets, getSortingAlgorithm } from '../misc/registry';
	import type { SortingAlgorithmId } from '../misc/types';
	import { createArrayByType } from '../misc/utils';
	import type { ArrayType } from '../misc/utils';
	import { StepManager } from '../steps/stepManager.svelte';
	import type { SortStep } from '../steps/stepTypes';

	const locale = getLocale();
	const t = (key: string, params?: Record<string, string | number>) => translate(locale, key, params);
	const stepDelayMinMs = 5;
	const stepDelayMaxMs = 120;
	const arraySize = 100;

	let { algorithmId }: { algorithmId: SortingAlgorithmId } = $props();
	const algorithm = getSortingAlgorithm(algorithmId);

	let baseArray = $state<number[]>([]);
	let arrayType = $state<ArrayType>('shuffled');
	const stepDelayStorageKey = 'sortingFirstViewStepDelayMs';
	const arrayTypeStorageKey = 'sortingArrayType';
	let hasHydratedPreferences = $state(false);
	let hasInitialBarsReveal = $state(false);

	const validArrayTypes = dataSets.map(ds => ds.type) as readonly ArrayType[];

	const stepManager = new StepManager<SortStep>([], {
		minDelay: stepDelayMinMs,
		maxDelay: stepDelayMaxMs,
		defaultDelay: 40,
		delayStorageKey: stepDelayStorageKey,
		timerType: 'interval',
	});

	let delayMs = $state(stepManager.delayMs);
	let currentStep = $derived(stepManager.steps[stepManager.currentStepIndex]);
	let displayedArray = $derived(currentStep ? currentStep.array : []);
	let stepLabel = $derived(currentStep ? t(currentStep.stepLabel.label, currentStep.stepLabel.params) : '');
	let barTransitionMs = $derived(stepManager.isPlaying ? delayMs : 120);

	const waitForHydrationPaint = () =>
		new Promise<void>(resolve => {
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					resolve();
				});
			});
		});

	onMount(async () => {
		arrayType = getStoredStringOption(arrayTypeStorageKey, validArrayTypes, 'shuffled');
		delayMs = stepManager.delayMs;

		const nextArray = createArrayByType(arrayType, arraySize);
		baseArray = nextArray;
		stepManager.setSteps(algorithm.generateSteps(nextArray));

		await tick();
		await waitForHydrationPaint();
		hasInitialBarsReveal = true;

		hasHydratedPreferences = true;
	});

	function regenerateArray() {
		stepManager.stop();
		const nextArray = createArrayByType(arrayType, arraySize);
		baseArray = nextArray;
		stepManager.setSteps(algorithm.generateSteps(nextArray));
	}

	function changeArrayType(type: ArrayType) {
		arrayType = type;
		regenerateArray();
	}

	function onDelayChange(newDelay: number) {
		delayMs = newDelay;
		stepManager.setDelay(newDelay);
	}

	$effect(() => {
		if (!hasHydratedPreferences || typeof window === 'undefined') {
			return;
		}
		saveStringToStorage(arrayTypeStorageKey, arrayType);
	});
</script>

<div class="treeline-card flex flex-col gap-4">
	<SortingPlaybackControls
		stepDescription={stepLabel}
		currentStep={stepManager.steps.length ? stepManager.currentStepIndex + 1 : 0}
		totalSteps={stepManager.steps.length}
		isPlaying={stepManager.isPlaying}
		canStepBackward={stepManager.steps.length > 0 && stepManager.currentStepIndex > 0}
		canStepForward={stepManager.steps.length > 0 && stepManager.currentStepIndex < stepManager.steps.length - 1}
		minDelay={stepDelayMinMs}
		maxDelay={stepDelayMaxMs}
		{delayMs}
		{onDelayChange}
		{arrayType}
		onShuffle={regenerateArray}
		onArrayTypeChange={changeArrayType}
		onTogglePlay={() => stepManager.toggle()}
		onStepBackward={() => void stepManager.stepBackward()}
		onStepForward={() => void stepManager.stepForward()} />

	<SortingBars
		items={displayedArray}
		hasReveal={hasInitialBarsReveal}
		transitionMs={barTransitionMs} />
</div>
