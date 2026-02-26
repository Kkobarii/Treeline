import { range, swap, uniqueSorted } from '$lib/sorting-algorithms/misc/utils';
import { detailedStepsToSortSteps } from '$lib/sorting-algorithms/steps/stepAdapters';

import type { DetailedSortStep, SortStep } from '../steps/stepTypes';
import { DetailedTraceBuilder } from '../steps/traceBuilder';

export function quickSortSteps(input: number[]): SortStep[] {
	return detailedStepsToSortSteps(quickSortDetailedSteps(input));
}

export function quickSortDetailedSteps(input: number[]): DetailedSortStep[] {
	const trace = new DetailedTraceBuilder(input);
	const array = trace.workingArray;
	const n = array.length;
	const sortedSet = new Set<number>();
	const sortedIndices = () => uniqueSorted(sortedSet);

	const partition = (low: number, high: number, depth: number): number => {
		const pivot = array[high];
		let i = low - 1;

		trace.record({
			codePartId: 'partition',
			indicesHighlighted: [high],
			comparedIndices: [],
			movedIndices: [],
			sortedIndices: sortedIndices(),
			label: `Choose pivot at index ${high}`,
			variables: { low, high, pivot, depth },
		});

		for (let j = low; j < high; j += 1) {
			trace.record({
				codePartId: 'compare',
				indicesHighlighted: [j, high],
				comparedIndices: [j, high],
				movedIndices: [],
				sortedIndices: sortedIndices(),
				label: `Compare arr[${j}] with pivot`,
				variables: { j, pivot, low, high },
			});

			if (array[j] <= pivot) {
				i += 1;
				swap(array, i, j);
				trace.record({
					codePartId: 'swap',
					indicesHighlighted: [i, j],
					comparedIndices: [],
					movedIndices: [i, j],
					sortedIndices: sortedIndices(),
					label: `Move arr[${j}] into left partition`,
					variables: { i, j, pivot },
				});
			}
		}

		swap(array, i + 1, high);
		trace.record({
			codePartId: 'pivot-place',
			indicesHighlighted: [i + 1, high],
			comparedIndices: [],
			movedIndices: [i + 1, high],
			sortedIndices: sortedIndices(),
			label: `Place pivot at index ${i + 1}`,
			variables: { pivotIndex: i + 1 },
		});

		return i + 1;
	};

	const quickSort = (low: number, high: number, depth: number) => {
		if (low > high) {
			return;
		}

		if (low === high) {
			sortedSet.add(low);
			trace.record({
				codePartId: 'recurse',
				indicesHighlighted: [low],
				comparedIndices: [],
				movedIndices: [],
				sortedIndices: sortedIndices(),
				label: `Single element at index ${low}`,
				variables: { low, high, depth },
			});
			return;
		}

		const pivotIndex = partition(low, high, depth);
		sortedSet.add(pivotIndex);
		trace.record({
			codePartId: 'recurse',
			indicesHighlighted: [pivotIndex],
			comparedIndices: [],
			movedIndices: [],
			sortedIndices: sortedIndices(),
			label: `Recurse around pivot ${pivotIndex}`,
			variables: { low, high, pivotIndex, depth },
		});

		quickSort(low, pivotIndex - 1, depth + 1);
		quickSort(pivotIndex + 1, high, depth + 1);
	};

	quickSort(0, n - 1, 0);
	trace.record({
		codePartId: 'recurse',
		indicesHighlighted: [],
		comparedIndices: [],
		movedIndices: [],
		sortedIndices: range(0, n - 1),
		label: 'Quick sort finished',
		variables: {},
	});

	return trace.build();
}
