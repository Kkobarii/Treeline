import { range, shift } from '$lib/sorting-algorithms/misc/utils';
import { detailedStepsToSortSteps } from '$lib/sorting-algorithms/steps/stepAdapters';

import type { DetailedSortStep, SortStep } from '../steps/stepTypes';
import { DetailedTraceBuilder } from '../steps/traceBuilder';

export function mergeSortSteps(input: number[]): SortStep[] {
	return detailedStepsToSortSteps(mergeSortDetailedSteps(input));
}

export function mergeSortDetailedSteps(input: number[]): DetailedSortStep[] {
	const trace = new DetailedTraceBuilder(input);
	const array = trace.workingArray;
	const n = array.length;

	const merge = (left: number, mid: number, right: number, depth: number) => {
		let leftEnd = mid;
		let rightStart = mid + 1;

		trace.record({
			codePartId: 'merge',
			indicesHighlighted: [left, mid, right],
			comparedIndices: [],
			movedIndices: [],
			sortedIndices: [],
			label: `Merge segments [${left}..${mid}] and [${mid + 1}..${right}]`,
			variables: { left, mid, right, depth },
		});

		if (array[leftEnd] <= array[rightStart]) {
			trace.record({
				codePartId: 'merge',
				indicesHighlighted: [leftEnd, rightStart],
				comparedIndices: [leftEnd, rightStart],
				movedIndices: [],
				sortedIndices: [],
				label: 'Segments already in order',
				variables: { left, mid, right },
			});
			return;
		}

		let leftPos = left;

		while (leftPos <= leftEnd && rightStart <= right) {
			trace.record({
				codePartId: 'write',
				indicesHighlighted: [leftPos, rightStart],
				comparedIndices: [leftPos, rightStart],
				movedIndices: [],
				sortedIndices: [],
				label: `Compare arr[${leftPos}] and arr[${rightStart}]`,
				variables: { leftPos, rightStart, left, right },
			});

			if (array[leftPos] <= array[rightStart]) {
				leftPos += 1;
			} else {
				shift(array, rightStart, leftPos);
				trace.record({
					codePartId: 'swap',
					indicesHighlighted: [leftPos, rightStart],
					comparedIndices: [],
					movedIndices: [leftPos],
					sortedIndices: [],
					label: `Shift element from ${rightStart} to ${leftPos}`,
					variables: { leftPos, rightStart },
				});
				leftPos += 1;
				leftEnd += 1;
				rightStart += 1;
			}
		}
	};

	const mergeSort = (left: number, right: number, depth: number) => {
		if (left >= right) {
			trace.record({
				codePartId: 'split',
				indicesHighlighted: [left],
				comparedIndices: [],
				movedIndices: [],
				sortedIndices: [left],
				label: `Base case at index ${left}`,
				variables: { left, right, depth },
			});
			return;
		}

		const mid = Math.floor((left + right) / 2);
		trace.record({
			codePartId: 'split',
			indicesHighlighted: [left, mid, right],
			comparedIndices: [],
			movedIndices: [],
			sortedIndices: [],
			label: `Split [${left}..${right}] at mid=${mid}`,
			variables: { left, mid, right, depth },
		});

		trace.record({
			codePartId: 'recurse-left',
			indicesHighlighted: [left, mid],
			comparedIndices: [],
			movedIndices: [],
			sortedIndices: [],
			label: `Recurse left [${left}..${mid}]`,
			variables: { left, mid, depth },
		});
		mergeSort(left, mid, depth + 1);

		trace.record({
			codePartId: 'recurse-right',
			indicesHighlighted: [mid + 1, right],
			comparedIndices: [],
			movedIndices: [],
			sortedIndices: [],
			label: `Recurse right [${mid + 1}..${right}]`,
			variables: { mid, right, depth },
		});
		mergeSort(mid + 1, right, depth + 1);

		merge(left, mid, right, depth);
	};

	mergeSort(0, n - 1, 0);
	trace.record({
		codePartId: 'merge',
		indicesHighlighted: [],
		comparedIndices: [],
		movedIndices: [],
		sortedIndices: range(0, n - 1),
		label: 'Merge sort finished',
		variables: {},
	});

	return trace.build();
}
