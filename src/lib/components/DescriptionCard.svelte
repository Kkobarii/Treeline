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
