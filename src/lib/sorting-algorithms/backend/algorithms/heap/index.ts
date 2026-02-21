import { SortTraceBuilder } from '$lib/sorting-algorithms/backend/traceBuilder';
import type { SortStep } from '$lib/sorting-algorithms/backend/types';
import { range } from '$lib/sorting-algorithms/backend/utils';

export function heapSortSteps(input: number[]): SortStep[] {
	const trace = new SortTraceBuilder(input);
	const array = trace.workingArray;
	const n = array.length;
	let sortedStart = n;

	const sortedIndices = () => range(sortedStart, n - 1);

	const heapify = (heapSize: number, rootIndex: number) => {
		let largest = rootIndex;
		const left = 2 * rootIndex + 1;
		const right = 2 * rootIndex + 2;

		if (left < heapSize) {
			trace.record([largest, left], [], sortedIndices(), 'Comparing root with left child');
			if (array[left] > array[largest]) {
				largest = left;
			}
		}

		if (right < heapSize) {
			trace.record([largest, right], [], sortedIndices(), 'Comparing current largest with right child');
			if (array[right] > array[largest]) {
				largest = right;
			}
		}

		if (largest !== rootIndex) {
			[array[rootIndex], array[largest]] = [array[largest], array[rootIndex]];
			trace.record([rootIndex, largest], [rootIndex, largest], sortedIndices(), 'Swapped to restore heap property');
			heapify(heapSize, largest);
		}
	};

	for (let root = Math.floor(n / 2) - 1; root >= 0; root -= 1) {
		heapify(n, root);
	}
	trace.record([], [], sortedIndices(), 'Initial max-heap built');

	for (let end = n - 1; end > 0; end -= 1) {
		[array[0], array[end]] = [array[end], array[0]];
		sortedStart = end;
		trace.record([0, end], [0, end], sortedIndices(), `Moved current max to position ${end}`);
		heapify(end, 0);
	}

	sortedStart = 0;
	trace.record([], [], sortedIndices(), 'Heap sort completed');
	return trace.build();
}
