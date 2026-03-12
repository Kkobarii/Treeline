export function createShuffledArray(size = 100): number[] {
	const values = Array.from({ length: size }, (_, index) => index + 1);

	for (let index = values.length - 1; index > 0; index -= 1) {
		const swapIndex = Math.floor(Math.random() * (index + 1));
		[values[index], values[swapIndex]] = [values[swapIndex], values[index]];
	}

	return values;
}

export function range(start: number, endInclusive: number): number[] {
	if (endInclusive < start) {
		return [];
	}

	return Array.from({ length: endInclusive - start + 1 }, (_, offset) => start + offset);
}

export function uniqueSorted(values: Iterable<number>): number[] {
	return [...new Set(values)].sort((left, right) => left - right);
}

export function swap<T>(array: T[], leftIndex: number, rightIndex: number): void {
	if (leftIndex === rightIndex) {
		return;
	}

	[array[leftIndex], array[rightIndex]] = [array[rightIndex], array[leftIndex]];
}

export function shift<T>(array: T[], fromIndex: number, toIndex: number): void {
	if (fromIndex === toIndex) {
		return;
	}

	if (fromIndex < toIndex) {
		// Moving right: repeatedly swap right
		for (let i = fromIndex; i < toIndex; i += 1) {
			swap(array, i, i + 1);
		}
	} else {
		// Moving left: repeatedly swap left
		for (let i = fromIndex; i > toIndex; i -= 1) {
			swap(array, i, i - 1);
		}
	}
}
