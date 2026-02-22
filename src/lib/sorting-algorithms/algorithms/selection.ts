import { range, swap } from '$lib/sorting-algorithms/misc/utils';
import { detailedStepsToSortSteps } from '$lib/sorting-algorithms/steps/stepAdapters';

import type { DetailedSortStep, SortStep } from '../steps/stepTypes';
import { DetailedTraceBuilder } from '../steps/traceBuilder';

export function selectionSortSteps(input: number[]): SortStep[] {
	return detailedStepsToSortSteps(selectionSortDetailedSteps(input));
}

export function selectionSortDetailedSteps(input: number[]): DetailedSortStep[] {
	const trace = new DetailedTraceBuilder(input);
	const array = trace.workingArray;
	const n = array.length;
	let sortedIndices: number[] = [];

	for (let i = 0; i < n - 1; i += 1) {
		let minIndex = i;
		trace.record({
			codePartId: 'outer-loop',
			indicesHighlighted: [i],
			movedIndices: [],
			sortedIndices,
			label: `Start searching minimum for position ${i}`,
			variables: { i, minIndex },
		});

		for (let j = i + 1; j < n; j += 1) {
			trace.record({
				codePartId: 'scan-loop',
				indicesHighlighted: [minIndex, j],
				movedIndices: [],
				sortedIndices,
				label: `Scan j=${j} against current minimum`,
				variables: { i, j, minIndex },
			});

			if (array[j] < array[minIndex]) {
				minIndex = j;
				trace.record({
					codePartId: 'new-min',
					indicesHighlighted: [minIndex],
					movedIndices: [],
					sortedIndices,
					label: `New minimum found at index ${minIndex}`,
					variables: { i, j, minIndex },
				});
			}
		}

		if (minIndex !== i) {
			swap(array, i, minIndex);
			trace.record({
				codePartId: 'swap',
				indicesHighlighted: [i, minIndex],
				movedIndices: [i, minIndex],
				sortedIndices,
				label: `Swap index ${i} with minimum index ${minIndex}`,
				variables: { i, minIndex },
			});
		}

		sortedIndices = range(0, i);
	}

	trace.record({
		codePartId: 'outer-loop',
		indicesHighlighted: [],
		movedIndices: [],
		sortedIndices: range(0, n - 1),
		label: 'Selection sort finished',
		variables: {},
	});

	return trace.build();
}
