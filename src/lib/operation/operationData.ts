import { DataStructure } from '$lib/structures/dataStructure';

export class OperationData {
	operation: string;

	startSnapshot: DataStructure;
	steps: StepData[];
	endSnapshot: DataStructure | null;

	constructor(operation: string, startSnapshot: DataStructure) {
		this.operation = operation;
		this.startSnapshot = startSnapshot;
		this.steps = [new StepData(0, { type: StepType.Start, action: 'Start' })];
		this.endSnapshot = null;
	}

	step(step: StepData) {
		step.id = this.steps.length;
		this.steps.push(step);
	}

	end(endSnapshot: DataStructure) {
		this.step(new StepData(this.steps.length, { type: StepType.End, action: 'End' }));
		this.endSnapshot = endSnapshot;
	}
}

export enum StepType {
	Start,
	End,
	CreateRoot,
	CreateLeaf,
	Compare,
	Traverse,
	Drop,
	Found,
	MarkToDelete,
	Delete,
	ReplaceWithChild,
	FoundInorderSuccessor,
	RelinkSuccessorChild,
	ReplaceWithInorderSuccessor,
}

export class StepData {
	id: number = 0;
	data: object = {};

	constructor(id: number, data: object) {
		this.id = id;
		this.data = data;
	}
}

export class BSTreeSteps {
	static CreateRoot(nodeId: number, value: number): StepData {
		return new StepData(0, {
			type: StepType.CreateRoot,
			nodeId: nodeId,
			value: value,
			action: `Create root node ${nodeId} with value ${value}`,
		});
	}

	static CreateLeaf(nodeId: number, value: number, parentId: number, direction: 'left' | 'right'): StepData {
		return new StepData(0, {
			type: StepType.CreateLeaf,
			nodeId: nodeId,
			value: value,
			parentId: parentId,
			direction: direction,
			action: `Create leaf node ${nodeId} with value ${value} as ${direction} child of ${parentId}`,
		});
	}

	static Compare(value: number, comparisonId: number, comparisonValue: number): StepData {
		let result = value < comparisonValue ? 'less' : value > comparisonValue ? 'greater' : 'equal';
		return new StepData(0, {
			type: StepType.Compare,
			value: value,
			comparisonId: comparisonId,
			comparisonValue: comparisonValue,
			result: result,
			action: `Compare value ${value} with node ${comparisonId}'s ${comparisonValue}, which is ${result}`,
		});
	}

	static Traverse(fromId: number, toId: number, direction: 'left' | 'right'): StepData {
		return new StepData(0, {
			type: StepType.Traverse,
			fromId: fromId,
			toId: toId,
			direction: direction,
			action: `Traverse ${direction} from node ${fromId} to node ${toId}`,
		});
	}

	static Drop(value: number, reason: string): StepData {
		return new StepData(0, {
			type: StepType.Drop,
			value: value,
			reason: reason,
			action: `Drop value ${value} due to ${reason}`,
		});
	}

	static Found(nodeId: number, value: number): StepData {
		return new StepData(0, {
			type: StepType.Found,
			nodeId: nodeId,
			value: value,
			action: `Found value ${value} at node ${nodeId}`,
		});
	}

	static MarkToDelete(nodeId: number, value: number): StepData {
		return new StepData(0, {
			type: StepType.MarkToDelete,
			nodeId: nodeId,
			value: value,
			action: `Mark node ${nodeId} with value ${value} for deletion`,
		});
	}

	static Delete(nodeId: number, value: number): StepData {
		return new StepData(0, {
			type: StepType.Delete,
			nodeId: nodeId,
			value: value,
			action: `Delete node ${nodeId} with value ${value}`,
		});
	}

	static ReplaceWithChild(oldNodeId: number, newNodeId: number, newValue: number, direction: 'left' | 'right'): StepData {
		return new StepData(0, {
			type: StepType.ReplaceWithChild,
			oldNodeId: oldNodeId,
			newNodeId: newNodeId,
			newValue: newValue,
			direction: direction,
			action: `Replace node ${oldNodeId} with ${direction} child ${newNodeId} having value ${newValue}`,
		});
	}

	static ReplaceWithInorderSuccessor(oldNodeId: number, successorNodeId: number, successorValue: number): StepData {
		return new StepData(0, {
			type: StepType.ReplaceWithInorderSuccessor,
			oldNodeId: oldNodeId,
			successorNodeId: successorNodeId,
			successorValue: successorValue,
			action: `Replace node ${oldNodeId} with inorder successor ${successorNodeId} having value ${successorValue}`,
		});
	}

	static RelinkSuccessorChild(childNodeId: number, childValue: number, newParentNodeId: number, newParentValue: number): StepData {
		return new StepData(0, {
			type: StepType.RelinkSuccessorChild,
			childNodeId: childNodeId,
			childValue: childValue,
			parentNodeId: newParentNodeId,
			parentValue: newParentValue,
			action: `Relink child node ${childNodeId} with value ${childValue} from successor to parent node ${newParentNodeId} with value ${newParentValue}`,
		});
	}

	static FoundInorderSuccessor(nodeId: number, successorId: number, successorValue: number): StepData {
		return new StepData(0, {
			type: StepType.FoundInorderSuccessor,
			nodeId: nodeId,
			successorId: successorId,
			successorValue: successorValue,
			action: `Found inorder successor of node ${nodeId} as ${successorId} with value ${successorValue}`,
		});
	}
}
