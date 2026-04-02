import { bubbleSortDetailedSteps, bubbleSortSteps } from '$lib/sorting-algorithms/algorithms/bubble.js';
import { heapSortDetailedSteps, heapSortSteps } from '$lib/sorting-algorithms/algorithms/heap.js';
import { insertionSortDetailedSteps, insertionSortSteps } from '$lib/sorting-algorithms/algorithms/insertion.js';
import { mergeSortDetailedSteps, mergeSortSteps } from '$lib/sorting-algorithms/algorithms/merge.js';
import { quickSortDetailedSteps, quickSortSteps } from '$lib/sorting-algorithms/algorithms/quick.js';
import { selectionSortDetailedSteps, selectionSortSteps } from '$lib/sorting-algorithms/algorithms/selection.js';
import type { DataSet, SortingAlgorithm, SortingAlgorithmId } from '$lib/sorting-algorithms/misc/types';
import {
	createAlmostSortedArray,
	createDuplicatesArray,
	createPyramidArray,
	createReverseSortedArray,
	createSawtoothArray,
	createShuffledArray,
} from '$lib/sorting-algorithms/misc/utils';

export const sortingAlgorithms: SortingAlgorithm[] = [
	{
		id: 'bubble',
		nameKey: 'sortingAlgorithms.bubbleSort',
		descriptionKey: 'sorting.descriptions.bubble',
		generateSteps: bubbleSortSteps,
		generateDetailedSteps: bubbleSortDetailedSteps,
	},
	{
		id: 'selection',
		nameKey: 'sortingAlgorithms.selectionSort',
		descriptionKey: 'sorting.descriptions.selection',
		generateSteps: selectionSortSteps,
		generateDetailedSteps: selectionSortDetailedSteps,
	},
	{
		id: 'insertion',
		nameKey: 'sortingAlgorithms.insertionSort',
		descriptionKey: 'sorting.descriptions.insertion',
		generateSteps: insertionSortSteps,
		generateDetailedSteps: insertionSortDetailedSteps,
	},
	{
		id: 'merge',
		nameKey: 'sortingAlgorithms.mergeSort',
		descriptionKey: 'sorting.descriptions.merge',
		generateSteps: mergeSortSteps,
		generateDetailedSteps: mergeSortDetailedSteps,
	},
	{
		id: 'quick',
		nameKey: 'sortingAlgorithms.quickSort',
		descriptionKey: 'sorting.descriptions.quick',
		generateSteps: quickSortSteps,
		generateDetailedSteps: quickSortDetailedSteps,
	},
	{
		id: 'heap',
		nameKey: 'sortingAlgorithms.heapSort',
		descriptionKey: 'sorting.descriptions.heap',
		generateSteps: heapSortSteps,
		generateDetailedSteps: heapSortDetailedSteps,
	},
];

export function getSortingAlgorithm(id: SortingAlgorithmId): SortingAlgorithm {
	const algorithm = sortingAlgorithms.find(entry => entry.id === id);
	if (!algorithm) {
		throw new Error(`Unknown sorting algorithm: ${id}`);
	}

	return algorithm;
}

export const dataSets: DataSet[] = [
	{ type: 'shuffled', labelKey: 'sorting.arrayTypes.shuffled', generate: createShuffledArray },
	{ type: 'almost-sorted', labelKey: 'sorting.arrayTypes.almostSorted', generate: createAlmostSortedArray },
	{ type: 'reverse', labelKey: 'sorting.arrayTypes.reverse', generate: createReverseSortedArray },
	{ type: 'duplicates', labelKey: 'sorting.arrayTypes.duplicates', generate: createDuplicatesArray },
	{ type: 'sawtooth', labelKey: 'sorting.arrayTypes.sawtooth', generate: createSawtoothArray },
	{ type: 'pyramid', labelKey: 'sorting.arrayTypes.pyramid', generate: createPyramidArray },
];

export function getDataSet(type: string): DataSet {
	const dataSet = dataSets.find(ds => ds.type === type);
	if (!dataSet) {
		throw new Error(`Unknown data set type: ${type}`);
	}

	return dataSet;
}
