export type ArrayType = 'shuffled' | 'almost-sorted' | 'reverse' | 'duplicates';

function swapIndex(index: number, values: number[]) {
	const swapIndex = Math.floor(Math.random() * (index + 1));
	[values[index], values[swapIndex]] = [values[swapIndex], values[index]];
}

function swapNeighbors(values: number[]) {
	const index = Math.floor(Math.random() * values.length);
	if (index === 0) {
		[values[0], values[1]] = [values[1], values[0]];
	} else if (index === values.length - 1) {
		const lastIndex = values.length - 1;
		[values[lastIndex], values[lastIndex - 1]] = [values[lastIndex - 1], values[lastIndex]];
	} else {
		const swapWithIndex = Math.random() < 0.5 ? index - 1 : index + 1;
		[values[index], values[swapWithIndex]] = [values[swapWithIndex], values[index]];
	}
}

function shuffle(values: number[]) {
	for (let index = values.length - 1; index > 0; index -= 1) {
		swapIndex(index, values);
	}
}

export function createShuffledArray(size = 100): number[] {
	const values = Array.from({ length: size }, (_, index) => index + 1);

	shuffle(values);
	return values;
}

export function createAlmostSortedArray(size = 100): number[] {
	const values = Array.from({ length: size }, (_, index) => index + 1);
	const swapCount = Math.max(2, Math.floor(size * 0.1));

	for (let i = 0; i < swapCount; i += 1) {
		swapNeighbors(values);
	}

	return values;
}

export function createReverseSortedArray(size = 100): number[] {
	return Array.from({ length: size }, (_, index) => size - index);
}

export function createDuplicatesArray(size = 100): number[] {
	const distinctCount = size == 100 ? 5 : 4;

	const array = [];
	for (let i = 0; i < size; i += 1) {
		array.push(((i % distinctCount) + 1) * Math.ceil(size / distinctCount));
	}

	shuffle(array);
	return array;
}

export function createArrayByType(type: ArrayType, size: number): number[] {
	switch (type) {
		case 'almost-sorted':
			return createAlmostSortedArray(size);
		case 'reverse':
			return createReverseSortedArray(size);
		case 'duplicates':
			return createDuplicatesArray(size);
		default:
			return createShuffledArray(size);
	}
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
