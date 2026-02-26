import { range, swap } from '$lib/sorting-algorithms/misc/utils';
import { detailedStepsToSortSteps } from '$lib/sorting-algorithms/steps/stepAdapters';

import type { DetailedCodeTemplate, DetailedSortStep, SortStep } from '../steps/stepTypes';
import { DetailedTraceBuilder } from '../steps/traceBuilder';

export enum BubbleSortPartId {
	OuterLoop = 'outer-loop',
	InnerLoop = 'inner-loop',
	Compare = 'compare',
	Swap = 'swap',
}

export const bubbleSortTemplate: DetailedCodeTemplate = {
	algorithmId: 'bubble',
	python: [
		{ indent: 0, text: 'for i in range(n - 1):', codePartId: BubbleSortPartId.OuterLoop },
		{ indent: 1, text: 'for j in range(n - i - 1):', codePartId: BubbleSortPartId.InnerLoop },
		{ indent: 2, text: 'if arr[j] > arr[j + 1]:', codePartId: BubbleSortPartId.Compare },
		{ indent: 3, text: 'arr[j], arr[j + 1] = arr[j + 1], arr[j]', codePartId: BubbleSortPartId.Swap },
	],
	javascript: [
		{ indent: 0, text: 'for (let i = 0; i < n - 1; i += 1) {', codePartId: BubbleSortPartId.OuterLoop },
		{ indent: 1, text: 'for (let j = 0; j < n - i - 1; j += 1) {', codePartId: BubbleSortPartId.InnerLoop },
		{ indent: 2, text: 'if (arr[j] > arr[j + 1]) {', codePartId: BubbleSortPartId.Compare },
		{ indent: 3, text: '[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];', codePartId: BubbleSortPartId.Swap },
		{ indent: 2, text: '}', codePartId: BubbleSortPartId.Compare },
		{ indent: 1, text: '}', codePartId: BubbleSortPartId.InnerLoop },
		{ indent: 0, text: '}', codePartId: BubbleSortPartId.OuterLoop },
	],
	c: [
		{ indent: 0, text: 'for (int i = 0; i < n - 1; i++) {', codePartId: BubbleSortPartId.OuterLoop },
		{ indent: 1, text: 'for (int j = 0; j < n - i - 1; j++) {', codePartId: BubbleSortPartId.InnerLoop },
		{ indent: 2, text: 'if (arr[j] > arr[j + 1]) {', codePartId: BubbleSortPartId.Compare },
		{ indent: 3, text: 'int tmp = arr[j];', codePartId: BubbleSortPartId.Swap },
		{ indent: 3, text: 'arr[j] = arr[j + 1];', codePartId: BubbleSortPartId.Swap },
		{ indent: 3, text: 'arr[j + 1] = tmp;', codePartId: BubbleSortPartId.Swap },
		{ indent: 2, text: '}', codePartId: BubbleSortPartId.Compare },
		{ indent: 1, text: '}', codePartId: BubbleSortPartId.InnerLoop },
		{ indent: 0, text: '}', codePartId: BubbleSortPartId.OuterLoop },
	],
};

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
				codePartId: 'inner-loop',
				indicesHighlighted: [j],
				movedIndices: [],
				sortedIndices,
				label: `Inner iteration j=${j}`,
				variables: { i, j },
			});

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
