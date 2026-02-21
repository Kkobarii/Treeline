export type SortingAlgorithmId = 'bubble' | 'selection' | 'insertion' | 'heap' | 'merge' | 'quick';

export interface SortStep {
	array: number[];
	activeIndices: number[];
	movedIndices: number[];
	sortedIndices: number[];
	label: string;
}

export interface SortingAlgorithm {
	id: SortingAlgorithmId;
	name: string;
	description: string;
	generateSteps: (input: number[]) => SortStep[];
}
