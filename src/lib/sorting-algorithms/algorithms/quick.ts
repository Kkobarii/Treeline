import { range, swap, uniqueSorted } from '$lib/sorting-algorithms/misc/utils';
import { StepLabel } from '$lib/steps/stepLabel';

import { LineBreak, type DetailedCodeTemplate, type DetailedSortStep, type SortStep } from '../steps/stepTypes';
import { DetailedTraceBuilder } from '../steps/traceBuilder';

export enum QuickSortPartId {
	// quick sort function
	QuickSort = 'quick-sort',
	Partition = 'partition',
	CallLeft = 'call-left',
	CallRight = 'call-right',
	QuickSortDone = 'quick-sort-done',

	// partition function
	Compare = 'compare',
	Swap = 'swap',
	PivotPlace = 'pivot-place',
	PartitionDone = 'partition-done',
}

export const quickSortTemplate: DetailedCodeTemplate = {
	algorithmId: 'quick',
	python: [
		{ indent: 0, text: 'def quick_sort(arr, low, high):', codePartId: QuickSortPartId.QuickSort },
		{ indent: 1, text: 'if low < high:', codePartId: QuickSortPartId.Partition },
		{ indent: 2, text: 'pivot_index = partition(arr, low, high)', codePartId: QuickSortPartId.Partition },
		{ indent: 2, text: 'quick_sort(arr, low, pivot_index - 1)', codePartId: QuickSortPartId.CallLeft },
		{ indent: 2, text: 'quick_sort(arr, pivot_index + 1, high)', codePartId: QuickSortPartId.CallRight },
		LineBreak,
		{ indent: 1, text: '# quick sort done', codePartId: QuickSortPartId.QuickSortDone },
		LineBreak,
		{ indent: 0, text: 'def partition(arr, low, high):', codePartId: QuickSortPartId.Partition },
		{ indent: 1, text: 'pivot = arr[high]', codePartId: QuickSortPartId.Partition },
		{ indent: 1, text: 'i = low - 1', codePartId: QuickSortPartId.Partition },
		LineBreak,
		{ indent: 1, text: 'for j in range(low, high):', codePartId: QuickSortPartId.Compare },
		{ indent: 2, text: 'if arr[j] <= pivot:', codePartId: QuickSortPartId.Compare },
		{ indent: 3, text: 'i += 1', codePartId: QuickSortPartId.Swap },
		{ indent: 3, text: 'arr[i], arr[j] = arr[j], arr[i]', codePartId: QuickSortPartId.Swap },
		LineBreak,
		{ indent: 1, text: 'arr[i + 1], arr[high] = arr[high], arr[i + 1]', codePartId: QuickSortPartId.PivotPlace },
		LineBreak,
		{ indent: 1, text: 'return i + 1', codePartId: QuickSortPartId.PartitionDone },
	],
	javascript: [
		{ indent: 0, text: 'function quickSort(arr, low, high) {', codePartId: QuickSortPartId.QuickSort },
		{ indent: 1, text: 'if (low < high) {', codePartId: QuickSortPartId.Partition },
		{ indent: 2, text: 'const pivotIndex = partition(arr, low, high);', codePartId: QuickSortPartId.Partition },
		{ indent: 2, text: 'quickSort(arr, low, pivotIndex - 1);', codePartId: QuickSortPartId.CallLeft },
		{ indent: 2, text: 'quickSort(arr, pivotIndex + 1, high);', codePartId: QuickSortPartId.CallRight },
		{ indent: 1, text: '}', codePartId: QuickSortPartId.Partition },
		LineBreak,
		{ indent: 1, text: '// quick sort done', codePartId: QuickSortPartId.QuickSortDone },
		{ indent: 0, text: '}', codePartId: QuickSortPartId.QuickSort },
		LineBreak,
		{ indent: 0, text: 'function partition(arr, low, high) {', codePartId: QuickSortPartId.Partition },
		{ indent: 1, text: 'const pivot = arr[high];', codePartId: QuickSortPartId.Partition },
		{ indent: 1, text: 'let i = low - 1;', codePartId: QuickSortPartId.Partition },
		LineBreak,
		{ indent: 1, text: 'for (let j = low; j < high; j += 1) {', codePartId: QuickSortPartId.Compare },
		{ indent: 2, text: 'if (arr[j] <= pivot) {', codePartId: QuickSortPartId.Compare },
		{ indent: 3, text: 'i += 1;', codePartId: QuickSortPartId.Swap },
		{ indent: 3, text: '[arr[i], arr[j]] = [arr[j], arr[i]];', codePartId: QuickSortPartId.Swap },
		{ indent: 2, text: '}', codePartId: QuickSortPartId.Compare },
		{ indent: 1, text: '}', codePartId: QuickSortPartId.Compare },
		LineBreak,
		{ indent: 1, text: '[arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];', codePartId: QuickSortPartId.PivotPlace },
		LineBreak,
		{ indent: 1, text: 'return i + 1;', codePartId: QuickSortPartId.PartitionDone },
		{ indent: 0, text: '}', codePartId: QuickSortPartId.Partition },
	],
	c: [
		{ indent: 0, text: 'void quickSort(int arr[], int low, int high) {', codePartId: QuickSortPartId.QuickSort },
		{ indent: 1, text: 'if (low < high) {', codePartId: QuickSortPartId.Partition },
		{ indent: 2, text: 'int pivotIndex = partition(arr, low, high);', codePartId: QuickSortPartId.Partition },
		{ indent: 2, text: 'quickSort(arr, low, pivotIndex - 1);', codePartId: QuickSortPartId.CallLeft },
		{ indent: 2, text: 'quickSort(arr, pivotIndex + 1, high);', codePartId: QuickSortPartId.CallRight },
		{ indent: 1, text: '}', codePartId: QuickSortPartId.Partition },
		LineBreak,
		{ indent: 1, text: '// quick sort done', codePartId: QuickSortPartId.QuickSortDone },
		{ indent: 0, text: '}', codePartId: QuickSortPartId.QuickSort },
		LineBreak,
		{ indent: 0, text: 'int partition(int arr[], int low, int high) {', codePartId: QuickSortPartId.Partition },
		{ indent: 1, text: 'int pivot = arr[high];', codePartId: QuickSortPartId.Partition },
		{ indent: 1, text: 'int i = low - 1;', codePartId: QuickSortPartId.Partition },
		LineBreak,
		{ indent: 1, text: 'for (int j = low; j < high; j++) {', codePartId: QuickSortPartId.Compare },
		{ indent: 2, text: 'if (arr[j] <= pivot) {', codePartId: QuickSortPartId.Compare },
		{ indent: 3, text: 'i += 1;', codePartId: QuickSortPartId.Swap },
		{ indent: 3, text: 'int temp = arr[i];', codePartId: QuickSortPartId.Swap },
		{ indent: 3, text: 'arr[i] = arr[j];', codePartId: QuickSortPartId.Swap },
		{ indent: 3, text: 'arr[j] = temp;', codePartId: QuickSortPartId.Swap },
		{ indent: 2, text: '}', codePartId: QuickSortPartId.Compare },
		{ indent: 1, text: '}', codePartId: QuickSortPartId.Compare },
		LineBreak,
		{ indent: 1, text: 'int temp = arr[i + 1];', codePartId: QuickSortPartId.PivotPlace },
		{ indent: 1, text: 'arr[i + 1] = arr[high];', codePartId: QuickSortPartId.PivotPlace },
		{ indent: 1, text: 'arr[high] = temp;', codePartId: QuickSortPartId.PivotPlace },
		LineBreak,
		{ indent: 1, text: 'return i + 1;', codePartId: QuickSortPartId.PartitionDone },
		{ indent: 0, text: '}', codePartId: QuickSortPartId.Partition },
	],
};

export function quickSortSteps(input: number[]): SortStep[] {
	const trace = new DetailedTraceBuilder(input, { useRows: true });
	const array = trace.workingArray;
	const n = array.length;
	const sortedSet = new Set<number>();
	const sortedIndices = () => uniqueSorted(sortedSet);

	const partition = (low: number, high: number, level: number): number => {
		const pivot = array[high].value;
		let i = low - 1;

		for (let j = low; j < high; j += 1) {
			trace.paint({ compared: [j, high], sorted: sortedIndices() });
			trace.record({
				codePartId: 'compare',
				stepLabel: new StepLabel('sorting.steps.quick.basic.compareWithPivot', { j }),
				variables: { j, pivot, low, high },
			});

			if (array[j].value <= pivot) {
				i += 1;
				swap(array, i, j);
				trace.paint({ moved: [i, j], compared: [high], sorted: sortedIndices() });
				trace.record({
					codePartId: 'swap',
					stepLabel: new StepLabel('sorting.steps.quick.basic.moveIntoLeftPartition', { j }),
					variables: { i, j, pivot },
				});
			}
		}

		swap(array, i + 1, high);
		trace.paint({ moved: [i + 1, high], sorted: sortedIndices() });
		trace.record({
			codePartId: 'swap-pivot',
			stepLabel: new StepLabel('sorting.steps.quick.basic.placePivot', { pivotIndex: i + 1 }),
			variables: { pivotIndex: i + 1 },
		});

		return i + 1;
	};

	const quickSort = (low: number, high: number, level: number) => {
		if (low >= high) {
			if (low === high) {
				sortedSet.add(low);
			}
			return;
		}

		const pivotIndex = partition(low, high, level);
		sortedSet.add(pivotIndex);

		quickSort(low, pivotIndex - 1, level + 1);
		quickSort(pivotIndex + 1, high, level + 1);
	};

	quickSort(0, n - 1, 0);

	return trace.build();
}

export function quickSortDetailedSteps(input: number[]): DetailedSortStep[] {
	const trace = new DetailedTraceBuilder(input, { useRows: true });
	const array = trace.workingArray;
	const n = array.length;
	const sortedSet = new Set<number>();
	const sortedIndices = () => uniqueSorted(sortedSet);

	const partition = (low: number, high: number, level: number): number => {
		const pivot = array[high].value;
		let i = low - 1;
		const targetAreaRow = level - 1;

		trace.paint({ compared: [high], sorted: sortedIndices() });
		trace.record({
			codePartId: QuickSortPartId.Partition,
			stepLabel: new StepLabel('sorting.steps.quick.detailed.partitionStart', { low, high }),
			variables: {
				low,
				high,
				pivot,
				i,
				targetAreaLeft: low,
				targetAreaRight: high,
				targetAreaRow,
			},
		});

		for (let j = low; j < high; j += 1) {
			// three ranges: left partition (low to i), right partition (i + 1 to j - 1), unexplored (j to high - 1)
			const leftPartition = range(low, i);
			const rightPartition = range(i + 1, j - 1);
			const unexplored = range(j, high - 1);

			trace.paint({
				light: leftPartition,
				dark: rightPartition,
				compared: [j, high],
				sorted: sortedIndices(),
			});
			trace.record({
				codePartId: QuickSortPartId.Compare,
				stepLabel: new StepLabel('sorting.steps.quick.detailed.compareWithPivotAtHigh', { j, high }),
				variables: {
					low,
					high,
					i,
					j,
					pivot,
					targetAreaLeft: low,
					targetAreaRight: high,
					targetAreaRow,
				},
			});

			if (array[j].value <= pivot) {
				i += 1;
				swap(array, i, j);
				trace.paint({
					compared: [high],
					moved: [i, j],
					light: leftPartition.concat(i),
					dark: rightPartition.filter(index => index !== i),
					sorted: sortedIndices(),
				});
				trace.record({
					codePartId: QuickSortPartId.Swap,
					stepLabel: new StepLabel('sorting.steps.quick.detailed.moveIntoLeftPartitionAtIndex', { j, i }),
					variables: {
						low,
						high,
						i,
						j,
						pivot,
						targetAreaLeft: low,
						targetAreaRight: high,
						targetAreaRow,
					},
				});
			}
		}
		trace.paint({
			compared: [high],
			light: range(low, i),
			dark: range(i + 1, high - 1),
			sorted: sortedIndices(),
		});
		trace.record({
			codePartId: QuickSortPartId.Compare,
			stepLabel: new StepLabel('sorting.steps.quick.detailed.allComparedPlacePivot', { pivotIndex: i + 1 }),
			variables: {
				low,
				high,
				i,
				pivot,
				targetAreaLeft: low,
				targetAreaRight: high,
				targetAreaRow,
			},
		});

		swap(array, i + 1, high);
		trace.paint({
			moved: [i + 1, high],
			light: i >= low ? range(low, i) : [],
			dark: i + 2 <= high ? range(i + 2, high) : [],
			sorted: sortedIndices(),
		});
		trace.record({
			codePartId: QuickSortPartId.PivotPlace,
			stepLabel: new StepLabel('sorting.steps.quick.detailed.placePivot', { pivotIndex: i + 1 }),
			variables: {
				low,
				high,
				pivotIndex: i + 1,
				pivot,
				targetAreaLeft: low,
				targetAreaRight: high,
				targetAreaRow,
			},
		});

		sortedSet.add(i + 1);
		trace.paint({
			sorted: sortedIndices(),
			light: range(low, i),
			dark: range(i + 2, high),
		});
		trace.record({
			codePartId: QuickSortPartId.PartitionDone,
			stepLabel: new StepLabel('sorting.steps.quick.detailed.partitionDone', { low, high, pivotIndex: i + 1 }),
			variables: {
				low,
				high,
				pivotIndex: i + 1,
				pivot,
				targetAreaLeft: low,
				targetAreaRight: high,
				targetAreaRow,
			},
		});

		return i + 1;
	};

	const quickSort = (low: number, high: number, level: number) => {
		if (low > high) {
			return;
		}

		const currentRow = level - 1;
		trace.setRow(range(low, high), currentRow);
		trace.paint({ sorted: sortedIndices() });
		trace.record({
			codePartId: QuickSortPartId.QuickSort,
			stepLabel: new StepLabel('sorting.steps.quick.detailed.quickSortSegment', { low, high }),
			variables: {
				low,
				high,
				row: currentRow,
				targetAreaLeft: low,
				targetAreaRight: high,
				targetAreaRow: currentRow,
			},
		});

		if (low === high) {
			sortedSet.add(low);
			trace.paint({ sorted: sortedIndices() });
			trace.record({
				codePartId: QuickSortPartId.QuickSortDone,
				stepLabel: new StepLabel('sorting.steps.quick.detailed.singleElementSorted', { low }),
				variables: {
					low,
					high,
					row: currentRow,
					targetAreaLeft: low,
					targetAreaRight: high,
					targetAreaRow: currentRow,
				},
			});
			return;
		}

		const pivotIndex = partition(low, high, level);

		if (low <= pivotIndex - 1) {
			trace.setRow(range(low, pivotIndex - 1), level);
			trace.paint({
				light: range(low, pivotIndex - 1),
				sorted: sortedIndices(),
			});
			trace.record({
				codePartId: QuickSortPartId.CallLeft,
				stepLabel: new StepLabel('sorting.steps.quick.detailed.recurseLeft', { low, high: pivotIndex - 1 }),
				variables: {
					low,
					high,
					pivotIndex,
					row: level,
					targetAreaLeft: low,
					targetAreaRight: high,
					targetAreaRow: currentRow,
				},
			});
		}
		quickSort(low, pivotIndex - 1, level + 1);
		trace.setRow(range(low, pivotIndex - 1), level - 1);

		if (pivotIndex + 1 <= high) {
			trace.setRow(range(pivotIndex + 1, high), level);
			trace.paint({
				dark: range(pivotIndex + 1, high),
				sorted: sortedIndices(),
			});
			trace.record({
				codePartId: QuickSortPartId.CallRight,
				stepLabel: new StepLabel('sorting.steps.quick.detailed.recurseRight', { low: pivotIndex + 1, high }),
				variables: {
					low,
					high,
					pivotIndex,
					row: level,
					targetAreaLeft: low,
					targetAreaRight: high,
					targetAreaRow: currentRow,
				},
			});
		}
		quickSort(pivotIndex + 1, high, level + 1);
		trace.setRow(range(pivotIndex + 1, high), level - 1);

		trace.paint({ sorted: sortedIndices(), light: range(low, high) });
		trace.record({
			codePartId: QuickSortPartId.QuickSortDone,
			stepLabel: new StepLabel('sorting.steps.quick.detailed.finishedQuickSortSegment', { low, high }),
			variables: {
				low,
				high,
				pivotIndex,
				row: currentRow,
				targetAreaLeft: low,
				targetAreaRight: high,
				targetAreaRow: currentRow,
			},
		});
	};

	quickSort(0, n - 1, 1);

	return trace.build();
}
