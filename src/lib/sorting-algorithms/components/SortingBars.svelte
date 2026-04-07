<script lang="ts">
	import { ItemHighlightType } from '../steps/traceBuilder';
	import type { SortingBarsProps } from './SortingBars.types';

	let { items, hasReveal = true, transitionMs = 120, mini = false }: SortingBarsProps = $props();

	let maxValue = $derived(items.length > 0 ? Math.max(...items.map(item => item.value)) : 1);
	let columns = $derived(items.length);
</script>

<div
	class="bars-wrapper"
	class:bars-mini={mini}
	style="grid-template-columns: repeat({columns}, minmax(0, 1fr));">
	{#each items as item}
		<div
			class="sort-bar"
			class:bar-compared={item.highlightType === ItemHighlightType.Compare}
			class:bar-moved={item.highlightType === ItemHighlightType.Move}
			class:bar-sorted={item.highlightType === ItemHighlightType.Sorted}
			style={`height: ${Math.max((item.value / maxValue) * 100, 1)}%; transform: scaleY(${hasReveal ? 1 : 0}); transition: transform 360ms ease-out, height ${transitionMs}ms linear, background-color ${transitionMs}ms ease;`}>
		</div>
	{/each}
</div>

<style lang="postcss">
	@reference "../../../app.css";

	.bars-wrapper {
		@apply grid items-end gap-[2px] rounded-xl bg-white p-3;
		height: 26rem;
	}

	.bars-mini {
		@apply rounded-md p-1;
		height: 5rem;
		content-visibility: auto;
		gap: 0 !important;
	}

	.bars-mini .sort-bar {
		@apply rounded-none;
	}

	.sort-bar {
		@apply rounded-sm bg-gray-300;
		transform-origin: bottom;
	}

	.bar-compared {
		@apply bg-red-500;
	}

	.bar-moved {
		@apply bg-blue-500;
	}

	.bar-sorted {
		@apply bg-green-500;
	}

	@media (max-width: 768px) {
		.bars-wrapper {
			@apply h-36 gap-px;
		}

		.bars-mini {
			height: 3.5rem;
		}
	}
</style>
