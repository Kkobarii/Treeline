import { range } from '$lib/sorting-algorithms/misc/utils';
import { detailedStepsToSortSteps } from '$lib/sorting-algorithms/steps/stepAdapters';
import type { DetailedCodeTemplate, DetailedSortStepResult, SortStepResult } from '$lib/sorting-algorithms/steps/stepTypes';
import { DetailedTraceBuilder } from '$lib/sorting-algorithms/steps/traceBuilder';
import { StepLabel } from '$lib/utils/stepLabel';

export enum LinearSearchPartId {
	StartLinearSearch = 'start-linear-search',
	Loop = 'loop',
	Compare = 'compare',
	Found = 'found',
	NotFound = 'not-found',
}

export const linearSearchCodeTemplate: DetailedCodeTemplate = {
	algorithmId: 'linear',
	codes: {
		python: [
			{ indent: 0, text: 'def linear_search(arr, target):', codePartId: LinearSearchPartId.StartLinearSearch },
			{ indent: 1, text: 'for i in range(len(arr)):', codePartId: LinearSearchPartId.Loop },
			{ indent: 2, text: 'if arr[i] == target:', codePartId: LinearSearchPartId.Compare },
			{ indent: 3, text: 'return i', codePartId: LinearSearchPartId.Found },
			{ indent: 1, text: 'return -1', codePartId: LinearSearchPartId.NotFound },
		],
		javascript: [
			{ indent: 0, text: 'function linearSearch(arr, target) {', codePartId: LinearSearchPartId.StartLinearSearch },
			{ indent: 1, text: 'for (let i = 0; i < arr.length; i++) {', codePartId: LinearSearchPartId.Loop },
			{ indent: 2, text: 'if (arr[i] === target) {', codePartId: LinearSearchPartId.Compare },
			{ indent: 3, text: 'return i;', codePartId: LinearSearchPartId.Found },
			{ indent: 1, text: '}', codePartId: LinearSearchPartId.Compare },
			{ indent: 1, text: 'return -1;', codePartId: LinearSearchPartId.NotFound },
			{ indent: 0, text: '}', codePartId: LinearSearchPartId.StartLinearSearch },
		],
		c: [
			{ indent: 0, text: 'int linearSearch(int arr[], int n, int target) {', codePartId: LinearSearchPartId.StartLinearSearch },
			{ indent: 1, text: 'for (int i = 0; i < n; i++) {', codePartId: LinearSearchPartId.Loop },
			{ indent: 2, text: 'if (arr[i] == target) {', codePartId: LinearSearchPartId.Compare },
			{ indent: 3, text: 'return i;', codePartId: LinearSearchPartId.Found },
			{ indent: 2, text: '}', codePartId: LinearSearchPartId.Compare },
			{ indent: 1, text: '}', codePartId: LinearSearchPartId.Loop },
			{ indent: 1, text: 'return -1;', codePartId: LinearSearchPartId.NotFound },
			{ indent: 0, text: '}', codePartId: LinearSearchPartId.StartLinearSearch },
		],
	},
};

export function linearSearchDetailedSteps(input: number[], targetValue?: number): DetailedSortStepResult {
	const trace = new DetailedTraceBuilder(input);
	const array = trace.workingArray;
	const target = targetValue ?? 0;

	trace.record({
		codePartId: LinearSearchPartId.StartLinearSearch,
		stepLabel: new StepLabel('sorting.search.start', { target }),
		variables: { target },
	});

	let found = false;
	for (let i = 0; i < array.length; i++) {
		trace.paint({ light: range(0, i - 1), dark: [i] });
		trace.record({
			codePartId: LinearSearchPartId.Loop,
			stepLabel: new StepLabel('sorting.search.loop', { i }),
			variables: { target, index: i },
		});

		trace.paint({ compared: [i], light: range(0, i - 1) });
		trace.record({
			codePartId: LinearSearchPartId.Compare,
			stepLabel: new StepLabel('sorting.search.compare', { comparison: array[i].value, target }),
			variables: { target, index: i },
		});

		trace.counters.compare();
		if (array[i].value === target) {
			trace.paint({ sorted: [i], light: range(0, i - 1) });
			trace.record({
				codePartId: LinearSearchPartId.Found,
				stepLabel: new StepLabel('sorting.search.found', { target, index: i }),
				variables: { target, index: i },
			});
			found = true;
			break;
		}
	}

	if (!found) {
		trace.record({
			codePartId: LinearSearchPartId.NotFound,
			stepLabel: new StepLabel('sorting.search.notFound', { target }),
			variables: { target },
		});
	}

	return trace.build(true);
}

export function linearSearchSteps(input: number[], targetValue?: number): SortStepResult {
	return detailedStepsToSortSteps(linearSearchDetailedSteps(input, targetValue));
}
