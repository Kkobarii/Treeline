import { SortTraceBuilder } from '$lib/sorting-algorithms/backend/traceBuilder';
import type { SortStep } from '$lib/sorting-algorithms/backend/types';
import { range } from '$lib/sorting-algorithms/backend/utils';

export function insertionSortSteps(input: number[]): SortStep[] {
	const trace = new SortTraceBuilder(input);
	const array = trace.workingArray;
	const n = array.length;

	for (let i = 1; i < n; i += 1) {
		const currentValue = array[i];
		let j = i - 1;
		trace.record([i], [], range(0, i - 1), `Taking value at position ${i} into the sorted prefix`);

		while (j >= 0 && array[j] > currentValue) {
			array[j + 1] = array[j];
			trace.record([j, j + 1], [j, j + 1], range(0, i - 1), `Shifted value right from ${j} to ${j + 1}`);
			j -= 1;
		}

		array[j + 1] = currentValue;
		trace.record([j + 1], [j + 1], range(0, i), `Inserted value at position ${j + 1}`);
	}

	trace.record([], [], range(0, n - 1), 'Insertion sort completed');
	return trace.build();
}
