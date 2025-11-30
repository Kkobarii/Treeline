import type { StepData } from '$lib/data-structures/operation/operationData';
import type { OperationManager } from '$lib/data-structures/operation/operationManager';
import { Step } from '$lib/data-structures/operation/stepData';
import type { AVLTree } from '$lib/data-structures/structures/avlTree/avlTree';
import { StepType, type StepTypeValue } from '$lib/data-structures/structures/dataStructure';

import type { AVLTreeAnimator } from '$lib/data-structures/structures/avlTree/avlTreeAnimator';
import type { DataStructureAnimator } from '$lib/data-structures/visual/animators/dataStructureAnimator';
import type { DataStructureAnnotator } from '$lib/data-structures/visual/annotators/dataStructureAnnotator';
import { StepHandlerBase } from '$lib/data-structures/visual/orchestrators/stepHandlerBase';
import * as Common from '$lib/data-structures/visual/orchestrators/treeStepHandlersCommon';

async function handleRotateLeftForward(animator: AVLTreeAnimator, annotator: DataStructureAnnotator, data: Step.AVLTree.RotateLeftData) {
    annotator.annotateNode(`Rotate left at root ${data.oldRootId}`, data.oldRootId);

    const oldPos = animator.getPosition(data.oldRootId);
    const newPos = animator.getPosition(data.newRootId);

    // Move new root into old root's position to illustrate rotation
    await Promise.all([
        animator.animateNodeMovement(data.newRootId, newPos, oldPos),
        animator.animateNodeShrink(data.oldRootId),
    ]);
}

async function handleRotateLeftBackward(animator: AVLTreeAnimator, annotator: DataStructureAnnotator, data: Step.AVLTree.RotateLeftData) {
    // Reconstruct previous layout
    animator.ensureTree(data.startSnapshot! as AVLTree);
    annotator.annotateNode(`Rotate left at root ${data.oldRootId}`, data.oldRootId);
}

async function handleRotateRightForward(animator: AVLTreeAnimator, annotator: DataStructureAnnotator, data: Step.AVLTree.RotateRightData) {
    annotator.annotateNode(`Rotate right at root ${data.oldRootId}`, data.oldRootId);

    const oldPos = animator.getPosition(data.oldRootId);
    const newPos = animator.getPosition(data.newRootId);

    await Promise.all([
        animator.animateNodeMovement(data.newRootId, newPos, oldPos),
        animator.animateNodeShrink(data.oldRootId),
    ]);
}

async function handleRotateRightBackward(animator: AVLTreeAnimator, annotator: DataStructureAnnotator, data: Step.AVLTree.RotateRightData) {
    animator.ensureTree(data.startSnapshot! as AVLTree);
    annotator.annotateNode(`Rotate right at root ${data.oldRootId}`, data.oldRootId);
}

export class AVLTreeStepHandler extends StepHandlerBase {
    async stepSetup(currentStep: StepData, baseAnimator: DataStructureAnimator, baseAnnotator: DataStructureAnnotator, isForward: boolean) {
        let animator = baseAnimator as AVLTreeAnimator;
        if (isForward && currentStep.startSnapshot) {
            animator.ensureTree(currentStep.startSnapshot);
        }
        if (!isForward && currentStep.endSnapshot) {
            animator.ensureTree(currentStep.endSnapshot);
        }
    }

    async stepCleanup(currentStep: StepData, baseAnimator: DataStructureAnimator, baseAnnotator: DataStructureAnnotator, isForward: boolean) {
        let animator = baseAnimator as AVLTreeAnimator;

        if (isForward && currentStep.endSnapshot) {
            animator.ensureTree(currentStep.endSnapshot);
        }
        if (!isForward && currentStep.startSnapshot) {
            animator.ensureTree(currentStep.startSnapshot);
        }
    }

    async stepRoute(
        currentStep: StepData,
        baseAnimator: DataStructureAnimator, baseAnnotator: DataStructureAnnotator,
        operationManager: OperationManager,
        isForward: boolean = true,
    ) {
        let animator = baseAnimator as AVLTreeAnimator;
        let annotator = baseAnnotator as DataStructureAnnotator;

        if (currentStep.type === StepType.AVLTree.Start) {
            animator.ensureTree(
                operationManager.getCurrentOperation().endSnapshot as AVLTree,
            );
        }

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
        }
    }
}
