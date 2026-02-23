<script lang="ts">
	import DescriptionCard from '$lib/components/DescriptionCard.svelte';
	import { onMount } from 'svelte';
	import type { SortingAlgorithmId } from '../misc/types';
	import SortingDetailedView from './SortingDetailedView.svelte';
	import SortingFirstView from './SortingFirstView.svelte';
	import ViewSwitcher from './ViewSwitcher.svelte';

	let { algorithmId }: { algorithmId: SortingAlgorithmId } = $props();

	let currentView: 'big-picture' | 'detailed' = $state('big-picture');

	onMount(() => {
		const stored = sessionStorage.getItem('sortingViewPreference');
		if (stored === 'detailed' || stored === 'big-picture') {
			currentView = stored;
		}
	});

	const handleViewChange = (newView: 'big-picture' | 'detailed') => {
		currentView = newView;
		sessionStorage.setItem('sortingViewPreference', newView);
	};
</script>

<ViewSwitcher {algorithmId} view={currentView} onViewChange={handleViewChange} />

{#if currentView === 'big-picture'}
	<SortingFirstView {algorithmId} />
{:else}
	<SortingDetailedView {algorithmId} />
{/if}

<DescriptionCard filename={`sorting-algorithms/${algorithmId}_sort`} />
