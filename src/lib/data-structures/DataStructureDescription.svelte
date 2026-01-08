<script lang="ts">
	import { marked } from 'marked';
	import { onMount } from 'svelte';

	import { base } from '$app/paths';

	export let filename: string;

	let html = '';
	let loadError: string | null = null;
	let controller: AbortController | null = null;

	const normalize = (name: string) => {
		const trimmed = name.trim().replace(/^\.?(\/)+/, '');
		return trimmed.endsWith('.md') ? trimmed : `${trimmed}.md`;
	};

	const buildUrl = (target: string) => `${base}/descriptions/${target}`;

	onMount(() => {
		loadMarkdown(filename);
	});

	const loadMarkdown = async (name: string) => {
		if (!name) {
			html = '';
			loadError = null;
			return;
		}

		const target = normalize(name);
		controller?.abort();
		controller = new AbortController();

		try {
			const response = await fetch(buildUrl(target), { signal: controller.signal });
			if (!response.ok) {
				throw new Error(`Failed to load description (${response.status})`);
			}

			const markdown = await response.text();
			html = await marked.parse(markdown);
			loadError = null;
		} catch (error) {
			if ((error as Error).name === 'AbortError') return;
			html = '';
			loadError = `Description file ${target} not found or could not be loaded.`;
		}
	};
</script>

<div class="data-structure-description treeline-card mt-20 mb-5">
	{#if loadError}
		<p class="text-sm text-red-500">{loadError}</p>
	{:else if html}
		<div class="prose dark:prose-invert max-w-none">
			{@html html}
		</div>
	{/if}
</div>
