import type { StepLabel } from '$lib/utils/stepLabel';

import type { SearchingAlgorithmId, SortingAlgorithmId } from '../misc/types';
import type { CodeLanguage } from '../registry';
import type { Item } from './traceBuilder';

// basic steps
export interface SortStep {
	array: Item[];
	stepLabel: StepLabel;
	comparisons?: number;
	swaps?: number;
}

export class Counters {
	comparisons: number;
	swaps: number;

	constructor() {
		this.comparisons = 0;
		this.swaps = 0;
	}

	compare(howMany: number = 1) {
		this.comparisons += howMany;
	}

	swap(howMany: number = 1) {
		this.swaps += howMany;
	}
}

export interface SortStepResult {
	steps: SortStep[];
	counters: Counters;
}

// detailed steps
export interface DetailedSortStep {
	array: Item[];
	rows?: Array<Array<Item | null>>;
	codePartId: string;
	stepLabel: StepLabel;
	variables: Record<string, number | string>;
}

export const LineBreak: CodeLine = { indent: 0, text: '', codePartId: '' };

export interface CodeLine {
	indent: number;
	text: string;
	codePartId: string | null;
}

export interface DetailedCodeTemplate {
	algorithmId: SortingAlgorithmId | SearchingAlgorithmId;
	codes: Record<CodeLanguage, CodeLine[]>;
}

export interface DetailedSortStepResult {
	steps: DetailedSortStep[];
	counters: Counters;
}
