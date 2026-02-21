import { SortTraceBuilder } from '$lib/sorting-algorithms/backend/traceBuilder';
import type { SortStep } from '$lib/sorting-algorithms/backend/types';
import { range } from '$lib/sorting-algorithms/backend/utils';

export function mergeSortSteps(input: number[]): SortStep[] {
	const trace = new SortTraceBuilder(input);
	const array = trace.workingArray;
	const n = array.length;

	const merge = (left: number, mid: number, right: number) => {
		const leftChunk = array.slice(left, mid + 1);
		const rightChunk = array.slice(mid + 1, right + 1);

		let leftIndex = 0;
		let rightIndex = 0;
		let targetIndex = left;

		while (leftIndex < leftChunk.length && rightIndex < rightChunk.length) {
			trace.record([left + leftIndex, mid + 1 + rightIndex], [], [], 'Comparing values from both halves');
			if (leftChunk[leftIndex] <= rightChunk[rightIndex]) {
				array[targetIndex] = leftChunk[leftIndex];
				leftIndex += 1;
			} else {
				array[targetIndex] = rightChunk[rightIndex];
				rightIndex += 1;
			}
			trace.record([targetIndex], [targetIndex], [], `Wrote merged value at position ${targetIndex}`);
			targetIndex += 1;
		}

		while (leftIndex < leftChunk.length) {
			array[targetIndex] = leftChunk[leftIndex];
			trace.record([targetIndex], [targetIndex], [], `Copied remaining left value to ${targetIndex}`);
			leftIndex += 1;
			targetIndex += 1;
		}

		while (rightIndex < rightChunk.length) {
			array[targetIndex] = rightChunk[rightIndex];
			trace.record([targetIndex], [targetIndex], [], `Copied remaining right value to ${targetIndex}`);
			rightIndex += 1;
			targetIndex += 1;
		}
	};

	const mergeSort = (left: number, right: number) => {
		if (left >= right) {
			return;
		}

		const mid = Math.floor((left + right) / 2);
		mergeSort(left, mid);
		mergeSort(mid + 1, right);
		merge(left, mid, right);
	};

	mergeSort(0, n - 1);
	trace.record([], [], range(0, n - 1), 'Merge sort completed');
	return trace.build();
}
