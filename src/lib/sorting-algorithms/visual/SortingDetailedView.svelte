<script lang="ts">
	import hljs from 'highlight.js';
	import { onMount, tick } from 'svelte';

	import SortingArray from '../components/SortingArray.svelte';
	import SortingPseudocode from '../components/SortingPseudocode.svelte';
	import { getLocale, translate } from '$lib/i18n';
	import { getStoredStringOption, saveStringToStorage } from '$lib/utils/storageUtils';

	import SortingPlaybackControls from '../components/SortingPlaybackControls.svelte';
	import { getCodeTemplate } from '../misc/codeTemplates';
	import type { SortingAlgorithmId } from '../misc/types';
	import type { ArrayType } from '../misc/utils';
	import { createArrayByType } from '../misc/utils';
	import { computeTargetAreaHighlight, DEFAULT_PLAYBACK_ANIMATION } from '../misc/visualUtils';
	import type { CodeLanguage } from '../registry';
	import { dataSets, DEFAULT_ARRAY_TYPE, DEFAULT_CODE_LANGUAGE, getSortingAlgorithm, languageOptions } from '../registry';
	import { StepManager } from '../steps/stepManager.svelte';
	import type { DetailedSortStep } from '../steps/stepTypes';

	const locale = getLocale();
	const t = (key: string, params?: Record<string, string | number>) => translate(locale, key, params);

	let {
		algorithmId,
		initialArray,
	}: {
		algorithmId: SortingAlgorithmId;
		initialArray?: number[];
	} = $props();

	const algorithm = getSortingAlgorithm(algorithmId);
	const codeTemplate = getCodeTemplate(algorithmId);

	const playback = DEFAULT_PLAYBACK_ANIMATION;
	const languageConfig = {
		storageKey: 'sortingDetailedViewCodeLanguage',
		options: languageOptions.map(opt => ({
			value: opt.id,
			label: t(opt.labelKey),
		})),
		validValues: languageOptions.map(o => o.id),
	};
	const arrayConfig = {
		storageKey: 'sortingArrayType',
		validTypes: dataSets.map(ds => ds.type) as readonly ArrayType[],
	};

	let language = $state<CodeLanguage>(DEFAULT_CODE_LANGUAGE);
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

	function updateSizes() {
		detailArraySize = window.matchMedia('(max-width: 425px)').matches ? 8 : 16;
		cellHeight = window.matchMedia('(max-width: 640px)').matches ? 52 : 92;
		regenerateArray();
	}

	const stepManager = new StepManager<DetailedSortStep>(algorithm.generateDetailedSteps(startingArray).steps, {
		minDelay: playback.minDelayMs,
		maxDelay: playback.maxDelayMs,
		defaultDelay: playback.defaultDelayMs,
		delayStorageKey: playback.storageKey,
		timerType: 'animation',
	});

	let delayMs = $state(stepManager.delayMs);
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

	let isMergeSort = $derived(algorithmId === 'merge');
	let isQuickSort = $derived(algorithmId === 'quick');
	let useExpandedAnimationArea = $derived(isMergeSort || isQuickSort);
	let targetAreaHighlight = $derived(
		useExpandedAnimationArea ? computeTargetAreaHighlight(variables, gridColumns, algorithmId, cellHeight) : null,
	);

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

		language = getStoredStringOption(languageConfig.storageKey, languageConfig.validValues, DEFAULT_CODE_LANGUAGE);
		arrayType = getStoredStringOption(arrayConfig.storageKey, arrayConfig.validTypes, DEFAULT_ARRAY_TYPE);
		delayMs = stepManager.delayMs;

		void tick().then(() => {
			baseArray = createArrayByType(arrayType, detailArraySize);
			stepManager.setSteps(algorithm.generateDetailedSteps(baseArray).steps);
			hasHydrated = true;
		});

		return () => mediaQuery.removeEventListener('change', handleChange);
	});

	function regenerateArray() {
		stepManager.stop();
		baseArray = createArrayByType(arrayType, detailArraySize);
		stepManager.setSteps(algorithm.generateDetailedSteps(baseArray).steps);
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
			navigation={{ onTogglePlay: () => stepManager.toggle(), onStepBackward: stepBackManual, onStepForward: stepForwardManual }} />

		<SortingArray
			{gridColumns}
			{gridCells}
			{targetAreaHighlight}
			{isQuickSort}
			{activeFlipDurationMs}
			{currentArray} />
	</div>

	<SortingPseudocode
		language={language}
		languageOptions={languageConfig.options}
		{highlightedCodeLines}
		currentCodePartId={currentCodePartId}
		onLanguageChange={(lang) => (language = lang)} />
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
