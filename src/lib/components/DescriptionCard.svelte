<script lang="ts">
	import { marked } from 'marked';

	import { base } from '$app/paths';

	import { getLocale, translate } from '$lib/i18n';

	const { filename }: { filename: string } = $props();

	const locale = getLocale();
	const t = (key: string, params?: Record<string, string | number>) => translate(locale, key, params);

	let html = $state('');
	let loadError = $state<string | null>(null);
	let controller: AbortController | null = null;

	const normalize = (name: string, loc: string) => {
		const trimmed = name.trim().replace(/^\.?(\/)+/, '');
		// Remove any existing .md extension then add locale suffix
		const base = trimmed.replace(/\.md$/, '');
		return `${base}.${loc}.md`;
	};

	const buildUrl = (target: string) => `${base}/descriptions/${target}`;

	const loadMarkdown = async (name: string, loc: string) => {
		if (!name) {
			html = '';
			loadError = null;
			return;
		}

		const target = normalize(name, loc);
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
			loadError = t('description.notFound', { filename: target });
		}
	};

	$effect(() => {
		loadMarkdown(filename, locale);
	});
</script>

<div class="treeline-card">
	<noscript class="prose">
		<h1>{t('description.title')}</h1>
		<p>{t('description.noJs')}</p>
		{#if filename}
			<p>
				{t('description.readRaw')}
				<a
					href={buildUrl(normalize(filename, 'en'))}
					class="text-primary underline">
					{normalize(filename, 'en')}
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
