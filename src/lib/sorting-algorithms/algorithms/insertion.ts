import { range, swap } from '$lib/sorting-algorithms/misc/utils';
import { detailedStepsToSortSteps } from '$lib/sorting-algorithms/steps/stepAdapters';

import type { DetailedCodeTemplate, DetailedSortStep, SortStep } from '../steps/stepTypes';
import { DetailedTraceBuilder } from '../steps/traceBuilder';

export enum InsertionSortPartId {
	OuterLoop = 'outer-loop',
	Compare = 'compare-loop',
	Swap = 'swap',
}

export const insertionSortTemplate: DetailedCodeTemplate = {
	algorithmId: 'insertion',
	python: [
		{ indent: 0, text: 'for i in range(1, n):', codePartId: InsertionSortPartId.OuterLoop },
		{ indent: 1, text: 'j = i', codePartId: InsertionSortPartId.OuterLoop },
		{ indent: 1, text: 'while j > 0 and arr[j - 1] > arr[j]:', codePartId: InsertionSortPartId.Compare },
		{ indent: 2, text: 'arr[j - 1], arr[j] = arr[j], arr[j - 1]', codePartId: InsertionSortPartId.Swap },
		{ indent: 2, text: 'j -= 1', codePartId: InsertionSortPartId.Swap },
	],
	javascript: [
		{ indent: 0, text: 'for (let i = 1; i < n; i += 1) {', codePartId: InsertionSortPartId.OuterLoop },
		{ indent: 1, text: 'let j = i;', codePartId: InsertionSortPartId.OuterLoop },
		{ indent: 1, text: 'while (j > 0 && arr[j - 1] > arr[j]) {', codePartId: InsertionSortPartId.Compare },
		{ indent: 2, text: '[arr[j - 1], arr[j]] = [arr[j], arr[j - 1]];', codePartId: InsertionSortPartId.Swap },
		{ indent: 2, text: 'j -= 1;', codePartId: InsertionSortPartId.Swap },
		{ indent: 1, text: '}', codePartId: InsertionSortPartId.Compare },
		{ indent: 0, text: '}', codePartId: InsertionSortPartId.OuterLoop },
	],
	c: [
		{ indent: 0, text: 'for (int i = 1; i < n; i++) {', codePartId: InsertionSortPartId.OuterLoop },
		{ indent: 1, text: 'int j = i;', codePartId: InsertionSortPartId.OuterLoop },
		{ indent: 1, text: 'while (j > 0 && arr[j - 1] > arr[j]) {', codePartId: InsertionSortPartId.Compare },
		{ indent: 2, text: 'int tmp = arr[j];', codePartId: InsertionSortPartId.Swap },
		{ indent: 2, text: 'arr[j] = arr[j - 1];', codePartId: InsertionSortPartId.Swap },
		{ indent: 2, text: 'arr[j - 1] = tmp;', codePartId: InsertionSortPartId.Swap },
		{ indent: 2, text: 'j -= 1;', codePartId: InsertionSortPartId.Swap },
		{ indent: 1, text: '}', codePartId: InsertionSortPartId.Compare },
		{ indent: 0, text: '}', codePartId: InsertionSortPartId.OuterLoop },
	],
};

export function insertionSortSteps(input: number[]): SortStep[] {
	return detailedStepsToSortSteps(insertionSortDetailedSteps(input));
}

export function insertionSortDetailedSteps(input: number[]): DetailedSortStep[] {
	const trace = new DetailedTraceBuilder(input);
	const array = trace.workingArray;
	const n = array.length;

	for (let i = 1; i < n; i += 1) {
		let j = i;
		trace.record({
			codePartId: InsertionSortPartId.OuterLoop,
			indicesHighlighted: [i],
			comparedIndices: [],
			movedIndices: [],
			sortedIndices: range(0, i - 1),
			label: `Start sorting element at index ${i}`,
			variables: { i, j },
		});

		while (j > 0) {
			trace.record({
				codePartId: InsertionSortPartId.Compare,
				indicesHighlighted: [j, j - 1],
				comparedIndices: [j, j - 1],
				movedIndices: [],
				sortedIndices: range(0, i - 1),
				label: `Compare element at index ${j} with previous element`,
				variables: { i, j },
			});

			if (array[j - 1] > array[j]) {
				swap(array, j - 1, j);
				trace.record({
					codePartId: InsertionSortPartId.Swap,
					indicesHighlighted: [j, j - 1],
					comparedIndices: [],
					movedIndices: [j, j - 1],
					sortedIndices: range(0, i - 1),
					label: `Swap elements at indices ${j} and ${j - 1}`,
					variables: { i, j },
				});
				j -= 1;
			} else {
				break;
			}
		}
	}

	trace.record({
		codePartId: InsertionSortPartId.OuterLoop,
		indicesHighlighted: [],
		comparedIndices: [],
		movedIndices: [],
		sortedIndices: range(0, n - 1),
		label: 'Insertion sort finished',
		variables: {},
	});

	return trace.build();
}
