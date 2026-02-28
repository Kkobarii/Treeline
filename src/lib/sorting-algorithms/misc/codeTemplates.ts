import type { SortingAlgorithmId } from '$lib/sorting-algorithms/misc/types';

import { bubbleSortTemplate } from '../algorithms/bubble';
import { insertionSortTemplate } from '../algorithms/insertion';
import { mergeSortTemplate } from '../algorithms/merge';
import { selectionSortTemplate } from '../algorithms/selection';
import type { DetailedCodeTemplate } from '../steps/stepTypes';

const tmpFix = { c: [], javascript: [], python: [] };

const templates: Record<SortingAlgorithmId, DetailedCodeTemplate> = {
	bubble: bubbleSortTemplate,
	selection: selectionSortTemplate,
	insertion: insertionSortTemplate,
	heap: {
		algorithmId: 'heap',
		...tmpFix,
	},
	merge: mergeSortTemplate,
	quick: {
		algorithmId: 'quick',
		...tmpFix,
	},
};

export function getCodeTemplate(algorithmId: SortingAlgorithmId): DetailedCodeTemplate {
	return templates[algorithmId];
}
