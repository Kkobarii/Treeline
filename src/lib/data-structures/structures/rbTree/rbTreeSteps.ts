import { StepDetail } from '$lib/data-structures/operations/stepData';
import { DataStructure, StepType } from '$lib/data-structures/structures/dataStructure';

export class ColorNodeData extends StepDetail {
	constructor(
		public nodeId: number,
		public nodeValue: number,
		public color: string,
		public startSnapshot: DataStructure,
		public endSnapshot: DataStructure,
	) {
		color = `steps.dataStructures.rbTree.snippet.${color}`;
		super(StepType.RBTree.ColorNode, 'steps.dataStructures.rbTree.colorNodeData', { nodeValue, color });
	}
}

export class RotateLeftData extends StepDetail {
	constructor(
		public oldRootId: number,
		public oldRootValue: number,
		public newRootId: number,
		public newRootValue: number,
		public adoptedChildId: number | null,
		public startSnapshot: DataStructure,
		public endSnapshot: DataStructure,
	) {
		super(StepType.RBTree.RotateLeft, 'steps.dataStructures.rbTree.rotateLeftData', { oldRootValue, newRootValue });
	}
}

export class RotateRightData extends StepDetail {
	constructor(
		public oldRootId: number,
		public oldRootValue: number,
		public newRootId: number,
		public newRootValue: number,

		public adoptedChildId: number | null,
		public startSnapshot: DataStructure,
		public endSnapshot: DataStructure,
	) {
		super(StepType.RBTree.RotateRight, 'steps.dataStructures.rbTree.rotateRightData', { oldRootValue, newRootValue });
	}
}

export class FixupData extends StepDetail {
	constructor(
		public nodeId: number,
		public nodeValue: number,
		public fixupType: string,
		public result: string,
	) {
		super(StepType.RBTree.Fixup, fixupType, { nodeId, nodeValue, result });
	}
}
