import { StepDetail } from '$lib/data-structures/operations/stepData';
import { DataStructure, StepType } from '$lib/data-structures/structures/dataStructure';

export class AppendData extends StepDetail {
	constructor(
		public nodeId: number,
		public value: number,
		public parentId: number,
		public startSnapshot: DataStructure,
		public endSnapshot: DataStructure,
	) {
		super(StepType.Heap.Append, 'steps.dataStructures.heap.appendData', { value });
	}
}

export class CompareWithParentData extends StepDetail {
	constructor(
		public nodeId: number,
		public parentId: number,
		public needsSwap: boolean,
	) {
		super(
			StepType.Heap.CompareWithParent,
			needsSwap
				? 'steps.dataStructures.heap.compareWithParentNeedsSwapData'
				: 'steps.dataStructures.heap.compareWithParentCorrectData',
			{ nodeId, parentId },
		);
	}
}

export class ReplaceRootWithLastData extends StepDetail {
	constructor(
		public rootId: number,
		public lastId: number,
		public rootValue: number,
		public lastValue: number,
		public startSnapshot: DataStructure,
		public endSnapshot: DataStructure,
	) {
		super(StepType.Heap.ReplaceRootWithLast, 'steps.dataStructures.heap.replaceRootWithLastData', { rootValue, lastValue });
	}
}

export class CompareWithChildrenData extends StepDetail {
	constructor(
		public nodeId: number,
		public largestChildId: number | null,
	) {
		super(
			StepType.Heap.CompareWithChildren,
			largestChildId !== null
				? 'steps.dataStructures.heap.compareWithChildrenHasLargestData'
				: 'steps.dataStructures.heap.compareWithChildrenCorrectData',
			{ nodeId, largestChildId: largestChildId ?? '' },
		);
	}
}

export class FindLargestChildData extends StepDetail {
	constructor(
		public parentId: number,
		public largestChildId: number,
		public largestChildValue: number,
	) {
		super(StepType.Heap.FindLargestChild, 'steps.dataStructures.heap.findLargestChildData', { largestChildId, largestChildValue });
	}
}

export class SwapData extends StepDetail {
	constructor(
		public fromId: number,
		public toId: number,
		public fromValue: number,
		public toValue: number,
		public startSnapshot: DataStructure,
		public endSnapshot: DataStructure,
	) {
		super(StepType.Heap.Swap, 'steps.dataStructures.heap.swapData', { fromId, fromValue, toId, toValue });
	}
}
