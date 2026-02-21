import { SortTraceBuilder } from '$lib/sorting-algorithms/backend/traceBuilder';
import type { SortStep } from '$lib/sorting-algorithms/backend/types';
import { range, uniqueSorted } from '$lib/sorting-algorithms/backend/utils';

export function quickSortSteps(input: number[]): SortStep[] {
	const trace = new SortTraceBuilder(input);
	const array = trace.workingArray;
	const n = array.length;
	const sorted = new Set<number>();

	const sortedIndices = () => uniqueSorted(sorted);

	const partition = (low: number, high: number): number => {
		const pivot = array[high];
		let i = low - 1;
		trace.record([high], [], sortedIndices(), `Pivot chosen at position ${high}`);

		for (let j = low; j < high; j += 1) {
			trace.record([j, high], [], sortedIndices(), `Comparing position ${j} with pivot`);
			if (array[j] <= pivot) {
				i += 1;
				[array[i], array[j]] = [array[j], array[i]];
				trace.record([i, j], [i, j], sortedIndices(), `Moved value <= pivot to index ${i}`);
			}
		}

		[array[i + 1], array[high]] = [array[high], array[i + 1]];
		trace.record([i + 1, high], [i + 1, high], sortedIndices(), `Placed pivot at position ${i + 1}`);
		return i + 1;
	};

	const quickSort = (low: number, high: number) => {
		if (low > high) {
			return;
		}

		if (low === high) {
			sorted.add(low);
			trace.record([low], [], sortedIndices(), `Single element at ${low} is in final position`);
			return;
		}

		const pivotIndex = partition(low, high);
		sorted.add(pivotIndex);
		trace.record([pivotIndex], [], sortedIndices(), `Pivot at ${pivotIndex} is fixed`);
		quickSort(low, pivotIndex - 1);
		quickSort(pivotIndex + 1, high);
	};

	quickSort(0, n - 1);
	trace.record([], [], range(0, n - 1), 'Quick sort completed');
	return trace.build();
}
