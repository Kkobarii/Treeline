<script lang="ts">
	import DescriptionCard from '$lib/components/DescriptionCard.svelte';
	import { getLocale, translate } from '$lib/i18n';
	import SortingFirstView from '$lib/sorting-algorithms/visual/SortingFirstView.svelte';
	import ViewSwitcher from '$lib/sorting-algorithms/visual/ViewSwitcher.svelte';

	const locale = getLocale();
	const t = (key: string) => translate(locale, key);
</script>

<div class="page-header">
	<h1 class="page-title">{t('sortingAlgorithms.quickSort')}</h1>
	<ViewSwitcher
		algorithmId="quick"
		view="big-picture" />
</div>

<SortingFirstView algorithmId="quick" />

<DescriptionCard />
