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

<div class="treeline-card">
	<noscript class="prose">
		<h1>Description</h1>
		<p>Description content loads dynamically and JavaScript is currently disabled.</p>
		{#if filename}
			<p>
				You can still read the raw description here:
				<a
					href={buildUrl(normalize(filename))}
					class="text-primary underline">
					{normalize(filename)}
				</a>
			</p>
		{/if}
	</noscript>

	{#if loadError}
		<p class="text-sm text-red-500">{loadError}</p>
	{:else if html}
		<div class="prose dark:prose-invert max-w-none">
			{@html html}
		</div>
	{/if}
</div>
