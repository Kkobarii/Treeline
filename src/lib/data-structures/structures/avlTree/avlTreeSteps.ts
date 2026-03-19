import { StepDetail } from '$lib/data-structures/operation/stepData';
import { DataStructure } from '$lib/data-structures/structures/dataStructure';

export class UpdateHeightBalanceData extends StepDetail {
	constructor(
		public nodeId: number,
		public height: number,
		public balance: number,
		public startSnapshot: DataStructure,
		public endSnapshot: DataStructure,
	) {
		super('steps.dataStructures.avlTree.updateHeightBalanceData', { nodeId, height, balance });
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
		super('steps.dataStructures.avlTree.rotateLeftData', { oldRootId, newRootId });
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
		super('steps.dataStructures.avlTree.rotateRightData', { oldRootId, newRootId });
	}
}
