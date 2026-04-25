import { StepDetail } from '$lib/data-structures/operations/stepData';
import { DataStructure, StepType } from '$lib/data-structures/structures/dataStructure';

export class UpdateHeightBalanceData extends StepDetail {
	constructor(
		public nodeId: number,
		public height: number,
		public balance: number,
		public startSnapshot: DataStructure,
		public endSnapshot: DataStructure,
	) {
		super(StepType.AVLTree.UpdateHeightBalance, 'steps.dataStructures.avlTree.updateHeightBalanceData', { nodeId, height, balance });
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
		super(StepType.AVLTree.RotateLeft, 'steps.dataStructures.avlTree.rotateLeftData', { oldRootValue, newRootValue });
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
		super(StepType.AVLTree.RotateRight, 'steps.dataStructures.avlTree.rotateRightData', { oldRootValue, newRootValue });
	}
}
