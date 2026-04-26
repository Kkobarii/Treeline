<script lang="ts">
	import { onMount } from 'svelte';

	import DescriptionCard from '$lib/components/DescriptionCard.svelte';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import { getLocale, translate } from '$lib/i18n';
	import type { SearchingAlgorithmId } from '$lib/sorting-algorithms/misc/types';
	import SearchingDetailedView from '$lib/sorting-algorithms/visual/SearchingDetailedView.svelte';
	import { getStoredStringOption, saveStringToStorage } from '$lib/utils/storageUtils';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const locale = getLocale();
	const t = (key: string) => translate(locale, key);

	const algorithmOptions = [
		{ value: 'linear' as SearchingAlgorithmId, label: t('sortingAlgorithms.linearSearch') },
		{ value: 'binary' as SearchingAlgorithmId, label: t('sortingAlgorithms.binarySearch') },
	];

	let selectedAlgorithm = $state<SearchingAlgorithmId>('linear');

	onMount(() => {
		const stored = getStoredStringOption('searchingAlgorithm', ['linear', 'binary'] as const, 'linear');
		selectedAlgorithm = stored;
	});

	function onAlgorithmChange(algorithm: SearchingAlgorithmId) {
		selectedAlgorithm = algorithm;
		saveStringToStorage('searchingAlgorithm', algorithm);
	}
</script>

<div class="page-header justify-start! gap-8!">
	<h1 class="page-title">{t('sortingAlgorithms.searching')}</h1>
	<div class="searching-dropdown-wrapper">
		<Dropdown
			options={algorithmOptions}
			value={selectedAlgorithm}
			onchange={onAlgorithmChange}
			ariaLabel={t('sortingAlgorithms.searching')} />
	</div>
</div>

{#key `algo-${selectedAlgorithm}`}
	<SearchingDetailedView
		algorithmId={selectedAlgorithm}
		initialArray={data.initialDetailedArray} />
{/key}

<DescriptionCard />

<style lang="postcss">
	@reference '../../../../app.css';

	:global(.searching-dropdown-wrapper) {
		z-index: 60;
	}

	:global(.searching-dropdown-wrapper .dropdown-trigger) {
		font-size: 0.95rem;
		font-weight: 600;
		padding: 0.7rem 1rem;
	}

	:global(.searching-dropdown-wrapper .dropdown-label) {
		font-weight: 600;
	}

	:global(.searching-dropdown-wrapper .dropdown-option) {
		font-size: 0.95rem;
		font-weight: 500;
	}
</style>
