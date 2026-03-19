import { StepDetail } from '$lib/data-structures/operation/stepData';
import { DataStructure } from '$lib/data-structures/structures/dataStructure';

export class CreateHeadData extends StepDetail {
	constructor(
		public nodeId: number,
		public value: number,
		public startSnapshot: DataStructure,
		public endSnapshot: DataStructure,
	) {
		super('steps.dataStructures.linkedList.createHeadData', { nodeId, value });
	}
}

export class InsertAtHeadData extends StepDetail {
	constructor(
		public nodeId: number,
		public value: number,
		public startSnapshot: DataStructure,
		public endSnapshot: DataStructure,
	) {
		super('steps.dataStructures.linkedList.insertAtHeadData', { nodeId, value });
	}
}

export class InsertAtTailData extends StepDetail {
	constructor(
		public nodeId: number,
		public value: number,
		public startSnapshot: DataStructure,
		public endSnapshot: DataStructure,
	) {
		super('steps.dataStructures.linkedList.insertAtTailData', { nodeId, value });
	}
}

export class CompareData extends StepDetail {
	constructor(
		public searchValue: number,
		public currentId: number,
		public currentValue: number,
		public position: number,
	) {
		super('steps.dataStructures.linkedList.compareData', { searchValue, currentId, currentValue, position });
	}
}

export class TraverseNextData extends StepDetail {
	constructor(
		public fromId: number,
		public toId: number,
	) {
		super('steps.dataStructures.linkedList.traverseNextData', { fromId, toId });
	}
}

export class TraverseToTailData extends StepDetail {
	constructor(public fromId: number) {
		super('steps.dataStructures.linkedList.traverseToTailData', { fromId });
	}
}

export class FoundData extends StepDetail {
	constructor(
		public nodeId: number,
		public value: number,
		public position: number,
	) {
		super('steps.dataStructures.linkedList.foundData', { nodeId, value, position });
	}
}

export class NotFoundData extends StepDetail {
	constructor(public value: number) {
		super('steps.dataStructures.linkedList.notFoundData', { value });
	}
}

export class MarkToDeleteData extends StepDetail {
	constructor(
		public nodeId: number,
		public value: number,
	) {
		super('steps.dataStructures.linkedList.markToDeleteData', { nodeId, value });
	}
}

export class RemoveHeadData extends StepDetail {
	constructor(
		public startSnapshot: DataStructure,
		public endSnapshot: DataStructure,
	) {
		super('steps.dataStructures.linkedList.removeHeadData');
	}
}

export class RemoveNodeData extends StepDetail {
	constructor(
		public nodeId: number,
		public startSnapshot: DataStructure,
		public endSnapshot: DataStructure,
	) {
		super('steps.dataStructures.linkedList.removeNodeData', { nodeId });
	}
}

export class EmptyListData extends StepDetail {
	constructor() {
		super('steps.dataStructures.linkedList.emptyListData');
	}
}
