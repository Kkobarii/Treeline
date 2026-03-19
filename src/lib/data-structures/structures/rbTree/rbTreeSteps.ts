import { StepDetail } from '$lib/data-structures/operation/stepData';
import { DataStructure, StepType } from '$lib/data-structures/structures/dataStructure';

export class ColorNodeData extends StepDetail {
	constructor(
		public nodeId: number,
		public color: 'red' | 'black',
		public startSnapshot: DataStructure,
		public endSnapshot: DataStructure,
	) {
		super(StepType.RBTree.ColorNode, 'steps.dataStructures.rbTree.colorNodeData', { nodeId, color });
	}
}

export class RotateLeftData extends StepDetail {
	constructor(
		public oldRootId: number,
		public newRootId: number,
		public adoptedChildId: number | null,
		public startSnapshot: DataStructure,
		public endSnapshot: DataStructure,
	) {
		super(StepType.RBTree.RotateLeft, 'steps.dataStructures.rbTree.rotateLeftData', { oldRootId, newRootId });
	}
}

export class RotateRightData extends StepDetail {
	constructor(
		public oldRootId: number,
		public newRootId: number,
		public adoptedChildId: number | null,
		public startSnapshot: DataStructure,
		public endSnapshot: DataStructure,
	) {
		super(StepType.RBTree.RotateRight, 'steps.dataStructures.rbTree.rotateRightData', { oldRootId, newRootId });
	}
}

export class FixupData extends StepDetail {
	constructor(
		public nodeId: number,
		public reason: string,
	) {
		super(StepType.RBTree.Fixup, 'steps.dataStructures.rbTree.fixupData', { nodeId, reason });
	}
}
