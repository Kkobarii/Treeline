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

<div class="mb-3 flex items-center justify-between gap-2">
	<h1 class="page-title">{t('sortingAlgorithms.insertionSort')}</h1>
	<ViewSwitcher
		algorithmId="insertion"
		view="detailed" />
</div>

<SortingDetailedView
	algorithmId="insertion"
	initialArray={data.initialDetailedArray} />

<DescriptionCard />
