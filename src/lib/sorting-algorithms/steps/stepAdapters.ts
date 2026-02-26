import type { DetailedSortStep, SortStep } from './stepTypes';

export function detailedStepsToSortSteps(steps: DetailedSortStep[]): SortStep[] {
	return steps
		.filter(step => {
			const normalizedLabel = step.label.toLowerCase();
			return normalizedLabel.includes('compare') || normalizedLabel.includes('swap');
		})
		.map(step => ({
			array: step.array,
			activeIndices: step.indicesHighlighted,
			comparedIndices: step.comparedIndices,
			movedIndices: step.movedIndices,
			sortedIndices: step.sortedIndices,
			label: step.label,
		}));
}
