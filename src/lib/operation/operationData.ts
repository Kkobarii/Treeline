import { DataStructure } from '$lib/structures/dataStructure';

export class OperationData {
	operation: string;

	startSnapshot: DataStructure;
	steps: StepData[];
	endSnapshot: DataStructure | null;

	constructor(operation: string, startSnapshot: DataStructure) {
		this.operation = operation;
		this.startSnapshot = startSnapshot;
		this.steps = [new StepData(0, 'Start', { action: 'Start' })];
		this.endSnapshot = null;
	}

	step(step: StepData) {
		step.id = this.steps.length;
		this.steps.push(step);
	}

	end(endSnapshot: DataStructure) {
		this.step(new StepData(this.steps.length, 'End', { action: 'End' }));
		this.endSnapshot = endSnapshot;
	}
}

export class StepData {
	id: number = 0;
	type: string;
	data: object = {};

	constructor(id: number, type: string, data: object) {
		this.id = id;
		this.type = type;
		this.data = data;
	}

	static new(type: string, data: object): StepData {
		return new StepData(0, type, data);
	}
}

export namespace BSTreeSteps {
	export enum StepType {
		Start = 'Start',
		End = 'End',
		CreateRoot = 'CreateRoot',
		CreateLeaf = 'CreateLeaf',
		Compare = 'Compare',
		Traverse = 'Traverse',
		Drop = 'Drop',
		Found = 'Found',
		MarkToDelete = 'MarkToDelete',
		Delete = 'Delete',
		ReplaceWithChild = 'ReplaceWithChild',
		FoundInorderSuccessor = 'FoundInorderSuccessor',
		RelinkSuccessorChild = 'RelinkSuccessorChild',
		ReplaceWithInorderSuccessor = 'ReplaceWithInorderSuccessor',
	}

	export class BSTreeStepData {
		constructor(public action: string) {}
	}

	export class CreateRootData extends BSTreeStepData {
		constructor(
			public nodeId: number,
			public value: number,
		) {
			super(`Create root node ${nodeId} with value ${value}`);
		}
	}

	export function CreateRoot(nodeId: number, value: number): StepData {
		return StepData.new(StepType.CreateRoot, new CreateRootData(nodeId, value));
	}

	export class CreateLeafData extends BSTreeStepData {
		constructor(
			public nodeId: number,
			public value: number,
			public parentId: number,
			public direction: 'left' | 'right',
		) {
			super(`Create leaf node ${nodeId} with value ${value} as ${direction} child of ${parentId}`);
		}
	}

	export function CreateLeaf(nodeId: number, value: number, parentId: number, direction: 'left' | 'right'): StepData {
		return StepData.new(StepType.CreateLeaf, new CreateLeafData(nodeId, value, parentId, direction));
	}

	export class CompareData extends BSTreeStepData {
		constructor(
			public value: number,
			public comparisonId: number,
			public comparisonValue: number,
			public result: 'less' | 'greater' | 'equal',
		) {
			super(`Compare value ${value} with node ${comparisonId}'s ${comparisonValue}`);
		}
	}

	export function Compare(value: number, comparisonId: number, comparisonValue: number): StepData {
		let result: 'less' | 'greater' | 'equal';
		if (value < comparisonValue) {
			result = 'less';
		} else if (value > comparisonValue) {
			result = 'greater';
		} else {
			result = 'equal';
		}
		return StepData.new(StepType.Compare, new CompareData(value, comparisonId, comparisonValue, result));
	}

	export class TraverseData extends BSTreeStepData {
		constructor(
			public fromId: number,
			public toId: number,
			public direction: 'left' | 'right',
		) {
			super(`Traverse ${direction} from node ${fromId} to node ${toId}`);
		}
	}

	export function Traverse(fromId: number, toId: number, direction: 'left' | 'right'): StepData {
		return StepData.new(StepType.Traverse, new TraverseData(fromId, toId, direction));
	}

	export class DropData extends BSTreeStepData {
		constructor(
			public value: number,
			public reason: string,
			public fromId: string,
		) {
			super(`Drop value ${value} from node ${fromId} due to ${reason}`);
		}
	}

	export function Drop(value: number, reason: string, fromId: string): StepData {
		return StepData.new(StepType.Drop, new DropData(value, reason, fromId));
	}

	export class FoundData extends BSTreeStepData {
		constructor(
			public nodeId: number,
			public value: number,
		) {
			super(`Found value ${value} at node ${nodeId}`);
		}
	}

	export function Found(nodeId: number, value: number): StepData {
		return new StepData(0, StepType.Found, new FoundData(nodeId, value));
	}

	export class MarkToDeleteData extends BSTreeStepData {
		constructor(
			public nodeId: number,
			public value: number,
		) {
			super(`Mark node ${nodeId} with value ${value} to delete`);
		}
	}

	export function MarkToDelete(nodeId: number, value: number): StepData {
		return new StepData(0, StepType.MarkToDelete, new MarkToDeleteData(nodeId, value));
	}

	export class DeleteData extends BSTreeStepData {
		constructor(
			public nodeId: number,
			public value: number,
		) {
			super(`Delete node ${nodeId} with value ${value}`);
		}
	}

	export function Delete(nodeId: number, value: number): StepData {
		return new StepData(0, StepType.Delete, new DeleteData(nodeId, value));
	}

	export class ReplaceWithChildData extends BSTreeStepData {
		constructor(
			public oldNodeId: number,
			public newNodeId: number,
			public newValue: number,
			public direction: 'left' | 'right',
		) {
			super(`Replace node ${oldNodeId} with its ${direction} child node ${newNodeId} having value ${newValue}`);
		}
	}

	export function ReplaceWithChild(oldNodeId: number, newNodeId: number, newValue: number, direction: 'left' | 'right'): StepData {
		return new StepData(0, StepType.ReplaceWithChild, new ReplaceWithChildData(oldNodeId, newNodeId, newValue, direction));
	}

	export class ReplaceWithInorderSuccessorData extends BSTreeStepData {
		constructor(
			public oldNodeId: number,
			public successorNodeId: number,
			public successorValue: number,
		) {
			super(`Replace node ${oldNodeId} with its inorder successor node ${successorNodeId} having value ${successorValue}`);
		}
	}

	export function ReplaceWithInorderSuccessor(oldNodeId: number, successorNodeId: number, successorValue: number): StepData {
		return new StepData(
			0,
			StepType.ReplaceWithInorderSuccessor,
			new ReplaceWithInorderSuccessorData(oldNodeId, successorNodeId, successorValue),
		);
	}

	export class RelinkSuccessorChildData extends BSTreeStepData {
		constructor(
			public childNodeId: number,
			public childValue: number,
			public newParentNodeId: number,
			public newParentValue: number,
		) {
			super(
				`Relink child node ${childNodeId} with value ${childValue} from successor to parent node ${newParentNodeId} with value ${newParentValue}`,
			);
		}
	}

	export function RelinkSuccessorChild(
		childNodeId: number,
		childValue: number,
		newParentNodeId: number,
		newParentValue: number,
	): StepData {
		return new StepData(
			0,
			StepType.RelinkSuccessorChild,
			new RelinkSuccessorChildData(childNodeId, childValue, newParentNodeId, newParentValue),
		);
	}

	export class FoundInorderSuccessorData extends BSTreeStepData {
		constructor(
			public nodeId: number,
			public successorId: number,
			public successorValue: number,
		) {
			super(`Found inorder successor node ${successorId} with value ${successorValue} for node ${nodeId}`);
		}
	}

	export function FoundInorderSuccessor(nodeId: number, successorId: number, successorValue: number): StepData {
		return new StepData(0, StepType.FoundInorderSuccessor, new FoundInorderSuccessorData(nodeId, successorId, successorValue));
	}
}
