import { StepDetail } from '$lib/data-structures/operations/stepData';
import { DataStructure, StepType } from '$lib/data-structures/structures/dataStructure';

export class CreateHeadData extends StepDetail {
	constructor(
		public nodeId: number,
		public value: number,
		public startSnapshot: DataStructure,
		public endSnapshot: DataStructure,
	) {
		super(StepType.LinkedList.CreateHead, 'steps.dataStructures.linkedList.createHeadData', { nodeId, value });
	}
}

export class InsertAtHeadData extends StepDetail {
	constructor(
		public nodeId: number,
		public value: number,
		public headId: number,
		public startSnapshot: DataStructure,
		public endSnapshot: DataStructure,
	) {
		super(StepType.LinkedList.InsertAtHead, 'steps.dataStructures.linkedList.insertAtHeadData', { nodeId, value });
	}
}

export class InsertAtTailData extends StepDetail {
	constructor(
		public nodeId: number,
		public value: number,
		public tailId: number,
		public startSnapshot: DataStructure,
		public endSnapshot: DataStructure,
	) {
		super(StepType.LinkedList.InsertAtTail, 'steps.dataStructures.linkedList.insertAtTailData', { nodeId, value });
	}
}

export class CompareData extends StepDetail {
	constructor(
		public searchValue: number,
		public currentId: number,
		public currentValue: number,
		public position: number,
	) {
		super(
			StepType.LinkedList.Compare,
			`steps.dataStructures.linkedList.compare${searchValue === currentValue ? 'Equal' : 'NotEqual'}Data`,
			{
				searchValue,
				currentId,
				currentValue,
				position,
			},
		);
	}
}

export class TraverseNextData extends StepDetail {
	constructor(
		public fromId: number,
		public fromValue: number,
		public toId: number,
		public toValue: number,
	) {
		super(StepType.LinkedList.TraverseNext, 'steps.dataStructures.linkedList.traverseNextData', { fromId, fromValue, toId, toValue });
	}
}

export class TraverseToTailData extends StepDetail {
	constructor(public tailId: number) {
		super(StepType.LinkedList.TraverseToTail, 'steps.dataStructures.linkedList.traverseToTailData', {
			tailId,
		});
	}
}

export class FoundData extends StepDetail {
	constructor(
		public nodeId: number,
		public value: number,
		public position: number,
	) {
		super(StepType.LinkedList.Found, 'steps.dataStructures.linkedList.foundData', { nodeId, value, position });
	}
}

export class NotFoundData extends StepDetail {
	constructor(
		public value: number,
		public position: number,
	) {
		super(StepType.LinkedList.NotFound, 'steps.dataStructures.linkedList.notFoundData', { value, position });
	}
}

export class MarkToDeleteData extends StepDetail {
	constructor(
		public nodeId: number,
		public value: number,
	) {
		super(StepType.LinkedList.MarkToDelete, 'steps.dataStructures.linkedList.markToDeleteData', { nodeId, value });
	}
}

export class RemoveHeadData extends StepDetail {
	constructor(
		public nodeId: number,
		public value: number,
		public startSnapshot: DataStructure,
		public endSnapshot: DataStructure,
	) {
		super(StepType.LinkedList.RemoveHead, 'steps.dataStructures.linkedList.removeHeadData');
	}
}

export class RemoveNodeData extends StepDetail {
	constructor(
		public nodeId: number,
		public value: number,
		public startSnapshot: DataStructure,
		public endSnapshot: DataStructure,
	) {
		super(StepType.LinkedList.RemoveNode, 'steps.dataStructures.linkedList.removeNodeData', { nodeId, value });
	}
}

export class EmptyListData extends StepDetail {
	constructor() {
		super(StepType.LinkedList.EmptyList, 'steps.dataStructures.linkedList.emptyListData');
	}
}
