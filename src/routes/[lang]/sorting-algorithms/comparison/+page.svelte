<script lang="ts">
	import DescriptionCard from '$lib/components/DescriptionCard.svelte';
	import { getLocale, translate } from '$lib/i18n';
	import ComparisonView from '$lib/sorting-algorithms/visual/ComparisonView.svelte';

	const locale = getLocale();
	const t = (key: string) => translate(locale, key);
</script>

<div class="page-header">
	<h1 class="page-title">{t('sorting.comparison.title')}</h1>
</div>

<div class="treeline-card">
	<ComparisonView />
</div>

<DescriptionCard />
