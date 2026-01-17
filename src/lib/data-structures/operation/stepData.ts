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

		export class CaseAnalysisData extends StepDetail {
			constructor(
				public caseNumber: number,
				public description: string,
				public nodeId?: number,
			) {
				super(`Case ${caseNumber}: ${description}`);
			}
		}

		export function CaseAnalysis(caseNumber: number, description: string, nodeId?: number): StepData {
			return StepData.new(StepType.BSTree.CaseAnalysis, new CaseAnalysisData(caseNumber, description, nodeId));
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

	export namespace RBTree {
		// Red-Black tree specific step details
		export class ColorNodeData extends StepDetail {
			constructor(
				public nodeId: number,
				public color: 'red' | 'black',
				public startSnapshot: DataStructure,
				public endSnapshot: DataStructure,
			) {
				super(`Color node ${nodeId} ${color}`);
			}
		}

		export function ColorNode(
			nodeId: number,
			color: 'red' | 'black',
			startSnapshot: DataStructure,
			endSnapshot: DataStructure,
		): StepData {
			return StepData.new(StepType.RBTree.ColorNode, new ColorNodeData(nodeId, color, startSnapshot, endSnapshot));
		}

		export class RotateLeftData extends StepDetail {
			constructor(
				public oldRootId: number,
				public newRootId: number,
				public adoptedChildId: number | null,
				public startSnapshot: DataStructure,
				public endSnapshot: DataStructure,
			) {
				super(`RB Rotate left at root ${oldRootId}, new root ${newRootId}`);
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
				StepType.RBTree.RotateLeft,
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
				super(`RB Rotate right at root ${oldRootId}, new root ${newRootId}`);
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
				StepType.RBTree.RotateRight,
				new RotateRightData(oldRootId, newRootId, adoptedChildId, startSnapshot, endSnapshot),
			);
		}

		export class FixupData extends StepDetail {
			constructor(
				public nodeId: number,
				public reason: string,
			) {
				super(`Fixup at node ${nodeId}: ${reason}`);
			}
		}

		export function Fixup(nodeId: number, reason: string): StepData {
			return StepData.new(StepType.RBTree.Fixup, new FixupData(nodeId, reason));
		}
	}

	export namespace BTree {
		// B-Tree specific step details
		export class MarkOverfullData extends StepDetail {
			constructor(
				public nodeId: number,
				public currentCount: number,
				public maxCount: number,
				public startSnapshot: DataStructure,
				public endSnapshot: DataStructure,
			) {
				super(`Node ${nodeId} is overfull: ${currentCount} values (max ${maxCount})`);
			}
		}

		export function MarkOverfull(
			nodeId: number,
			currentCount: number,
			maxCount: number,
			startSnapshot: DataStructure,
			endSnapshot: DataStructure,
		): StepData {
			return StepData.new(
				StepType.BTree.MarkOverfull,
				new MarkOverfullData(nodeId, currentCount, maxCount, startSnapshot, endSnapshot),
			);
		}

		export class SplitData extends StepDetail {
			constructor(
				public nodeId: number,
				public middleValue: number,
				public leftNodeId: number,
				public rightNodeId: number,
				public startSnapshot: DataStructure,
				public endSnapshot: DataStructure,
			) {
				super(`Split node ${nodeId}: move ${middleValue} up (left: ${leftNodeId}, right: ${rightNodeId})`);
			}
		}

		export function Split(
			nodeId: number,
			middleValue: number,
			leftNodeId: number,
			rightNodeId: number,
			startSnapshot: DataStructure,
			endSnapshot: DataStructure,
		): StepData {
			return StepData.new(
				StepType.BTree.Split,
				new SplitData(nodeId, middleValue, leftNodeId, rightNodeId, startSnapshot, endSnapshot),
			);
		}

		export class PromoteMiddleData extends StepDetail {
			constructor(
				public middleValue: number,
				public targetNodeId: number,
				public isNewRoot: boolean,
				public startSnapshot: DataStructure,
				public endSnapshot: DataStructure,
			) {
				const msg = isNewRoot ? `Promote ${middleValue} as new root` : `Promote ${middleValue} into parent (${targetNodeId})`;
				super(msg);
			}
		}

		export function PromoteMiddle(
			middleValue: number,
			targetNodeId: number,
			isNewRoot: boolean,
			startSnapshot: DataStructure,
			endSnapshot: DataStructure,
		): StepData {
			return StepData.new(
				StepType.BTree.PromoteMiddle,
				new PromoteMiddleData(middleValue, targetNodeId, isNewRoot, startSnapshot, endSnapshot),
			);
		}

		export class ChooseBranchData extends StepDetail {
			constructor(
				public nodeId: number,
				public value: number,
				public childIndex: number,
				public childId: number,
				public lowerBound: number | null,
				public upperBound: number | null,
			) {
				let msg = `Choose child ${childIndex} (node ${childId}) for value ${value}`;
				if (lowerBound !== null && upperBound !== null) {
					msg += ` (between ${lowerBound} and ${upperBound})`;
				} else if (lowerBound !== null) {
					msg += ` (greater than ${lowerBound})`;
				} else if (upperBound !== null) {
					msg += ` (less than ${upperBound})`;
				}
				super(msg);
			}
		}

		export function ChooseBranch(
			nodeId: number,
			value: number,
			childIndex: number,
			childId: number,
			lowerBound: number | null,
			upperBound: number | null,
		): StepData {
			return StepData.new(
				StepType.BTree.ChooseBranch,
				new ChooseBranchData(nodeId, value, childIndex, childId, lowerBound, upperBound),
			);
		}

		export class InsertValueData extends StepDetail {
			constructor(
				public nodeId: number,
				public value: number,
				public startSnapshot: DataStructure,
				public endSnapshot: DataStructure,
			) {
				super(`Insert value ${value} into node ${nodeId}`);
			}
		}

		export function InsertValue(nodeId: number, value: number, startSnapshot: DataStructure, endSnapshot: DataStructure): StepData {
			return StepData.new(StepType.BTree.InsertValue, new InsertValueData(nodeId, value, startSnapshot, endSnapshot));
		}

		export class RemoveValueData extends StepDetail {
			constructor(
				public nodeId: number,
				public value: number,
				public startSnapshot: DataStructure,
				public endSnapshot: DataStructure,
			) {
				super(`Remove value ${value} from node ${nodeId}`);
			}
		}

		export function RemoveValue(nodeId: number, value: number, startSnapshot: DataStructure, endSnapshot: DataStructure): StepData {
			return StepData.new(StepType.BTree.RemoveValue, new RemoveValueData(nodeId, value, startSnapshot, endSnapshot));
		}

		export class ReplaceValueData extends StepDetail {
			constructor(
				public nodeId: number,
				public oldValue: number,
				public newValue: number,
				public replacementSource: string,
				public startSnapshot: DataStructure,
				public endSnapshot: DataStructure,
			) {
				super(`Replace value ${oldValue} with ${newValue} (${replacementSource}) in node ${nodeId}`);
			}
		}

		export function ReplaceValue(
			nodeId: number,
			oldValue: number,
			newValue: number,
			replacementSource: string,
			startSnapshot: DataStructure,
			endSnapshot: DataStructure,
		): StepData {
			return StepData.new(
				StepType.BTree.ReplaceValue,
				new ReplaceValueData(nodeId, oldValue, newValue, replacementSource, startSnapshot, endSnapshot),
			);
		}

		export class BorrowFromLeftData extends StepDetail {
			constructor(
				public childId: number,
				public siblingId: number,
				public borrowedValue: number,
				public parentValue: number,
				public startSnapshot: DataStructure,
				public endSnapshot: DataStructure,
			) {
				super(
					`Borrow value ${borrowedValue} from left sibling ${siblingId} through parent value ${parentValue} to node ${childId}`,
				);
			}
		}

		export function BorrowFromLeft(
			childId: number,
			siblingId: number,
			borrowedValue: number,
			parentValue: number,
			startSnapshot: DataStructure,
			endSnapshot: DataStructure,
		): StepData {
			return StepData.new(
				StepType.BTree.BorrowFromLeft,
				new BorrowFromLeftData(childId, siblingId, borrowedValue, parentValue, startSnapshot, endSnapshot),
			);
		}

		export class BorrowFromRightData extends StepDetail {
			constructor(
				public childId: number,
				public siblingId: number,
				public borrowedValue: number,
				public parentValue: number,
				public startSnapshot: DataStructure,
				public endSnapshot: DataStructure,
			) {
				super(
					`Borrow value ${borrowedValue} from right sibling ${siblingId} through parent value ${parentValue} to node ${childId}`,
				);
			}
		}

		export function BorrowFromRight(
			childId: number,
			siblingId: number,
			borrowedValue: number,
			parentValue: number,
			startSnapshot: DataStructure,
			endSnapshot: DataStructure,
		): StepData {
			return StepData.new(
				StepType.BTree.BorrowFromRight,
				new BorrowFromRightData(childId, siblingId, borrowedValue, parentValue, startSnapshot, endSnapshot),
			);
		}

		export class MergeChildrenData extends StepDetail {
			constructor(
				public leftChildId: number,
				public rightChildId: number,
				public parentValue: number | null,
				public startSnapshot: DataStructure,
				public endSnapshot: DataStructure,
			) {
				super(`Merge node ${leftChildId} and node ${rightChildId} with parent value ${parentValue}`);
			}
		}

		export function MergeChildren(
			leftChildId: number,
			rightChildId: number,
			parentValue: number | null,
			startSnapshot: DataStructure,
			endSnapshot: DataStructure,
		): StepData {
			return StepData.new(
				StepType.BTree.MergeChildren,
				new MergeChildrenData(leftChildId, rightChildId, parentValue, startSnapshot, endSnapshot),
			);
		}

		export class FindInorderReplacementData extends StepDetail {
			constructor(
				public nodeId: number,
				public childId: number,
				public replacementValue: number,
				public replacementType: 'predecessor' | 'successor',
			) {
				const typeText = replacementType === 'predecessor' ? 'predecessor' : 'successor';
				super(`Found ${typeText} value ${replacementValue} in node ${childId} for node ${nodeId}`);
			}
		}

		export function FindInorderReplacement(
			nodeId: number,
			childId: number,
			replacementValue: number,
			replacementType: 'predecessor' | 'successor',
		): StepData {
			return StepData.new(
				StepType.BTree.FindInorderReplacement,
				new FindInorderReplacementData(nodeId, childId, replacementValue, replacementType),
			);
		}
	}
}
