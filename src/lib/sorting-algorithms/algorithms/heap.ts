import { range, swap } from '$lib/sorting-algorithms/misc/utils';
import { StepLabel } from '$lib/utils/stepLabel';

import { LineBreak, type DetailedCodeTemplate, type DetailedSortStepResult, type SortStepResult } from '../steps/stepTypes';
import { DetailedTraceBuilder } from '../steps/traceBuilder';

export enum HeapSortPartId {
	// heapify function
	Heapify = 'heapify',
	CompareLeft = 'compare_left',
	LeftLarger = 'compare_left_larger',
	CompareRight = 'compare_right',
	RightLarger = 'compare_right_larger',
	SwapChild = 'swap_child',
	CallHeapifyRecursive = 'call_heapify',
	EndHeapify = 'end_heapify',

	// heap sort function
	HeapSort = 'heap_sort',
	BuildHeap = 'build_heap',
	ExtractRoot = 'extract_root',
	CallHeapifySort = 'call_heapify_sort',
	EndHeapSort = 'end_heap_sort',
}

export const heapSortTemplate: DetailedCodeTemplate = {
	algorithmId: 'heap',
	codes: {
		python: [
			{ indent: 0, text: 'def heap_sort(arr):', codePartId: HeapSortPartId.HeapSort },
			{ indent: 1, text: 'n = len(arr)', codePartId: HeapSortPartId.HeapSort },
			LineBreak,
			{ indent: 1, text: 'for i in range(n // 2 - 1, -1, -1):', codePartId: HeapSortPartId.BuildHeap },
			{ indent: 2, text: 'heapify(arr, n, i)', codePartId: HeapSortPartId.BuildHeap },
			LineBreak,
			{ indent: 1, text: 'for end in range(n - 1, 0, -1):', codePartId: HeapSortPartId.ExtractRoot },
			{ indent: 2, text: 'arr[0], arr[end] = arr[end], arr[0]', codePartId: HeapSortPartId.ExtractRoot },
			{ indent: 2, text: 'heapify(arr, end, 0)', codePartId: HeapSortPartId.CallHeapifySort },
			LineBreak,
			{ indent: 1, text: '# heap sort done', codePartId: HeapSortPartId.EndHeapSort },
			LineBreak,
			{ indent: 0, text: 'def heapify(arr, heap_size, root):', codePartId: HeapSortPartId.Heapify },
			{ indent: 1, text: 'largest = root', codePartId: HeapSortPartId.Heapify },
			{ indent: 1, text: 'left = 2 * root + 1', codePartId: HeapSortPartId.Heapify },
			{ indent: 1, text: 'right = 2 * root + 2', codePartId: HeapSortPartId.Heapify },
			LineBreak,
			{ indent: 1, text: 'if left < heap_size and arr[left] > arr[largest]:', codePartId: HeapSortPartId.CompareLeft },
			{ indent: 2, text: 'largest = left', codePartId: HeapSortPartId.LeftLarger },
			{ indent: 1, text: 'if right < heap_size and arr[right] > arr[largest]:', codePartId: HeapSortPartId.CompareRight },
			{ indent: 2, text: 'largest = right', codePartId: HeapSortPartId.RightLarger },
			LineBreak,
			{ indent: 1, text: 'if largest != root:', codePartId: HeapSortPartId.SwapChild },
			{ indent: 2, text: 'arr[root], arr[largest] = arr[largest], arr[root]', codePartId: HeapSortPartId.SwapChild },
			{ indent: 2, text: 'heapify(arr, heap_size, largest)', codePartId: HeapSortPartId.CallHeapifyRecursive },
			LineBreak,
			{ indent: 1, text: '# heapify done', codePartId: HeapSortPartId.EndHeapify },
		],
		javascript: [
			{ indent: 0, text: 'function heapSort(arr) {', codePartId: HeapSortPartId.HeapSort },
			{ indent: 1, text: 'const n = arr.length;', codePartId: HeapSortPartId.HeapSort },
			LineBreak,
			{ indent: 1, text: 'for (let i = Math.floor(n / 2) - 1; i >= 0; i -= 1) {', codePartId: HeapSortPartId.BuildHeap },
			{ indent: 2, text: 'heapify(arr, n, i);', codePartId: HeapSortPartId.BuildHeap },
			{ indent: 1, text: '}', codePartId: HeapSortPartId.BuildHeap },
			LineBreak,
			{ indent: 1, text: 'for (let end = n - 1; end > 0; end -= 1) {', codePartId: HeapSortPartId.ExtractRoot },
			{ indent: 2, text: '[arr[0], arr[end]] = [arr[end], arr[0]];', codePartId: HeapSortPartId.ExtractRoot },
			{ indent: 2, text: 'heapify(arr, end, 0);', codePartId: HeapSortPartId.CallHeapifySort },
			{ indent: 1, text: '}', codePartId: HeapSortPartId.ExtractRoot },
			LineBreak,
			{ indent: 1, text: '// heap sort done', codePartId: HeapSortPartId.EndHeapSort },
			{ indent: 0, text: '}', codePartId: HeapSortPartId.HeapSort },
			LineBreak,
			{ indent: 0, text: 'function heapify(arr, heapSize, root) {', codePartId: HeapSortPartId.Heapify },
			{ indent: 1, text: 'let largest = root;', codePartId: HeapSortPartId.Heapify },
			{ indent: 1, text: 'const left = 2 * root + 1;', codePartId: HeapSortPartId.Heapify },
			{ indent: 1, text: 'const right = 2 * root + 2;', codePartId: HeapSortPartId.Heapify },
			LineBreak,
			{ indent: 1, text: 'if (left < heapSize && arr[left] > arr[largest]) {', codePartId: HeapSortPartId.CompareLeft },
			{ indent: 2, text: 'largest = left;', codePartId: HeapSortPartId.LeftLarger },
			{ indent: 1, text: '}', codePartId: HeapSortPartId.CompareLeft },
			{ indent: 1, text: 'if (right < heapSize && arr[right] > arr[largest]) {', codePartId: HeapSortPartId.CompareRight },
			{ indent: 2, text: 'largest = right;', codePartId: HeapSortPartId.RightLarger },
			{ indent: 1, text: '}', codePartId: HeapSortPartId.CompareRight },
			LineBreak,
			{ indent: 1, text: 'if (largest !== root) {', codePartId: HeapSortPartId.SwapChild },
			{ indent: 2, text: '[arr[root], arr[largest]] = [arr[largest], arr[root]];', codePartId: HeapSortPartId.SwapChild },
			{ indent: 2, text: 'heapify(arr, heapSize, largest);', codePartId: HeapSortPartId.CallHeapifyRecursive },
			{ indent: 1, text: '}', codePartId: HeapSortPartId.SwapChild },
			LineBreak,
			{ indent: 1, text: '// heapify done', codePartId: HeapSortPartId.EndHeapify },
			{ indent: 0, text: '}', codePartId: HeapSortPartId.Heapify },
		],
		c: [
			{ indent: 0, text: 'void heapSort(int arr[], int n) {', codePartId: HeapSortPartId.HeapSort },
			{ indent: 1, text: 'for (int i = n / 2 - 1; i >= 0; i--) {', codePartId: HeapSortPartId.BuildHeap },
			{ indent: 2, text: 'heapify(arr, n, i);', codePartId: HeapSortPartId.BuildHeap },
			{ indent: 1, text: '}', codePartId: HeapSortPartId.BuildHeap },
			LineBreak,
			{ indent: 1, text: 'for (int end = n - 1; end > 0; end--) {', codePartId: HeapSortPartId.ExtractRoot },
			{ indent: 2, text: 'int temp = arr[0];', codePartId: HeapSortPartId.ExtractRoot },
			{ indent: 2, text: 'arr[0] = arr[end];', codePartId: HeapSortPartId.ExtractRoot },
			{ indent: 2, text: 'arr[end] = temp;', codePartId: HeapSortPartId.ExtractRoot },
			{ indent: 2, text: 'heapify(arr, end, 0);', codePartId: HeapSortPartId.CallHeapifySort },
			{ indent: 1, text: '}', codePartId: HeapSortPartId.ExtractRoot },
			LineBreak,
			{ indent: 1, text: '// heap sort done', codePartId: HeapSortPartId.EndHeapSort },
			{ indent: 0, text: '}', codePartId: HeapSortPartId.HeapSort },
			LineBreak,
			{ indent: 0, text: 'void heapify(int arr[], int heapSize, int root) {', codePartId: HeapSortPartId.Heapify },
			{ indent: 1, text: 'int largest = root;', codePartId: HeapSortPartId.Heapify },
			{ indent: 1, text: 'int left = 2 * root + 1;', codePartId: HeapSortPartId.Heapify },
			{ indent: 1, text: 'int right = 2 * root + 2;', codePartId: HeapSortPartId.Heapify },
			LineBreak,
			{ indent: 1, text: 'if (left < heapSize && arr[left] > arr[largest]) {', codePartId: HeapSortPartId.CompareLeft },
			{ indent: 2, text: 'largest = left;', codePartId: HeapSortPartId.LeftLarger },
			{ indent: 1, text: '}', codePartId: HeapSortPartId.CompareLeft },
			{ indent: 1, text: 'if (right < heapSize && arr[right] > arr[largest]) {', codePartId: HeapSortPartId.CompareRight },
			{ indent: 2, text: 'largest = right;', codePartId: HeapSortPartId.RightLarger },
			{ indent: 1, text: '}', codePartId: HeapSortPartId.CompareRight },
			LineBreak,
			{ indent: 1, text: 'if (largest != root) {', codePartId: HeapSortPartId.SwapChild },
			{ indent: 2, text: 'int temp = arr[root];', codePartId: HeapSortPartId.SwapChild },
			{ indent: 2, text: 'arr[root] = arr[largest];', codePartId: HeapSortPartId.SwapChild },
			{ indent: 2, text: 'arr[largest] = temp;', codePartId: HeapSortPartId.SwapChild },
			{ indent: 2, text: 'heapify(arr, heapSize, largest);', codePartId: HeapSortPartId.CallHeapifyRecursive },
			{ indent: 1, text: '}', codePartId: HeapSortPartId.SwapChild },
			LineBreak,
			{ indent: 1, text: '// heapify done', codePartId: HeapSortPartId.EndHeapify },
			{ indent: 0, text: '}', codePartId: HeapSortPartId.Heapify },
		],
	},
};

export function heapSortSteps(input: number[]): SortStepResult {
	const trace = new DetailedTraceBuilder(input);
	const array = trace.workingArray;
	const n = array.length;
	let sortedStart = n;

	const sortedIndices = () => range(sortedStart, n - 1);

	const heapify = (heapSize: number, root: number) => {
		let largest = root;
		const left = 2 * root + 1;
		const right = 2 * root + 2;

		trace.counters.compare(2);
		if (left < heapSize && right < heapSize) {
			trace.paint({ compared: [root, left, right], sorted: sortedIndices() });
			trace.record({
				codePartId: 'compare',
				stepLabel: new StepLabel('sorting.steps.heap.basic.compareRootLeftRight', { root, left, right }),
				variables: { root, left, right },
			});
		} else if (left < heapSize) {
			trace.paint({ compared: [root, left], sorted: sortedIndices() });
			trace.record({
				codePartId: 'compare',
				stepLabel: new StepLabel('sorting.steps.heap.basic.compareRootLeft', { root, left }),
				variables: { root, left },
			});
		} else if (right < heapSize) {
			trace.paint({ compared: [root, right], sorted: sortedIndices() });
			trace.record({
				codePartId: 'compare',
				stepLabel: new StepLabel('sorting.steps.heap.basic.compareRootRight', { root, right }),
				variables: { root, right },
			});
		}

		trace.counters.compare();
		if (left < heapSize && array[left].value > array[largest].value) {
			largest = left;
		}
		trace.counters.compare();
		if (right < heapSize && array[right].value > array[largest].value) {
			largest = right;
		}

		if (largest !== root) {
			swap(array, root, largest, trace.counters);
			trace.paint({ moved: [root, largest], sorted: sortedIndices() });
			trace.record({
				codePartId: 'swap',
				stepLabel: new StepLabel('sorting.steps.heap.basic.heapifySwap', { root, largest }),
				variables: { heapSize, root, largest },
			});
			heapify(heapSize, largest);
		}
	};

	for (let i = Math.floor(n / 2) - 1; i >= 0; i -= 1) {
		heapify(n, i);
	}

	for (let end = n - 1; end > 0; end -= 1) {
		swap(array, 0, end, trace.counters);
		sortedStart = end;
		trace.paint({ moved: [0, end], sorted: sortedIndices() });
		trace.record({
			codePartId: 'swap',
			stepLabel: new StepLabel('sorting.steps.heap.basic.moveMaxToIndex', { end }),
			variables: { end },
		});
		heapify(end, 0);
	}

	return trace.build();
}

export function heapSortDetailedSteps(input: number[]): DetailedSortStepResult {
	const trace = new DetailedTraceBuilder(input);
	const array = trace.workingArray;
	const n = array.length;
	let sortedStart = n;

	const sortedIndices = () => range(sortedStart, n - 1);
	const getHeapIndices = (root: number) => {
		if (root >= sortedStart) return [];
		const indices = [root];

		const left = 2 * root + 1;
		const right = 2 * root + 2;
		indices.push(...getHeapIndices(left));
		indices.push(...getHeapIndices(right));

		return indices;
	};

	const heapify = (heapSize: number, root: number) => {
		let largest = root;
		const left = 2 * root + 1;
		const right = 2 * root + 2;

		let classicPaint = { light: [root, left, right], dark: [largest], sorted: sortedIndices() };

		trace.paint({ ...classicPaint });
		trace.record({
			codePartId: HeapSortPartId.Heapify,
			stepLabel: new StepLabel('sorting.steps.heap.detailed.heapifyStart', { root, left }),
			variables: { root, left },
		});

		if (left < heapSize) {
			trace.paint({ ...classicPaint, compared: [root, left] });
			trace.record({
				codePartId: HeapSortPartId.CompareLeft,
				stepLabel: new StepLabel('sorting.steps.heap.detailed.compareLeft', { left, root }),
				variables: { root, left },
			});
			if (array[left].value > array[largest].value) {
				largest = left;

				trace.paint({ ...classicPaint, dark: [largest] });
				trace.record({
					codePartId: HeapSortPartId.LeftLarger,
					stepLabel: new StepLabel('sorting.steps.heap.detailed.leftLarger', { left }),
					variables: { root, left, largest },
				});
			}
		}

		if (right < heapSize) {
			trace.paint({ ...classicPaint, compared: [root, right] });
			trace.record({
				codePartId: HeapSortPartId.CompareRight,
				stepLabel: new StepLabel('sorting.steps.heap.detailed.compareRight', { right, largest }),
				variables: { root, right, largest },
			});
			if (array[right].value > array[largest].value) {
				largest = right;

				trace.paint({ ...classicPaint, dark: [largest] });
				trace.record({
					codePartId: HeapSortPartId.RightLarger,
					stepLabel: new StepLabel('sorting.steps.heap.detailed.rightLarger', { right }),
					variables: { root, right, largest },
				});
			}
		}

		if (largest !== root) {
			swap(array, root, largest);
			trace.paint({ ...classicPaint, moved: [root, largest] });
			trace.record({
				codePartId: HeapSortPartId.SwapChild,
				stepLabel: new StepLabel('sorting.steps.heap.detailed.swapRootWithLargest', { root, largest }),
				variables: { heapSize, root, largest },
			});

			trace.paint({ light: getHeapIndices(largest), sorted: sortedIndices() });
			trace.record({
				codePartId: HeapSortPartId.CallHeapifyRecursive,
				stepLabel: new StepLabel('sorting.steps.heap.detailed.callHeapifyRecursive', { largest }),
				variables: { heapSize, largest },
			});
			heapify(heapSize, largest);
		}

		trace.paint({ sorted: sortedIndices(), light: getHeapIndices(root) });
		trace.record({
			codePartId: HeapSortPartId.EndHeapify,
			stepLabel: new StepLabel('sorting.steps.heap.detailed.endHeapify', { root }),
			variables: { root },
		});
	};

	const heapSort = () => {
		trace.paint({ sorted: sortedIndices() });
		trace.record({
			codePartId: HeapSortPartId.HeapSort,
			stepLabel: new StepLabel('sorting.steps.heap.detailed.startHeapSort'),
			variables: {},
		});

		for (let i = Math.floor(n / 2) - 1; i >= 0; i -= 1) {
			trace.paint({ light: getHeapIndices(i), sorted: sortedIndices() });
			trace.record({
				codePartId: HeapSortPartId.BuildHeap,
				stepLabel: new StepLabel('sorting.steps.heap.detailed.buildHeapAtIndex', { i }),
				variables: { i },
			});
			heapify(n, i);
		}

		for (let end = n - 1; end > 0; end -= 1) {
			swap(array, 0, end);
			sortedStart = end;
			trace.paint({ moved: [0, end], sorted: sortedIndices() });
			trace.record({
				codePartId: HeapSortPartId.ExtractRoot,
				stepLabel: new StepLabel('sorting.steps.heap.detailed.moveMaxToIndex', { end }),
				variables: { end },
			});

			trace.paint({ light: getHeapIndices(0), sorted: sortedIndices() });
			trace.record({
				codePartId: HeapSortPartId.CallHeapifySort,
				stepLabel: new StepLabel('sorting.steps.heap.detailed.heapifyAfterExtractingMax'),
				variables: { end },
			});
			heapify(end, 0);
		}

		sortedStart = 0;
		trace.paint({ sorted: sortedIndices() });
		trace.record({
			codePartId: HeapSortPartId.EndHeapSort,
			stepLabel: new StepLabel('sorting.steps.heap.detailed.heapSortComplete'),
			variables: {},
		});
	};

	heapSort();

	return trace.build();
}
