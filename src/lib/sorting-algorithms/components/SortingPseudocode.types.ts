import type { CodeLanguage } from '$lib/sorting-algorithms/registry';
import type { CodeLine } from '$lib/sorting-algorithms/steps/stepTypes';

export type HighlightedCodeLine = CodeLine & {
	highlightedText: string;
};

export interface SortingPseudocodeProps {
	language: CodeLanguage;
	languageOptions: { value: string; label: string }[];
	highlightedCodeLines: HighlightedCodeLine[];
	currentCodePartId: string;
	onLanguageChange: (lang: CodeLanguage) => void;
}
