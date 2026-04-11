<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="treeline-card">
	{#if page.data.descriptionError}
		<p class="text-sm text-red-500">{page.data.descriptionError}</p>
	{:else if page.data.descriptionHtml}
		<div class="prose dark:prose-invert max-w-none">
			{@html page.data.descriptionHtml}
		</div>
	{/if}
</div>

<style>
	:global(.treeline-card .prose h1),
	:global(.treeline-card .prose h2),
	:global(.treeline-card .prose h3) {
		color: var(--color-secondary);
		font-weight: 700;
		margin-top: 1.5rem;
		margin-bottom: 0.75rem;
	}

	:global(.treeline-card .prose h1) {
		font-size: 2rem;
		margin-top: 0;
	}

	:global(.treeline-card .prose h2) {
		font-size: 1.5rem;
		border-bottom: 2px solid var(--color-secondary-light);
		padding-bottom: 0.5rem;
	}

	:global(.treeline-card .prose h3) {
		font-size: 1.25rem;
	}

	:global(.treeline-card .prose p) {
		line-height: 1.6;
		margin-bottom: 1rem;
	}

	:global(.treeline-card .prose ul),
	:global(.treeline-card .prose ol) {
		margin-bottom: 1rem;
		margin-left: 1.5rem;
		list-style: revert;
	}

	:global(.treeline-card .prose li) {
		margin-bottom: 0.25rem;
		line-height: 1.6;
	}

	:global(.treeline-card .prose li p) {
		display: inline;
		margin-bottom: 0;
	}

	:global(.treeline-card .prose table) {
		width: auto;
		border-collapse: collapse;
		margin: 1rem 0;
		border: 1px solid var(--color-gray-300);
		border-radius: 0.5rem;
		overflow: hidden;
	}

	:global(.treeline-card .prose th) {
		background-color: var(--color-secondary);
		color: white;
		font-weight: 600;
		padding: 0.75rem 1rem;
		text-align: left;
	}

	:global(.treeline-card .prose td) {
		padding: 0.75rem 1rem;
		border-top: 1px solid var(--color-gray-300);
	}

	:global(.treeline-card .prose tbody tr:hover) {
		background-color: var(--color-gray-100);
	}

	@media (max-width: 768px) {
		:global(.treeline-card .prose h1) {
			font-size: 1.5rem;
		}

		:global(.treeline-card .prose h2) {
			font-size: 1.25rem;
		}

		:global(.treeline-card .prose h3) {
			font-size: 1.1rem;
		}
	}
</style>
