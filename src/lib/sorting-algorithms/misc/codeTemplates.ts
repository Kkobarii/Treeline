import type { SortingAlgorithmId } from '$lib/sorting-algorithms/misc/types';

import { bubbleSortTemplate } from '../algorithms/bubble';
import type { DetailedCodeTemplate } from '../steps/stepTypes';

const templates: Record<SortingAlgorithmId, DetailedCodeTemplate> = {
	bubble: bubbleSortTemplate,
	selection: {
		algorithmId: 'selection',
		parts: [
			{ id: 'outer-loop', python: 'for i in range(n - 1):', javascript: 'for (let i = 0; i < n - 1; i += 1) {' },
			{ id: 'scan-loop', python: 'for j in range(i + 1, n):', javascript: 'for (let j = i + 1; j < n; j += 1) {' },
			{ id: 'new-min', python: 'if arr[j] < arr[min_idx]: min_idx = j', javascript: 'if (arr[j] < arr[minIndex]) { minIndex = j; }' },
			{
				id: 'swap',
				python: 'arr[i], arr[min_idx] = arr[min_idx], arr[i]',
				javascript: '[arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];',
			},
		],
	},
	insertion: {
		algorithmId: 'insertion',
		parts: [
			{ id: 'outer-loop', python: 'for i in range(1, n):', javascript: 'for (let i = 1; i < n; i += 1) {' },
			{ id: 'swap-loop', python: 'while j > 0 and arr[j - 1] > arr[j]:', javascript: 'while (j > 0 && arr[j - 1] > arr[j]) {' },
			{ id: 'swap', python: 'arr[j - 1], arr[j] = arr[j], arr[j - 1]', javascript: '[arr[j - 1], arr[j]] = [arr[j], arr[j - 1]];' },
			{ id: 'inner-complete', python: '# element placed', javascript: '// element placed' },
		],
	},
	heap: {
		algorithmId: 'heap',
		parts: [
			{
				id: 'build-heap',
				python: 'for i in range(n // 2 - 1, -1, -1): heapify(i)',
				javascript: 'for (let i = Math.floor(n / 2) - 1; i >= 0; i -= 1) heapify(i);',
			},
			{ id: 'extract-loop', python: 'for end in range(n - 1, 0, -1):', javascript: 'for (let end = n - 1; end > 0; end -= 1) {' },
			{ id: 'swap-root', python: 'arr[0], arr[end] = arr[end], arr[0]', javascript: '[arr[0], arr[end]] = [arr[end], arr[0]];' },
			{ id: 'heapify', python: 'heapify(0, end)', javascript: 'heapify(0, end);' },
		],
	},
	merge: {
		algorithmId: 'merge',
		parts: [
			{ id: 'split', python: 'mid = (left + right) // 2', javascript: 'const mid = Math.floor((left + right) / 2);' },
			{ id: 'recurse-left', python: 'merge_sort(left, mid)', javascript: 'mergeSort(left, mid);' },
			{ id: 'recurse-right', python: 'merge_sort(mid + 1, right)', javascript: 'mergeSort(mid + 1, right);' },
			{ id: 'merge', python: 'merge(left, mid, right)', javascript: 'merge(left, mid, right);' },
			{ id: 'write', python: 'arr[k] = next_value', javascript: 'arr[k] = nextValue;' },
		],
	},
	quick: {
		algorithmId: 'quick',
		parts: [
			{ id: 'partition', python: 'pivot = arr[high]', javascript: 'const pivot = arr[high];' },
			{ id: 'compare', python: 'if arr[j] <= pivot:', javascript: 'if (arr[j] <= pivot) {' },
			{ id: 'swap', python: 'arr[i], arr[j] = arr[j], arr[i]', javascript: '[arr[i], arr[j]] = [arr[j], arr[i]];' },
			{
				id: 'pivot-place',
				python: 'arr[i + 1], arr[high] = arr[high], arr[i + 1]',
				javascript: '[arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];',
			},
			{
				id: 'recurse',
				python: 'quick_sort(low, p - 1); quick_sort(p + 1, high)',
				javascript: 'quickSort(low, p - 1); quickSort(p + 1, high);',
			},
		],
	},
};

export function getCodeTemplate(algorithmId: SortingAlgorithmId): DetailedCodeTemplate {
	return templates[algorithmId];
}
