import { range, swap } from '$lib/sorting-algorithms/misc/utils';
import { detailedStepsToSortSteps } from '$lib/sorting-algorithms/steps/stepAdapters';
import { StepLabel } from '$lib/steps/stepLabel';

import { type DetailedCodeTemplate, type DetailedSortStep, type SortStep } from '../steps/stepTypes';
import { DetailedTraceBuilder } from '../steps/traceBuilder';

export enum BubbleSortPartId {
	StartBubbleSort = 'start-bubble-sort',
	OuterLoop = 'outer-loop',
	InnerLoop = 'inner-loop',
	Compare = 'compare',
	Swap = 'swap',
}

export const bubbleSortTemplate: DetailedCodeTemplate = {
	algorithmId: 'bubble',
	codes: {
		python: [
			{ indent: 0, text: 'def bubble_sort(arr):', codePartId: BubbleSortPartId.StartBubbleSort },
			{ indent: 1, text: 'n = len(arr)', codePartId: BubbleSortPartId.StartBubbleSort },
			{ indent: 1, text: 'for i in range(n - 1):', codePartId: BubbleSortPartId.OuterLoop },
			{ indent: 2, text: 'for j in range(n - i - 1):', codePartId: BubbleSortPartId.InnerLoop },
			{ indent: 3, text: 'if arr[j] > arr[j + 1]:', codePartId: BubbleSortPartId.Compare },
			{ indent: 4, text: 'arr[j], arr[j + 1] = arr[j + 1], arr[j]', codePartId: BubbleSortPartId.Swap },
		],
		javascript: [
			{ indent: 0, text: 'function bubbleSort(arr) {', codePartId: BubbleSortPartId.StartBubbleSort },
			{ indent: 1, text: 'const n = arr.length;', codePartId: BubbleSortPartId.StartBubbleSort },
			{ indent: 1, text: 'for (let i = 0; i < n - 1; i += 1) {', codePartId: BubbleSortPartId.OuterLoop },
			{ indent: 2, text: 'for (let j = 0; j < n - i - 1; j += 1) {', codePartId: BubbleSortPartId.InnerLoop },
			{ indent: 3, text: 'if (arr[j] > arr[j + 1]) {', codePartId: BubbleSortPartId.Compare },
			{ indent: 4, text: '[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];', codePartId: BubbleSortPartId.Swap },
			{ indent: 3, text: '}', codePartId: BubbleSortPartId.Compare },
			{ indent: 2, text: '}', codePartId: BubbleSortPartId.InnerLoop },
			{ indent: 1, text: '}', codePartId: BubbleSortPartId.OuterLoop },
			{ indent: 0, text: '}', codePartId: BubbleSortPartId.StartBubbleSort },
		],
		c: [
			{ indent: 0, text: 'void bubbleSort(int arr[], int n) {', codePartId: BubbleSortPartId.StartBubbleSort },
			{ indent: 1, text: 'for (int i = 0; i < n - 1; i++) {', codePartId: BubbleSortPartId.OuterLoop },
			{ indent: 2, text: 'for (int j = 0; j < n - i - 1; j++) {', codePartId: BubbleSortPartId.InnerLoop },
			{ indent: 3, text: 'if (arr[j] > arr[j + 1]) {', codePartId: BubbleSortPartId.Compare },
			{ indent: 4, text: 'int tmp = arr[j];', codePartId: BubbleSortPartId.Swap },
			{ indent: 4, text: 'arr[j] = arr[j + 1];', codePartId: BubbleSortPartId.Swap },
			{ indent: 4, text: 'arr[j + 1] = tmp;', codePartId: BubbleSortPartId.Swap },
			{ indent: 3, text: '}', codePartId: BubbleSortPartId.Compare },
			{ indent: 2, text: '}', codePartId: BubbleSortPartId.InnerLoop },
			{ indent: 1, text: '}', codePartId: BubbleSortPartId.OuterLoop },
			{ indent: 0, text: '}', codePartId: BubbleSortPartId.StartBubbleSort },
		],
	},
};

export function bubbleSortSteps(input: number[]): SortStep[] {
	return detailedStepsToSortSteps(bubbleSortDetailedSteps(input));
}

export function bubbleSortDetailedSteps(input: number[]): DetailedSortStep[] {
	const trace = new DetailedTraceBuilder(input);
	const array = trace.workingArray;
	const n = array.length;
	let sortedIndices: number[] = [];

	trace.paint({ sorted: sortedIndices });
	trace.record({
		codePartId: BubbleSortPartId.StartBubbleSort,
		stepLabel: new StepLabel('sorting.steps.bubble.start'),
		variables: { n },
	});

	for (let i = 0; i < n - 1; i += 1) {
		trace.paint({ light: range(0, n - i - 1), sorted: sortedIndices });
		trace.record({
			codePartId: BubbleSortPartId.OuterLoop,
			stepLabel: new StepLabel('sorting.steps.bubble.outerIteration', { i }),
			variables: { i, n },
		});

		for (let j = 0; j < n - i - 1; j += 1) {
			trace.paint({ light: [j], sorted: sortedIndices });
			trace.record({
				codePartId: BubbleSortPartId.InnerLoop,
				stepLabel: new StepLabel('sorting.steps.bubble.innerIteration', { j }),
				variables: { i, j },
			});

			trace.paint({ compared: [j, j + 1], sorted: sortedIndices });
			trace.record({
				codePartId: BubbleSortPartId.Compare,
				stepLabel: new StepLabel('sorting.steps.bubble.compare', { j, nextJ: j + 1 }),
				variables: { i, j },
			});

			if (array[j].value > array[j + 1].value) {
				swap(array, j, j + 1);
				trace.paint({ moved: [j, j + 1], sorted: sortedIndices });
				trace.record({
					codePartId: BubbleSortPartId.Swap,
					stepLabel: new StepLabel('sorting.steps.bubble.swap', { j, nextJ: j + 1 }),
					variables: { i, j },
				});
			}
		}

		sortedIndices = range(n - i - 1, n - 1);
	}

	return trace.build();
}
