import type { DetailedSortStep, SortStep } from '../steps/stepTypes';

export type SortingAlgorithmId = 'bubble' | 'selection' | 'insertion' | 'heap' | 'merge' | 'quick';

export interface SortingAlgorithm {
	id: SortingAlgorithmId;
	nameKey: string;
	descriptionKey: string;
	generateSteps: (input: number[]) => SortStep[];
	generateDetailedSteps: (input: number[]) => DetailedSortStep[];
}

export type DataSetType = 'shuffled' | 'almost-sorted' | 'reverse' | 'duplicates' | 'sawtooth' | 'pyramid';

export interface DataSet {
	type: DataSetType;
	labelKey: string;
	generate: (size: number) => number[];
}
