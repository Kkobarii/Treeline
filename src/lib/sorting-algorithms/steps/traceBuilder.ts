import type { DetailedSortStep } from './stepTypes';

export enum ItemHighlightType {
	Compare = 'compare',
	Move = 'move',
	Sorted = 'sorted',
	Left = 'left',
	Right = 'right',
}

export class Item {
	private readonly rawValue: number;
	highlightType: ItemHighlightType | null = null;

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
	left?: number[];
	right?: number[];
}

interface DetailedTraceBuilderOptions {
	useRows?: boolean;
}

export class DetailedTraceBuilder {
	private readonly array: Item[];
	private readonly steps: DetailedSortStep[] = [];
	private readonly rowByValue = new Map<number, number>();
	private readonly columnByValue = new Map<number, number>();
	private readonly useRows: boolean;

	constructor(initialArray: number[], options: DetailedTraceBuilderOptions = {}) {
		this.useRows = options.useRows ?? false;
		this.array = initialArray.map(value => {
			const item = new Item(value);
			this.rowByValue.set(item.value, 0);

			return item;
		});

		this.record({
			codePartId: 'initial',
			label: 'Initial array',
			variables: {},
		});
	}

	get workingArray(): Item[] {
		return this.array;
	}

	paint({ compared = [], moved = [], sorted = [], left = [], right = [] }: TracePaintOptions = {}): void {
		for (const item of this.array) {
			item.highlightType = null;
		}

		for (const index of left) {
			if (this.array[index]) {
				this.array[index].highlightType = ItemHighlightType.Left;
			}
		}
		for (const index of right) {
			if (this.array[index]) {
				this.array[index].highlightType = ItemHighlightType.Right;
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
				this.rowByValue.set(item.value, Math.max(0, row));
			}
		}
	}

	moveRowUp(indices: number[], amount = 1): void {
		for (const index of indices) {
			const item = this.array[index];
			if (!item) {
				continue;
			}

			const currentRow = this.rowByValue.get(item.value) ?? 0;
			this.rowByValue.set(item.value, currentRow + amount);
		}
	}

	moveRowDown(indices: number[], amount = 1): void {
		for (const index of indices) {
			const item = this.array[index];
			if (!item) {
				continue;
			}

			const currentRow = this.rowByValue.get(item.value) ?? 0;
			this.rowByValue.set(item.value, Math.max(0, currentRow - amount));
		}
	}

	setColumn(indices: number[], column: number = 0): void {
		for (const index of indices) {
			const item = this.array[index];
			if (item) {
				this.columnByValue.set(item.value, Math.max(0, column));
			}
		}
	}

	getColumn(index: number): number | undefined {
		const item = this.array[index];
		if (item) {
			return this.columnByValue.get(item.value);
		}
		return undefined;
	}

	clearColumn(indices: number[]): void {
		for (const index of indices) {
			const item = this.array[index];
			if (item) {
				this.columnByValue.delete(item.value);
			}
		}
	}

	setCoords(index: number, row: number, column: number): void {
		const item = this.array[index];
		if (item) {
			this.rowByValue.set(item.value, Math.max(0, row));
			this.columnByValue.set(item.value, Math.max(0, column));
		}
	}

	private buildRowsSnapshot(snapshotArray: Item[]): Array<Array<Item | null>> {
		if (!snapshotArray.length) {
			return [];
		}

		const positionedItems = snapshotArray.map((item, defaultCol) => ({
			item,
			row: this.rowByValue.get(item.value) ?? 0,
			col: this.columnByValue.get(item.value) ?? defaultCol,
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
			const snapshotItem = new Item(item.value);
			snapshotItem.highlightType = item.highlightType;

			return snapshotItem;
		});

		this.steps.push({
			array: snapshotArray,
			rows: this.useRows ? this.buildRowsSnapshot(snapshotArray) : undefined,
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
