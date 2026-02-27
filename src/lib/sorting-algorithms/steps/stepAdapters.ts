import type { DetailedSortStep, SortStep } from './stepTypes';

export function detailedStepsToSortSteps(steps: DetailedSortStep[]): SortStep[] {
	return steps
		.filter(step => {
			const normalizedLabel = step.label.toLowerCase();

			return (
				normalizedLabel.includes('compare') ||
				normalizedLabel.includes('swap') ||
				normalizedLabel.includes('shift') ||
				normalizedLabel.includes('initial') ||
				normalizedLabel.includes('final')
			);
		})
		.map(step => ({
			array: step.array,
			label: step.label,
		}));
}
