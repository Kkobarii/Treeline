import type { SortingAlgorithmId } from '$lib/sorting-algorithms/misc/types';

import { bubbleSortTemplate } from '../algorithms/bubble';
import { heapSortTemplate } from '../algorithms/heap';
import { insertionSortTemplate } from '../algorithms/insertion';
import { mergeSortTemplate } from '../algorithms/merge';
import { quickSortTemplate } from '../algorithms/quick';
import { selectionSortTemplate } from '../algorithms/selection';
import type { DetailedCodeTemplate } from '../steps/stepTypes';

const tmpFix = { c: [], javascript: [], python: [] };

const templates: Record<SortingAlgorithmId, DetailedCodeTemplate> = {
	bubble: bubbleSortTemplate,
	selection: selectionSortTemplate,
	insertion: insertionSortTemplate,
	heap: heapSortTemplate,
	merge: mergeSortTemplate,
	quick: quickSortTemplate,
};

export function getCodeTemplate(algorithmId: SortingAlgorithmId): DetailedCodeTemplate {
	return templates[algorithmId];
}
