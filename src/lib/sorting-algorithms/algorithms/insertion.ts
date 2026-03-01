import { range, swap } from '$lib/sorting-algorithms/misc/utils';
import { detailedStepsToSortSteps } from '$lib/sorting-algorithms/steps/stepAdapters';

import type { DetailedCodeTemplate, DetailedSortStep, SortStep } from '../steps/stepTypes';
import { DetailedTraceBuilder } from '../steps/traceBuilder';

export enum InsertionSortPartId {
	StartInsertionSort = 'start-insertion-sort',
	OuterLoop = 'outer-loop',
	Compare = 'compare',
	Swap = 'swap',
}

export const insertionSortTemplate: DetailedCodeTemplate = {
	algorithmId: 'insertion',
	python: [
		{ indent: 0, text: 'def insertion_sort(arr):', codePartId: InsertionSortPartId.StartInsertionSort },
		{ indent: 1, text: 'n = len(arr)', codePartId: InsertionSortPartId.StartInsertionSort },
		{ indent: 1, text: 'for i in range(1, n):', codePartId: InsertionSortPartId.OuterLoop },
		{ indent: 2, text: 'j = i', codePartId: InsertionSortPartId.OuterLoop },
		{ indent: 2, text: 'while j > 0 and arr[j - 1] > arr[j]:', codePartId: InsertionSortPartId.Compare },
		{ indent: 3, text: 'arr[j - 1], arr[j] = arr[j], arr[j - 1]', codePartId: InsertionSortPartId.Swap },
		{ indent: 3, text: 'j -= 1', codePartId: InsertionSortPartId.Swap },
	],
	javascript: [
		{ indent: 0, text: 'function insertionSort(arr) {', codePartId: InsertionSortPartId.StartInsertionSort },
		{ indent: 1, text: 'const n = arr.length;', codePartId: InsertionSortPartId.StartInsertionSort },
		{ indent: 1, text: 'for (let i = 1; i < n; i += 1) {', codePartId: InsertionSortPartId.OuterLoop },
		{ indent: 2, text: 'let j = i;', codePartId: InsertionSortPartId.OuterLoop },
		{ indent: 2, text: 'while (j > 0 && arr[j - 1] > arr[j]) {', codePartId: InsertionSortPartId.Compare },
		{ indent: 3, text: '[arr[j - 1], arr[j]] = [arr[j], arr[j - 1]];', codePartId: InsertionSortPartId.Swap },
		{ indent: 3, text: 'j -= 1;', codePartId: InsertionSortPartId.Swap },
		{ indent: 2, text: '}', codePartId: InsertionSortPartId.Compare },
		{ indent: 1, text: '}', codePartId: InsertionSortPartId.OuterLoop },
		{ indent: 0, text: '}', codePartId: InsertionSortPartId.StartInsertionSort },
	],
	c: [
		{ indent: 0, text: 'void insertionSort(int arr[], int n) {', codePartId: InsertionSortPartId.StartInsertionSort },
		{ indent: 1, text: 'for (int i = 1; i < n; i++) {', codePartId: InsertionSortPartId.OuterLoop },
		{ indent: 2, text: 'int j = i;', codePartId: InsertionSortPartId.OuterLoop },
		{ indent: 2, text: 'while (j > 0 && arr[j - 1] > arr[j]) {', codePartId: InsertionSortPartId.Compare },
		{ indent: 3, text: 'int tmp = arr[j];', codePartId: InsertionSortPartId.Swap },
		{ indent: 3, text: 'arr[j] = arr[j - 1];', codePartId: InsertionSortPartId.Swap },
		{ indent: 3, text: 'arr[j - 1] = tmp;', codePartId: InsertionSortPartId.Swap },
		{ indent: 3, text: 'j -= 1;', codePartId: InsertionSortPartId.Swap },
		{ indent: 2, text: '}', codePartId: InsertionSortPartId.Compare },
		{ indent: 1, text: '}', codePartId: InsertionSortPartId.OuterLoop },
		{ indent: 0, text: '}', codePartId: InsertionSortPartId.StartInsertionSort },
	],
};

export function insertionSortSteps(input: number[]): SortStep[] {
	return detailedStepsToSortSteps(insertionSortDetailedSteps(input));
}

export function insertionSortDetailedSteps(input: number[]): DetailedSortStep[] {
	const trace = new DetailedTraceBuilder(input);
	const array = trace.workingArray;
	const n = array.length;

	trace.paint({ sorted: [0] });
	trace.record({
		codePartId: InsertionSortPartId.StartInsertionSort,
		label: 'Start insertion sort: first element is already sorted',
		variables: { n },
	});

	for (let i = 1; i < n; i += 1) {
		let j = i;
		trace.paint({ light: [i], sorted: range(0, i - 1) });
		trace.record({
			codePartId: InsertionSortPartId.OuterLoop,
			label: `Start sorting element at index ${i}`,
			variables: { i, j },
		});

		while (j > 0) {
			trace.paint({ compared: [j, j - 1], sorted: range(0, i) });
			trace.record({
				codePartId: InsertionSortPartId.Compare,
				label: `Compare element at index ${j} with previous element`,
				variables: { i, j },
			});

			if (array[j - 1].value > array[j].value) {
				swap(array, j - 1, j);
				trace.paint({ moved: [j, j - 1], sorted: range(0, i) });
				trace.record({
					codePartId: InsertionSortPartId.Swap,
					label: `Swap elements at indices ${j} and ${j - 1}`,
					variables: { i, j },
				});
				j -= 1;
			} else {
				break;
			}
		}
	}

	return trace.build();
}
