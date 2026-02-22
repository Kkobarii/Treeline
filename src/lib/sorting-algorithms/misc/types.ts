import type { DetailedSortStep, SortStep } from '../steps/stepTypes';

export type SortingAlgorithmId = 'bubble' | 'selection' | 'insertion' | 'heap' | 'merge' | 'quick';

export interface SortingAlgorithm {
	id: SortingAlgorithmId;
	name: string;
	description: string;
	generateSteps: (input: number[]) => SortStep[];
	generateDetailedSteps: (input: number[]) => DetailedSortStep[];
}
