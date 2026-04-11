import { StepLabel } from '$lib/utils/stepLabel';

import type { DetailedSortStep } from './stepTypes';

export enum ItemHighlightType {
	Compare = 'compare',
	Move = 'move',
	Sorted = 'sorted',
	Light = 'light',
	Dark = 'dark',
}

export class Item {
	private readonly rawValue: number;
	readonly id: string;
	highlightType: ItemHighlightType | null = null;

	constructor(value: number, id: string) {
		this.rawValue = value;
		this.id = id;
	}

	get value(): number {
		return this.rawValue;
	}

	get label(): string {
		return `${this.rawValue}`;
	}
}

export function generateItemIds(values: number[]): string[] {
	const indexed = values.map((value, index) => ({ value, index }));
	indexed.sort((a, b) => a.value - b.value || a.index - b.index);

	const ids = new Array<string>(values.length);
	for (let sortedPosition = 0; sortedPosition < indexed.length; sortedPosition++) {
		ids[indexed[sortedPosition].index] = `${sortedPosition}`;
	}

	return ids;
}

export interface TracePaintOptions {
	compared?: number[];
	moved?: number[];
	sorted?: number[];
	light?: number[];
	dark?: number[];
}

interface DetailedTraceBuilderOptions {
	useRows?: boolean;
}

export class DetailedTraceBuilder {
	private readonly array: Item[];
	private readonly steps: DetailedSortStep[] = [];
	private readonly rowById = new Map<string, number>();
	private readonly columnById = new Map<string, number>();
	private readonly useRows: boolean;

	constructor(initialArray: number[], options: DetailedTraceBuilderOptions = {}) {
		this.useRows = options.useRows ?? false;
		const ids = generateItemIds(initialArray);
		this.array = initialArray.map((value, index) => {
			const item = new Item(value, ids[index]);
			this.rowById.set(item.id, 0);

			return item;
		});

		this.record({
			codePartId: 'initial',
			stepLabel: new StepLabel('sorting.steps.common.initialArray'),
			variables: {},
		});
	}

	get workingArray(): Item[] {
		return this.array;
	}

	paint({ compared = [], moved = [], sorted = [], light = [], dark = [] }: TracePaintOptions = {}): void {
		for (const item of this.array) {
			item.highlightType = null;
		}

		for (const index of light) {
			if (this.array[index]) {
				this.array[index].highlightType = ItemHighlightType.Light;
			}
		}
		for (const index of dark) {
			if (this.array[index]) {
				this.array[index].highlightType = ItemHighlightType.Dark;
			}
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

	setRow(indices: number[], row: number = 0): void {
		for (const index of indices) {
			const item = this.array[index];
			if (item) {
				this.rowById.set(item.id, Math.max(0, row));
			}
		}
	}

	moveRowUp(indices: number[], amount = 1): void {
		for (const index of indices) {
			const item = this.array[index];
			if (!item) {
				continue;
			}

			const currentRow = this.rowById.get(item.id) ?? 0;
			this.rowById.set(item.id, currentRow + amount);
		}
	}

	moveRowDown(indices: number[], amount = 1): void {
		for (const index of indices) {
			const item = this.array[index];
			if (!item) {
				continue;
			}

			const currentRow = this.rowById.get(item.id) ?? 0;
			this.rowById.set(item.id, Math.max(0, currentRow - amount));
		}
	}

	setColumn(indices: number[], column: number = 0): void {
		for (const index of indices) {
			const item = this.array[index];
			if (item) {
				this.columnById.set(item.id, Math.max(0, column));
			}
		}
	}

	getColumn(index: number): number | undefined {
		const item = this.array[index];
		if (item) {
			return this.columnById.get(item.id);
		}
		return undefined;
	}

	clearColumn(indices: number[]): void {
		for (const index of indices) {
			const item = this.array[index];
			if (item) {
				this.columnById.delete(item.id);
			}
		}
	}

	setCoords(index: number, row: number, column: number): void {
		const item = this.array[index];
		if (item) {
			this.rowById.set(item.id, Math.max(0, row));
			this.columnById.set(item.id, Math.max(0, column));
		}
	}

	private buildRowsSnapshot(snapshotArray: Item[]): Array<Array<Item | null>> {
		if (!snapshotArray.length) {
			return [];
		}

		const positionedItems = snapshotArray.map((item, defaultCol) => ({
			item,
			row: this.rowById.get(item.id) ?? 0,
			col: this.columnById.get(item.id) ?? defaultCol,
		}));
		const maxRow = Math.max(...positionedItems.map(({ row }) => row));
		const rowCount = maxRow + 1;
		const matrix: Array<Array<Item | null>> = Array.from({ length: rowCount }, () => []);

		const ensureColumn = (column: number) => {
			for (const row of matrix) {
				while (row.length <= column) {
					row.push(null);
				}
			}
		};

		positionedItems.forEach(({ item, row, col }) => {
			let targetCol = col;
			ensureColumn(targetCol);
			while (matrix[row][targetCol] !== null) {
				targetCol += 1;
				ensureColumn(targetCol);
			}
			matrix[row][targetCol] = item;
		});

		const maxColumnCount = Math.max(snapshotArray.length, ...matrix.map(row => row.length));
		for (const row of matrix) {
			while (row.length < maxColumnCount) {
				row.push(null);
			}
		}

		return matrix;
	}

	record(step: Omit<DetailedSortStep, 'array'>): void {
		const snapshotArray = this.array.map(item => {
			const snapshotItem = new Item(item.value, item.id);
			snapshotItem.highlightType = item.highlightType;

			return snapshotItem;
		});

		this.steps.push({
			array: snapshotArray,
			rows: this.useRows ? this.buildRowsSnapshot(snapshotArray) : undefined,
			codePartId: step.codePartId,
			stepLabel: step.stepLabel,
			variables: step.variables,
		});
	}

	build(): DetailedSortStep[] {
		this.paint({ sorted: this.array.map((_, index) => index) });
		this.record({
			codePartId: 'final',
			stepLabel: new StepLabel('sorting.steps.common.finalArray'),
			variables: {},
		});

		return this.steps;
	}
}
