import { StepDetail } from '$lib/data-structures/operation/stepData';
import { DataStructure } from '$lib/data-structures/structures/dataStructure';

export class AppendData extends StepDetail {
	constructor(
		public nodeId: number,
		public value: number,
		public parentId: number,
		public startSnapshot: DataStructure,
		public endSnapshot: DataStructure,
	) {
		super('steps.dataStructures.heap.appendData', { value });
	}
}

export class CompareWithParentData extends StepDetail {
	constructor(
		public nodeId: number,
		public parentId: number,
		public needsSwap: boolean,
	) {
		super(
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
		super('steps.dataStructures.heap.replaceRootWithLastData', { rootValue, lastValue });
	}
}

export class CompareWithChildrenData extends StepDetail {
	constructor(
		public nodeId: number,
		public largestChildId: number | null,
	) {
		super(
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
		super('steps.dataStructures.heap.findLargestChildData', { largestChildId, largestChildValue });
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
		super('steps.dataStructures.heap.swapData', { fromId, fromValue, toId, toValue });
	}
}
