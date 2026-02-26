import { uniqueSorted } from '$lib/sorting-algorithms/misc/utils';

import type { DetailedSortStep } from './stepTypes';

export class DetailedTraceBuilder {
	private readonly array: number[];
	private readonly steps: DetailedSortStep[] = [];

	constructor(initialArray: number[]) {
		this.array = [...initialArray];
	}

	get workingArray(): number[] {
		return this.array;
	}

	record(
		step: Omit<DetailedSortStep, 'array' | 'indicesHighlighted' | 'comparedIndices' | 'movedIndices' | 'sortedIndices'> & {
			indicesHighlighted: number[];
			comparedIndices: number[];
			movedIndices: number[];
			sortedIndices: number[];
		},
	): void {
		this.steps.push({
			array: [...this.array],
			indicesHighlighted: uniqueSorted(step.indicesHighlighted),
			comparedIndices: uniqueSorted(step.comparedIndices),
			movedIndices: uniqueSorted(step.movedIndices),
			sortedIndices: uniqueSorted(step.sortedIndices),
			codePartId: step.codePartId,
			label: step.label,
			variables: step.variables,
		});
	}

	build(): DetailedSortStep[] {
		return this.steps;
	}
}
