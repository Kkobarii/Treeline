import { range, shift } from '$lib/sorting-algorithms/misc/utils';
import { detailedStepsToSortSteps } from '$lib/sorting-algorithms/steps/stepAdapters';
import type { DetailedCodeTemplate, DetailedSortStepResult, SortStepResult } from '$lib/sorting-algorithms/steps/stepTypes';
import { DetailedTraceBuilder } from '$lib/sorting-algorithms/steps/traceBuilder';
import { StepLabel } from '$lib/utils/stepLabel';

export enum BinarySearchPartId {
	StartBinarySearch = 'start-binary-search',
	SortedArray = 'sorted-array',
	CalculateMid = 'calculate-mid',
	Compare = 'compare',
	Found = 'found',
	NotFound = 'not-found',
	AdjustLeft = 'adjust-left',
	AdjustRight = 'adjust-right',
}

export const binarySearchCodeTemplate: DetailedCodeTemplate = {
	algorithmId: 'binary',
	codes: {
		python: [
			{ indent: 0, text: 'def binary_search(arr, target):', codePartId: BinarySearchPartId.StartBinarySearch },
			{ indent: 1, text: 'left, right = 0, len(arr) - 1', codePartId: BinarySearchPartId.StartBinarySearch },
			{ indent: 1, text: 'while left <= right:', codePartId: BinarySearchPartId.CalculateMid },
			{ indent: 2, text: 'mid = (left + right) // 2', codePartId: BinarySearchPartId.CalculateMid },
			{ indent: 2, text: 'if arr[mid] == target:', codePartId: BinarySearchPartId.Compare },
			{ indent: 3, text: 'return mid', codePartId: BinarySearchPartId.Found },
			{ indent: 2, text: 'elif arr[mid] < target:', codePartId: BinarySearchPartId.AdjustLeft },
			{ indent: 3, text: 'left = mid + 1', codePartId: BinarySearchPartId.AdjustLeft },
			{ indent: 2, text: 'else:', codePartId: BinarySearchPartId.AdjustRight },
			{ indent: 3, text: 'right = mid - 1', codePartId: BinarySearchPartId.AdjustRight },
			{ indent: 1, text: 'return -1', codePartId: BinarySearchPartId.NotFound },
		],
		javascript: [
			{ indent: 0, text: 'function binarySearch(arr, target) {', codePartId: BinarySearchPartId.StartBinarySearch },
			{ indent: 1, text: 'let left = 0, right = arr.length - 1;', codePartId: BinarySearchPartId.StartBinarySearch },
			{ indent: 1, text: 'while (left <= right) {', codePartId: BinarySearchPartId.CalculateMid },
			{ indent: 2, text: 'const mid = Math.floor((left + right) / 2);', codePartId: BinarySearchPartId.CalculateMid },
			{ indent: 2, text: 'if (arr[mid] === target) {', codePartId: BinarySearchPartId.Compare },
			{ indent: 3, text: 'return mid;', codePartId: BinarySearchPartId.Found },
			{ indent: 2, text: '} else if (arr[mid] < target) {', codePartId: BinarySearchPartId.AdjustLeft },
			{ indent: 3, text: 'left = mid + 1;', codePartId: BinarySearchPartId.AdjustLeft },
			{ indent: 2, text: '} else {', codePartId: BinarySearchPartId.AdjustRight },
			{ indent: 3, text: 'right = mid - 1;', codePartId: BinarySearchPartId.AdjustRight },
			{ indent: 2, text: '}', codePartId: BinarySearchPartId.AdjustRight },
			{ indent: 1, text: '}', codePartId: BinarySearchPartId.CalculateMid },
			{ indent: 1, text: 'return -1;', codePartId: BinarySearchPartId.NotFound },
			{ indent: 0, text: '}', codePartId: BinarySearchPartId.StartBinarySearch },
		],
		c: [
			{ indent: 0, text: 'int binarySearch(int arr[], int n, int target) {', codePartId: BinarySearchPartId.StartBinarySearch },
			{ indent: 1, text: 'int left = 0, right = n - 1;', codePartId: BinarySearchPartId.StartBinarySearch },
			{ indent: 1, text: 'while (left <= right) {', codePartId: BinarySearchPartId.CalculateMid },
			{ indent: 2, text: 'int mid = left + (right - left) / 2;', codePartId: BinarySearchPartId.CalculateMid },
			{ indent: 2, text: 'if (arr[mid] == target) {', codePartId: BinarySearchPartId.Compare },
			{ indent: 3, text: 'return mid;', codePartId: BinarySearchPartId.Found },
			{ indent: 2, text: '} else if (arr[mid] < target) {', codePartId: BinarySearchPartId.AdjustLeft },
			{ indent: 3, text: 'left = mid + 1;', codePartId: BinarySearchPartId.AdjustLeft },
			{ indent: 2, text: '} else {', codePartId: BinarySearchPartId.AdjustRight },
			{ indent: 3, text: 'right = mid - 1;', codePartId: BinarySearchPartId.AdjustRight },
			{ indent: 2, text: '}', codePartId: BinarySearchPartId.AdjustRight },
			{ indent: 1, text: '}', codePartId: BinarySearchPartId.CalculateMid },
			{ indent: 1, text: 'return -1;', codePartId: BinarySearchPartId.NotFound },
			{ indent: 0, text: '}', codePartId: BinarySearchPartId.StartBinarySearch },
		],
	},
};

export function binarySearchDetailedSteps(input: number[], targetValue?: number): DetailedSortStepResult {
	const trace = new DetailedTraceBuilder(input);
	const array = trace.workingArray;
	const target = targetValue ?? 0;

	const discardedIds: number[] = [];

	trace.record({
		codePartId: BinarySearchPartId.StartBinarySearch,
		stepLabel: new StepLabel('sorting.search.binaryStart', { target }),
		variables: { target },
	});

	// mini insertion sort cameo
	for (let i = 1; i < array.length; i++) {
		const key = array[i].value;
		let j = i - 1;
		while (j >= 0 && array[j].value > key) {
			j--;
		}
		shift(array, i, j + 1);
	}
	trace.record({
		codePartId: BinarySearchPartId.StartBinarySearch,
		stepLabel: new StepLabel('sorting.search.sortedArray'),
		variables: { target },
	});

	let left = 0;
	let right = array.length - 1;

	let found = false;
	while (left <= right) {
		const mid = Math.floor((left + right) / 2);

		trace.paint({ dark: [mid], light: discardedIds });
		trace.record({
			codePartId: BinarySearchPartId.CalculateMid,
			stepLabel: new StepLabel('sorting.search.calculateMid', { mid: mid }),
			variables: { target, left, right, mid },
		});

		const comparison = array[mid].value;
		trace.paint({ compared: [mid], light: discardedIds });
		trace.record({
			codePartId: BinarySearchPartId.Compare,
			stepLabel: new StepLabel('sorting.search.compare', { comparison, target }),
			variables: { target, index: mid, left, right },
		});

		trace.counters.compare();
		if (array[mid].value === target) {
			trace.paint({ sorted: [mid] });
			trace.record({
				codePartId: BinarySearchPartId.Found,
				stepLabel: new StepLabel('sorting.search.found', { index: mid, target }),
				variables: { target, index: mid },
			});
			found = true;
			break;
		} else if (array[mid].value < target) {
			discardedIds.push(...range(left, mid));
			left = mid + 1;
			trace.paint({ light: discardedIds });
			trace.record({
				codePartId: BinarySearchPartId.AdjustLeft,
				stepLabel: new StepLabel('sorting.search.adjustLeft', { target, comparison }),
				variables: { target, left, right, mid },
			});
		} else {
			discardedIds.push(...range(mid, right));
			right = mid - 1;
			trace.paint({ light: discardedIds });
			trace.record({
				codePartId: BinarySearchPartId.AdjustRight,
				stepLabel: new StepLabel('sorting.search.adjustRight', { target, comparison }),
				variables: { target, left, right, mid },
			});
		}
	}

	if (!found) {
		trace.record({
			codePartId: BinarySearchPartId.NotFound,
			stepLabel: new StepLabel('sorting.search.notFound', { target }),
			variables: { target },
		});
	}

	return trace.build(true);
}

export function binarySearchSteps(input: number[], targetValue?: number): SortStepResult {
	return detailedStepsToSortSteps(binarySearchDetailedSteps(input, targetValue));
}
