import type { SortStep } from '$lib/sorting-algorithms/steps/stepTypes';

export interface CellState {
	steps: SortStep[];
	currentStepIndex: number;
}
