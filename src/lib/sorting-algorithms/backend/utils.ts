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
