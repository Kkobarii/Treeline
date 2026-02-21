import type { SortStep } from '$lib/sorting-algorithms/backend/types';
import { uniqueSorted } from '$lib/sorting-algorithms/backend/utils';

export class SortTraceBuilder {
	private readonly array: number[];
	private readonly steps: SortStep[] = [];

	constructor(initialArray: number[]) {
		this.array = [...initialArray];
		this.record([], [], [], 'Initial state');
	}

	get workingArray(): number[] {
		return this.array;
	}

	record(activeIndices: number[], movedIndices: number[], sortedIndices: number[], label: string): void {
		this.steps.push({
			array: [...this.array],
			activeIndices: uniqueSorted(activeIndices),
			movedIndices: uniqueSorted(movedIndices),
			sortedIndices: uniqueSorted(sortedIndices),
			label,
		});
	}

	build(): SortStep[] {
		return this.steps;
	}
}
