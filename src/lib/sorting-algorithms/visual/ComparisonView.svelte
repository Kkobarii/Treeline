<script lang="ts">
	import { onMount, tick } from 'svelte';

	import Dropdown from '$lib/components/Dropdown.svelte';
	import { getLocale, translate } from '$lib/i18n';
	import { dataSets, sortingAlgorithms } from '$lib/sorting-algorithms/registry';
	import { createTimer } from '$lib/utils/timer';

	import SortingBars from '../components/SortingBars.svelte';
	import type { ArrayType } from '../misc/utils';
	import { createWaitForPaint } from '../misc/visualUtils';
	import type { SortStep } from '../steps/stepTypes';
	import type { Item } from '../steps/traceBuilder';

	const locale = getLocale();
	const t = (key: string) => translate(locale, key);

	const stepDelayMs = 15;
	const arraySize = 32;

	interface CellState {
		steps: SortStep[];
		counters: { comparisons: number; swaps: number };
		currentStepIndex: number;
	}

	const arrayTypeOptions = dataSets.map(ds => ({
		type: ds.type,
		labelKey: ds.labelKey,
	}));
	const initialArrays = dataSets.map(ds => ds.generate(arraySize));
	const dropdownOptions = arrayTypeOptions.map(o => ({
		value: o.type,
		label: t(o.labelKey),
	}));

	let cellStates = $state<CellState[][]>(
		sortingAlgorithms.map(() =>
			arrayTypeOptions.map(() => ({ steps: [], counters: { comparisons: 0, swaps: 0 }, currentStepIndex: 0 })),
		),
	);
	let playingCells: boolean[][] = $state(sortingAlgorithms.map(() => arrayTypeOptions.map(() => false)));
	let finishedCells: boolean[][] = $state(sortingAlgorithms.map(() => arrayTypeOptions.map(() => false)));
	let finishOrder: (number | null)[][] = $state(sortingAlgorithms.map(() => arrayTypeOptions.map(() => null)));
	let runStats: { comparisons: number; swaps: number }[][] = $state(
		sortingAlgorithms.map(() => arrayTypeOptions.map(() => ({ comparisons: 0, swaps: 0 }))),
	);
	let columnFinishCounters: number[] = $state(arrayTypeOptions.map(() => 0));
	let playMode: 'all' | 'column' | 'row' | null = $state(null);
	let showBadges = $derived(playMode === 'all' || playMode === 'column');
	let hasReveal = $state(false);
	let selectedColumnType: ArrayType = $state('shuffled');
	let selectedTypeIndex = $derived(arrayTypeOptions.findIndex(o => o.type === selectedColumnType));

	let isAnyPlaying = $derived(playingCells.some(row => row.some(Boolean)));
	const timer = createTimer('interval');

	function resetCell(algoIndex: number, typeIndex: number) {
		const algorithm = sortingAlgorithms[algoIndex];
		const result = algorithm.generateSteps(initialArrays[typeIndex]);
		cellStates[algoIndex][typeIndex] = {
			steps: result.steps,
			counters: { comparisons: result.counters.comparisons, swaps: result.counters.swaps },
			currentStepIndex: 0,
		};
	}

	function resetAllCells() {
		for (let a = 0; a < sortingAlgorithms.length; a++) {
			for (let t = 0; t < arrayTypeOptions.length; t++) {
				resetCell(a, t);
			}
		}
	}

	function clearAll() {
		setPlayingAll(false);
		resetAllCells();
		finishedCells = sortingAlgorithms.map(() => arrayTypeOptions.map(() => false));
		finishOrder = sortingAlgorithms.map(() => arrayTypeOptions.map(() => null));
		runStats = sortingAlgorithms.map(() => arrayTypeOptions.map(() => ({ comparisons: 0, swaps: 0 })));
		columnFinishCounters = arrayTypeOptions.map(() => 0);
		playMode = null;
	}

	function setPlayingAll(value: boolean) {
		for (let a = 0; a < sortingAlgorithms.length; a++) {
			for (let t = 0; t < arrayTypeOptions.length; t++) {
				playingCells[a][t] = value;
			}
		}
	}

	function runAll() {
		clearAll();
		playMode = 'all';
		setPlayingAll(true);
	}

	function runRow(algoIndex: number) {
		clearAll();
		playMode = 'row';
		for (let t = 0; t < arrayTypeOptions.length; t++) {
			playingCells[algoIndex][t] = true;
		}
	}

	function runColumn(typeIndex: number) {
		clearAll();
		playMode = 'column';
		for (let a = 0; a < sortingAlgorithms.length; a++) {
			playingCells[a][typeIndex] = true;
		}
	}

	function getDisplayedItems(algoIndex: number, typeIndex: number): Item[] {
		const state = cellStates[algoIndex][typeIndex];
		return state.steps[state.currentStepIndex]?.array ?? [];
	}

	function tickCell(algoIndex: number, typeIndex: number): boolean {
		const state = cellStates[algoIndex][typeIndex];
		if (state.currentStepIndex < state.steps.length - 1) {
			cellStates[algoIndex][typeIndex] = {
				...state,
				currentStepIndex: state.currentStepIndex + 1,
			};
			return true;
		}
		return false;
	}

	function tickAllCells() {
		for (let a = 0; a < sortingAlgorithms.length; a++) {
			for (let t = 0; t < arrayTypeOptions.length; t++) {
				if (playingCells[a][t]) {
					if (!tickCell(a, t)) {
						playingCells[a][t] = false;
						finishedCells[a][t] = true;
						runStats[a][t] = cellStates[a][t].counters;
						if (showBadges) {
							columnFinishCounters[t] += 1;
							finishOrder[a][t] = columnFinishCounters[t];
						}
					}
				}
			}
		}
	}

	$effect(() => {
		if (!isAnyPlaying) {
			timer.stop();
			return;
		}
		timer.start(stepDelayMs, tickAllCells);
		return () => timer.stop();
	});

	$effect(() => {
		void selectedColumnType;
		clearAll();
		finishedCells = sortingAlgorithms.map(() => arrayTypeOptions.map(() => false));
		finishOrder = sortingAlgorithms.map(() => arrayTypeOptions.map(() => null));
		runStats = sortingAlgorithms.map(() => arrayTypeOptions.map(() => ({ comparisons: 0, swaps: 0 })));
		columnFinishCounters = arrayTypeOptions.map(() => 0);
	});

	onMount(async () => {
		await tick();
		await createWaitForPaint();
		hasReveal = true;
	});

	clearAll();
</script>

<div class="flex flex-col gap-4">
	<div
		class="comparison-grid hidden lg:grid"
		style="grid-template-columns: auto repeat({arrayTypeOptions.length}, 1fr);">
		<div class="comparison-header-cell">
			{#if isAnyPlaying}
				<button
					class="comparison-control-btn"
					onclick={clearAll}>
					<img
						src="/controls/stop.svg"
						alt=""
						aria-hidden="true" />
					<span class="font-semibold">{t('sorting.comparison.stop')}</span>
				</button>
			{:else}
				<button
					class="comparison-control-btn"
					onclick={runAll}>
					<img
						src="/controls/play.svg"
						alt=""
						aria-hidden="true" />
					<span class="font-semibold">{t('sorting.comparison.runAll')}</span>
				</button>
			{/if}
		</div>

		{#each arrayTypeOptions as arrayType, typeIndex}
			<div class="comparison-header-cell">
				<span class="text-[0.75rem] font-semibold">{t(arrayType.labelKey)}</span>
				<button
					class="comparison-run-btn"
					onclick={() => runColumn(typeIndex)}
					title={t('sorting.comparison.runColumn')}>
					<img
						src="/controls/play.svg"
						alt=""
						aria-hidden="true" />
				</button>
			</div>
		{/each}

		{#each sortingAlgorithms as algorithm, algoIndex}
			<div class="comparison-row-header">
				<a
					href="/{locale}/sorting-algorithms/{algorithm.id}"
					class="comparison-algo-link">
					{t(algorithm.nameKey)}
				</a>
				<button
					class="comparison-run-btn"
					onclick={() => runRow(algoIndex)}
					title={t('sorting.comparison.runRow')}>
					<img
						src="/controls/play.svg"
						alt=""
						aria-hidden="true" />
				</button>
			</div>

			{#each arrayTypeOptions as arrayType, typeIndex}
				{@const order = finishOrder[algoIndex][typeIndex]}
				{@const sat = showBadges && order !== null ? Math.max(0.2, 1 - (order - 1) * 0.15) : 1}
				{@const stats = runStats[algoIndex][typeIndex]}
				{@const finished = finishedCells[algoIndex][typeIndex]}
				<div class="comparison-cell">
					{#if showBadges && order !== null}
						<span class="finish-badge {order <= 3 ? 'finish-badge-top' : 'finish-badge-other'}">{order}</span>
					{/if}
					{#if finished}
						<div class="run-stats">
							<span class="run-stats-label">{t('sorting.comparison.swaps')}</span>
							<span class="run-stats-num">{stats.swaps}</span>
							<span class="run-stats-label">{t('sorting.comparison.comparisons')}</span>
							<span class="run-stats-num">{stats.comparisons}</span>
						</div>
					{/if}
					<div
						class="h-full"
						style={sat < 1 ? `filter: saturate(${sat});` : ''}>
						<SortingBars
							items={getDisplayedItems(algoIndex, typeIndex)}
							{hasReveal}
							transitionMs={stepDelayMs}
							mini={true} />
					</div>
				</div>
			{/each}
		{/each}
	</div>

	<div class="flex flex-col gap-3 lg:hidden">
		<div class="flex items-center gap-2">
			{#if isAnyPlaying}
				<button
					class="mobile-run-btn"
					onclick={clearAll}>
					<img
						src="/controls/stop.svg"
						alt=""
						aria-hidden="true" />
					<span class="text-[0.7rem] font-semibold">{t('sorting.comparison.stop')}</span>
				</button>
			{:else}
				<button
					class="mobile-run-btn"
					onclick={runAll}>
					<img
						src="/controls/play.svg"
						alt=""
						aria-hidden="true" />
					<span class="text-[0.7rem] font-semibold">{t('sorting.comparison.runAll')}</span>
				</button>
			{/if}
			<Dropdown
				options={dropdownOptions}
				value={selectedColumnType}
				onchange={v => (selectedColumnType = v)} />
		</div>

		{#each sortingAlgorithms as algorithm, algoIndex}
			<div class="mobile-comparison-row">
				<div class="mobile-row-header">
					<a
						href="/{locale}/sorting-algorithms/{algorithm.id}"
						class="comparison-algo-link">
						{t(algorithm.nameKey)}
					</a>
				</div>
				<div class="comparison-cell">
					{#if showBadges && finishOrder[algoIndex][selectedTypeIndex] !== null}
						{@const order = finishOrder[algoIndex][selectedTypeIndex]}
						<span class="finish-badge {order <= 3 ? 'finish-badge-top' : ''}">{order}</span>
					{/if}
					{#if finishedCells[algoIndex][selectedTypeIndex]}
						{@const stats = runStats[algoIndex][selectedTypeIndex]}
						<div class="run-stats">
							<span class="run-stats-label">{t('sorting.comparison.swaps')}</span>
							<span class="run-stats-num">{stats.swaps}</span>
							<span class="run-stats-label">{t('sorting.comparison.comparisons')}</span>
							<span class="run-stats-num">{stats.comparisons}</span>
						</div>
					{/if}
					<div class="h-full">
						<SortingBars
							items={getDisplayedItems(algoIndex, selectedTypeIndex)}
							{hasReveal}
							transitionMs={stepDelayMs}
							mini={true} />
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

<style lang="postcss">
	@reference '../../../app.css';

	.comparison-grid {
		gap: 0.5rem;
	}

	.comparison-header-cell {
		@apply flex items-center justify-center gap-1.5 rounded-md bg-gray-100 px-2 py-2 text-center;
	}

	.comparison-control-btn {
		@apply inline-flex items-center gap-1.5 rounded-md bg-transparent px-2 py-1 text-[0.7rem] font-semibold;
		border: none;
		cursor: pointer;
		transition: opacity 0.15s ease;
	}

	.comparison-control-btn:hover {
		@apply opacity-90;
	}

	.comparison-control-btn:focus {
		box-shadow: none;
	}

	.comparison-control-btn img {
		@apply h-6 w-6 dark:invert;
	}

	.comparison-row-header {
		@apply flex flex-col justify-center rounded-md bg-gray-100 px-3 py-2;
		min-width: 7rem;
	}

	.comparison-algo-link {
		@apply text-[0.8rem] font-semibold no-underline;
		color: var(--color-secondary-dark);
		transition: opacity 0.15s ease;
	}

	.comparison-algo-link:hover {
		@apply opacity-80;
	}

	.comparison-run-btn {
		@apply inline-flex shrink-0 items-center justify-start rounded bg-transparent p-0 opacity-50;
		border: none;
		cursor: pointer;
		transition: opacity 0.15s ease;
	}

	.comparison-run-btn:hover {
		@apply opacity-100;
	}

	.comparison-run-btn:focus {
		box-shadow: none;
	}

	.comparison-run-btn img {
		@apply h-6 w-6 dark:invert;
	}

	.comparison-cell {
		@apply relative overflow-hidden rounded-md border border-gray-200;
	}

	.finish-badge {
		@apply absolute top-0 left-0 z-10 flex items-center justify-center rounded-br-lg px-2 py-1 text-sm;
		background-color: oklch(from var(--color-secondary-light) l c h / 0.5);
		color: var(--color-primary-ultra-dark);
		min-width: 2rem;
	}

	.finish-badge-top {
		@apply font-bold;
	}

	.run-stats {
		@apply absolute right-2 bottom-2 z-10 grid grid-cols-[auto_auto] gap-x-2 text-[0.6rem] leading-tight font-bold text-gray-50;
	}

	.run-stats-label {
		@apply text-right;
	}

	.run-stats-num {
		@apply text-right tabular-nums;
	}

	@media (max-width: 768px) {
		.comparison-grid {
			gap: 0.25rem;
		}

		.comparison-row-header {
			min-width: 5rem;
			@apply px-2;
		}
	}

	.mobile-comparison-row {
		display: flex;
		gap: 0.5rem;
		align-items: stretch;
	}

	.mobile-comparison-row .comparison-cell {
		flex: 1;
		min-width: 0;
	}

	.mobile-row-header {
		@apply flex shrink-0 flex-col items-center justify-center rounded-md bg-gray-100 px-3 py-2;
		width: 7rem;
	}

	.mobile-run-btn {
		width: 7rem;
		gap: 0.2rem;
	}

	.mobile-run-btn img {
		@apply h-6 w-6 dark:invert;
	}
</style>
