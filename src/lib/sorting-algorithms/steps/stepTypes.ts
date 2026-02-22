import type { SortingAlgorithmId } from "../misc/types";

// basic steps
export interface SortStep {
	array: number[];
	activeIndices: number[];
	movedIndices: number[];
	sortedIndices: number[];
	label: string;
}

// detailed steps

export type CodeLanguage = 'python' | 'javascript';

export interface DetailedSortStep {
	array: number[];
	indicesHighlighted: number[];
	movedIndices: number[];
	sortedIndices: number[];
	codePartId: string;
	label: string;
	variables: Record<string, number | string>;
}

export interface CodePart {
	id: string;
	python: string;
	javascript: string;
}

export interface DetailedCodeTemplate {
	algorithmId: SortingAlgorithmId;
	parts: CodePart[];
}
