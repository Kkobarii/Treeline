import { range, swap } from '$lib/sorting-algorithms/misc/utils';
import { detailedStepsToSortSteps } from '$lib/sorting-algorithms/steps/stepAdapters';

import type { DetailedSortStep, SortStep } from '../steps/stepTypes';
import { DetailedTraceBuilder } from '../steps/traceBuilder';

export function heapSortSteps(input: number[]): SortStep[] {
	return detailedStepsToSortSteps(heapSortDetailedSteps(input));
}

export function heapSortDetailedSteps(input: number[]): DetailedSortStep[] {
	const trace = new DetailedTraceBuilder(input);
	const array = trace.workingArray;
	const n = array.length;
	let sortedStart = n;

	const sortedIndices = () => range(sortedStart, n - 1);

	const heapify = (heapSize: number, root: number) => {
		let largest = root;
		const left = 2 * root + 1;
		const right = 2 * root + 2;

		if (left < heapSize && array[left] > array[largest]) {
			largest = left;
		}
		if (right < heapSize && array[right] > array[largest]) {
			largest = right;
		}

		if (largest !== root) {
			swap(array, root, largest);
			trace.record({
				codePartId: 'heapify',
				indicesHighlighted: [root, largest],
				movedIndices: [root, largest],
				sortedIndices: sortedIndices(),
				label: `Heapify swap ${root} ↔ ${largest}`,
				variables: { heapSize, root, largest },
			});
			heapify(heapSize, largest);
		}
	};

	for (let i = Math.floor(n / 2) - 1; i >= 0; i -= 1) {
		trace.record({
			codePartId: 'build-heap',
			indicesHighlighted: [i],
			movedIndices: [],
			sortedIndices: sortedIndices(),
			label: `Build heap from root ${i}`,
			variables: { i },
		});
		heapify(n, i);
	}

	for (let end = n - 1; end > 0; end -= 1) {
		swap(array, 0, end);
		sortedStart = end;
		trace.record({
			codePartId: 'swap-root',
			indicesHighlighted: [0, end],
			movedIndices: [0, end],
			sortedIndices: sortedIndices(),
			label: `Move max value to index ${end}`,
			variables: { end },
		});

		trace.record({
			codePartId: 'heapify',
			indicesHighlighted: [0],
			movedIndices: [],
			sortedIndices: sortedIndices(),
			label: 'Restore heap property',
			variables: { heapSize: end },
		});
		heapify(end, 0);
	}

	trace.record({
		codePartId: 'extract-loop',
		indicesHighlighted: [],
		movedIndices: [],
		sortedIndices: range(0, n - 1),
		label: 'Heap sort finished',
		variables: {},
	});

	return trace.build();
}
