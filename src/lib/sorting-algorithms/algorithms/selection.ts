import { range, swap } from '$lib/sorting-algorithms/misc/utils';
import { detailedStepsToSortSteps } from '$lib/sorting-algorithms/steps/stepAdapters';
import { StepLabel } from '$lib/steps/stepLabel';

import type { DetailedCodeTemplate, DetailedSortStep, SortStep } from '../steps/stepTypes';
import { DetailedTraceBuilder } from '../steps/traceBuilder';

export enum SelectionSortPartId {
	StartSelectionSort = 'start-selection-sort',
	OuterLoop = 'outer-loop',
	ScanLoop = 'scan-loop',
	Compare = 'compare',
	NewMin = 'new-min',
	Swap = 'swap',
}

export const selectionSortTemplate: DetailedCodeTemplate = {
	algorithmId: 'selection',
	python: [
		{ indent: 0, text: 'def selection_sort(arr):', codePartId: SelectionSortPartId.StartSelectionSort },
		{ indent: 1, text: 'n = len(arr)', codePartId: SelectionSortPartId.StartSelectionSort },
		{ indent: 1, text: 'for i in range(n - 1):', codePartId: SelectionSortPartId.OuterLoop },
		{ indent: 2, text: 'min_idx = i', codePartId: SelectionSortPartId.OuterLoop },
		{ indent: 2, text: 'for j in range(i + 1, n):', codePartId: SelectionSortPartId.ScanLoop },
		{ indent: 3, text: 'if arr[j] < arr[min_idx]:', codePartId: SelectionSortPartId.Compare },
		{ indent: 4, text: 'min_idx = j', codePartId: SelectionSortPartId.NewMin },
		{ indent: 2, text: 'arr[i], arr[min_idx] = arr[min_idx], arr[i]', codePartId: SelectionSortPartId.Swap },
	],
	javascript: [
		{ indent: 0, text: 'function selectionSort(arr) {', codePartId: SelectionSortPartId.StartSelectionSort },
		{ indent: 1, text: 'const n = arr.length;', codePartId: SelectionSortPartId.StartSelectionSort },
		{ indent: 1, text: 'for (let i = 0; i < n - 1; i += 1) {', codePartId: SelectionSortPartId.OuterLoop },
		{ indent: 2, text: 'let minIndex = i;', codePartId: SelectionSortPartId.OuterLoop },
		{ indent: 2, text: 'for (let j = i + 1; j < n; j += 1) {', codePartId: SelectionSortPartId.ScanLoop },
		{ indent: 3, text: 'if (arr[j] < arr[minIndex]) {', codePartId: SelectionSortPartId.Compare },
		{ indent: 4, text: 'minIndex = j;', codePartId: SelectionSortPartId.NewMin },
		{ indent: 3, text: '}', codePartId: SelectionSortPartId.Compare },
		{ indent: 2, text: '}', codePartId: SelectionSortPartId.ScanLoop },
		{ indent: 2, text: '[arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];', codePartId: SelectionSortPartId.Swap },
		{ indent: 1, text: '}', codePartId: SelectionSortPartId.OuterLoop },
		{ indent: 0, text: '}', codePartId: SelectionSortPartId.StartSelectionSort },
	],
	c: [
		{ indent: 0, text: 'void selectionSort(int arr[], int n) {', codePartId: SelectionSortPartId.StartSelectionSort },
		{ indent: 1, text: 'for (int i = 0; i < n - 1; i++) {', codePartId: SelectionSortPartId.OuterLoop },
		{ indent: 2, text: 'int min_idx = i;', codePartId: SelectionSortPartId.OuterLoop },
		{ indent: 2, text: 'for (int j = i + 1; j < n; j++) {', codePartId: SelectionSortPartId.ScanLoop },
		{ indent: 3, text: 'if (arr[j] < arr[min_idx]) {', codePartId: SelectionSortPartId.Compare },
		{ indent: 4, text: 'min_idx = j;', codePartId: SelectionSortPartId.NewMin },
		{ indent: 3, text: '}', codePartId: SelectionSortPartId.Compare },
		{ indent: 2, text: '}', codePartId: SelectionSortPartId.ScanLoop },
		{ indent: 2, text: 'int tmp = arr[i];', codePartId: SelectionSortPartId.Swap },
		{ indent: 2, text: 'arr[i] = arr[min_idx];', codePartId: SelectionSortPartId.Swap },
		{ indent: 2, text: 'arr[min_idx] = tmp;', codePartId: SelectionSortPartId.Swap },
		{ indent: 1, text: '}', codePartId: SelectionSortPartId.OuterLoop },
		{ indent: 0, text: '}', codePartId: SelectionSortPartId.StartSelectionSort },
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

	trace.paint({ sorted: sortedIndices });
	trace.record({
		codePartId: SelectionSortPartId.StartSelectionSort,
		stepLabel: new StepLabel('sorting.steps.selection.start'),
		variables: { n },
	});

	for (let i = 0; i < n - 1; i += 1) {
		let minIndex = i;
		trace.paint({ dark: [i], sorted: sortedIndices });
		trace.record({
			codePartId: SelectionSortPartId.OuterLoop,
			stepLabel: new StepLabel('sorting.steps.selection.outerIteration', { i }),
			variables: { i, minIndex },
		});

		for (let j = i + 1; j < n; j += 1) {
			trace.paint({ light: [j], dark: [minIndex], sorted: sortedIndices });
			trace.record({
				codePartId: SelectionSortPartId.ScanLoop,
				stepLabel: new StepLabel('sorting.steps.selection.scan', { j }),
				variables: { i, j, minIndex },
			});

			trace.paint({ compared: [j, minIndex], sorted: sortedIndices });
			trace.record({
				codePartId: SelectionSortPartId.Compare,
				stepLabel: new StepLabel('sorting.steps.selection.compare', { j, minIndex }),
				variables: { i, j, minIndex },
			});

			if (array[j].value < array[minIndex].value) {
				minIndex = j;
				trace.paint({ dark: [minIndex], sorted: sortedIndices });
				trace.record({
					codePartId: SelectionSortPartId.NewMin,
					stepLabel: new StepLabel('sorting.steps.selection.newMinimum', { minIndex }),
					variables: { i, j, minIndex },
				});
			}
		}

		if (minIndex !== i) {
			swap(array, i, minIndex);
			trace.paint({ moved: [i, minIndex], sorted: sortedIndices });
			trace.record({
				codePartId: SelectionSortPartId.Swap,
				stepLabel: new StepLabel('sorting.steps.selection.swap', { i, minIndex }),
				variables: { i, minIndex },
			});
		}

		sortedIndices = range(0, i);
	}

	return trace.build();
}
