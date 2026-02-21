import { SortTraceBuilder } from '$lib/sorting-algorithms/backend/traceBuilder';
import type { SortStep } from '$lib/sorting-algorithms/backend/types';
import { range } from '$lib/sorting-algorithms/backend/utils';

export function selectionSortSteps(input: number[]): SortStep[] {
	const trace = new SortTraceBuilder(input);
	const array = trace.workingArray;
	const n = array.length;
	let sortedIndices: number[] = [];

	for (let i = 0; i < n - 1; i += 1) {
		let minIndex = i;

		for (let j = i + 1; j < n; j += 1) {
			trace.record([minIndex, j], [], sortedIndices, `Scanning for minimum in unsorted section`);

			if (array[j] < array[minIndex]) {
				minIndex = j;
				trace.record([i, minIndex], [], sortedIndices, `New minimum found at position ${minIndex}`);
			}
		}

		if (minIndex !== i) {
			[array[i], array[minIndex]] = [array[minIndex], array[i]];
			trace.record([i, minIndex], [i, minIndex], sortedIndices, `Placed minimum at position ${i}`);
		}

		sortedIndices = range(0, i);
		trace.record([], [], sortedIndices, `Prefix [0..${i}] is sorted`);
	}

	sortedIndices = range(0, n - 1);
	trace.record([], [], sortedIndices, 'Selection sort completed');
	return trace.build();
}
