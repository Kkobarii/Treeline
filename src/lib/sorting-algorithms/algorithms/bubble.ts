import { range, swap } from '$lib/sorting-algorithms/misc/utils';
import { detailedStepsToSortSteps } from '$lib/sorting-algorithms/steps/stepAdapters';

import type { DetailedSortStep, SortStep } from '../steps/stepTypes';
import { DetailedTraceBuilder } from '../steps/traceBuilder';

export function bubbleSortSteps(input: number[]): SortStep[] {
	return detailedStepsToSortSteps(bubbleSortDetailedSteps(input));
}

export function bubbleSortDetailedSteps(input: number[]): DetailedSortStep[] {
	const trace = new DetailedTraceBuilder(input);
	const array = trace.workingArray;
	const n = array.length;
	let sortedIndices: number[] = [];

	trace.record({
		codePartId: 'outer-loop',
		indicesHighlighted: [],
		movedIndices: [],
		sortedIndices,
		label: 'Bubble sort simulation started',
		variables: { n },
	});

	for (let i = 0; i < n - 1; i += 1) {
		let swapped = false;
		trace.record({
			codePartId: 'outer-loop',
			indicesHighlighted: [i],
			movedIndices: [],
			sortedIndices,
			label: `Outer iteration i=${i}`,
			variables: { i, n },
		});

		for (let j = 0; j < n - i - 1; j += 1) {
			trace.record({
				codePartId: 'compare',
				indicesHighlighted: [j, j + 1],
				movedIndices: [],
				sortedIndices,
				label: `Compare arr[${j}] and arr[${j + 1}]`,
				variables: { i, j },
			});

			if (array[j] > array[j + 1]) {
				swap(array, j, j + 1);
				swapped = true;
				trace.record({
					codePartId: 'swap',
					indicesHighlighted: [j, j + 1],
					movedIndices: [j, j + 1],
					sortedIndices,
					label: `Swap indices ${j} and ${j + 1}`,
					variables: { i, j },
				});
			}
		}

		sortedIndices = range(n - i - 1, n - 1);
		trace.record({
			codePartId: 'inner-loop',
			indicesHighlighted: [n - i - 1],
			movedIndices: [],
			sortedIndices,
			label: `Index ${n - i - 1} fixed in final place`,
			variables: { i },
		});

		if (!swapped) {
			sortedIndices = range(0, n - 1);
			break;
		}
	}

	trace.record({
		codePartId: 'outer-loop',
		indicesHighlighted: [],
		movedIndices: [],
		sortedIndices: range(0, n - 1),
		label: 'Bubble sort finished',
		variables: {},
	});

	return trace.build();
}
