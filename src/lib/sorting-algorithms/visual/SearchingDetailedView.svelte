<script lang="ts">
	import hljs from 'highlight.js';
	import { onMount, tick } from 'svelte';

	import { getLocale, translate } from '$lib/i18n';
	import SortingArray from '$lib/sorting-algorithms/components/SortingArray.svelte';
	import SortingPlaybackControls from '$lib/sorting-algorithms/components/SortingPlaybackControls.svelte';
	import SortingPseudocode from '$lib/sorting-algorithms/components/SortingPseudocode.svelte';
	import { getCodeTemplate } from '$lib/sorting-algorithms/misc/codeTemplates';
	import type { SearchingAlgorithmId } from '$lib/sorting-algorithms/misc/types';
	import type { ArrayType } from '$lib/sorting-algorithms/misc/utils';
	import { createArrayByType } from '$lib/sorting-algorithms/misc/utils';
	import { DEFAULT_PLAYBACK_ANIMATION } from '$lib/sorting-algorithms/misc/visualUtils';
	import type { CodeLanguage } from '$lib/sorting-algorithms/registry';
	import { getSearchingAlgorithm, languageOptions } from '$lib/sorting-algorithms/registry';
	import { StepManager } from '$lib/sorting-algorithms/steps/stepManager.svelte';
	import type { DetailedSortStep } from '$lib/sorting-algorithms/steps/stepTypes';
	import { getStoredStringOption, saveStringToStorage } from '$lib/utils/storageUtils';

	const locale = getLocale();
	const t = (key: string, params?: Record<string, string | number>) => translate(locale, key, params);
	const DEFAULT_ARRAY_TYPE = 'discontinuous';

	let {
		algorithmId,
		initialArray,
	}: {
		algorithmId: SearchingAlgorithmId;
		initialArray?: number[];
	} = $props();

	const algorithm = $derived(getSearchingAlgorithm(algorithmId));
	const codeTemplate = $derived(getCodeTemplate(algorithmId));

	const playback = DEFAULT_PLAYBACK_ANIMATION;
	const languageConfig = {
		storageKey: 'searchingDetailedViewCodeLanguage',
		options: languageOptions.map(opt => ({
			value: opt.id,
			label: t(opt.labelKey),
		})),
		validValues: languageOptions.map(o => o.id),
	};
	const arrayConfig = {
		storageKey: 'searchingArrayType',
		validTypes: ['discontinuous'] as const,
	};

	let language = $state<CodeLanguage>('python');
	let codeLines = $derived(codeTemplate.codes[language] || []);
	let highlightedCodeLines = $derived(
		codeLines.map(line => ({
			...line,
			highlightedText: hljs.highlight(line.text, { language }).value,
		})),
	);

	const startingArray = initialArray?.length ? [...initialArray] : createArrayByType(DEFAULT_ARRAY_TYPE, 16);
	let detailArraySize = $state(16);
	let baseArray = $state(startingArray);
	let arrayType = $state<ArrayType>(DEFAULT_ARRAY_TYPE);
	let hasHydrated = $state(false);
	let lastStepAdvanceAt = $state(0);
	let fastAnimation = $state(false);
	let cellHeight = $state(92);

	let targetValue = $state(0);
	let maxArrayValue = $derived(baseArray.length);

	function updateSizes() {
		detailArraySize = window.matchMedia('(max-width: 425px)').matches ? 8 : 16;
		cellHeight = window.matchMedia('(max-width: 640px)').matches ? 52 : 92;
		regenerateArray();
	}

	const stepManager = $derived.by(
		() =>
			new StepManager<DetailedSortStep>(algorithm.generateDetailedSteps(startingArray).steps, {
				minDelay: playback.minDelayMs,
				maxDelay: playback.maxDelayMs,
				defaultDelay: playback.defaultDelayMs,
				delayStorageKey: playback.storageKey,
				timerType: 'animation',
			}),
	);

	let delayMs = $state(playback.defaultDelayMs);
	let currentStep = $derived(stepManager.steps[stepManager.currentStepIndex]);
	let currentArray = $derived(currentStep?.array ?? []);
	let currentRows = $derived(currentStep?.rows?.length ? currentStep.rows : currentArray.length ? [currentArray] : []);
	let gridColumns = $derived(currentArray.length);
	let gridCells = $derived(
		currentRows.flatMap((row, rowIndex) =>
			row.map((item, colIndex) => ({
				item,
				key: item ? `item-${item.id}` : `slot-${rowIndex}-${colIndex}`,
				indexLabel: item ? currentArray.findIndex(c => c.id === item.id) : -1,
			})),
		),
	);
	let currentCodePartId = $derived(currentStep?.codePartId ?? '');
	let stepLabel = $derived(currentStep ? t(currentStep.stepLabel.label, currentStep.stepLabel.params) : '');
	let variables = $derived(currentStep?.variables ?? {});

	let isMergeSort = $derived(false);
	let isQuickSort = $derived(false);
	let useExpandedAnimationArea = $derived(false);
	let targetAreaHighlight = $derived(null);

	let normalFlipDurationMs = $derived(stepManager.isPlaying ? Math.max(100, Math.floor(delayMs * 0.85)) : 300);
	let activeFlipDurationMs = $derived(fastAnimation ? Math.max(35, Math.floor(normalFlipDurationMs * 0.22)) : normalFlipDurationMs);

	function animateCardHeight(node: HTMLElement) {
		let previousHeight = node.offsetHeight;
		let isAnimating = false;

		const resizeObserver = new ResizeObserver(() => {
			if (isAnimating) return;
			const nextHeight = node.offsetHeight;
			if (Math.abs(nextHeight - previousHeight) < 1) return;

			isAnimating = true;
			node.style.overflow = 'hidden';

			const animation = node.animate([{ height: `${previousHeight}px` }, { height: `${nextHeight}px` }], {
				duration: 280,
				easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
			});

			animation.onfinish = animation.oncancel = () => {
				previousHeight = node.offsetHeight;
				node.style.overflow = '';
				isAnimating = false;
			};
		});

		resizeObserver.observe(node);
		return { destroy: () => resizeObserver.disconnect() };
	}

	async function stepWithAnimation(stepFn: () => Promise<void>, canStep: () => boolean, isManualStep = false) {
		if (!stepManager.steps.length) return;
		if (canStep()) {
			const now = performance.now();
			fastAnimation = isManualStep && now - lastStepAdvanceAt < normalFlipDurationMs;
			await stepFn();
			lastStepAdvanceAt = now;
			if (fastAnimation) {
				await tick();
				fastAnimation = false;
			}
		}
	}

	function stepForwardManual() {
		void stepWithAnimation(
			() => stepManager.stepForward(true),
			() => stepManager.currentStepIndex < stepManager.steps.length - 1,
			true,
		);
	}

	function stepBackManual() {
		void stepWithAnimation(
			() => stepManager.stepBackward(true),
			() => stepManager.currentStepIndex > 0,
			true,
		);
	}

	onMount(() => {
		updateSizes();
		const mediaQuery = window.matchMedia('(max-width: 640px)');
		const handleChange = () => {
			updateSizes();
		};
		mediaQuery.addEventListener('change', handleChange);

		language = getStoredStringOption(languageConfig.storageKey, languageConfig.validValues, 'python');
		arrayType = getStoredStringOption(arrayConfig.storageKey, arrayConfig.validTypes, DEFAULT_ARRAY_TYPE);
		delayMs = stepManager.delayMs;

		void tick().then(() => {
			baseArray = createArrayByType(arrayType, detailArraySize);
			targetValue = baseArray[Math.floor(baseArray.length / 2)];
			stepManager.setSteps(algorithm.generateDetailedSteps(baseArray, targetValue).steps);
			hasHydrated = true;
		});

		return () => mediaQuery.removeEventListener('change', handleChange);
	});

	function regenerateArray() {
		stepManager.stop();
		baseArray = createArrayByType(arrayType, detailArraySize);
		// targetValue = baseArray[Math.floor(baseArray.length / 2)];
		stepManager.setSteps(algorithm.generateDetailedSteps(baseArray, targetValue).steps);
	}

	function changeArrayType(type: ArrayType) {
		arrayType = type;
		regenerateArray();
	}

	function onTargetChange(value: number) {
		targetValue = value;
		stepManager.stop();
		stepManager.setSteps(algorithm.generateDetailedSteps(baseArray, targetValue).steps);
	}

	function handleItemClick(value: number) {
		onTargetChange(value);
	}

	function onDelayChange(newDelay: number) {
		delayMs = newDelay;
		stepManager.setDelay(newDelay);
	}

	$effect(() => {
		if (!hasHydrated) return;
		saveStringToStorage(languageConfig.storageKey, language);
		saveStringToStorage(arrayConfig.storageKey, arrayType);
	});
</script>

<link
	rel="stylesheet"
	href="//unpkg.com/@catppuccin/highlightjs@1.0.1/css/catppuccin-latte.css" />

<div class="detailed-layout">
	<div
		class="treeline-card flex flex-col gap-[0.85rem]"
		use:animateCardHeight>
		<SortingPlaybackControls
			playbackState={{
				stepDescription: stepLabel,
				currentStep: stepManager.steps.length ? stepManager.currentStepIndex + 1 : 0,
				totalSteps: stepManager.steps.length,
				isPlaying: stepManager.isPlaying,
				canStepBackward: stepManager.steps.length > 0 && stepManager.currentStepIndex > 0,
				canStepForward: stepManager.steps.length > 0 && stepManager.currentStepIndex < stepManager.steps.length - 1,
			}}
			delayConfig={{ ...playback, delayMs, onDelayChange }}
			arrayConfig={{ arrayType, onArrayTypeChange: changeArrayType, onShuffle: regenerateArray }}
			targetConfig={{ targetValue, minTargetValue: -99, maxTargetValue: 99, onTargetChange }}
			navigation={{ onTogglePlay: () => stepManager.toggle(), onStepBackward: stepBackManual, onStepForward: stepForwardManual }} />

		<SortingArray
			{gridColumns}
			{gridCells}
			{targetAreaHighlight}
			{isQuickSort}
			{activeFlipDurationMs}
			{currentArray}
			onItemClick={handleItemClick} />
	</div>

	{#key algorithmId}
		<SortingPseudocode
			{language}
			languageOptions={languageConfig.options}
			{highlightedCodeLines}
			{currentCodePartId}
			onLanguageChange={lang => (language = lang)} />
	{/key}
</div>

<style lang="postcss">
	@reference '../../../app.css';

	.detailed-layout {
		@apply grid gap-4;
		grid-template-columns: minmax(0, 65%) minmax(0, 35%);
	}

	@media (max-width: 1040px) {
		.detailed-layout {
			grid-template-columns: 1fr;
			align-items: start;
		}
	}
</style>
