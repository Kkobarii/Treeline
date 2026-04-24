import { range, shift } from '$lib/sorting-algorithms/misc/utils';
import { StepLabel } from '$lib/utils/stepLabel';

import { detailedStepsToSortSteps } from '../steps/stepAdapters';
import { LineBreak, type DetailedCodeTemplate, type DetailedSortStepResult, type SortStepResult } from '../steps/stepTypes';
import { DetailedTraceBuilder } from '../steps/traceBuilder';

export enum MergeSortPartId {
	// merge sort function
	MergeSort = 'merge-sort',
	Divide = 'divide',
	CallLeft = 'call-left',
	CallRight = 'call-right',
	Merge = 'merge',
	MergeDone = 'merge-done',

	// merge function
	Compare = 'compare',
	Shift = 'shift',
	TakeLeft = 'take-left',
	TakeRight = 'take-right',
	AppendLeft = 'append-left',
	AppendRight = 'append-right',
}

export const mergeSortTemplate: DetailedCodeTemplate = {
	algorithmId: 'merge',
	codes: {
		python: [
			{ indent: 0, text: 'def merge_sort(arr, left, right):', codePartId: MergeSortPartId.MergeSort },
			{ indent: 1, text: 'if left < right:', codePartId: MergeSortPartId.Divide },
			{ indent: 2, text: 'mid = (left + right) // 2', codePartId: MergeSortPartId.Divide },
			{ indent: 2, text: 'merge_sort(arr, left, mid)', codePartId: MergeSortPartId.CallLeft },
			{ indent: 2, text: 'merge_sort(arr, mid + 1, right)', codePartId: MergeSortPartId.CallRight },
			{ indent: 2, text: 'merge(arr, left, mid, right)', codePartId: MergeSortPartId.Merge },
			LineBreak,
			{ indent: 1, text: '# merge sort done', codePartId: MergeSortPartId.MergeDone },
			LineBreak,
			{ indent: 0, text: 'def merge(arr, left, mid, right):', codePartId: MergeSortPartId.Merge },
			{ indent: 1, text: 'leftArr = arr[left:mid + 1]', codePartId: MergeSortPartId.Merge },
			{ indent: 1, text: 'rightArr = arr[mid + 1:right + 1]', codePartId: MergeSortPartId.Merge },
			{ indent: 1, text: 'leftPos, rightPos = 0, 0', codePartId: MergeSortPartId.Merge },
			{ indent: 1, text: 'i = left', codePartId: MergeSortPartId.Merge },
			LineBreak,
			{ indent: 1, text: 'while leftPos < len(leftArr) and rightPos < len(rightArr):', codePartId: MergeSortPartId.Merge },
			{ indent: 2, text: 'if leftArr[leftPos] <= rightArr[rightPos]:', codePartId: MergeSortPartId.Compare },
			{ indent: 3, text: 'arr[i] = leftArr[leftPos]', codePartId: MergeSortPartId.TakeLeft },
			{ indent: 3, text: 'leftPos += 1', codePartId: MergeSortPartId.TakeLeft },
			{ indent: 2, text: 'else:', codePartId: MergeSortPartId.Compare },
			{ indent: 3, text: 'arr[i] = rightArr[rightPos]', codePartId: MergeSortPartId.TakeRight },
			{ indent: 3, text: 'rightPos += 1', codePartId: MergeSortPartId.TakeRight },
			{ indent: 2, text: 'i += 1', codePartId: '' },
			LineBreak,
			{ indent: 1, text: 'while leftPos < len(leftArr):', codePartId: MergeSortPartId.AppendLeft },
			{ indent: 2, text: 'arr[i] = leftArr[leftPos]', codePartId: MergeSortPartId.AppendLeft },
			{ indent: 2, text: 'leftPos += 1', codePartId: MergeSortPartId.AppendLeft },
			{ indent: 2, text: 'i += 1', codePartId: MergeSortPartId.AppendLeft },
			LineBreak,
			{ indent: 1, text: 'while rightPos < len(rightArr):', codePartId: MergeSortPartId.AppendRight },
			{ indent: 2, text: 'arr[i] = rightArr[rightPos]', codePartId: MergeSortPartId.AppendRight },
			{ indent: 2, text: 'rightPos += 1', codePartId: MergeSortPartId.AppendRight },
			{ indent: 2, text: 'i += 1', codePartId: MergeSortPartId.AppendRight },
		],
		javascript: [
			{ indent: 0, text: 'function mergeSort(arr, left, right) {', codePartId: MergeSortPartId.MergeSort },
			{ indent: 1, text: 'if (left < right) {', codePartId: MergeSortPartId.Divide },
			{ indent: 2, text: 'const mid = Math.floor((left + right) / 2);', codePartId: MergeSortPartId.Divide },
			{ indent: 2, text: 'mergeSort(arr, left, mid);', codePartId: MergeSortPartId.CallLeft },
			{ indent: 2, text: 'mergeSort(arr, mid + 1, right);', codePartId: MergeSortPartId.CallRight },
			{ indent: 2, text: 'merge(arr, left, mid, right);', codePartId: MergeSortPartId.Merge },
			{ indent: 1, text: '}', codePartId: MergeSortPartId.Divide },
			LineBreak,
			{ indent: 1, text: '// merge sort done', codePartId: MergeSortPartId.MergeDone },
			{ indent: 0, text: '}', codePartId: MergeSortPartId.MergeSort },
			LineBreak,
			{ indent: 0, text: 'function merge(arr, left, mid, right) {', codePartId: MergeSortPartId.Merge },
			{ indent: 1, text: 'const leftArr = arr.slice(left, mid + 1);', codePartId: MergeSortPartId.Merge },
			{ indent: 1, text: 'const rightArr = arr.slice(mid + 1, right + 1);', codePartId: MergeSortPartId.Merge },
			{ indent: 1, text: 'let leftPos = 0, rightPos = 0;', codePartId: MergeSortPartId.Merge },
			{ indent: 1, text: 'let i = left;', codePartId: MergeSortPartId.Merge },
			LineBreak,
			{ indent: 1, text: 'while (leftPos < leftArr.length && rightPos < rightArr.length) {', codePartId: MergeSortPartId.Merge },
			{ indent: 2, text: 'if (leftArr[leftPos] <= rightArr[rightPos]) {', codePartId: MergeSortPartId.Compare },
			{ indent: 3, text: 'arr[i] = leftArr[leftPos];', codePartId: MergeSortPartId.TakeLeft },
			{ indent: 3, text: 'leftPos += 1;', codePartId: MergeSortPartId.TakeLeft },
			{ indent: 2, text: '} else {', codePartId: MergeSortPartId.Compare },
			{ indent: 3, text: 'arr[i] = rightArr[rightPos];', codePartId: MergeSortPartId.TakeRight },
			{ indent: 3, text: 'rightPos += 1;', codePartId: MergeSortPartId.TakeRight },
			{ indent: 2, text: '}', codePartId: MergeSortPartId.Compare },
			{ indent: 2, text: 'i += 1;', codePartId: '' },
			{ indent: 1, text: '}', codePartId: MergeSortPartId.Merge },
			LineBreak,
			{ indent: 1, text: 'while (leftPos < leftArr.length) {', codePartId: MergeSortPartId.AppendLeft },
			{ indent: 2, text: 'arr[i] = leftArr[leftPos];', codePartId: MergeSortPartId.AppendLeft },
			{ indent: 2, text: 'leftPos += 1;', codePartId: MergeSortPartId.AppendLeft },
			{ indent: 2, text: 'i += 1;', codePartId: MergeSortPartId.AppendLeft },
			{ indent: 1, text: '}', codePartId: MergeSortPartId.AppendLeft },
			LineBreak,
			{ indent: 1, text: 'while (rightPos < rightArr.length) {', codePartId: MergeSortPartId.AppendRight },
			{ indent: 2, text: 'arr[i] = rightArr[rightPos];', codePartId: MergeSortPartId.AppendRight },
			{ indent: 2, text: 'rightPos += 1;', codePartId: MergeSortPartId.AppendRight },
			{ indent: 2, text: 'i += 1;', codePartId: MergeSortPartId.AppendRight },
			{ indent: 1, text: '}', codePartId: MergeSortPartId.AppendRight },
			{ indent: 0, text: '}', codePartId: MergeSortPartId.Merge },
		],
		c: [
			{ indent: 0, text: 'void mergeSort(int arr[], int left, int right) {', codePartId: MergeSortPartId.MergeSort },
			{ indent: 1, text: 'if (left < right) {', codePartId: MergeSortPartId.Divide },
			{ indent: 2, text: 'int mid = (left + right) / 2;', codePartId: MergeSortPartId.Divide },
			{ indent: 2, text: 'mergeSort(arr, left, mid);', codePartId: MergeSortPartId.CallLeft },
			{ indent: 2, text: 'mergeSort(arr, mid + 1, right);', codePartId: MergeSortPartId.CallRight },
			{ indent: 2, text: 'merge(arr, left, mid, right);', codePartId: MergeSortPartId.Merge },
			{ indent: 1, text: '}', codePartId: MergeSortPartId.Divide },
			LineBreak,
			{ indent: 1, text: '// merge sort done', codePartId: MergeSortPartId.MergeDone },
			{ indent: 0, text: '}', codePartId: MergeSortPartId.MergeSort },
			LineBreak,
			{ indent: 0, text: 'void merge(int arr[], int left, int mid, int right) {', codePartId: MergeSortPartId.Merge },
			{ indent: 1, text: 'int leftSize = mid - left + 1;', codePartId: MergeSortPartId.Merge },
			{ indent: 1, text: 'int rightSize = right - mid;', codePartId: MergeSortPartId.Merge },
			{ indent: 1, text: 'int leftArr[leftSize], rightArr[rightSize];', codePartId: MergeSortPartId.Merge },
			LineBreak,
			{ indent: 1, text: 'for (int p = 0; p < leftSize; p++)', codePartId: MergeSortPartId.Merge },
			{ indent: 2, text: 'leftArr[p] = arr[left + p];', codePartId: MergeSortPartId.Merge },
			{ indent: 1, text: 'for (int p = 0; p < rightSize; p++)', codePartId: MergeSortPartId.Merge },
			{ indent: 2, text: 'rightArr[p] = arr[mid + 1 + p];', codePartId: MergeSortPartId.Merge },
			LineBreak,
			{ indent: 1, text: 'int leftPos = 0, rightPos = 0;', codePartId: MergeSortPartId.Merge },
			{ indent: 1, text: 'int i = left;', codePartId: MergeSortPartId.Merge },
			LineBreak,
			{ indent: 1, text: 'while (leftPos < leftSize && rightPos < rightSize) {', codePartId: MergeSortPartId.Merge },
			{ indent: 2, text: 'if (leftArr[leftPos] <= rightArr[rightPos]) {', codePartId: MergeSortPartId.Compare },
			{ indent: 3, text: 'arr[i] = leftArr[leftPos];', codePartId: MergeSortPartId.TakeLeft },
			{ indent: 3, text: 'leftPos += 1;', codePartId: MergeSortPartId.TakeLeft },
			{ indent: 2, text: '} else {', codePartId: MergeSortPartId.Compare },
			{ indent: 3, text: 'arr[i] = rightArr[rightPos];', codePartId: MergeSortPartId.TakeRight },
			{ indent: 3, text: 'rightPos += 1;', codePartId: MergeSortPartId.TakeRight },
			{ indent: 2, text: '}', codePartId: MergeSortPartId.Compare },
			{ indent: 2, text: 'i += 1;', codePartId: '' },
			{ indent: 1, text: '}', codePartId: MergeSortPartId.Merge },
			LineBreak,
			{ indent: 1, text: 'while (leftPos < leftSize) {', codePartId: MergeSortPartId.AppendLeft },
			{ indent: 2, text: 'arr[i] = leftArr[leftPos];', codePartId: MergeSortPartId.AppendLeft },
			{ indent: 2, text: 'leftPos += 1;', codePartId: MergeSortPartId.AppendLeft },
			{ indent: 2, text: 'i += 1;', codePartId: MergeSortPartId.AppendLeft },
			{ indent: 1, text: '}', codePartId: MergeSortPartId.AppendLeft },
			LineBreak,
			{ indent: 1, text: 'while (rightPos < rightSize) {', codePartId: MergeSortPartId.AppendRight },
			{ indent: 2, text: 'arr[i] = rightArr[rightPos];', codePartId: MergeSortPartId.AppendRight },
			{ indent: 2, text: 'rightPos += 1;', codePartId: MergeSortPartId.AppendRight },
			{ indent: 2, text: 'i += 1;', codePartId: MergeSortPartId.AppendRight },
			{ indent: 1, text: '}', codePartId: MergeSortPartId.AppendRight },
			{ indent: 0, text: '}', codePartId: MergeSortPartId.Merge },
		],
	},
};

export function mergeSortSteps(input: number[]): SortStepResult {
	const trace = new DetailedTraceBuilder(input);
	const array = trace.workingArray;
	const n = array.length;

	const merge = (left: number, mid: number, right: number, depth: number) => {
		let leftEnd = mid;
		let rightStart = mid + 1;

		trace.counters.compare();
		if (array[leftEnd].value <= array[rightStart].value) {
			return;
		}

		let leftPos = left;

		while (leftPos <= leftEnd && rightStart <= right) {
			trace.paint({ compared: [leftPos, rightStart] });
			trace.record({
				codePartId: MergeSortPartId.Compare,
				stepLabel: new StepLabel('sorting.steps.merge.basic.compare', { leftPos, rightPos: rightStart }),
				variables: {},
			});

			trace.counters.compare();
			if (array[leftPos].value <= array[rightStart].value) {
				leftPos += 1;
			} else {
				shift(array, rightStart, leftPos, trace.counters);

				trace.paint({ moved: [leftPos] });
				trace.record({
					codePartId: MergeSortPartId.Shift,
					stepLabel: new StepLabel('sorting.steps.merge.basic.shift', { from: rightStart, to: leftPos }),
					variables: { count: 1 },
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

	return detailedStepsToSortSteps(trace.build());
}

export function mergeSortDetailedSteps(input: number[]): DetailedSortStepResult {
	const trace = new DetailedTraceBuilder(input, { useRows: true });
	const array = trace.workingArray;
	const n = array.length;

	const merge = (left: number, mid: number, right: number, level: number) => {
		let leftPos = left;
		let leftEnd = mid;
		let rightPos = mid + 1;
		const targetAreaRow = level - 1;

		trace.paint({ light: range(leftPos, leftEnd), dark: range(rightPos, right), compared: [] });
		trace.record({
			codePartId: MergeSortPartId.Merge,
			stepLabel: new StepLabel('sorting.steps.merge.detailed.startMerging', {
				left,
				mid,
				right,
				rightStart: mid + 1,
			}),
			variables: {
				left,
				mid,
				right,
				i: leftPos,
				targetAreaLeft: left,
				targetAreaRight: right,
				targetAreaRow,
			},
		});

		let i = leftPos;
		while (leftPos <= leftEnd && rightPos <= right) {
			trace.paint({ compared: [leftPos, rightPos], light: range(leftPos, leftEnd), dark: range(rightPos, right) });
			trace.record({
				codePartId: MergeSortPartId.Compare,
				stepLabel: new StepLabel('sorting.steps.merge.detailed.compare', { leftPos, rightPos }),
				variables: {
					left,
					right,
					leftPos,
					rightPos,
					targetAreaLeft: left,
					targetAreaRight: right,
					targetAreaRow,
				},
			});

			if (array[leftPos].value <= array[rightPos].value) {
				trace.setCoords(leftPos, level - 1, i);
				trace.paint({ moved: [leftPos], light: range(leftPos, leftEnd), dark: range(rightPos, right) });
				trace.record({
					codePartId: MergeSortPartId.TakeLeft,
					stepLabel: new StepLabel('sorting.steps.merge.detailed.moveLeftToOutput', { leftPos, i }),
					variables: {
						i,
						leftPos,
						targetAreaLeft: left,
						targetAreaRight: right,
						targetAreaRow,
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

				trace.paint({ moved: [leftPos], light: range(leftPos, leftEnd + 1), dark: range(rightPos + 1, right) });
				trace.record({
					codePartId: MergeSortPartId.TakeRight,
					stepLabel: new StepLabel('sorting.steps.merge.detailed.moveRightToOutput', { rightPos, i }),
					variables: {
						i,
						rightPos,
						targetAreaLeft: left,
						targetAreaRight: right,
						targetAreaRow,
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
			trace.paint({ moved: [leftPos], light: range(leftPos + 1, leftEnd) });
			trace.record({
				codePartId: MergeSortPartId.AppendLeft,
				stepLabel: new StepLabel('sorting.steps.merge.detailed.insertRemainingLeft', { leftPos }),
				variables: {
					i: leftPos,
					targetAreaLeft: left,
					targetAreaRight: right,
					targetAreaRow,
				},
			});
			leftPos += 1;
		}

		while (rightPos <= right) {
			trace.setCoords(rightPos, level - 1, i);
			trace.paint({ moved: [rightPos], dark: range(rightPos + 1, right) });
			trace.record({
				codePartId: MergeSortPartId.AppendRight,
				stepLabel: new StepLabel('sorting.steps.merge.detailed.insertRemainingRight', { i }),
				variables: {
					i,
					rightPos,
					targetAreaLeft: left,
					targetAreaRight: right,
					targetAreaRow,
				},
			});
			rightPos += 1;
			i += 1;
		}
	};

	const mergeSort = (left: number, right: number, level: number) => {
		const currentWorkingRow = level - 1;
		trace.paint({ light: range(left, right) });
		trace.record({
			codePartId: MergeSortPartId.MergeSort,
			stepLabel: new StepLabel('sorting.steps.merge.detailed.startMergeSortSegment', { left, right }),
			variables: {
				left,
				right,
				targetAreaLeft: left,
				targetAreaRight: right,
				targetAreaRow: currentWorkingRow,
			},
		});

		if (left < right) {
			const mid = Math.floor((left + right) / 2);
			trace.paint({ light: range(left, mid), dark: range(mid + 1, right) });
			trace.record({
				codePartId: MergeSortPartId.Divide,
				stepLabel: new StepLabel('sorting.steps.merge.detailed.divideSegment', { left, right, mid, rightStart: mid + 1 }),
				variables: {
					left,
					mid,
					right,
					targetAreaLeft: left,
					targetAreaRight: right,
					targetAreaRow: currentWorkingRow,
				},
			});

			// move left part to the next row
			trace.setRow(range(left, mid), level);
			trace.paint({ light: range(left, mid) });
			trace.record({
				codePartId: MergeSortPartId.CallLeft,
				stepLabel: new StepLabel('sorting.steps.merge.detailed.mergeSortLeftSegment', { left, mid }),
				variables: {
					targetAreaLeft: left,
					targetAreaRight: right,
					targetAreaRow: currentWorkingRow,
				},
			});
			mergeSort(left, mid, level + 1);

			// move right part to the next row
			trace.setRow(range(mid + 1, right), level);
			trace.paint({ dark: range(mid + 1, right) });
			trace.record({
				codePartId: MergeSortPartId.CallRight,
				stepLabel: new StepLabel('sorting.steps.merge.detailed.mergeSortRightSegment', { rightStart: mid + 1, right }),
				variables: {
					targetAreaLeft: left,
					targetAreaRight: right,
					targetAreaRow: currentWorkingRow,
				},
			});
			mergeSort(mid + 1, right, level + 1);

			merge(left, mid, right, level);
		}

		trace.paint({ sorted: range(left, right) });
		trace.record({
			codePartId: MergeSortPartId.MergeDone,
			stepLabel: new StepLabel('sorting.steps.merge.detailed.finishedMergeSortSegment', { left, right }),
			variables: {
				left,
				right,
				targetAreaLeft: left,
				targetAreaRight: right,
				targetAreaRow: currentWorkingRow,
			},
		});
	};

	mergeSort(0, n - 1, 1);

	return trace.build();
}
