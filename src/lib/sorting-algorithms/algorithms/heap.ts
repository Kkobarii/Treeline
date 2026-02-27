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

		if (left < heapSize && array[left].value > array[largest].value) {
			largest = left;
		}
		if (right < heapSize && array[right].value > array[largest].value) {
			largest = right;
		}

		if (largest !== root) {
			swap(array, root, largest);
			trace.paint({ moved: [root, largest], sorted: sortedIndices() });
			trace.record({
				codePartId: 'heapify',
				label: `Heapify swap ${root} ↔ ${largest}`,
				variables: { heapSize, root, largest },
			});
			heapify(heapSize, largest);
		}
	};

	for (let i = Math.floor(n / 2) - 1; i >= 0; i -= 1) {
		trace.paint({ compared: [i], sorted: sortedIndices() });
		trace.record({
			codePartId: 'build-heap',
			label: `Build heap from root ${i}`,
			variables: { i },
		});
		heapify(n, i);
	}

	for (let end = n - 1; end > 0; end -= 1) {
		swap(array, 0, end);
		sortedStart = end;
		trace.paint({ moved: [0, end], sorted: sortedIndices() });
		trace.record({
			codePartId: 'swap',
			label: `Move max value to index ${end}`,
			variables: { end },
		});

		trace.paint({ compared: [0], sorted: sortedIndices() });
		trace.record({
			codePartId: 'heapify',
			label: 'Restore heap property',
			variables: { heapSize: end },
		});
		heapify(end, 0);
	}

	return trace.build();
}
