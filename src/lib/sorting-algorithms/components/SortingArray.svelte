<script lang="ts">
	import { cubicInOut } from 'svelte/easing';

	import { ItemHighlightType } from '../steps/traceBuilder';
	import type { SortingArrayProps } from './SortingArray.types';

	let { gridColumns, gridCells, targetAreaHighlight, isQuickSort, activeFlipDurationMs, currentArray, onItemClick }: SortingArrayProps =
		$props();

	let arcHeightFactor = $state(0.1);
	const maxValue = $derived(currentArray.reduce((max, item) => Math.max(max, item.value), 0));

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
</script>

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
			class={cell.item ? `array-item ${onItemClick ? 'cursor-pointer' : ''} ${onItemClick ? 'searching' : 'default'}` : 'array-slot'}
			class:item-compared={cell.item?.highlightType === ItemHighlightType.Compare}
			class:item-moved={cell.item?.highlightType === ItemHighlightType.Move}
			class:item-sorted={cell.item?.highlightType === ItemHighlightType.Sorted}
			class:item-light={cell.item?.highlightType === ItemHighlightType.Light}
			class:item-dark={cell.item?.highlightType === ItemHighlightType.Dark}
			animate:curvedFlip={{
				duration: activeFlipDurationMs,
				easing: cubicInOut,
			}}
			{...onItemClick && cell.item
				? {
						onclick: () => onItemClick(cell.item!.value),
						role: 'button',
						tabindex: 0,
						onkeydown: (e: KeyboardEvent) => e.key === 'Enter' && onItemClick(cell.item!.value),
					}
				: {}}>
			{#if cell.item}
				<div class="value-marker-track">
					<div
						class="value-marker-fill"
						style={`height: ${(cell.item.value / maxValue) * 100}%;`}>
					</div>
				</div>
				<div class="flex min-w-0 flex-1 flex-col p-[0.45rem] pl-[0.55rem]">
					<div class="flex items-center justify-center text-[0.78rem] opacity-90 select-none">
						[{cell.indexLabel}]
					</div>
					<div class="flex w-full flex-1 items-center justify-center">
						<div class="text-base font-bold select-none">{cell.item.value}</div>
					</div>
				</div>
			{/if}
		</div>
	{/each}
</div>

<style lang="postcss">
	@reference '../../../app.css';

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
	}

	.array-item.cursor-pointer {
		cursor: pointer;
	}

	.array-item.cursor-pointer:active {
		transform: translateY(1px);
		background: var(--color-primary-ultra-light);
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

	.array-item.searching.item-light {
		@apply bg-gray-100;
	}
	.array-item.searching.item-dark {
		@apply bg-gray-300;
	}

	@media (max-width: 640px) {
		.array-grid {
			--cell-height: 52px;
			--cell-height-half: 26px;
		}
	}
</style>
