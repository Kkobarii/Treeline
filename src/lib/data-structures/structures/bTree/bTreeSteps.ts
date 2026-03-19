import { StepDetail } from '$lib/data-structures/operation/stepData';
import { DataStructure, StepType } from '$lib/data-structures/structures/dataStructure';

export class MarkOverfullData extends StepDetail {
	constructor(
		public nodeId: number,
		public currentCount: number,
		public maxCount: number,
		public startSnapshot: DataStructure,
		public endSnapshot: DataStructure,
	) {
		super(StepType.BTree.MarkOverfull, 'steps.dataStructures.bTree.markOverfullData', { nodeId, currentCount, maxCount });
	}
}

export class SplitData extends StepDetail {
	constructor(
		public nodeId: number,
		public middleValue: number,
		public leftNodeId: number,
		public rightNodeId: number,
		public startSnapshot: DataStructure,
		public endSnapshot: DataStructure,
	) {
		super(StepType.BTree.Split, 'steps.dataStructures.bTree.splitData', { nodeId, middleValue, leftNodeId, rightNodeId });
	}
}

export class PromoteMiddleData extends StepDetail {
	constructor(
		public middleValue: number,
		public targetNodeId: number,
		public isNewRoot: boolean,
		public startSnapshot: DataStructure,
		public endSnapshot: DataStructure,
	) {
		super(
			StepType.BTree.PromoteMiddle,
			isNewRoot ? 'steps.dataStructures.bTree.promoteMiddleNewRootData' : 'steps.dataStructures.bTree.promoteMiddleData',
			{ middleValue, targetNodeId },
		);
	}
}

export class ChooseBranchData extends StepDetail {
	constructor(
		public nodeId: number,
		public value: number,
		public childIndex: number,
		public childId: number,
		public lowerBound: number | null,
		public upperBound: number | null,
	) {
		if (lowerBound !== null && upperBound !== null) {
			super(StepType.BTree.ChooseBranch, 'steps.dataStructures.bTree.chooseBranchBetweenData', {
				childIndex,
				childId,
				value,
				lowerBound,
				upperBound,
			});
			return;
		}

		if (lowerBound !== null) {
			super(StepType.BTree.ChooseBranch, 'steps.dataStructures.bTree.chooseBranchGreaterThanData', {
				childIndex,
				childId,
				value,
				lowerBound,
			});
			return;
		}

		if (upperBound !== null) {
			super(StepType.BTree.ChooseBranch, 'steps.dataStructures.bTree.chooseBranchLessThanData', {
				childIndex,
				childId,
				value,
				upperBound,
			});
			return;
		}

		super(StepType.BTree.ChooseBranch, 'steps.dataStructures.bTree.chooseBranchData', { childIndex, childId, value });
	}
}

export class InsertValueData extends StepDetail {
	constructor(
		public nodeId: number,
		public value: number,
		public startSnapshot: DataStructure,
		public endSnapshot: DataStructure,
	) {
		super(StepType.BTree.InsertValue, 'steps.dataStructures.bTree.insertValueData', { nodeId, value });
	}
}

export class RemoveValueData extends StepDetail {
	constructor(
		public nodeId: number,
		public value: number,
		public startSnapshot: DataStructure,
		public endSnapshot: DataStructure,
	) {
		super(StepType.BTree.RemoveValue, 'steps.dataStructures.bTree.removeValueData', { nodeId, value });
	}
}

export class ReplaceValueData extends StepDetail {
	constructor(
		public nodeId: number,
		public oldValue: number,
		public newValue: number,
		public replacementSource: string,
		public startSnapshot: DataStructure,
		public endSnapshot: DataStructure,
	) {
		super(StepType.BTree.ReplaceValue, 'steps.dataStructures.bTree.replaceValueData', {
			nodeId,
			oldValue,
			newValue,
			replacementSource,
		});
	}
}

export class BorrowFromLeftData extends StepDetail {
	constructor(
		public childId: number,
		public siblingId: number,
		public borrowedValue: number,
		public parentValue: number,
		public startSnapshot: DataStructure,
		public endSnapshot: DataStructure,
	) {
		super(StepType.BTree.BorrowFromLeft, 'steps.dataStructures.bTree.borrowFromLeftData', {
			childId,
			siblingId,
			borrowedValue,
			parentValue,
		});
	}
}

export class BorrowFromRightData extends StepDetail {
	constructor(
		public childId: number,
		public siblingId: number,
		public borrowedValue: number,
		public parentValue: number,
		public startSnapshot: DataStructure,
		public endSnapshot: DataStructure,
	) {
		super(StepType.BTree.BorrowFromRight, 'steps.dataStructures.bTree.borrowFromRightData', {
			childId,
			siblingId,
			borrowedValue,
			parentValue,
		});
	}
}

export class MergeChildrenData extends StepDetail {
	constructor(
		public leftChildId: number,
		public rightChildId: number,
		public parentValue: number | null,
		public startSnapshot: DataStructure,
		public endSnapshot: DataStructure,
	) {
		super(StepType.BTree.MergeChildren, 'steps.dataStructures.bTree.mergeChildrenData', {
			leftChildId,
			rightChildId,
			parentValue: parentValue ?? '',
		});
	}
}

export class FindInorderReplacementData extends StepDetail {
	constructor(
		public nodeId: number,
		public childId: number,
		public replacementValue: number,
		public replacementType: 'predecessor' | 'successor',
	) {
		super(
			StepType.BTree.FindInorderReplacement,
			replacementType === 'predecessor'
				? 'steps.dataStructures.bTree.findInorderReplacementPredecessorData'
				: 'steps.dataStructures.bTree.findInorderReplacementSuccessorData',
			{ nodeId, childId, replacementValue },
		);
	}
}
