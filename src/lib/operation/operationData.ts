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
	Delete,
	Replace,
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

	static Delete(nodeId: number, value: number): StepData {
		return new StepData(0, {
			type: StepType.Delete,
			nodeId: nodeId,
			value: value,
			action: `Delete node ${nodeId} with value ${value}`,
		});
	}

	static Replace(oldNodeId: number, newNodeId: number, newValue: number): StepData {
		return new StepData(0, {
			type: StepType.Replace,
			oldNodeId: oldNodeId,
			newNodeId: newNodeId,
			newValue: newValue,
			action: `Replace node ${oldNodeId} with node ${newNodeId} and value ${newValue}`,
		});
	}
}
