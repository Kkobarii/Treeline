import { range, swap, uniqueSorted } from '$lib/sorting-algorithms/misc/utils';
import { detailedStepsToSortSteps } from '$lib/sorting-algorithms/steps/stepAdapters';

import type { DetailedSortStep, SortStep } from '../steps/stepTypes';
import { DetailedTraceBuilder } from '../steps/traceBuilder';

export function quickSortSteps(input: number[]): SortStep[] {
	return detailedStepsToSortSteps(quickSortDetailedSteps(input));
}

export function quickSortDetailedSteps(input: number[]): DetailedSortStep[] {
	const trace = new DetailedTraceBuilder(input, { useRows: true });
	const array = trace.workingArray;
	const n = array.length;
	const sortedSet = new Set<number>();
	const sortedIndices = () => uniqueSorted(sortedSet);
	const setSegmentRow = (left: number, right: number, row: number) => {
		if (left > right) {
			return;
		}

		trace.setRow(range(left, right), row);
	};

	const partition = (low: number, high: number, level: number): number => {
		const pivot = array[high].value;
		let i = low - 1;

		setSegmentRow(low, high, level);
		trace.paint({ compared: [high], sorted: sortedIndices() });
		trace.record({
			codePartId: 'partition',
			label: `Choose pivot at index ${high}`,
			variables: { low, high, pivot, level },
		});

		for (let j = low; j < high; j += 1) {
			setSegmentRow(low, high, level);
			trace.paint({ compared: [j, high], sorted: sortedIndices() });
			trace.record({
				codePartId: 'compare',
				label: `Compare arr[${j}] with pivot`,
				variables: { j, pivot, low, high },
			});

			if (array[j].value <= pivot) {
				i += 1;
				swap(array, i, j);
				setSegmentRow(low, high, level);
				trace.paint({ moved: [i, j], sorted: sortedIndices() });
				trace.record({
					codePartId: 'swap',
					label: `Move arr[${j}] into left partition`,
					variables: { i, j, pivot },
				});
			}
		}

		swap(array, i + 1, high);
		setSegmentRow(low, high, level);
		trace.paint({ moved: [i + 1, high], sorted: sortedIndices() });
		trace.record({
			codePartId: 'pivot-place',
			label: `Place pivot at index ${i + 1}`,
			variables: { pivotIndex: i + 1 },
		});

		return i + 1;
	};

	const quickSort = (low: number, high: number, level: number) => {
		if (low > high) {
			return;
		}

		if (low === high) {
			sortedSet.add(low);
			trace.setRow([low], level);
			trace.paint({ sorted: sortedIndices() });
			trace.record({
				codePartId: 'recurse',
				label: `Single element at index ${low}`,
				variables: { low, high, level },
			});
			return;
		}

		const pivotIndex = partition(low, high, level);
		sortedSet.add(pivotIndex);
		setSegmentRow(low, high, level);
		trace.paint({ sorted: sortedIndices() });
		trace.record({
			codePartId: 'recurse',
			label: `Recurse around pivot ${pivotIndex}`,
			variables: { low, high, pivotIndex, level },
		});

		quickSort(low, pivotIndex - 1, level + 1);
		quickSort(pivotIndex + 1, high, level + 1);
	};

	quickSort(0, n - 1, 0);
	setSegmentRow(0, n - 1, 0);

	return trace.build();
}
