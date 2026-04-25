import { StepDetail } from '$lib/data-structures/operations/stepData';
import { DataStructure, StepType } from '$lib/data-structures/structures/dataStructure';

import type { IdTranslationMap } from './bTree';

export class MarkOverfullData extends StepDetail {
	constructor(
		public nodeId: number,
		public currentCount: number,
		public maxCount: number,
	) {
		super(StepType.BTree.MarkOverfull, 'steps.dataStructures.bTree.markOverfullData', { nodeId, currentCount, maxCount });
	}
}

export class MarkUnderfullData extends StepDetail {
	constructor(
		public nodeId: number,
		public currentCount: number,
		public minCount: number,
	) {
		super(StepType.BTree.MarkUnderfull, 'steps.dataStructures.bTree.markUnderfullData', { nodeId, currentCount, minCount });
	}
}

export class SplitData extends StepDetail {
	constructor(
		public nodeId: number,
		public middleValue: number,
		public leftNodeId: number,
		public rightNodeId: number,
		public translationMap: IdTranslationMap,
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
		public sourceLeftId: number,
		public sourceRightId: number,
		public isNewRoot: boolean,
		public startSnapshot: DataStructure,
		public endSnapshot: DataStructure,
	) {
		super(
			StepType.BTree.PromoteMiddle,
			isNewRoot ? 'steps.dataStructures.bTree.promoteMiddleAsNewRootData' : 'steps.dataStructures.bTree.promoteMiddleIntoParentData',
			{ middleValue, targetNodeId },
		);
	}
}

export class CollapseRootData extends StepDetail {
	constructor(
		public oldRootId: number,
		public newRootId: number,
		public startSnapshot: DataStructure,
		public endSnapshot: DataStructure,
	) {
		super(StepType.BTree.CollapseRoot, 'steps.dataStructures.bTree.collapseRootData', { oldRootId, newRootId });
	}
}

export class ChooseBranchData extends StepDetail {
	childIndexHumanReadable: number;
	constructor(
		public nodeId: number,
		public value: number,
		public childIndex: number,
		public childId: number,
		public lowerBound: number | null,
		public upperBound: number | null,
	) {
		const childIndexHumanReadable = childIndex + 1;
		if (lowerBound !== null && upperBound !== null) {
			super(StepType.BTree.ChooseBranch, 'steps.dataStructures.bTree.chooseBranchBetweenData', {
				childIndex,
				childIndexHumanReadable,
				childId,
				value,
				lowerBound,
				upperBound,
			});
			this.childIndexHumanReadable = childIndexHumanReadable;
			return;
		}

		if (lowerBound !== null) {
			super(StepType.BTree.ChooseBranch, 'steps.dataStructures.bTree.chooseBranchGreaterThanData', {
				childIndex,
				childIndexHumanReadable,
				childId,
				value,
				lowerBound,
			});
			this.childIndexHumanReadable = childIndexHumanReadable;
			return;
		}

		if (upperBound !== null) {
			super(StepType.BTree.ChooseBranch, 'steps.dataStructures.bTree.chooseBranchLessThanData', {
				childIndex,
				childIndexHumanReadable,
				childId,
				value,
				upperBound,
			});
			this.childIndexHumanReadable = childIndexHumanReadable;
			return;
		}

		super(StepType.BTree.ChooseBranch, 'steps.dataStructures.bTree.chooseBranchData', {
			childIndex,
			childIndexHumanReadable,
			childId,
			value,
		});
		this.childIndexHumanReadable = childIndexHumanReadable;
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
		public sourceId: number,
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

export class BorrowFromSiblingData extends StepDetail {
	constructor(
		public childId: number,
		public siblingId: number,
		public parentId: number,
		public borrowedValue: number,
		public parentValue: number,
		public direction: 'left' | 'right',
		public startSnapshot: DataStructure,
		public endSnapshot: DataStructure,
	) {
		super(
			StepType.BTree.BorrowFromSibling,
			direction === 'left' ? 'steps.dataStructures.bTree.borrowFromLeftData' : 'steps.dataStructures.bTree.borrowFromRightData',
			{
				childId,
				siblingId,
				parentId,
				borrowedValue,
				parentValue,
			},
		);
	}
}

export class MergeChildrenData extends StepDetail {
	constructor(
		public mergedNodeId: number,
		public parentId: number,
		public originalLeftChildId: number,
		public originalRightChildId: number,
		public originalParentId: number,
		public parentValue: number | null,
		public translationMap: IdTranslationMap,
		public startSnapshot: DataStructure,
		public endSnapshot: DataStructure,
	) {
		super(
			StepType.BTree.MergeChildren,
			parentValue ? 'steps.dataStructures.bTree.mergeChildrenAndParentData' : 'steps.dataStructures.bTree.mergeChildrenData',
			{
				leftChildId: originalLeftChildId,
				rightChildId: originalRightChildId,
				parentValue: parentValue ?? '',
			},
		);
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
