import { DataStructure, StepType } from '$lib/structures/dataStructure';
import { StepData } from './operationData';

export namespace Step {
	export class StepDetail {
		constructor(public action: string) {}
	}

	export class StartData extends StepDetail {
		constructor() {
			super('Start');
		}
	}

	export function Start(): StepData {
		return StepData.new('Start', new StartData());
	}

	export class EndData extends StepDetail {
		constructor() {
			super('End');
		}
	}

	export function End(): StepData {
		return StepData.new('End', new EndData());
	}

	export namespace BSTree {
		export class CreateRootData extends StepDetail {
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

		export class CreateLeafData extends StepDetail {
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

		export class CompareData extends StepDetail {
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

		export class TraverseData extends StepDetail {
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

		export class DropData extends StepDetail {
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

		export class FoundData extends StepDetail {
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

		export class MarkToDeleteData extends StepDetail {
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

		export class DeleteData extends StepDetail {
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

		export class ReplaceWithChildData extends StepDetail {
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

		export class ReplaceWithInorderSuccessorData extends StepDetail {
			constructor(
				public oldNodeId: number,
				public successorNodeId: number,
				public successorValue: number,
				public successorParentId: number,
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
			successorParentId: number,
			startSnapshot: DataStructure,
			endSnapshot: DataStructure,
		): StepData {
			return new StepData(
				0,
				StepType.BSTree.ReplaceWithInorderSuccessor,
				new ReplaceWithInorderSuccessorData(oldNodeId, successorNodeId, successorValue, successorParentId, startSnapshot, endSnapshot),
			);
		}

		export class RelinkSuccessorChildData extends StepDetail {
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

		export class FoundInorderSuccessorData extends StepDetail {
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
