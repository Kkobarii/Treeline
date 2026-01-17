import type { StepData } from '$lib/data-structures/operation/operationData';
import type { OperationManager } from '$lib/data-structures/operation/operationManager';
import type { BTreeAnimator } from '$lib/data-structures/structures/bTree/bTreeAnimator';
import { StepType, type StepTypeValue } from '$lib/data-structures/structures/dataStructure';
import type { DataStructureAnimator } from '$lib/data-structures/visual/animators/dataStructureAnimator';
import type { DataStructureAnnotator } from '$lib/data-structures/visual/annotators/dataStructureAnnotator';
import { StepHandlerBase } from '$lib/data-structures/visual/orchestrators/stepHandlerBase';
import * as Common from '$lib/data-structures/visual/orchestrators/treeStepHandlersCommon';

export class BTreeStepHandler extends StepHandlerBase {
	async stepSetup(currentStep: StepData, baseAnimator: DataStructureAnimator, baseAnnotator: DataStructureAnnotator, isForward: boolean) {
		let animator = baseAnimator as BTreeAnimator;
		if (isForward && currentStep.startSnapshot) {
			console.log('setup forward');
			animator.ensure(currentStep.startSnapshot);
		}
		if (!isForward && currentStep.endSnapshot) {
			console.log('setup backward');
			animator.ensure(currentStep.endSnapshot);
		}
	}

	async stepCleanup(
		currentStep: StepData,
		baseAnimator: DataStructureAnimator,
		baseAnnotator: DataStructureAnnotator,
		isForward: boolean,
	) {
		let animator = baseAnimator as BTreeAnimator;

		if (isForward && currentStep.endSnapshot) {
			console.log('cleanup forward');
			animator.ensure(currentStep.endSnapshot);
		}
		if (!isForward && currentStep.startSnapshot) {
			console.log('cleanup backward');
			animator.ensure(currentStep.startSnapshot);
		}
	}

	async stepRoute(
		currentStep: StepData,
		baseAnimator: DataStructureAnimator,
		baseAnnotator: DataStructureAnnotator,
		operationManager: OperationManager,
		isForward: boolean = true,
	) {
		let animator = baseAnimator as BTreeAnimator;
		let annotator = baseAnnotator as DataStructureAnnotator;

		switch (currentStep.type as StepTypeValue) {
			case StepType.BTree.Start:
				if (isForward) await Common.handleStartForwardCommon(animator, annotator, operationManager);
				else await Common.handleStartBackwardCommon(animator, annotator, operationManager);
				break;
			case StepType.BTree.End:
				if (isForward) await Common.handleEndForwardCommon(animator, annotator, operationManager);
				else await Common.handleEndBackwardCommon(animator, annotator, operationManager);
				break;
			case StepType.BTree.CreateRoot:
				if (isForward) await Common.handleCreateRootForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleCreateRootBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.BTree.CreateLeaf:
				if (isForward) await Common.handleCreateLeafForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleCreateLeafBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.BTree.Compare:
				if (isForward) await Common.handleCompareForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleCompareBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.BTree.Traverse:
				if (isForward) await Common.handleTraverseForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleTraverseBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.BTree.Drop:
				if (isForward) await Common.handleDropForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleDropBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.BTree.Found:
				if (isForward) await Common.handleFoundForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleFoundBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.BTree.MarkToDelete:
				if (isForward) await Common.handleMarkToDeleteForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleMarkToDeleteBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.BTree.Delete:
				if (isForward) await Common.handleDeleteForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleDeleteBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.BTree.ReplaceWithChild:
				if (isForward) await Common.handleReplaceWithChildForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleReplaceWithChildBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.BTree.FoundInorderSuccessor:
				if (isForward) await Common.handleFoundInorderSuccessorForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleFoundInorderSuccessorBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.BTree.RelinkSuccessorChild:
				if (isForward) await Common.handleRelinkSuccessorChildForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleRelinkSuccessorChildBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.BTree.ReplaceWithInorderSuccessor:
				if (isForward) await Common.handleReplaceWithInorderSuccessorForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleReplaceWithInorderSuccessorBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.BTree.CaseAnalysis:
				if (isForward) await Common.handleCaseAnalysisForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleCaseAnalysisBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.BTree.MarkOverfull:
				if (isForward) await this.handleMarkOverfullForward(animator, annotator, currentStep.data as any);
				else await this.handleMarkOverfullBackward(animator, annotator, currentStep.data as any);
				break;
			case StepType.BTree.Split:
				if (isForward) await this.handleSplitForward(animator, annotator, currentStep.data as any);
				else await this.handleSplitBackward(animator, annotator, currentStep.data as any);
				break;
			case StepType.BTree.PromoteMiddle:
				if (isForward) await this.handlePromoteMiddleForward(animator, annotator, currentStep.data as any);
				else await this.handlePromoteMiddleBackward(animator, annotator, currentStep.data as any);
				break;
			case StepType.BTree.ChooseBranch:
				if (isForward) await this.handleChooseBranchForward(animator, annotator, currentStep.data as any);
				else await this.handleChooseBranchBackward(animator, annotator, currentStep.data as any);
				break;
			case StepType.BTree.InsertValue:
				if (isForward) await this.handleInsertValueForward(animator, annotator, currentStep.data as any);
				else await this.handleInsertValueBackward(animator, annotator, currentStep.data as any);
				break;
			case StepType.BTree.RemoveValue:
				if (isForward) await this.handleRemoveValueForward(animator, annotator, currentStep.data as any);
				else await this.handleRemoveValueBackward(animator, annotator, currentStep.data as any);
				break;
			case StepType.BTree.ReplaceValue:
				if (isForward) await this.handleReplaceValueForward(animator, annotator, currentStep.data as any);
				else await this.handleReplaceValueBackward(animator, annotator, currentStep.data as any);
				break;
			case StepType.BTree.BorrowFromLeft:
				if (isForward) await this.handleBorrowFromLeftForward(animator, annotator, currentStep.data as any);
				else await this.handleBorrowFromLeftBackward(animator, annotator, currentStep.data as any);
				break;
			case StepType.BTree.BorrowFromRight:
				if (isForward) await this.handleBorrowFromRightForward(animator, annotator, currentStep.data as any);
				else await this.handleBorrowFromRightBackward(animator, annotator, currentStep.data as any);
				break;
			case StepType.BTree.MergeChildren:
				if (isForward) await this.handleMergeChildrenForward(animator, annotator, currentStep.data as any);
				else await this.handleMergeChildrenBackward(animator, annotator, currentStep.data as any);
				break;
			case StepType.BTree.FindInorderReplacement:
				if (isForward) await this.handleFindInorderReplacementForward(animator, annotator, currentStep.data as any);
				else await this.handleFindInorderReplacementBackward(animator, annotator, currentStep.data as any);
				break;
			default:
				console.warn('Unhandled BTree step type:', currentStep.type);
		}
	}

	async handleMarkOverfullForward(animator: BTreeAnimator, annotator: DataStructureAnnotator, data: any) {
		const { nodeId } = data;
		// Color the overfull node red to highlight the constraint violation
		animator.setNodeColor(nodeId, '#FF4500');
		annotator.annotateNode(`Overfull: ${data.currentCount}/${data.maxCount}`, nodeId);
	}

	async handleMarkOverfullBackward(animator: BTreeAnimator, annotator: DataStructureAnnotator, data: any) {
		const { nodeId } = data;
		// Restore the original color
		animator.resetNodeColor(nodeId);
		annotator.clearAnnotation();
	}

	async handleSplitForward(animator: BTreeAnimator, annotator: DataStructureAnnotator, data: any) {
		const { nodeId, leftNodeId, rightNodeId, middleValue } = data;
		// Animate the split: ensure end snapshot is applied
		animator.ensure(data.endSnapshot);
		// Annotate the split operation
		annotator.annotateNode(`Split: ${middleValue} moved up`, nodeId);
	}

	async handleSplitBackward(animator: BTreeAnimator, annotator: DataStructureAnnotator, data: any) {
		const { nodeId } = data;
		// Restore to before the split
		animator.ensure(data.startSnapshot);
		annotator.clearAnnotation();
	}

	async handlePromoteMiddleForward(animator: BTreeAnimator, annotator: DataStructureAnnotator, data: any) {
		const { middleValue, targetNodeId, isNewRoot } = data;
		// Animate to the promotion result
		animator.ensure(data.endSnapshot);
		const msg = isNewRoot ? `${middleValue} becomes new root` : `${middleValue} promoted to parent`;
		annotator.annotateNode(msg, targetNodeId);
	}

	async handlePromoteMiddleBackward(animator: BTreeAnimator, annotator: DataStructureAnnotator, data: any) {
		// Restore to before the promotion
		animator.ensure(data.startSnapshot);
		annotator.clearAnnotation();
	}

	async handleChooseBranchForward(animator: BTreeAnimator, annotator: DataStructureAnnotator, data: any) {
		const { nodeId, value, childIndex, childId, lowerBound, upperBound } = data;
		// Highlight the edge to the child we're going to traverse to
		animator.setEdgeStyle(nodeId, childId, '#FF4500', 4);
		// Build the annotation message
		let msg = `Going to child ${childIndex}`;
		if (lowerBound !== null && upperBound !== null) {
			msg += ` (${lowerBound} < ${value} < ${upperBound})`;
		} else if (lowerBound !== null) {
			msg += ` (${value} > ${lowerBound})`;
		} else if (upperBound !== null) {
			msg += ` (${value} < ${upperBound})`;
		}
		annotator.annotateNode(msg, nodeId);
	}

	async handleChooseBranchBackward(animator: BTreeAnimator, annotator: DataStructureAnnotator, data: any) {
		const { nodeId, childId } = data;
		// Restore edge style
		animator.resetEdgeStyle(nodeId, childId);
		annotator.clearAnnotation();
	}

	async handleInsertValueForward(animator: BTreeAnimator, annotator: DataStructureAnnotator, data: any) {
		const { nodeId, value } = data;
		// Apply the end snapshot to show the inserted value
		animator.ensure(data.endSnapshot);
		// Highlight the node where insertion happened
		animator.setNodeColor(nodeId, '#90EE90');
		annotator.annotateNode(`Inserted ${value}`, nodeId);
	}

	async handleInsertValueBackward(animator: BTreeAnimator, annotator: DataStructureAnnotator, data: any) {
		const { nodeId } = data;
		// Restore to before insertion
		animator.ensure(data.startSnapshot);
		animator.resetNodeColor(nodeId);
		annotator.clearAnnotation();
	}

	async handleRemoveValueForward(animator: BTreeAnimator, annotator: DataStructureAnnotator, data: any) {
		const { nodeId, value } = data;
		// Apply the end snapshot to show the removed value
		animator.ensure(data.endSnapshot);
		// Highlight the node where removal happened
		animator.setNodeColor(nodeId, '#FFB6C1');
		annotator.annotateNode(`Removed ${value}`, nodeId);
	}

	async handleRemoveValueBackward(animator: BTreeAnimator, annotator: DataStructureAnnotator, data: any) {
		const { nodeId } = data;
		// Restore to before removal
		animator.ensure(data.startSnapshot);
		animator.resetNodeColor(nodeId);
		annotator.clearAnnotation();
	}

	async handleReplaceValueForward(animator: BTreeAnimator, annotator: DataStructureAnnotator, data: any) {
		const { nodeId, oldValue, newValue, replacementSource } = data;
		// Apply the end snapshot to show the replaced value
		animator.ensure(data.endSnapshot);
		// Highlight the node where replacement happened
		animator.setNodeColor(nodeId, '#FFD700');
		annotator.annotateNode(`Replaced ${oldValue} with ${newValue} (${replacementSource})`, nodeId);
	}

	async handleReplaceValueBackward(animator: BTreeAnimator, annotator: DataStructureAnnotator, data: any) {
		const { nodeId } = data;
		// Restore to before replacement
		animator.ensure(data.startSnapshot);
		animator.resetNodeColor(nodeId);
		annotator.clearAnnotation();
	}

	async handleBorrowFromLeftForward(animator: BTreeAnimator, annotator: DataStructureAnnotator, data: any) {
		const { childId, siblingId, borrowedValue, parentValue } = data;
		// Apply the end snapshot to show the borrowed value
		animator.ensure(data.endSnapshot);
		// Highlight both nodes involved in the borrow
		animator.setNodeColor(childId, '#87CEEB');
		animator.setNodeColor(siblingId, '#FFA07A');
		annotator.annotateNode(`Borrowed ${borrowedValue} from left sibling`, childId);
	}

	async handleBorrowFromLeftBackward(animator: BTreeAnimator, annotator: DataStructureAnnotator, data: any) {
		const { childId, siblingId } = data;
		// Restore to before borrow
		animator.ensure(data.startSnapshot);
		animator.resetNodeColor(childId);
		animator.resetNodeColor(siblingId);
		annotator.clearAnnotation();
	}

	async handleBorrowFromRightForward(animator: BTreeAnimator, annotator: DataStructureAnnotator, data: any) {
		const { childId, siblingId, borrowedValue, parentValue } = data;
		// Apply the end snapshot to show the borrowed value
		animator.ensure(data.endSnapshot);
		// Highlight both nodes involved in the borrow
		animator.setNodeColor(childId, '#87CEEB');
		animator.setNodeColor(siblingId, '#FFA07A');
		annotator.annotateNode(`Borrowed ${borrowedValue} from right sibling`, childId);
	}

	async handleBorrowFromRightBackward(animator: BTreeAnimator, annotator: DataStructureAnnotator, data: any) {
		const { childId, siblingId } = data;
		// Restore to before borrow
		animator.ensure(data.startSnapshot);
		animator.resetNodeColor(childId);
		animator.resetNodeColor(siblingId);
		annotator.clearAnnotation();
	}

	async handleMergeChildrenForward(animator: BTreeAnimator, annotator: DataStructureAnnotator, data: any) {
		const { leftChildId, rightChildId, parentValue } = data;
		// Apply the end snapshot to show the merged node
		animator.ensure(data.endSnapshot);
		// Highlight the merged node
		animator.setNodeColor(leftChildId, '#DDA0DD');
		annotator.annotateNode(`Merged with sibling (parent value: ${parentValue})`, leftChildId);
	}

	async handleMergeChildrenBackward(animator: BTreeAnimator, annotator: DataStructureAnnotator, data: any) {
		const { leftChildId } = data;
		// Restore to before merge
		animator.ensure(data.startSnapshot);
		animator.resetNodeColor(leftChildId);
		annotator.clearAnnotation();
	}

	async handleFindInorderReplacementForward(animator: BTreeAnimator, annotator: DataStructureAnnotator, data: any) {
		const { nodeId, childId, replacementValue, replacementType } = data;
		// Highlight the child node where the replacement value was found
		animator.setNodeColor(childId, '#98FB98');
		const typeText = replacementType === 'predecessor' ? 'predecessor' : 'successor';
		annotator.annotateNode(`Found ${typeText}: ${replacementValue}`, childId);
	}

	async handleFindInorderReplacementBackward(animator: BTreeAnimator, annotator: DataStructureAnnotator, data: any) {
		const { childId } = data;
		animator.resetNodeColor(childId);
		annotator.clearAnnotation();
	}
}
