import { range, swap } from '$lib/sorting-algorithms/misc/utils';
import { detailedStepsToSortSteps } from '$lib/sorting-algorithms/steps/stepAdapters';

import type { DetailedCodeTemplate, DetailedSortStep, SortStep } from '../steps/stepTypes';
import { DetailedTraceBuilder } from '../steps/traceBuilder';

export enum SelectionSortPartId {
	OuterLoop = 'outer-loop',
	ScanLoop = 'scan-loop',
	Compare = 'compare',
	NewMin = 'new-min',
	Swap = 'swap',
}

export const selectionSortTemplate: DetailedCodeTemplate = {
	algorithmId: 'selection',
	python: [
		{ indent: 0, text: 'for i in range(n - 1):', codePartId: SelectionSortPartId.OuterLoop },
		{ indent: 1, text: 'min_idx = i', codePartId: SelectionSortPartId.OuterLoop },
		{ indent: 1, text: 'for j in range(i + 1, n):', codePartId: SelectionSortPartId.ScanLoop },
		{ indent: 2, text: 'if arr[j] < arr[min_idx]:', codePartId: SelectionSortPartId.Compare },
		{ indent: 3, text: 'min_idx = j', codePartId: SelectionSortPartId.NewMin },
		{ indent: 1, text: 'arr[i], arr[min_idx] = arr[min_idx], arr[i]', codePartId: SelectionSortPartId.Swap },
	],
	javascript: [
		{ indent: 0, text: 'for (let i = 0; i < n - 1; i += 1) {', codePartId: SelectionSortPartId.OuterLoop },
		{ indent: 1, text: 'let minIndex = i;', codePartId: SelectionSortPartId.OuterLoop },
		{ indent: 1, text: 'for (let j = i + 1; j < n; j += 1) {', codePartId: SelectionSortPartId.ScanLoop },
		{ indent: 2, text: 'if (arr[j] < arr[minIndex]) {', codePartId: SelectionSortPartId.Compare },
		{ indent: 3, text: 'minIndex = j;', codePartId: SelectionSortPartId.NewMin },
		{ indent: 2, text: '}', codePartId: SelectionSortPartId.NewMin },
		{ indent: 1, text: '}', codePartId: SelectionSortPartId.ScanLoop },
		{ indent: 1, text: '[arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];', codePartId: SelectionSortPartId.Swap },
		{ indent: 0, text: '}', codePartId: SelectionSortPartId.OuterLoop },
	],
	c: [
		{ indent: 0, text: 'for (int i = 0; i < n - 1; i++) {', codePartId: SelectionSortPartId.OuterLoop },
		{ indent: 1, text: 'int min_idx = i;', codePartId: SelectionSortPartId.OuterLoop },
		{ indent: 1, text: 'for (int j = i + 1; j < n; j++) {', codePartId: SelectionSortPartId.ScanLoop },
		{ indent: 2, text: 'if (arr[j] < arr[min_idx]) {', codePartId: SelectionSortPartId.Compare },
		{ indent: 3, text: 'min_idx = j;', codePartId: SelectionSortPartId.NewMin },
		{ indent: 2, text: '}', codePartId: SelectionSortPartId.NewMin },
		{ indent: 1, text: '}', codePartId: SelectionSortPartId.ScanLoop },
		{ indent: 1, text: 'int tmp = arr[i];', codePartId: SelectionSortPartId.Swap },
		{ indent: 1, text: 'arr[i] = arr[min_idx];', codePartId: SelectionSortPartId.Swap },
		{ indent: 1, text: 'arr[min_idx] = tmp;', codePartId: SelectionSortPartId.Swap },
		{ indent: 0, text: '}', codePartId: SelectionSortPartId.OuterLoop },
	],
};

export function selectionSortSteps(input: number[]): SortStep[] {
	return detailedStepsToSortSteps(selectionSortDetailedSteps(input));
}

export function selectionSortDetailedSteps(input: number[]): DetailedSortStep[] {
	const trace = new DetailedTraceBuilder(input);
	const array = trace.workingArray;
	const n = array.length;
	let sortedIndices: number[] = [];

	for (let i = 0; i < n - 1; i += 1) {
		let minIndex = i;
		trace.paint({ compared: [i], sorted: sortedIndices });
		trace.record({
			codePartId: 'outer-loop',
			label: `Start searching minimum for position ${i}`,
			variables: { i, minIndex },
		});

		for (let j = i + 1; j < n; j += 1) {
			trace.paint({ compared: [j, minIndex], sorted: sortedIndices });
			trace.record({
				codePartId: 'scan-loop',
				label: `Scan j=${j} against current minimum`,
				variables: { i, j, minIndex },
			});

			trace.paint({ compared: [j, minIndex], sorted: sortedIndices });
			trace.record({
				codePartId: 'compare',
				label: `Compare arr[${j}] with current minimum arr[${minIndex}]`,
				variables: { i, j, minIndex },
			});

			if (array[j].value < array[minIndex].value) {
				minIndex = j;
				trace.paint({ compared: [minIndex], sorted: sortedIndices });
				trace.record({
					codePartId: 'new-min',
					label: `New minimum found at index ${minIndex}`,
					variables: { i, j, minIndex },
				});
			}
		}

		if (minIndex !== i) {
			swap(array, i, minIndex);
			trace.paint({ moved: [i, minIndex], sorted: sortedIndices });
			trace.record({
				codePartId: 'swap',
				label: `Swap index ${i} with minimum index ${minIndex}`,
				variables: { i, minIndex },
			});
		}

		sortedIndices = range(0, i);
	}

	return trace.build();
}
