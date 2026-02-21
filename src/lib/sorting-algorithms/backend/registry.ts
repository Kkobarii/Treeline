import { bubbleSortSteps } from '$lib/sorting-algorithms/backend/algorithms/bubble';
import { heapSortSteps } from '$lib/sorting-algorithms/backend/algorithms/heap';
import { insertionSortSteps } from '$lib/sorting-algorithms/backend/algorithms/insertion';
import { mergeSortSteps } from '$lib/sorting-algorithms/backend/algorithms/merge';
import { quickSortSteps } from '$lib/sorting-algorithms/backend/algorithms/quick';
import { selectionSortSteps } from '$lib/sorting-algorithms/backend/algorithms/selection';
import type { SortingAlgorithm, SortingAlgorithmId } from '$lib/sorting-algorithms/backend/types';

export const sortingAlgorithms: SortingAlgorithm[] = [
	{
		id: 'bubble',
		name: 'Bubble Sort',
		description: 'Repeatedly compares adjacent items and swaps them when they are out of order.',
		generateSteps: bubbleSortSteps,
	},
	{
		id: 'selection',
		name: 'Selection Sort',
		description: 'Finds the minimum element in the unsorted section and moves it into place.',
		generateSteps: selectionSortSteps,
	},
	{
		id: 'insertion',
		name: 'Insertion Sort',
		description: 'Builds a sorted prefix by inserting each value into its correct position.',
		generateSteps: insertionSortSteps,
	},
	{
		id: 'heap',
		name: 'Heap Sort',
		description: 'Builds a max heap and repeatedly extracts the largest element to the end.',
		generateSteps: heapSortSteps,
	},
	{
		id: 'merge',
		name: 'Merge Sort',
		description: 'Splits the array into halves and merges sorted segments recursively.',
		generateSteps: mergeSortSteps,
	},
	{
		id: 'quick',
		name: 'Quick Sort',
		description: 'Partitions around a pivot and recursively sorts the partitions.',
		generateSteps: quickSortSteps,
	},
];

export function getSortingAlgorithm(id: SortingAlgorithmId): SortingAlgorithm {
	const algorithm = sortingAlgorithms.find(entry => entry.id === id);
	if (!algorithm) {
		throw new Error(`Unknown sorting algorithm: ${id}`);
	}

	return algorithm;
}
