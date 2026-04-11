<script lang="ts">
	import hljs from 'highlight.js';
	import { onMount, tick } from 'svelte';
	import { cubicInOut } from 'svelte/easing';

	import Dropdown from '$lib/components/Dropdown.svelte';
	import { getLocale, translate } from '$lib/i18n';
	import { getStoredStringOption, saveStringToStorage } from '$lib/utils/storageUtils';

	import SortingPlaybackControls from '../components/SortingPlaybackControls.svelte';
	import { getCodeTemplate } from '../misc/codeTemplates';
	import type { CodeLanguage } from '../registry';
	import { dataSets, DEFAULT_ARRAY_TYPE, DEFAULT_CODE_LANGUAGE, getSortingAlgorithm, languageOptions } from '../registry';
	import type { SortingAlgorithmId } from '../misc/types';
	import type { ArrayType } from '../misc/utils';
	import { createArrayByType } from '../misc/utils';
	import { computeTargetAreaHighlight, DEFAULT_PLAYBACK_ANIMATION } from '../misc/visualUtils';
	import { StepManager } from '../steps/stepManager.svelte';
	import type { DetailedSortStep } from '../steps/stepTypes';
	import { ItemHighlightType } from '../steps/traceBuilder';

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

	const stepManager = new StepManager<DetailedSortStep>(algorithm.generateDetailedSteps(startingArray), {
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
	let arcHeightFactor = $state(0.1);

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

	function curvedFlip(
		_: Element,
		{ from, to }: { from: DOMRect; to: DOMRect },
		{ duration, easing }: { duration: number; easing: (t: number) => number },
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
			stepManager.setSteps(algorithm.generateDetailedSteps(baseArray));
			hasHydrated = true;
		});

		return () => mediaQuery.removeEventListener('change', handleChange);
	});

	function regenerateArray() {
		stepManager.stop();
		baseArray = createArrayByType(arrayType, detailArraySize);
		stepManager.setSteps(algorithm.generateDetailedSteps(baseArray));
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

		<div
			class="array-grid"
			class:array-grid-quick-overlap={isQuickSort}
			style={`grid-template-columns: repeat(${gridColumns || 1}, minmax(0, 1fr));`}>
			{#if targetAreaHighlight}
				<div
					class="merge-target-area"
					style={`left: ${targetAreaHighlight.left}; width: ${targetAreaHighlight.width}; top: ${targetAreaHighlight.top}; height: ${targetAreaHighlight.height};`}>
				</div>
			{/if}
			{#each gridCells as cell (cell.key)}
				<div
					class={cell.item ? 'array-item' : 'array-slot'}
					class:item-compared={cell.item?.highlightType === ItemHighlightType.Compare}
					class:item-moved={cell.item?.highlightType === ItemHighlightType.Move}
					class:item-sorted={cell.item?.highlightType === ItemHighlightType.Sorted}
					class:item-light={cell.item?.highlightType === ItemHighlightType.Light}
					class:item-dark={cell.item?.highlightType === ItemHighlightType.Dark}
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
		<div class="flex items-center justify-between border-b border-gray-200 pb-3">
			<h2 class="text-secondary text-lg font-bold">{t('sorting.code.title')}</h2>
			<Dropdown
				options={languageConfig.options}
				value={language}
				onchange={lang => (language = lang)}
				ariaLabel={t('sorting.code.title')} />
		</div>

		<div class="flex flex-col">
			{#each highlightedCodeLines as line, index (`${language}-${index}`)}
				<div
					class="code-line pt-0.5"
					class:code-line-active={line.codePartId === currentCodePartId}>
					<code
						class={`language-${language}`}
						style={`padding-left: ${line.indent * 12}px`}
						class:line-break={line.text === ''}>{@html line.highlightedText}&nbsp;</code>
				</div>
			{/each}
		</div>
	</div>
</div>

<style lang="postcss">
	@reference '../../../app.css';

	.detailed-layout {
		@apply grid gap-4;
		grid-template-columns: minmax(0, 65%) minmax(0, 35%);
	}

	.array-grid {
		@apply relative grid w-full gap-[0.35rem];
		--cell-height: 92px;
		--cell-height-half: 46px;
		contain: layout;
		overflow: visible;
		align-content: start;
	}

	.merge-target-area {
		@apply pointer-events-none absolute z-0;
		height: var(--cell-height);
		background: oklch(from var(--color-secondary-light) l c h / 0.4);
		border: 1px solid oklch(from var(--color-secondary) l c h / 0.6);
	}

	.array-grid-quick-overlap {
		row-gap: 0;
		padding-bottom: var(--cell-height-half);
		grid-auto-rows: var(--cell-height-half);
	}

	.array-slot {
		@apply relative z-[1] min-w-0;
		height: var(--cell-height);
	}

	.array-item {
		@apply relative z-[1] flex min-w-0 flex-row items-stretch gap-0 overflow-hidden bg-white p-0;
		height: var(--cell-height);
		border: 1px solid var(--color-primary-ultra-light);
		transition: background-color 140ms ease;
		will-change: transform;
		transform: translateZ(0);
		backface-visibility: hidden;
	}

	.value-marker-track {
		@apply flex w-[10px] shrink-0 items-end overflow-hidden;
	}

	.value-marker-fill {
		@apply w-full;
		background: var(--color-primary-dark);
	}

	.item-compared {
		@apply bg-red-300;
	}
	.item-moved {
		@apply bg-blue-300;
	}
	.item-sorted {
		@apply bg-green-200;
	}
	.item-light {
		@apply bg-cyan-300;
	}
	.item-dark {
		@apply bg-purple-300;
	}

	.code-line {
		@apply flex items-center px-1 text-sm;
		font-size: small;
	}

	.code-line code {
		@apply block w-full whitespace-pre-wrap;
	}

	.code-line-active {
		background: oklch(from var(--color-secondary-light) l c h / 0.5);
	}

	.line-break {
		max-height: 0.7em;
	}

	@media (max-width: 1040px) {
		.detailed-layout {
			grid-template-columns: 1fr;
			align-items: start;
		}
	}

	@media (max-width: 640px) {
		.array-grid {
			--cell-height: 52px;
			--cell-height-half: 26px;
		}
	}
</style>
