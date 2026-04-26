import type { DetailedSortStepResult, SortStepResult } from '../steps/stepTypes';

export type SortingAlgorithmId = 'bubble' | 'selection' | 'insertion' | 'heap' | 'merge' | 'quick';

export type SearchingAlgorithmId = 'linear' | 'binary';

export interface SortingAlgorithm {
	id: SortingAlgorithmId;
	nameKey: string;
	descriptionKey: string;
	generateSteps: (input: number[]) => SortStepResult;
	generateDetailedSteps: (input: number[]) => DetailedSortStepResult;
}

export interface SearchingAlgorithm {
	id: SearchingAlgorithmId;
	nameKey: string;
	descriptionKey: string;
	generateSteps: (input: number[], targetValue?: number) => SortStepResult;
	generateDetailedSteps: (input: number[], targetValue?: number) => DetailedSortStepResult;
}

export type DataSetType = 'shuffled' | 'almost-sorted' | 'reverse' | 'duplicates' | 'sawtooth' | 'pyramid' | 'discontinuous';

export interface DataSet {
	type: DataSetType;
	labelKey: string;
	generate: (size: number) => number[];
}
