import { range, swap } from '$lib/sorting-algorithms/misc/utils';
import { detailedStepsToSortSteps } from '$lib/sorting-algorithms/steps/stepAdapters';

import type { DetailedSortStep, SortStep } from '../steps/stepTypes';
import { DetailedTraceBuilder } from '../steps/traceBuilder';

export function insertionSortSteps(input: number[]): SortStep[] {
	return detailedStepsToSortSteps(insertionSortDetailedSteps(input));
}

export function insertionSortDetailedSteps(input: number[]): DetailedSortStep[] {
	const trace = new DetailedTraceBuilder(input);
	const array = trace.workingArray;
	const n = array.length;

	for (let i = 1; i < n; i += 1) {
		let j = i;
		trace.record({
			codePartId: 'outer-loop',
			indicesHighlighted: [i],
			movedIndices: [],
			sortedIndices: range(0, i - 1),
			label: `Start sorting element at index ${i}`,
			variables: { i, j },
		});

		while (j > 0 && array[j - 1] > array[j]) {
			trace.record({
				codePartId: 'swap-loop',
				indicesHighlighted: [j - 1, j],
				movedIndices: [],
				sortedIndices: range(0, i - 1),
				label: `arr[${j - 1}] > arr[${j}], swap needed`,
				variables: { i, j },
			});

			swap(array, j - 1, j);
			trace.record({
				codePartId: 'swap',
				indicesHighlighted: [j - 1, j],
				movedIndices: [j - 1, j],
				sortedIndices: range(0, i - 1),
				label: `Swap indices ${j - 1} and ${j}`,
				variables: { i, j },
			});

			j -= 1;
		}

		trace.record({
			codePartId: 'inner-complete',
			indicesHighlighted: [j],
			movedIndices: [],
			sortedIndices: range(0, i),
			label: `Element placed at index ${j}`,
			variables: { i, j },
		});
	}

	trace.record({
		codePartId: 'outer-loop',
		indicesHighlighted: [],
		movedIndices: [],
		sortedIndices: range(0, n - 1),
		label: 'Insertion sort finished',
		variables: {},
	});

	return trace.build();
}
