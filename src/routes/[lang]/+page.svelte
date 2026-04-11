<script lang="ts">
	import { dataStructures } from '$lib/data-structures/registry';
	import { getLocale, translate } from '$lib/i18n';
	import { sortingAlgorithms } from '$lib/sorting-algorithms/registry';

	const locale = getLocale();
	const t = (key: string) => translate(locale, key);
</script>

<h1 class="page-title">{t('nav.dataStructures')} & {t('nav.sortingAlgorithms')}</h1>

<div class="grid gap-6 md:grid-cols-2">
	<div class="treeline-card">
		<h2 class="mb-4 text-xl font-semibold">{t('nav.dataStructures')}</h2>
		<ul class="space-y-2">
			{#each dataStructures as ds}
				<li>
					<a
						href="/{locale}/data-structures/{ds.id}"
						class="text-secondary hover:underline">{t(ds.nameKey)}</a>
				</li>
			{/each}
		</ul>
	</div>

	<div class="treeline-card">
		<h2 class="mb-4 text-xl font-semibold">{t('nav.sortingAlgorithms')}</h2>
		<ul class="space-y-2">
			{#each sortingAlgorithms as algo}
				<li>
					<a
						href="/{locale}/sorting-algorithms/{algo.id}"
						class="text-secondary hover:underline">{t(algo.nameKey)}</a>
				</li>
			{/each}
		</ul>
	</div>
</div>
