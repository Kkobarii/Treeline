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
	const setSegmentDepth = (left: number, right: number, depth: number) => {
		trace.setDepth(range(left, right), depth);
	};

	const merge = (left: number, mid: number, right: number, depth: number) => {
		let leftEnd = mid;
		let rightStart = mid + 1;

		setSegmentDepth(left, right, depth);
		trace.paint({ compared: [left, mid, right] });
		trace.record({
			codePartId: 'merge',
			label: `Merge segments [${left}..${mid}] and [${mid + 1}..${right}]`,
			variables: { left, mid, right, depth },
		});

		if (array[leftEnd].value <= array[rightStart].value) {
			setSegmentDepth(left, right, depth);
			trace.paint({ compared: [leftEnd, rightStart] });
			trace.record({
				codePartId: 'merge',
				label: 'Segments already in order',
				variables: { left, mid, right, depth },
			});
			return;
		}

		let leftPos = left;

		while (leftPos <= leftEnd && rightStart <= right) {
			setSegmentDepth(left, right, depth);
			trace.paint({ compared: [leftPos, rightStart] });
			trace.record({
				codePartId: 'compare',
				label: `Compare arr[${leftPos}] and arr[${rightStart}]`,
				variables: { leftPos, rightStart, left, right, depth },
			});

			if (array[leftPos].value <= array[rightStart].value) {
				leftPos += 1;
			} else {
				shift(array, rightStart, leftPos);
				setSegmentDepth(left, right, depth);
				trace.paint({ moved: [leftPos, rightStart] });
				trace.record({
					codePartId: 'shift',
					label: `Shift element from ${rightStart} to ${leftPos}`,
					variables: { leftPos, rightStart, depth },
				});
				leftPos += 1;
				leftEnd += 1;
				rightStart += 1;
			}
		}
	};

	const mergeSort = (left: number, right: number, depth: number) => {
		if (left >= right) {
			trace.setDepth([left], depth);
			trace.paint({ sorted: [left] });
			trace.record({
				codePartId: 'split',
				label: `Base case at index ${left}`,
				variables: { left, right, depth },
			});
			return;
		}

		const mid = Math.floor((left + right) / 2);
		setSegmentDepth(left, right, depth);
		trace.paint({ compared: [left, mid, right] });
		trace.record({
			codePartId: 'split',
			label: `Split [${left}..${right}] at mid=${mid}`,
			variables: { left, mid, right, depth },
		});

		setSegmentDepth(left, mid, depth + 1);
		trace.paint({ compared: [left, mid] });
		trace.record({
			codePartId: 'recurse-left',
			label: `Recurse left [${left}..${mid}]`,
			variables: { left, mid, depth },
		});
		mergeSort(left, mid, depth + 1);

		setSegmentDepth(mid + 1, right, depth + 1);
		trace.paint({ compared: [mid + 1, right] });
		trace.record({
			codePartId: 'recurse-right',
			label: `Recurse right [${mid + 1}..${right}]`,
			variables: { mid, right, depth },
		});
		mergeSort(mid + 1, right, depth + 1);

		merge(left, mid, right, depth);
	};

	mergeSort(0, n - 1, 0);
	setSegmentDepth(0, n - 1, 0);

	return trace.build();
}
