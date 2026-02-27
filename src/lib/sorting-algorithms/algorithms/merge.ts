import { range, shift } from '$lib/sorting-algorithms/misc/utils';

import type { DetailedSortStep, SortStep } from '../steps/stepTypes';
import { DetailedTraceBuilder } from '../steps/traceBuilder';

export function mergeSortSteps(input: number[]): SortStep[] {
	const trace = new DetailedTraceBuilder(input);
	const array = trace.workingArray;
	const n = array.length;

	const merge = (left: number, mid: number, right: number, depth: number) => {
		let leftEnd = mid;
		let rightStart = mid + 1;

		if (array[leftEnd].value <= array[rightStart].value) {
			return;
		}

		let leftPos = left;

		while (leftPos <= leftEnd && rightStart <= right) {
			trace.paint({ compared: [leftPos, rightStart] });
			trace.record({
				codePartId: 'compare',
				label: `Compare arr[${leftPos}] and arr[${rightStart}]`,
				variables: {},
			});

			if (array[leftPos].value <= array[rightStart].value) {
				leftPos += 1;
			} else {
				shift(array, rightStart, leftPos);

				trace.paint({ moved: [leftPos, rightStart] });
				trace.record({
					codePartId: 'shift',
					label: `Shift element from ${rightStart} to ${leftPos}`,
					variables: {},
				});
				leftPos += 1;
				leftEnd += 1;
				rightStart += 1;
			}
		}
	};

	const mergeSort = (left: number, right: number, depth: number) => {
		if (left >= right) {
			return;
		}

		const mid = Math.floor((left + right) / 2);
		mergeSort(left, mid, depth + 1);
		mergeSort(mid + 1, right, depth + 1);

		merge(left, mid, right, depth);
	};

	mergeSort(0, n - 1, 0);

	return trace.build();
}

export function mergeSortDetailedSteps(input: number[]): DetailedSortStep[] {
	const trace = new DetailedTraceBuilder(input, { useRows: true });
	const array = trace.workingArray;
	const n = array.length;

	const merge = (left: number, mid: number, right: number, level: number) => {
		let leftPos = left;
		let leftEnd = mid;
		let rightStart = mid + 1;
		let rightPos = rightStart;

		trace.paint({ left: range(leftPos, leftEnd), right: range(rightStart, right), compared: [] });
		trace.record({
			codePartId: 'merge',
			label: `Start merging arr[${left}..${mid}] and arr[${mid + 1}..${right}]`,
			variables: { left, mid, right, i: leftPos },
		});

		let i = leftPos;
		while (leftPos <= leftEnd && rightPos <= right) {
			if (array[leftPos].value <= array[rightPos].value) {
				trace.setCoords(leftPos, level - 1, i);
				trace.paint({ moved: [leftPos], left: range(leftPos, leftEnd), right: range(rightPos, right) });
				trace.record({
					codePartId: 'take-left',
					label: `Move arr[${leftPos}] to output position ${i}`,
					variables: { i, leftPos },
				});
				leftPos += 1;
				i += 1;
			} else {
				const preservedColumns: number[] = [];
				for (let index = leftPos; index < rightPos; index += 1) {
					preservedColumns.push(trace.getColumn(index) ?? index);
					trace.setCoords(index, level, trace.getColumn(index) ?? index);
				}

				trace.setCoords(rightPos, level - 1, i);
				shift(array, rightPos, leftPos);

				for (let offset = 0; offset < preservedColumns.length; offset += 1) {
					trace.setCoords(leftPos + offset + 1, level, preservedColumns[offset]);
				}

				trace.paint({ moved: [leftPos], left: range(leftPos, leftEnd + 1), right: range(rightPos + 1, right) });
				trace.record({
					codePartId: 'take-right',
					label: `Move arr[${rightPos}] to output position ${i}`,
					variables: { i, rightPos },
				});

				leftPos += 1;
				leftEnd += 1;
				rightPos += 1;
				i += 1;
			}
		}

		while (leftPos <= leftEnd) {
			trace.setCoords(leftPos, level - 1, leftPos);
			trace.paint({ moved: [leftPos], left: range(leftPos + 1, leftEnd) });
			trace.record({
				codePartId: 'append-left',
				label: `Insert remaining left item at position ${leftPos}`,
				variables: { i: leftPos },
			});
			leftPos += 1;
		}

		while (rightPos <= right) {
			trace.setCoords(rightPos, level - 1, i);
			trace.paint({ moved: [rightPos], right: range(rightPos + 1, right) });
			trace.record({
				codePartId: 'append-right',
				label: `Insert remaining right item at position ${i}`,
				variables: { i, rightPos },
			});
			rightPos += 1;
			i += 1;
		}

		trace.paint({ sorted: range(left, right) });
		trace.record({
			codePartId: 'merge-done',
			label: `Merged segment arr[${left}..${right}]`,
			variables: { left, right },
		});
	};

	const mergeSort = (left: number, right: number, level: number) => {
		if (left < right) {
			const mid = Math.floor((left + right) / 2);

			// move left part to the next row
			trace.setRow(range(left, mid), level);
			trace.record({
				codePartId: 'divide',
				label: `Merge sort arr[${left}..${mid}]`,
				variables: {},
			});
			mergeSort(left, mid, level + 1);

			// move right part to the next row
			trace.setRow(range(mid + 1, right), level);
			trace.record({
				codePartId: 'divide',
				label: `Merge sort arr[${mid + 1}..${right}]`,
				variables: {},
			});
			mergeSort(mid + 1, right, level + 1);

			merge(left, mid, right, level);
		}
	};

	mergeSort(0, n - 1, 1);

	return trace.build();
}
