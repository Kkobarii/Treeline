import type { SortingAlgorithmId } from '../misc/types';

// basic steps
export interface SortStep {
	array: number[];
	activeIndices: number[];
	movedIndices: number[];
	sortedIndices: number[];
	label: string;
}

// detailed steps

export type CodeLanguage = 'python' | 'javascript' | 'c';

export interface DetailedSortStep {
	array: number[];
	indicesHighlighted: number[];
	movedIndices: number[];
	sortedIndices: number[];
	codePartId: string;
	label: string;
	variables: Record<string, number | string>;
}

export interface CodeLine {
	indent: number;
	text: string;
	codePartId: string | null;
}

export interface DetailedCodeTemplate {
	algorithmId: SortingAlgorithmId;
	python: CodeLine[];
	javascript: CodeLine[];
	c: CodeLine[];
}
