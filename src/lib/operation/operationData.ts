import { DataStructure, StepType } from '$lib/structures/dataStructure';

export class OperationData {
	operation: string;

	startSnapshot: DataStructure;
	steps: StepData[];
	endSnapshot: DataStructure | null;

	constructor(operation: string, startSnapshot: DataStructure) {
		this.operation = operation;
		this.startSnapshot = startSnapshot;
		this.steps = [new StepData(0, 'Start', { action: 'Start' }, startSnapshot, startSnapshot)];
		this.endSnapshot = null;
	}

	step(step: StepData) {
		step.id = this.steps.length;
		this.steps.push(step);
	}

	end(endSnapshot: DataStructure) {
		this.step(new StepData(this.steps.length, 'End', { action: 'End' }, endSnapshot, endSnapshot));
		this.endSnapshot = endSnapshot;
	}
}

export class StepData {
	id: number = 0;
	type: string;
	data: object = {};
	startSnapshot: DataStructure | null = null;
	endSnapshot: DataStructure | null = null;

	constructor(
		id: number,
		type: string,
		data: object,
		startSnapshot: DataStructure | null = null,
		endSnapshot: DataStructure | null = null,
	) {
		this.id = id;
		this.type = type;
		this.data = data;
		this.startSnapshot = startSnapshot;
		this.endSnapshot = endSnapshot;
	}

	static new(type: string, data: object, startSnapshot: DataStructure | null = null, endSnapshot: DataStructure | null = null): StepData {
		return new StepData(0, type, data, startSnapshot, endSnapshot);
	}
}

export namespace Step {
	export class BSTreeStepData {
		constructor(public action: string) {}
	}

	export namespace BSTree {
		export class CreateRootData extends BSTreeStepData {
			constructor(
				public nodeId: number,
				public value: number,
				public startSnapshot: DataStructure,
				public endSnapshot: DataStructure,
			) {
				super(`Create root node ${nodeId} with value ${value}`);
			}
		}

		export function CreateRoot(nodeId: number, value: number, startSnapshot: DataStructure, endSnapshot: DataStructure): StepData {
			return StepData.new(StepType.BSTree.CreateRoot, new CreateRootData(nodeId, value, startSnapshot, endSnapshot));
		}

		export class CreateLeafData extends BSTreeStepData {
			constructor(
				public nodeId: number,
				public value: number,
				public parentId: number,
				public direction: 'left' | 'right',
				public startSnapshot: DataStructure,
				public endSnapshot: DataStructure,
			) {
				super(`Create leaf node ${nodeId} with value ${value} as ${direction} child of ${parentId}`);
			}
		}

		export function CreateLeaf(
			nodeId: number,
			value: number,
			parentId: number,
			direction: 'left' | 'right',
			startSnapshot: DataStructure,
			endSnapshot: DataStructure,
		): StepData {
			return StepData.new(
				StepType.BSTree.CreateLeaf,
				new CreateLeafData(nodeId, value, parentId, direction, startSnapshot, endSnapshot),
			);
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
			return StepData.new(StepType.BSTree.Compare, new CompareData(value, comparisonId, comparisonValue, result));
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
			return StepData.new(StepType.BSTree.Traverse, new TraverseData(fromId, toId, direction));
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
			return StepData.new(StepType.BSTree.Drop, new DropData(value, reason, fromId));
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
			return new StepData(0, StepType.BSTree.Found, new FoundData(nodeId, value));
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
			return new StepData(0, StepType.BSTree.MarkToDelete, new MarkToDeleteData(nodeId, value));
		}

		export class DeleteData extends BSTreeStepData {
			constructor(
				public nodeId: number,
				public value: number,
				public startSnapshot: DataStructure,
				public endSnapshot: DataStructure,
			) {
				super(`Delete node ${nodeId} with value ${value}`);
			}
		}

		export function Delete(nodeId: number, value: number, startSnapshot: DataStructure, endSnapshot: DataStructure): StepData {
			return new StepData(0, StepType.BSTree.Delete, new DeleteData(nodeId, value, startSnapshot, endSnapshot));
		}

		export class ReplaceWithChildData extends BSTreeStepData {
			constructor(
				public oldNodeId: number,
				public newNodeId: number,
				public newValue: number,
				public direction: 'left' | 'right',
				public startSnapshot: DataStructure,
				public endSnapshot: DataStructure,
			) {
				super(`Replace node ${oldNodeId} with its ${direction} child node ${newNodeId} having value ${newValue}`);
			}
		}

		export function ReplaceWithChild(
			oldNodeId: number,
			newNodeId: number,
			newValue: number,
			direction: 'left' | 'right',
			startSnapshot: DataStructure,
			endSnapshot: DataStructure,
		): StepData {
			return new StepData(
				0,
				StepType.BSTree.ReplaceWithChild,
				new ReplaceWithChildData(oldNodeId, newNodeId, newValue, direction, startSnapshot, endSnapshot),
			);
		}

		export class ReplaceWithInorderSuccessorData extends BSTreeStepData {
			constructor(
				public oldNodeId: number,
				public successorNodeId: number,
				public successorValue: number,
				public startSnapshot: DataStructure,
				public endSnapshot: DataStructure,
			) {
				super(`Replace node ${oldNodeId} with its inorder successor node ${successorNodeId} having value ${successorValue}`);
			}
		}

		export function ReplaceWithInorderSuccessor(
			oldNodeId: number,
			successorNodeId: number,
			successorValue: number,
			startSnapshot: DataStructure,
			endSnapshot: DataStructure,
		): StepData {
			return new StepData(
				0,
				StepType.BSTree.ReplaceWithInorderSuccessor,
				new ReplaceWithInorderSuccessorData(oldNodeId, successorNodeId, successorValue, startSnapshot, endSnapshot),
			);
		}

		export class RelinkSuccessorChildData extends BSTreeStepData {
			constructor(
				public childNodeId: number,
				public childValue: number,
				public newParentNodeId: number,
				public newParentValue: number,
				public successorNodeId: number,
				public startSnapshot: DataStructure,
				public endSnapshot: DataStructure,
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
			successorNodeId: number,
			startSnapshot: DataStructure,
			endSnapshot: DataStructure,
		): StepData {
			return new StepData(
				0,
				StepType.BSTree.RelinkSuccessorChild,
				new RelinkSuccessorChildData(
					childNodeId,
					childValue,
					newParentNodeId,
					newParentValue,
					successorNodeId,
					startSnapshot,
					endSnapshot,
				),
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
			return new StepData(
				0,
				StepType.BSTree.FoundInorderSuccessor,
				new FoundInorderSuccessorData(nodeId, successorId, successorValue),
			);
		}
	}
}
