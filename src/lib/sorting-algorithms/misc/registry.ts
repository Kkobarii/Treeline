import { bubbleSortDetailedSteps, bubbleSortSteps } from '$lib/sorting-algorithms/algorithms/bubble.js';
import { heapSortDetailedSteps, heapSortSteps } from '$lib/sorting-algorithms/algorithms/heap.js';
import { insertionSortDetailedSteps, insertionSortSteps } from '$lib/sorting-algorithms/algorithms/insertion.js';
import { mergeSortDetailedSteps, mergeSortSteps } from '$lib/sorting-algorithms/algorithms/merge.js';
import { quickSortDetailedSteps, quickSortSteps } from '$lib/sorting-algorithms/algorithms/quick.js';
import { selectionSortDetailedSteps, selectionSortSteps } from '$lib/sorting-algorithms/algorithms/selection.js';
import type { SortingAlgorithm, SortingAlgorithmId } from '$lib/sorting-algorithms/misc/types';

export const sortingAlgorithms: SortingAlgorithm[] = [
	{
		id: 'bubble',
		name: 'Bubble Sort',
		description: 'Repeatedly compares adjacent items and swaps them when they are out of order.',
		generateSteps: bubbleSortSteps,
		generateDetailedSteps: bubbleSortDetailedSteps,
	},
	{
		id: 'selection',
		name: 'Selection Sort',
		description: 'Finds the minimum element in the unsorted section and moves it into place.',
		generateSteps: selectionSortSteps,
		generateDetailedSteps: selectionSortDetailedSteps,
	},
	{
		id: 'insertion',
		name: 'Insertion Sort',
		description: 'Builds a sorted prefix by inserting each value into its correct position.',
		generateSteps: insertionSortSteps,
		generateDetailedSteps: insertionSortDetailedSteps,
	},
	{
		id: 'heap',
		name: 'Heap Sort',
		description: 'Builds a max heap and repeatedly extracts the largest element to the end.',
		generateSteps: heapSortSteps,
		generateDetailedSteps: heapSortDetailedSteps,
	},
	{
		id: 'merge',
		name: 'Merge Sort',
		description: 'Splits the array into halves and merges sorted segments recursively.',
		generateSteps: mergeSortSteps,
		generateDetailedSteps: mergeSortDetailedSteps,
	},
	{
		id: 'quick',
		name: 'Quick Sort',
		description: 'Partitions around a pivot and recursively sorts the partitions.',
		generateSteps: quickSortSteps,
		generateDetailedSteps: quickSortDetailedSteps,
	},
];

export function getSortingAlgorithm(id: SortingAlgorithmId): SortingAlgorithm {
	const algorithm = sortingAlgorithms.find(entry => entry.id === id);
	if (!algorithm) {
		throw new Error(`Unknown sorting algorithm: ${id}`);
	}

	return algorithm;
}
