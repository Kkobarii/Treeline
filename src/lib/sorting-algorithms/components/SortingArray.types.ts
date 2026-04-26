import type { Item } from '$lib/sorting-algorithms/steps/traceBuilder';

export interface GridCell {
	item: Item | null;
	key: string;
	indexLabel: number;
}

export interface TargetAreaHighlight {
	left: string;
	width: string;
	top: string;
	height: string;
}

export interface SortingArrayProps {
	gridColumns: number;
	gridCells: GridCell[];
	targetAreaHighlight: TargetAreaHighlight | null;
	isQuickSort: boolean;
	activeFlipDurationMs: number;
	currentArray: Item[];
	onItemClick?: (value: number) => void;
}
