import type { DetailedSortStep, SortStep } from './stepTypes';

export function detailedStepsToSortSteps(steps: DetailedSortStep[]): SortStep[] {
	return steps
		.filter(step => {
			const key = step.stepLabel.label;

			return (
				key === 'sorting.steps.common.initialArray' ||
				key === 'sorting.steps.common.finalArray' ||
				key.includes('.compare') ||
				key.includes('.swap') ||
				key.includes('.shift')
			);
		})
		.map(step => ({
			array: step.array,
			stepLabel: step.stepLabel,
		}));
}
