import type { SortingAlgorithmId } from '../misc/types';
import type { Item } from './traceBuilder';

// basic steps
export interface SortStep {
	array: Item[];
	label: string;
}

// detailed steps

export type CodeLanguage = 'python' | 'javascript' | 'c';

export interface DetailedSortStep {
	array: Item[];
	rows?: Array<Array<Item | null>>;
	codePartId: string;
	label: string;
	variables: Record<string, number | string>;
}

export const LineBreak: CodeLine = { indent: 0, text: '', codePartId: '' };

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
