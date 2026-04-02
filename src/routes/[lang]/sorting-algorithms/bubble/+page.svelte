<script lang="ts">
	import DescriptionCard from '$lib/components/DescriptionCard.svelte';
	import { getLocale, translate } from '$lib/i18n';
	import SortingFirstView from '$lib/sorting-algorithms/visuals/SortingFirstView.svelte';
	import ViewSwitcher from '$lib/sorting-algorithms/visuals/ViewSwitcher.svelte';

	const locale = getLocale();
	const t = (key: string) => translate(locale, key);
</script>

<div class="page-header">
	<h1 class="page-title">{t('sortingAlgorithms.bubbleSort')}</h1>
	<ViewSwitcher
		algorithmId="bubble"
		view="big-picture" />
</div>

<SortingFirstView algorithmId="bubble" />

<DescriptionCard />
