import { range, shift } from '$lib/sorting-algorithms/misc/utils';

import type { DetailedCodeTemplate, DetailedSortStep, SortStep } from '../steps/stepTypes';
import { DetailedTraceBuilder } from '../steps/traceBuilder';

export enum MergeSortPartId {
	MergeSort = 'merge-sort',
	Divide = 'divide',
	CallLeft = 'call-left',
	CallRight = 'call-right',
	Merge = 'merge',
	MergeDone = 'merge-done',

	Compare = 'compare',
	Shift = 'shift',
	TakeLeft = 'take-left',
	TakeRight = 'take-right',
	AppendLeft = 'append-left',
	AppendRight = 'append-right',
}

export const mergeSortTemplate: DetailedCodeTemplate = {
	algorithmId: 'merge',
	python: [
		{ indent: 0, text: 'def merge_sort(arr, left, right):', codePartId: MergeSortPartId.MergeSort },
		{ indent: 1, text: 'if left < right:', codePartId: MergeSortPartId.Divide },
		{ indent: 2, text: 'mid = (left + right) // 2', codePartId: MergeSortPartId.Divide },
		{ indent: 2, text: 'merge_sort(arr, left, mid)', codePartId: MergeSortPartId.CallLeft },
		{ indent: 2, text: 'merge_sort(arr, mid + 1, right)', codePartId: MergeSortPartId.CallRight },
		{ indent: 2, text: 'merge(arr, left, mid, right)', codePartId: MergeSortPartId.Merge },
		{ indent: 1, text: '# merge done', codePartId: MergeSortPartId.MergeDone },
		{ indent: 0, text: '', codePartId: '' },
		{ indent: 0, text: 'def merge(arr, left, mid, right):', codePartId: MergeSortPartId.Merge },
		{ indent: 1, text: 'leftArr = arr[left:mid + 1]', codePartId: MergeSortPartId.Merge },
		{ indent: 1, text: 'rightArr = arr[mid + 1:right + 1]', codePartId: MergeSortPartId.Merge },
		{ indent: 1, text: 'leftPos, rightPos = 0, 0', codePartId: MergeSortPartId.Merge },
		{ indent: 1, text: 'i = left', codePartId: MergeSortPartId.Merge },
		{ indent: 1, text: 'while leftPos < len(leftArr) and rightPos < len(rightArr):', codePartId: MergeSortPartId.Merge },
		{ indent: 2, text: 'if leftArr[leftPos] <= rightArr[rightPos]:', codePartId: MergeSortPartId.Compare },
		{ indent: 3, text: 'arr[i] = leftArr[leftPos]', codePartId: MergeSortPartId.TakeLeft },
		{ indent: 3, text: 'leftPos += 1', codePartId: MergeSortPartId.TakeLeft },
		{ indent: 2, text: 'else:', codePartId: MergeSortPartId.Compare },
		{ indent: 3, text: 'arr[i] = rightArr[rightPos]', codePartId: MergeSortPartId.TakeRight },
		{ indent: 3, text: 'rightPos += 1', codePartId: MergeSortPartId.TakeRight },
		{ indent: 2, text: 'i += 1', codePartId: '' },
		{ indent: 1, text: 'while leftPos < len(leftArr):', codePartId: MergeSortPartId.AppendLeft },
		{ indent: 2, text: 'arr[i] = leftArr[leftPos]', codePartId: MergeSortPartId.AppendLeft },
		{ indent: 2, text: 'leftPos += 1', codePartId: MergeSortPartId.AppendLeft },
		{ indent: 2, text: 'i += 1', codePartId: MergeSortPartId.AppendLeft },
		{ indent: 1, text: 'while rightPos < len(rightArr):', codePartId: MergeSortPartId.AppendRight },
		{ indent: 2, text: 'arr[i] = rightArr[rightPos]', codePartId: MergeSortPartId.AppendRight },
		{ indent: 2, text: 'rightPos += 1', codePartId: MergeSortPartId.AppendRight },
		{ indent: 2, text: 'i += 1', codePartId: MergeSortPartId.AppendRight },
	],
	javascript: [],
	c: [],
};

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
				codePartId: MergeSortPartId.Compare,
				label: `Compare arr[${leftPos}] and arr[${rightStart}]`,
				variables: {},
			});

			if (array[leftPos].value <= array[rightStart].value) {
				leftPos += 1;
			} else {
				shift(array, rightStart, leftPos);

				trace.paint({ moved: [leftPos, rightStart] });
				trace.record({
					codePartId: MergeSortPartId.Shift,
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
		let rightPos = mid + 1;
		const mergeTargetRow = level - 1;

		trace.paint({ left: range(leftPos, leftEnd), right: range(rightPos, right), compared: [] });
		trace.record({
			codePartId: MergeSortPartId.Merge,
			label: `Start merging arr[${left}..${mid}] and arr[${mid + 1}..${right}]`,
			variables: {
				left,
				mid,
				right,
				i: leftPos,
				mergeTargetLeft: left,
				mergeTargetRight: right,
				mergeTargetRow,
			},
		});

		let i = leftPos;
		while (leftPos <= leftEnd && rightPos <= right) {
			trace.paint({ compared: [leftPos, rightPos], left: range(leftPos, leftEnd), right: range(rightPos, right) });
			trace.record({
				codePartId: MergeSortPartId.Compare,
				label: `Compare arr[${leftPos}] and arr[${rightPos}]`,
				variables: {
					left,
					right,
					leftPos,
					rightPos,
					mergeTargetLeft: left,
					mergeTargetRight: right,
					mergeTargetRow,
				},
			});

			if (array[leftPos].value <= array[rightPos].value) {
				trace.setCoords(leftPos, level - 1, i);
				trace.paint({ moved: [leftPos], left: range(leftPos, leftEnd), right: range(rightPos, right) });
				trace.record({
					codePartId: MergeSortPartId.TakeLeft,
					label: `Move arr[${leftPos}] to output position ${i}`,
					variables: {
						i,
						leftPos,
						mergeTargetLeft: left,
						mergeTargetRight: right,
						mergeTargetRow,
					},
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
					codePartId: MergeSortPartId.TakeRight,
					label: `Move arr[${rightPos}] to output position ${i}`,
					variables: {
						i,
						rightPos,
						mergeTargetLeft: left,
						mergeTargetRight: right,
						mergeTargetRow,
					},
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
				codePartId: MergeSortPartId.AppendLeft,
				label: `Insert remaining left item at position ${leftPos}`,
				variables: {
					i: leftPos,
					mergeTargetLeft: left,
					mergeTargetRight: right,
					mergeTargetRow,
				},
			});
			leftPos += 1;
		}

		while (rightPos <= right) {
			trace.setCoords(rightPos, level - 1, i);
			trace.paint({ moved: [rightPos], right: range(rightPos + 1, right) });
			trace.record({
				codePartId: MergeSortPartId.AppendRight,
				label: `Insert remaining right item at position ${i}`,
				variables: {
					i,
					rightPos,
					mergeTargetLeft: left,
					mergeTargetRight: right,
					mergeTargetRow,
				},
			});
			rightPos += 1;
			i += 1;
		}

		// trace.paint({ sorted: range(left, right) });
		// trace.record({
		// 	codePartId: MergeSortPartId.MergeDone,
		// 	label: `Merged segment arr[${left}..${right}]`,
		// 	variables: { left, right },
		// });
	};

	const mergeSort = (left: number, right: number, level: number) => {
		const currentWorkingRow = level - 1;
		trace.paint({ left: range(left, right) });
		trace.record({
			codePartId: MergeSortPartId.MergeSort,
			label: `Start merge_sort on arr[${left}..${right}]`,
			variables: {
				left,
				right,
				mergeTargetLeft: left,
				mergeTargetRight: right,
				mergeTargetRow: currentWorkingRow,
			},
		});

		if (left < right) {
			const mid = Math.floor((left + right) / 2);
			trace.paint({ left: range(left, mid), right: range(mid + 1, right) });
			trace.record({
				codePartId: MergeSortPartId.Divide,
				label: `Divide arr[${left}..${right}] into arr[${left}..${mid}] and arr[${mid + 1}..${right}]`,
				variables: {
					left,
					mid,
					right,
					mergeTargetLeft: left,
					mergeTargetRight: right,
					mergeTargetRow: currentWorkingRow,
				},
			});

			// move left part to the next row
			trace.setRow(range(left, mid), level);
			trace.paint({ left: range(left, mid) });
			trace.record({
				codePartId: MergeSortPartId.CallLeft,
				label: `Merge sort arr[${left}..${mid}]`,
				variables: {
					mergeTargetLeft: left,
					mergeTargetRight: right,
					mergeTargetRow: currentWorkingRow,
				},
			});
			mergeSort(left, mid, level + 1);

			// move right part to the next row
			trace.setRow(range(mid + 1, right), level);
			trace.paint({ right: range(mid + 1, right) });
			trace.record({
				codePartId: MergeSortPartId.CallRight,
				label: `Merge sort arr[${mid + 1}..${right}]`,
				variables: {
					mergeTargetLeft: left,
					mergeTargetRight: right,
					mergeTargetRow: currentWorkingRow,
				},
			});
			mergeSort(mid + 1, right, level + 1);

			merge(left, mid, right, level);
		}

		trace.paint({ sorted: range(left, right) });
		trace.record({
			codePartId: MergeSortPartId.MergeDone,
			label: `Finished merge_sort on arr[${left}..${right}]`,
			variables: {
				left,
				right,
				mergeTargetLeft: left,
				mergeTargetRight: right,
				mergeTargetRow: currentWorkingRow,
			},
		});
	};

	mergeSort(0, n - 1, 1);

	return trace.build();
}
