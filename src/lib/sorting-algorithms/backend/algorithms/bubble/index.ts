import { SortTraceBuilder } from '$lib/sorting-algorithms/backend/traceBuilder';
import type { SortStep } from '$lib/sorting-algorithms/backend/types';
import { range } from '$lib/sorting-algorithms/backend/utils';

export function bubbleSortSteps(input: number[]): SortStep[] {
	const trace = new SortTraceBuilder(input);
	const array = trace.workingArray;
	const n = array.length;
	let sortedIndices: number[] = [];

	for (let i = 0; i < n - 1; i += 1) {
		let swapped = false;

		for (let j = 0; j < n - i - 1; j += 1) {
			trace.record([j, j + 1], [], sortedIndices, `Comparing positions ${j} and ${j + 1}`);

			if (array[j] > array[j + 1]) {
				[array[j], array[j + 1]] = [array[j + 1], array[j]];
				swapped = true;
				trace.record([j, j + 1], [j, j + 1], sortedIndices, `Swapped positions ${j} and ${j + 1}`);
			}
		}

		sortedIndices = range(n - i - 1, n - 1);
		trace.record([], [], sortedIndices, `Position ${n - i - 1} is now fixed`);

		if (!swapped) {
			sortedIndices = range(0, n - 1);
			break;
		}
	}

	trace.record([], [], sortedIndices, 'Bubble sort completed');
	return trace.build();
}
