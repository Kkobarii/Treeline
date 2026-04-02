<script lang="ts">
	import DescriptionCard from '$lib/components/DescriptionCard.svelte';
	import { getLocale, translate } from '$lib/i18n';
	import SortingDetailedView from '$lib/sorting-algorithms/visuals/SortingDetailedView.svelte';
	import ViewSwitcher from '$lib/sorting-algorithms/visuals/ViewSwitcher.svelte';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const locale = getLocale();
	const t = (key: string) => translate(locale, key);
</script>

<div class="page-header">
	<h1 class="page-title">{t('sortingAlgorithms.selectionSort')}</h1>
	<ViewSwitcher
		algorithmId="selection"
		view="detailed" />
</div>

<SortingDetailedView
	algorithmId="selection"
	initialArray={data.initialDetailedArray} />

<DescriptionCard />
