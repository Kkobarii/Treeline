import { binarySearchCodeTemplate } from '$lib/sorting-algorithms/algorithms/binary';
import { linearSearchCodeTemplate } from '$lib/sorting-algorithms/algorithms/linear';
import type { SearchingAlgorithmId, SortingAlgorithmId } from '$lib/sorting-algorithms/misc/types';

import { bubbleSortTemplate } from '../algorithms/bubble';
import { heapSortTemplate } from '../algorithms/heap';
import { insertionSortTemplate } from '../algorithms/insertion';
import { mergeSortTemplate } from '../algorithms/merge';
import { quickSortTemplate } from '../algorithms/quick';
import { selectionSortTemplate } from '../algorithms/selection';
import type { DetailedCodeTemplate } from '../steps/stepTypes';

const templates: Record<SortingAlgorithmId, DetailedCodeTemplate> = {
	bubble: bubbleSortTemplate,
	selection: selectionSortTemplate,
	insertion: insertionSortTemplate,
	heap: heapSortTemplate,
	merge: mergeSortTemplate,
	quick: quickSortTemplate,
};

const searchingTemplates: Record<SearchingAlgorithmId, DetailedCodeTemplate> = {
	linear: linearSearchCodeTemplate,
	binary: binarySearchCodeTemplate,
};

export function getCodeTemplate(algorithmId: SortingAlgorithmId | SearchingAlgorithmId): DetailedCodeTemplate {
	if (algorithmId === 'linear' || algorithmId === 'binary') {
		return searchingTemplates[algorithmId];
	}
	return templates[algorithmId];
}
