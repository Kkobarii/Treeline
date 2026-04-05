import type { Item } from '$lib/sorting-algorithms/steps/traceBuilder';

export interface SortingBarsProps {
	items: Item[];
	hasReveal?: boolean;
	transitionMs?: number;
	mini?: boolean;
	columns?: number;
}
