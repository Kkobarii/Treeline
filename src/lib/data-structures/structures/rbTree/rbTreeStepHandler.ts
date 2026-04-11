import type { StepData } from '$lib/data-structures/operations/operationData';
import type { OperationManager } from '$lib/data-structures/operations/operationManager';
import { StepType, type StepTypeValue } from '$lib/data-structures/structures/dataStructure';
import type { RBTree } from '$lib/data-structures/structures/rbTree/rbTree';
import type { RBTreeAnimator } from '$lib/data-structures/structures/rbTree/rbTreeAnimator';
import type { ColorNodeData, FixupData, RotateLeftData, RotateRightData } from '$lib/data-structures/structures/rbTree/rbTreeSteps';
import type { DataStructureAnimator } from '$lib/data-structures/visual/animators/dataStructureAnimator';
import type { DataStructureAnnotator } from '$lib/data-structures/visual/annotators/dataStructureAnnotator';
import { StepHandlerBase } from '$lib/data-structures/visual/orchestrators/stepHandlerBase';
import * as Common from '$lib/data-structures/visual/orchestrators/treeStepHandlersCommon';
import { translate as t } from '$lib/i18n';

import type { RBTreeAnnotator } from './rbTreeAnnotator';

async function handleColorNodeForward(animator: RBTreeAnimator, annotator: RBTreeAnnotator, data: ColorNodeData) {
	const info = t(annotator.locale, 'steps.dataStructures.rbTree.colorNodeData', { color: data.color });
	annotator.annotateNode(info, data.nodeId);
	animator.ensure(data.endSnapshot! as RBTree);
}

async function handleColorNodeBackward(animator: RBTreeAnimator, annotator: RBTreeAnnotator, data: ColorNodeData) {
	const info = t(annotator.locale, 'steps.dataStructures.rbTree.colorNodeData', { color: data.color });
	annotator.annotateNode(info, data.nodeId);
	animator.ensure(data.startSnapshot! as RBTree);
}

async function handleRotateLeftForward(animator: RBTreeAnimator, annotator: RBTreeAnnotator, data: RotateLeftData) {
	const info = t(annotator.locale, 'steps.dataStructures.rbTree.rotateLeftData', {
		oldRootId: String(data.oldRootId),
		newRootId: String(data.newRootId),
	});
	annotator.annotateNode(info, data.newRootId);
	await animator.ensureAndAnimate(data.endSnapshot! as RBTree);
}

async function handleRotateLeftBackward(animator: RBTreeAnimator, annotator: RBTreeAnnotator, data: RotateLeftData) {
	const info = t(annotator.locale, 'steps.dataStructures.rbTree.rotateLeftData', {
		oldRootId: String(data.oldRootId),
		newRootId: String(data.newRootId),
	});
	annotator.annotateNode(info, data.newRootId);
	await animator.ensureAndAnimate(data.startSnapshot! as RBTree);
}

async function handleRotateRightForward(animator: RBTreeAnimator, annotator: RBTreeAnnotator, data: RotateRightData) {
	const info = t(annotator.locale, 'steps.dataStructures.rbTree.rotateRightData', {
		oldRootId: String(data.oldRootId),
		newRootId: String(data.newRootId),
	});
	annotator.annotateNode(info, data.newRootId);
	await animator.ensureAndAnimate(data.endSnapshot! as RBTree);
}

async function handleRotateRightBackward(animator: RBTreeAnimator, annotator: RBTreeAnnotator, data: RotateRightData) {
	const info = t(annotator.locale, 'steps.dataStructures.rbTree.rotateRightData', {
		oldRootId: String(data.oldRootId),
		newRootId: String(data.newRootId),
	});
	annotator.annotateNode(info, data.newRootId);
	await animator.ensureAndAnimate(data.startSnapshot! as RBTree);
}

async function handleFixupForward(animator: RBTreeAnimator, annotator: RBTreeAnnotator, data: FixupData) {
	const info = t(annotator.locale, 'steps.dataStructures.rbTree.fixupData');
	annotator.annotateNode(info, data.nodeId);
}

async function handleFixupBackward(animator: RBTreeAnimator, annotator: RBTreeAnnotator, data: FixupData) {
	const info = t(annotator.locale, 'steps.dataStructures.rbTree.fixupData');
	annotator.annotateNode(info, data.nodeId);
}

export class RBTreeStepHandler extends StepHandlerBase {
	async stepSetup(currentStep: StepData, baseAnimator: DataStructureAnimator, baseAnnotator: DataStructureAnnotator, isForward: boolean) {
		let animator = baseAnimator as RBTreeAnimator;
		if (isForward && currentStep.startSnapshot) {
			animator.ensure(currentStep.startSnapshot);
		}
		if (!isForward && currentStep.endSnapshot) {
			animator.ensure(currentStep.endSnapshot);
		}
	}

	async stepCleanup(
		currentStep: StepData,
		baseAnimator: DataStructureAnimator,
		baseAnnotator: DataStructureAnnotator,
		isForward: boolean,
	) {
		let animator = baseAnimator as RBTreeAnimator;
		if (isForward && currentStep.endSnapshot) {
			animator.ensure(currentStep.endSnapshot);
		}
		if (!isForward && currentStep.startSnapshot) {
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
		let animator = baseAnimator as RBTreeAnimator;
		let annotator = baseAnnotator as RBTreeAnnotator;

		switch (currentStep.type as StepTypeValue) {
			case StepType.RBTree.Start:
				if (isForward) await Common.handleStartForwardCommon(animator, annotator, operationManager);
				else await Common.handleStartBackwardCommon(animator, annotator, operationManager);
				break;
			case StepType.RBTree.End:
				if (isForward) await Common.handleEndForwardCommon(animator, annotator, operationManager);
				else await Common.handleEndBackwardCommon(animator, annotator, operationManager);
				break;
			case StepType.RBTree.CreateRoot:
				if (isForward) await Common.handleCreateRootForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleCreateRootBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.RBTree.CreateLeaf:
				if (isForward) await Common.handleCreateLeafForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleCreateLeafBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.RBTree.Compare:
				if (isForward) await Common.handleCompareForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleCompareBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.RBTree.Traverse:
				if (isForward) await Common.handleTraverseForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleTraverseBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.RBTree.Drop:
				if (isForward) await Common.handleDropForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleDropBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.RBTree.Found:
				if (isForward) await Common.handleFoundForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleFoundBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.RBTree.MarkToDelete:
				if (isForward) await Common.handleMarkToDeleteForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleMarkToDeleteBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.RBTree.Delete:
				if (isForward) await Common.handleDeleteForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleDeleteBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.RBTree.ReplaceWithChild:
				if (isForward) await Common.handleReplaceWithChildForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleReplaceWithChildBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.RBTree.FoundInorderSuccessor:
				if (isForward) await Common.handleFoundInorderSuccessorForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleFoundInorderSuccessorBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.RBTree.RelinkSuccessorChild:
				if (isForward) await Common.handleRelinkSuccessorChildForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleRelinkSuccessorChildBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.RBTree.ReplaceWithInorderSuccessor:
				if (isForward) await Common.handleReplaceWithInorderSuccessorForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleReplaceWithInorderSuccessorBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.RBTree.CaseAnalysis:
				if (isForward) await Common.handleCaseAnalysisForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleCaseAnalysisBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			// RBTree-specific steps
			case StepType.RBTree.ColorNode:
				if (isForward) await handleColorNodeForward(animator, annotator, currentStep.data as any);
				else await handleColorNodeBackward(animator, annotator, currentStep.data as any);
				break;
			case StepType.RBTree.RotateLeft:
				if (isForward) await handleRotateLeftForward(animator, annotator, currentStep.data as any);
				else await handleRotateLeftBackward(animator, annotator, currentStep.data as any);
				break;
			case StepType.RBTree.RotateRight:
				if (isForward) await handleRotateRightForward(animator, annotator, currentStep.data as any);
				else await handleRotateRightBackward(animator, annotator, currentStep.data as any);
				break;
			case StepType.RBTree.Fixup:
				if (isForward) await handleFixupForward(animator, annotator, currentStep.data as any);
				else await handleFixupBackward(animator, annotator, currentStep.data as any);
				break;
			default:
				console.warn('Unhandled RB Tree step type:', currentStep.type);
		}
	}
}
