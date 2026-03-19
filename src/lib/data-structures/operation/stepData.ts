import { DataStructure } from '$lib/data-structures/structures/dataStructure';
import { StepLabel, type StepLabelParams } from '$lib/steps/stepLabel';

export class StepDetail extends StepLabel {
	constructor(label: string, params: StepLabelParams = {}) {
		super(label, params);
	}
}

export class StartData extends StepDetail {
	constructor() {
		super('steps.dataStructures.common.startData');
	}
}

export class EndData extends StepDetail {
	constructor() {
		super('steps.dataStructures.common.endData');
	}
}

export class CreateRootData extends StepDetail {
	constructor(
		public nodeId: number,
		public value: number,
		public startSnapshot: DataStructure,
		public endSnapshot: DataStructure,
	) {
		super('steps.dataStructures.common.createRootData', { nodeId, value });
	}
}

export class CreateLeafData extends StepDetail {
	constructor(
		public nodeId: number,
		public value: number,
		public parentId: number,
		public direction: 'left' | 'right',
		public startSnapshot: DataStructure,
		public endSnapshot: DataStructure,
	) {
		super('steps.dataStructures.common.createLeafData', { nodeId, value, parentId, direction });
	}
}

export class CompareData extends StepDetail {
	constructor(
		public value: number,
		public comparisonId: number,
		public comparisonValue: number,
	) {
		super('steps.dataStructures.common.compareData', { value, comparisonId, comparisonValue });
	}
}

export class TraverseData extends StepDetail {
	constructor(
		public fromId: number,
		public toId: number,
		public direction: 'left' | 'right',
	) {
		super('steps.dataStructures.common.traverseData', { fromId, toId, direction });
	}
}

export class DropData extends StepDetail {
	constructor(
		public value: number,
		public reason: string,
		public fromId: string,
	) {
		super('steps.dataStructures.common.dropData', { value, reason, fromId });
	}
}

export class FoundData extends StepDetail {
	constructor(
		public nodeId: number,
		public value: number,
	) {
		super('steps.dataStructures.common.foundData', { nodeId, value });
	}
}

export class MarkToDeleteData extends StepDetail {
	constructor(
		public nodeId: number,
		public value: number,
	) {
		super('steps.dataStructures.common.markToDeleteData', { nodeId, value });
	}
}

export class DeleteData extends StepDetail {
	constructor(
		public nodeId: number,
		public value: number,
		public startSnapshot: DataStructure,
		public endSnapshot: DataStructure,
	) {
		super('steps.dataStructures.common.deleteData', { nodeId, value });
	}
}

export class ReplaceWithChildData extends StepDetail {
	constructor(
		public oldNodeId: number,
		public newNodeId: number,
		public newValue: number,
		public direction: 'left' | 'right',
		public startSnapshot: DataStructure,
		public endSnapshot: DataStructure,
	) {
		super('steps.dataStructures.common.replaceWithChildData', { oldNodeId, newNodeId, newValue, direction });
	}
}

export class ReplaceWithInorderSuccessorData extends StepDetail {
	constructor(
		public oldNodeId: number,
		public successorNodeId: number,
		public successorValue: number,
		public successorParentId: number,
		public relinkedChildId: number | null,
		public startSnapshot: DataStructure,
		public endSnapshot: DataStructure,
	) {
		super('steps.dataStructures.common.replaceWithInorderSuccessorData', {
			oldNodeId,
			successorNodeId,
			successorValue,
		});
	}
}

export class RelinkSuccessorChildData extends StepDetail {
	constructor(
		public childNodeId: number,
		public childValue: number,
		public newParentNodeId: number,
		public newParentValue: number,
		public successorNodeId: number,
		public successorValue: number,
		public startSnapshot: DataStructure,
		public endSnapshot: DataStructure,
	) {
		super('steps.dataStructures.common.relinkSuccessorChildData', {
			childNodeId,
			childValue,
			newParentNodeId,
			newParentValue,
		});
	}
}

export class FoundInorderSuccessorData extends StepDetail {
	constructor(
		public nodeId: number,
		public successorId: number,
		public successorValue: number,
	) {
		super('steps.dataStructures.common.foundInorderSuccessorData', { nodeId, successorId, successorValue });
	}
}

export class CaseAnalysisData extends StepDetail {
	constructor(
		public caseNumber: number,
		public description: string,
		public nodeId?: number,
	) {
		super('steps.dataStructures.common.caseAnalysisData', { caseNumber, description });
	}
}
