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

	for (let i = 0; i < n - 1; i += 1) {
		trace.paint({ compared: [i], sorted: sortedIndices });
		trace.record({
			codePartId: 'outer-loop',
			label: `Outer iteration i=${i}`,
			variables: { i, n },
		});

		for (let j = 0; j < n - i - 1; j += 1) {
			trace.paint({ compared: [j], sorted: sortedIndices });
			trace.record({
				codePartId: 'inner-loop',
				label: `Inner iteration j=${j}`,
				variables: { i, j },
			});

			trace.paint({ compared: [j, j + 1], sorted: sortedIndices });
			trace.record({
				codePartId: 'compare',
				label: `Compare arr[${j}] and arr[${j + 1}]`,
				variables: { i, j },
			});

			if (array[j].value > array[j + 1].value) {
				swap(array, j, j + 1);
				trace.paint({ moved: [j, j + 1], sorted: sortedIndices });
				trace.record({
					codePartId: 'swap',
					label: `Swap indices ${j} and ${j + 1}`,
					variables: { i, j },
				});
			}
		}

		sortedIndices = range(n - i - 1, n - 1);
		trace.paint({ compared: [n - i - 1], sorted: sortedIndices });
		trace.record({
			codePartId: 'inner-loop',
			label: `Index ${n - i - 1} fixed in final place`,
			variables: { i },
		});
	}

	return trace.build();
}
