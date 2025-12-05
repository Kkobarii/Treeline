import { DataStructure, StepType } from '$lib/data-structures/structures/dataStructure';

import { StepData } from './operationData';

export namespace Step {
	export class StepDetail {
		constructor(public action: string) {}
	}

	// Start / End
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

	// Shared StepDetail subclasses for common tree operations
	export namespace Common {
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

		export function Compare(value: number, comparisonId: number, comparisonValue: number): StepData {
			return StepData.new(StepType.BSTree.Compare, new CompareData(value, comparisonId, comparisonValue));
		}

		export class CompareData extends StepDetail {
			constructor(
				public value: number,
				public comparisonId: number,
				public comparisonValue: number,
			) {
				super(`Compare value ${value} with node ${comparisonId}'s ${comparisonValue}`);
			}
		}

		export function Traverse(fromId: number, toId: number, direction: 'left' | 'right'): StepData {
			return StepData.new(StepType.BSTree.Traverse, new TraverseData(fromId, toId, direction));
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

		export function Drop(value: number, reason: string, fromId: string): StepData {
			return StepData.new(StepType.BSTree.Drop, new DropData(value, reason, fromId));
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

		export function Found(nodeId: number, value: number): StepData {
			return StepData.new(StepType.BSTree.Found, new FoundData(nodeId, value));
		}

		export class FoundData extends StepDetail {
			constructor(
				public nodeId: number,
				public value: number,
			) {
				super(`Found value ${value} at node ${nodeId}`);
			}
		}

		export function MarkToDelete(nodeId: number, value: number): StepData {
			return StepData.new(StepType.BSTree.MarkToDelete, new MarkToDeleteData(nodeId, value));
		}

		export class MarkToDeleteData extends StepDetail {
			constructor(
				public nodeId: number,
				public value: number,
			) {
				super(`Mark node ${nodeId} with value ${value} to delete`);
			}
		}

		export function Delete(nodeId: number, value: number, startSnapshot: DataStructure, endSnapshot: DataStructure): StepData {
			return StepData.new(StepType.BSTree.Delete, new DeleteData(nodeId, value, startSnapshot, endSnapshot));
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

		export function ReplaceWithChild(
			oldNodeId: number,
			newNodeId: number,
			newValue: number,
			direction: 'left' | 'right',
			startSnapshot: DataStructure,
			endSnapshot: DataStructure,
		): StepData {
			return StepData.new(
				StepType.BSTree.ReplaceWithChild,
				new ReplaceWithChildData(oldNodeId, newNodeId, newValue, direction, startSnapshot, endSnapshot),
			);
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

		export function ReplaceWithInorderSuccessor(
			oldNodeId: number,
			successorNodeId: number,
			successorValue: number,
			successorParentId: number,
			relinkedChildId: number | null,
			startSnapshot: DataStructure,
			endSnapshot: DataStructure,
		): StepData {
			return StepData.new(
				StepType.BSTree.ReplaceWithInorderSuccessor,
				new ReplaceWithInorderSuccessorData(
					oldNodeId,
					successorNodeId,
					successorValue,
					successorParentId,
					relinkedChildId,
					startSnapshot,
					endSnapshot,
				),
			);
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
				super(`Replace node ${oldNodeId} with its inorder successor node ${successorNodeId} having value ${successorValue}`);
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
			successorValue: number,
			startSnapshot: DataStructure,
			endSnapshot: DataStructure,
		): StepData {
			return StepData.new(
				StepType.BSTree.RelinkSuccessorChild,
				new RelinkSuccessorChildData(
					childNodeId,
					childValue,
					newParentNodeId,
					newParentValue,
					successorNodeId,
					successorValue,
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
			return StepData.new(StepType.BSTree.FoundInorderSuccessor, new FoundInorderSuccessorData(nodeId, successorId, successorValue));
		}
	}

	export namespace AVLTree {
		// AVL-specific step details
		export class UpdateHeightBalanceData extends StepDetail {
			constructor(
				public nodeId: number,
				public height: number,
				public balance: number,
				public startSnapshot: DataStructure,
				public endSnapshot: DataStructure,
			) {
				super(`Update height and balance of node ${nodeId} to H:${height}, B:${balance}`);
			}
		}

		export function UpdateHeightBalance(
			nodeId: number,
			height: number,
			balance: number,
			startSnapshot: DataStructure,
			endSnapshot: DataStructure,
		): StepData {
			return StepData.new(
				StepType.AVLTree.UpdateHeightBalance,
				new UpdateHeightBalanceData(nodeId, height, balance, startSnapshot, endSnapshot),
			);
		}

		export class RotateLeftData extends StepDetail {
			constructor(
				public oldRootId: number,
				public newRootId: number,
				public adoptedChildId: number | null,
				public startSnapshot: DataStructure,
				public endSnapshot: DataStructure,
			) {
				super(`Rotate left at root ${oldRootId}, new root ${newRootId}`);
			}
		}

		export function RotateLeft(
			oldRootId: number,
			newRootId: number,
			adoptedChildId: number | null,
			startSnapshot: DataStructure,
			endSnapshot: DataStructure,
		): StepData {
			return StepData.new(
				StepType.AVLTree.RotateLeft,
				new RotateLeftData(oldRootId, newRootId, adoptedChildId, startSnapshot, endSnapshot),
			);
		}

		export class RotateRightData extends StepDetail {
			constructor(
				public oldRootId: number,
				public newRootId: number,
				public adoptedChildId: number | null,
				public startSnapshot: DataStructure,
				public endSnapshot: DataStructure,
			) {
				super(`Rotate right at root ${oldRootId}, new root ${newRootId}`);
			}
		}

		export function RotateRight(
			oldRootId: number,
			newRootId: number,
			adoptedChildId: number | null,
			startSnapshot: DataStructure,
			endSnapshot: DataStructure,
		): StepData {
			return StepData.new(
				StepType.AVLTree.RotateRight,
				new RotateRightData(oldRootId, newRootId, adoptedChildId, startSnapshot, endSnapshot),
			);
		}
	}
}
