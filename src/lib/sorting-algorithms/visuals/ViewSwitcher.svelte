<script lang="ts">
	import { getSortingAlgorithm } from '../misc/registry';
	import type { SortingAlgorithmId } from '../misc/types';

	let { algorithmId, view }: { algorithmId: SortingAlgorithmId; view: 'big-picture' | 'detailed' } = $props();
	const algorithm = getSortingAlgorithm(algorithmId);
</script>

<div class="mb-3 flex items-center justify-between gap-2">
	<h1 class="page-title">{algorithm.name}</h1>
	<div class="view-switcher">
		{#if view === 'big-picture'}
			<span class="switcher-option switcher-active">Big Picture</span>
			<a
				href={`/sorting-algorithms/${algorithmId}/detailed`}
				class="switcher-option switcher-inactive">
				Detailed
			</a>
		{:else}
			<a
				href={`/sorting-algorithms/${algorithmId}`}
				class="switcher-option switcher-inactive">
				Big Picture
			</a>
			<span class="switcher-option switcher-active">Detailed</span>
		{/if}
	</div>
</div>

<style>
	.view-switcher {
		display: flex;
		align-items: center;
		background-color: oklch(from var(--color-gray-100) l c h / 0.8);
		border: 1px solid oklch(from var(--color-gray-400) l c h / 0.6);
		border-radius: 1rem;
		padding: 0.4rem;
		backdrop-filter: blur(8px);
		gap: 0.25rem;
	}

	.switcher-option {
		padding: 0.5rem 1.2rem;
		text-decoration: none;
		font-size: 0.9rem;
		font-weight: 500;
		border-radius: 0.7rem;
		transition: all 200ms ease;
		cursor: pointer;
		color: var(--color-text);
	}

	.switcher-active {
		background-color: oklch(from var(--color-primary-light) l c h / 0.8);
		font-weight: 600;
	}

	.switcher-inactive:hover {
		background-color: oklch(from var(--color-gray-200) l c h / 0.8);
	}
</style>
