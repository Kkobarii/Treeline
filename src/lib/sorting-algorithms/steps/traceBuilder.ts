import type { DetailedSortStep } from './stepTypes';

export enum ItemHighlightType {
	Compare = 'compare',
	Move = 'move',
	Sorted = 'sorted',
}

export class Item {
	private readonly rawValue: number;
	highlightType: ItemHighlightType | null = null;
	depth: number = 0;

	constructor(value: number) {
		this.rawValue = value;
	}

	get value(): number {
		return this.rawValue;
	}

	get label(): string {
		return `${this.rawValue}`;
	}
}

export interface TracePaintOptions {
	compared?: number[];
	moved?: number[];
	sorted?: number[];
}

export class DetailedTraceBuilder {
	private readonly array: Item[];
	private readonly steps: DetailedSortStep[] = [];

	constructor(initialArray: number[]) {
		this.array = initialArray.map(value => new Item(value));

		this.record({
			codePartId: 'initial',
			label: 'Initial array',
			variables: {},
		});
	}

	get workingArray(): Item[] {
		return this.array;
	}

	paint({ compared = [], moved = [], sorted = [] }: TracePaintOptions = {}): void {
		for (const item of this.array) {
			item.highlightType = null;
		}

		for (const index of sorted) {
			if (this.array[index]) {
				this.array[index].highlightType = ItemHighlightType.Sorted;
			}
		}
		for (const index of compared) {
			if (this.array[index]) {
				this.array[index].highlightType = ItemHighlightType.Compare;
			}
		}
		for (const index of moved) {
			if (this.array[index]) {
				this.array[index].highlightType = ItemHighlightType.Move;
			}
		}
	}

	setDepth(indices: number[], depth: number = 0): void {
		for (const index of indices) {
			if (this.array[index]) {
				this.array[index].depth = depth;
			}
		}
	}

	moveDepthUp(indices: number[], amount = 1): void {
		for (const index of indices) {
			if (!this.array[index]) {
				continue;
			}

			const currentDepth = this.array[index].depth ?? 0;
			this.array[index].depth = currentDepth + amount;
		}
	}

	moveDepthDown(indices: number[], amount = 1): void {
		for (const index of indices) {
			if (!this.array[index]) {
				continue;
			}

			const currentDepth = this.array[index].depth ?? 0;
			this.array[index].depth = Math.max(0, currentDepth - amount);
		}
	}

	record(step: Omit<DetailedSortStep, 'array'>): void {
		this.steps.push({
			array: this.array.map(item => {
				const snapshotItem = new Item(item.value);
				snapshotItem.highlightType = item.highlightType;
				snapshotItem.depth = item.depth;

				return snapshotItem;
			}),
			codePartId: step.codePartId,
			label: step.label,
			variables: step.variables,
		});
	}

	build(): DetailedSortStep[] {
		this.paint({ sorted: this.array.map((_, index) => index) });
		this.record({
			codePartId: 'final',
			label: 'Final array',
			variables: {},
		});

		return this.steps;
	}
}
