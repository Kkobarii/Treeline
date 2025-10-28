import { DataStructure } from '$lib/structures/dataStructure';

export class OperationData {
	operation: string;

	startSnapshot: DataStructure;
	steps: StepData[];
	endSnapshot: DataStructure | null;

	constructor(operation: string, startSnapshot: DataStructure) {
		this.operation = operation;
		this.startSnapshot = startSnapshot;
		this.steps = [new StepData(0, StepType.Start, { action: 'Start' })];
		this.endSnapshot = null;
	}

	step(step: StepData) {
		step.id = this.steps.length;
		this.steps.push(step);
	}

	end(endSnapshot: DataStructure) {
		this.step(new StepData(this.steps.length, StepType.End, { action: 'End' }));
		this.endSnapshot = endSnapshot;
	}
}

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

export class StepData {
	id: number = 0;
	type: StepType;
	data: object = {};

	constructor(id: number, type: StepType, data: object) {
		this.id = id;
		this.type = type;
		this.data = data;
	}
}

export class BSTreeSteps {
	static CreateRoot(nodeId: number, value: number): StepData {
		return new StepData(0, StepType.CreateRoot, {
			nodeId: nodeId,
			value: value,
			action: `Create root node ${nodeId} with value ${value}`,
		});
	}

	static CreateLeaf(nodeId: number, value: number, parentId: number, direction: 'left' | 'right'): StepData {
		return new StepData(0, StepType.CreateLeaf, {
			nodeId: nodeId,
			value: value,
			parentId: parentId,
			direction: direction,
			action: `Create leaf node ${nodeId} with value ${value} as ${direction} child of ${parentId}`,
		});
	}

	static Compare(value: number, comparisonId: number, comparisonValue: number): StepData {
		let result = value < comparisonValue ? 'less' : value > comparisonValue ? 'greater' : 'equal';
		return new StepData(0, StepType.Compare, {
			value: value,
			comparisonId: comparisonId,
			comparisonValue: comparisonValue,
			result: result,
			action: `Compare value ${value} with node ${comparisonId}'s ${comparisonValue}, which is ${result}`,
		});
	}

	static Traverse(fromId: number, toId: number, direction: 'left' | 'right'): StepData {
		return new StepData(0, StepType.Traverse, {
			fromId: fromId,
			toId: toId,
			direction: direction,
			action: `Traverse ${direction} from node ${fromId} to node ${toId}`,
		});
	}

	static Drop(value: number, reason: string, fromId: string): StepData {
		return new StepData(0, StepType.Drop, {
			value: value,
			reason: reason,
			fromId: fromId,
			action: `Drop value ${value} from node ${fromId} due to ${reason}`,
		});
	}

	static Found(nodeId: number, value: number): StepData {
		return new StepData(0, StepType.Found, {
			nodeId: nodeId,
			value: value,
			action: `Found value ${value} at node ${nodeId}`,
		});
	}

	static MarkToDelete(nodeId: number, value: number): StepData {
		return new StepData(0, StepType.MarkToDelete, {
			nodeId: nodeId,
			value: value,
			action: `Mark node ${nodeId} with value ${value} for deletion`,
		});
	}

	static Delete(nodeId: number, value: number): StepData {
		return new StepData(0, StepType.Delete, {
			nodeId: nodeId,
			value: value,
			action: `Delete node ${nodeId} with value ${value}`,
		});
	}

	static ReplaceWithChild(oldNodeId: number, newNodeId: number, newValue: number, direction: 'left' | 'right'): StepData {
		return new StepData(0, StepType.ReplaceWithChild, {
			oldNodeId: oldNodeId,
			newNodeId: newNodeId,
			newValue: newValue,
			direction: direction,
			action: `Replace node ${oldNodeId} with ${direction} child ${newNodeId} having value ${newValue}`,
		});
	}

	static ReplaceWithInorderSuccessor(oldNodeId: number, successorNodeId: number, successorValue: number): StepData {
		return new StepData(0, StepType.ReplaceWithInorderSuccessor, {
			oldNodeId: oldNodeId,
			successorNodeId: successorNodeId,
			successorValue: successorValue,
			action: `Replace node ${oldNodeId} with inorder successor ${successorNodeId} having value ${successorValue}`,
		});
	}

	static RelinkSuccessorChild(childNodeId: number, childValue: number, newParentNodeId: number, newParentValue: number): StepData {
		return new StepData(0, StepType.RelinkSuccessorChild, {
			childNodeId: childNodeId,
			childValue: childValue,
			parentNodeId: newParentNodeId,
			parentValue: newParentValue,
			action: `Relink child node ${childNodeId} with value ${childValue} from successor to parent node ${newParentNodeId} with value ${newParentValue}`,
		});
	}

	static FoundInorderSuccessor(nodeId: number, successorId: number, successorValue: number): StepData {
		return new StepData(0, StepType.FoundInorderSuccessor, {
			nodeId: nodeId,
			successorId: successorId,
			successorValue: successorValue,
			action: `Found inorder successor of node ${nodeId} as ${successorId} with value ${successorValue}`,
		});
	}
}
