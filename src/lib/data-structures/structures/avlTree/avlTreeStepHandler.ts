import type { StepData } from '$lib/data-structures/operation/operationData';
import type { OperationManager } from '$lib/data-structures/operation/operationManager';
import { Step } from '$lib/data-structures/operation/stepData';
import type { AVLTree } from '$lib/data-structures/structures/avlTree/avlTree';
import type { AVLTreeAnimator } from '$lib/data-structures/structures/avlTree/avlTreeAnimator';
import { StepType, type StepTypeValue } from '$lib/data-structures/structures/dataStructure';
import type { DataStructureAnimator } from '$lib/data-structures/visual/animators/dataStructureAnimator';
import { StepHandlerBase } from '$lib/data-structures/visual/orchestrators/stepHandlerBase';
import * as Common from '$lib/data-structures/visual/orchestrators/treeStepHandlersCommon';

import type { AVLTreeAnnotator } from './avlTreeAnnotator';

async function handleRotateLeftForward(animator: AVLTreeAnimator, annotator: AVLTreeAnnotator, data: Step.AVLTree.RotateLeftData) {
	annotator.annotateNode(`Rotate left at root ${data.oldRootId}`, data.newRootId);
	await animator.ensureAndAnimate(data.endSnapshot! as AVLTree);
}

async function handleRotateLeftBackward(animator: AVLTreeAnimator, annotator: AVLTreeAnnotator, data: Step.AVLTree.RotateLeftData) {
	annotator.annotateNode(`Rotate left at root ${data.oldRootId}`, data.newRootId);
	await animator.ensureAndAnimate(data.startSnapshot! as AVLTree);
}

async function handleRotateRightForward(animator: AVLTreeAnimator, annotator: AVLTreeAnnotator, data: Step.AVLTree.RotateRightData) {
	annotator.annotateNode(`Rotate right at root ${data.oldRootId}`, data.newRootId);
	await animator.ensureAndAnimate(data.endSnapshot! as AVLTree);
}

async function handleRotateRightBackward(animator: AVLTreeAnimator, annotator: AVLTreeAnnotator, data: Step.AVLTree.RotateRightData) {
	annotator.annotateNode(`Rotate right at root ${data.oldRootId}`, data.newRootId);
	await animator.ensureAndAnimate(data.startSnapshot! as AVLTree);
}

async function handleUpdateHeightBalanceForward(
	animator: AVLTreeAnimator,
	annotator: AVLTreeAnnotator,
	data: Step.AVLTree.UpdateHeightBalanceData,
) {
	annotator.annotateNode(`Check height and balance`, data.nodeId);
	annotator.highlightNodeHeightBalance(data.nodeId);
	animator.ensure(data.endSnapshot);
}

async function handleUpdateHeightBalanceBackward(
	animator: AVLTreeAnimator,
	annotator: AVLTreeAnnotator,
	data: Step.AVLTree.UpdateHeightBalanceData,
) {
	annotator.annotateNode(`Check height and balance`, data.nodeId);
	annotator.highlightNodeHeightBalance(data.nodeId);
	animator.ensure(data.startSnapshot);
}

export class AVLTreeStepHandler extends StepHandlerBase {
	async stepSetup(currentStep: StepData, baseAnimator: DataStructureAnimator, baseAnnotator: AVLTreeAnnotator, isForward: boolean) {
		let animator = baseAnimator as AVLTreeAnimator;
		if (isForward && currentStep.startSnapshot) {
			await animator.ensureAndAnimate(currentStep.startSnapshot);
		}
		if (!isForward && currentStep.endSnapshot) {
			await animator.ensureAndAnimate(currentStep.endSnapshot);
		}
	}

	async stepCleanup(currentStep: StepData, baseAnimator: DataStructureAnimator, baseAnnotator: AVLTreeAnnotator, isForward: boolean) {
		let animator = baseAnimator as AVLTreeAnimator;

		if (isForward && currentStep.endSnapshot) {
			await animator.ensureAndAnimate(currentStep.endSnapshot);
		}
		if (!isForward && currentStep.startSnapshot) {
			await animator.ensureAndAnimate(currentStep.startSnapshot);
		}
	}

	async stepRoute(
		currentStep: StepData,
		baseAnimator: DataStructureAnimator,
		baseAnnotator: AVLTreeAnnotator,
		operationManager: OperationManager,
		isForward: boolean = true,
	) {
		let animator = baseAnimator as AVLTreeAnimator;
		let annotator = baseAnnotator as AVLTreeAnnotator;

		switch (currentStep.type as StepTypeValue) {
			case StepType.AVLTree.Start:
				if (isForward) await Common.handleStartForwardCommon(animator, annotator, operationManager);
				else await Common.handleStartBackwardCommon(animator, annotator, operationManager);
				break;
			case StepType.AVLTree.End:
				if (isForward) await Common.handleEndForwardCommon(animator, annotator, operationManager);
				else await Common.handleEndBackwardCommon(animator, annotator, operationManager);
				break;
			case StepType.AVLTree.CreateRoot:
				if (isForward) await Common.handleCreateRootForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleCreateRootBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.AVLTree.CreateLeaf:
				if (isForward) await Common.handleCreateLeafForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleCreateLeafBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.AVLTree.Compare:
				if (isForward) await Common.handleCompareForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleCompareBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.AVLTree.Traverse:
				if (isForward) await Common.handleTraverseForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleTraverseBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.AVLTree.Drop:
				if (isForward) await Common.handleDropForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleDropBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.AVLTree.Found:
				if (isForward) await Common.handleFoundForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleFoundBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.AVLTree.MarkToDelete:
				if (isForward) await Common.handleMarkToDeleteForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleMarkToDeleteBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.AVLTree.Delete:
				if (isForward) await Common.handleDeleteForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleDeleteBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.AVLTree.ReplaceWithChild:
				if (isForward) await Common.handleReplaceWithChildForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleReplaceWithChildBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.AVLTree.FoundInorderSuccessor:
				if (isForward) await Common.handleFoundInorderSuccessorForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleFoundInorderSuccessorBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.AVLTree.RelinkSuccessorChild:
				if (isForward) await Common.handleRelinkSuccessorChildForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleRelinkSuccessorChildBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.AVLTree.ReplaceWithInorderSuccessor:
				if (isForward) await Common.handleReplaceWithInorderSuccessorForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleReplaceWithInorderSuccessorBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.AVLTree.RotateLeft:
				if (isForward) await handleRotateLeftForward(animator, annotator, currentStep.data as any);
				else await handleRotateLeftBackward(animator, annotator, currentStep.data as any);
				break;
			case StepType.AVLTree.RotateRight:
				if (isForward) await handleRotateRightForward(animator, annotator, currentStep.data as any);
				else await handleRotateRightBackward(animator, annotator, currentStep.data as any);
				break;
			case StepType.AVLTree.UpdateHeightBalance:
				if (isForward) await handleUpdateHeightBalanceForward(animator, annotator, currentStep.data as any);
				else await handleUpdateHeightBalanceBackward(animator, annotator, currentStep.data as any);
				break;
			case StepType.AVLTree.CaseAnalysis:
				if (isForward) await Common.handleCaseAnalysisForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleCaseAnalysisBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			default:
				console.warn('Unhandled AVL Tree step type:', currentStep.type);
		}
	}
}
