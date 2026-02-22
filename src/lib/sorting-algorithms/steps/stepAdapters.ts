import type { DetailedSortStep, SortStep } from './stepTypes';

export function detailedStepsToSortSteps(steps: DetailedSortStep[]): SortStep[] {
	return steps.map(step => ({
		array: step.array,
		activeIndices: step.indicesHighlighted,
		movedIndices: step.movedIndices,
		sortedIndices: step.sortedIndices,
		label: step.label,
	}));
}
