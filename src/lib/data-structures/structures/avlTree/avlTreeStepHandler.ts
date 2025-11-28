import { Colors } from '$lib/assets/colors';
import type { StepData } from '$lib/data-structures/operation/operationData';
import type { OperationManager } from '$lib/data-structures/operation/operationManager';
import { Step } from '$lib/data-structures/operation/stepData';
import type { AVLTree } from '$lib/data-structures/structures/avlTree/avlTree';
import { StepType, type StepTypeValue } from '$lib/data-structures/structures/dataStructure';
import { getDummyNodeId } from '$lib/data-structures/utils/graphs';
import { relationTextToSymbol } from '$lib/data-structures/utils/utils';

import type { AVLTreeAnimator } from '$lib/data-structures/structures/avlTree/avlTreeAnimator';
import type { DataStructureAnimator } from '$lib/data-structures/visual/animators/dataStructureAnimator';
import type { DataStructureAnnotator } from '$lib/data-structures/visual/annotators/dataStructureAnnotator';
import { StepHandlerBase } from '$lib/data-structures/visual/orchestrators/stepHandlerBase';

async function handleStartForward(animator: AVLTreeAnimator, annotator: DataStructureAnnotator, operationManager: OperationManager) {
    animator.ensureTree(operationManager.getCurrentOperation().startSnapshot as AVLTree);
    animator.resetFormatting();

    const info = `Starting ${operationManager.getCurrentOperation().operation.toString()} operation`;
    annotator.annotateNode(info, null);
    // if tree has at least one node, create value annotation for the operation value
    if (animator.hasNodes()) {
        const value = operationManager.getCurrentOperation().operation.split(' ')[1];
        annotator.createValueAnnotation(value, null);
    }
}

async function handleStartBackward(animator: AVLTreeAnimator, annotator: DataStructureAnnotator, operationManager: OperationManager) {
    animator.ensureTree(operationManager.getCurrentOperation().startSnapshot as AVLTree);

    const info = `Starting ${operationManager.getCurrentOperation().operation.toString()} operation`;
    annotator.annotateNode(info, null);
    annotator.removeValueAnnotation();
}

function handleEndForward(animator: AVLTreeAnimator, annotator: DataStructureAnnotator, operationManager: OperationManager) {
    animator.ensureTree(operationManager.getCurrentOperation().endSnapshot as AVLTree);

    annotator.clearAnnotation();
    annotator.clearValueAnnotation();
}

function handleEndBackward(animator: AVLTreeAnimator, annotator: DataStructureAnnotator, operationManager: OperationManager) {
    annotator.clearAnnotation();
    annotator.clearValueAnnotation();

    animator.ensureTree(operationManager.getCurrentOperation().endSnapshot as AVLTree);
}

async function handleCreateRootForward(animator: AVLTreeAnimator, annotator: DataStructureAnnotator, data: Step.AVLTree.CreateRootData) {
    animator.addNode(data.nodeId, data.value);
    annotator.annotateNode(`Create root node with value ${data.value}`, data.nodeId);

    await Promise.all([animator.animateNodeGrowth(data.nodeId), animator.animateLegsGrowth(data.nodeId)]);
}

async function handleCreateRootBackward(animator: AVLTreeAnimator, annotator: DataStructureAnnotator, data: Step.AVLTree.CreateRootData) {
    annotator.annotateNode(`Create root node with value ${data.value}`, data.nodeId);
    await Promise.all([
        animator.animateNodeShrink(data.nodeId),
        animator.animateLegsShrink(data.nodeId),
    ]);
    animator.removeNode(data.nodeId);
}

async function handleCreateLeafForward(animator: AVLTreeAnimator, annotator: DataStructureAnnotator, data: Step.AVLTree.CreateLeafData) {
    const info = `Create ${data.direction} child with value ${data.value}`;
    const childNumber = data.direction === 'left' ? 0 : 1;

    animator.addNode(data.nodeId, data.value, data.parentId, childNumber);
    annotator.annotateNode(info, data.nodeId);

    await Promise.all([
        animator.animateNodeGrowth(data.nodeId),
        animator.animateLegsGrowth(data.nodeId),
    ]);
}

async function handleCreateLeafBackward(animator: AVLTreeAnimator, annotator: DataStructureAnnotator, data: Step.AVLTree.CreateLeafData) {
    const info = `Create ${data.direction} child with value ${data.value}`;
    annotator.annotateNode(info, data.parentId);

    await Promise.all([
        animator.animateNodeShrink(data.nodeId),
        animator.animateLegsShrink(data.nodeId),
    ]);

    animator.removeNode(data.nodeId);
}

async function handleCompareForward(animator: AVLTreeAnimator, annotator: DataStructureAnnotator, data: Step.AVLTree.CompareData) {
    annotator.annotateNode(`${data.value} ${relationTextToSymbol(data.result)} ${data.comparisonValue}`, data.comparisonId);
}

async function handleCompareBackward(animator: AVLTreeAnimator, annotator: DataStructureAnnotator, data: Step.AVLTree.CompareData) {
    annotator.annotateNode(`${data.value} ${relationTextToSymbol(data.result)} ${data.comparisonValue}`, data.comparisonId);
}

async function handleTraverseForward(animator: AVLTreeAnimator, annotator: DataStructureAnnotator, data: Step.AVLTree.TraverseData) {
    // Move the floating value annotation along with traversal
    if (data.toId !== -1) {
        await annotator.moveValueAnnotationTo(data.toId);
    } else {
        // dummy traversal — move back to parent
        await annotator.moveValueAnnotationTo(data.fromId);
    }
    annotator.annotateNode(`Traverse to ${data.direction} child`, data.fromId);
}

async function handleTraverseBackward(animator: AVLTreeAnimator, annotator: DataStructureAnnotator, data: Step.AVLTree.TraverseData) {
    // move value annotation back to the from node
    await annotator.moveValueAnnotationTo(data.fromId);
    annotator.annotateNode(`Traverse to ${data.direction} child`, data.fromId);
}

async function handleDropForward(animator: AVLTreeAnimator, annotator: DataStructureAnnotator, data: Step.AVLTree.DropData) {
    annotator.annotateNode(`Drop value ${data.value}`, data.fromId);
    annotator.clearValueAnnotation();
}

async function handleDropBackward(animator: AVLTreeAnimator, annotator: DataStructureAnnotator, data: Step.AVLTree.DropData) {
    annotator.annotateNode(`Drop value ${data.value}`, data.fromId);
    annotator.createValueAnnotation(String(data.value), data.fromId);
}

function handleFoundForward(animator: AVLTreeAnimator, annotator: DataStructureAnnotator, data: Step.AVLTree.FoundData) {
    annotator.annotateNode(`Found node with value ${data.value}`, data.nodeId);
    animator.setNodeColor(data.nodeId, Colors.Green);
    annotator.clearValueAnnotation();
}

function handleFoundBackward(animator: AVLTreeAnimator, annotator: DataStructureAnnotator, data: Step.AVLTree.FoundData) {
    annotator.annotateNode(`Found node with value ${data.value}`, data.nodeId);
    animator.resetNodeColor(data.nodeId);
    annotator.createValueAnnotation(String(data.value), data.nodeId);
}

function handleMarkToDeleteForward(animator: AVLTreeAnimator, annotator: DataStructureAnnotator, data: Step.AVLTree.MarkToDeleteData) {
    annotator.annotateNode(`Mark node with value ${data.value} to delete`, data.nodeId);
    animator.setNodeColor(data.nodeId, Colors.Red);
    annotator.clearValueAnnotation();
}

function handleMarkToDeleteBackward(animator: AVLTreeAnimator, annotator: DataStructureAnnotator, data: Step.AVLTree.MarkToDeleteData) {
    annotator.annotateNode(`Mark node with value ${data.value} to delete`, data.nodeId);
    animator.resetNodeColor(data.nodeId);
    annotator.createValueAnnotation(String(data.value), data.nodeId);
}

async function handleDeleteForward(animator: AVLTreeAnimator, annotator: DataStructureAnnotator, data: Step.AVLTree.DeleteData) {
    annotator.annotateNode(`Delete node with value ${data.value}`, data.nodeId);
    await Promise.all([animator.animateNodeShrink(data.nodeId), animator.animateLegsShrink(data.nodeId)]);
}

async function handleDeleteBackward(animator: AVLTreeAnimator, annotator: DataStructureAnnotator, data: Step.AVLTree.DeleteData) {
    animator.ensureTree(data.startSnapshot! as AVLTree);
    annotator.annotateNode(`Delete node with value ${data.value}`, data.nodeId);
    animator.setNodeColor(data.nodeId, Colors.Red);
    await Promise.all([animator.animateNodeGrowth(data.nodeId), animator.animateLegsGrowth(data.nodeId)]);
}

async function handleReplaceWithChildForward(animator: AVLTreeAnimator, annotator: DataStructureAnnotator, data: Step.AVLTree.ReplaceWithChildData) {
    annotator.annotateNode(`Replace node with its ${data.direction} child`, data.oldNodeId);
    await Promise.all([
        animator.animateNodeMovement(data.newNodeId, animator.getPosition(data.newNodeId), animator.getPosition(data.oldNodeId)),
        animator.animateNodeShrink(data.oldNodeId),
        animator.animateLegsShrink(data.oldNodeId),
    ]);
}

async function handleReplaceWithChildBackward(animator: AVLTreeAnimator, annotator: DataStructureAnnotator, data: Step.AVLTree.ReplaceWithChildData) {
    animator.ensureTree(data.startSnapshot! as AVLTree);
    annotator.annotateNode(`Replace node with its ${data.direction} child`, data.oldNodeId);
    animator.setNodeColor(data.oldNodeId, Colors.Red);

    const childPosition = animator.getPosition(data.newNodeId);
    const deletedParentPosition = animator.getPosition(data.oldNodeId);
    animator.snapNodeTo(data.newNodeId, deletedParentPosition.x, deletedParentPosition.y);

    await Promise.all([
        animator.animateNodeMovement(data.newNodeId, deletedParentPosition, childPosition),
        animator.animateNodeGrowth(data.oldNodeId),
        animator.animateLegsGrowth(data.oldNodeId),
    ]);
}

async function handleFoundInorderSuccessorForward(animator: AVLTreeAnimator, annotator: DataStructureAnnotator, data: Step.AVLTree.FoundInorderSuccessorData) {
    annotator.annotateNode(`Found inorder successor`, data.successorId);
    animator.setNodeColor(data.successorId, Colors.Blue);
}

async function handleFoundInorderSuccessorBackward(animator: AVLTreeAnimator, annotator: DataStructureAnnotator, data: Step.AVLTree.FoundInorderSuccessorData) {
    annotator.annotateNode(`Found inorder successor`, data.successorId);
    animator.resetNodeColor(data.successorId);
}

async function handleRelinkSuccessorChildForward(animator: AVLTreeAnimator, annotator: DataStructureAnnotator, data: Step.AVLTree.RelinkSuccessorChildData) {
    annotator.annotateNode(`Relink inorder successor's child`, data.newParentNodeId);

    let originalChildPos = animator.getPosition(data.childNodeId);
    let originalSuccessorPos = animator.getPosition(data.successorNodeId);

    animator.unlinkNode(data.successorNodeId, data.childNodeId);
    animator.unlinkNode(data.newParentNodeId, data.successorNodeId);

    animator.addDummyNode(data.successorNodeId, 1);

    animator.linkNode(data.newParentNodeId, data.childNodeId, 0);

    if (animator.nodeExists(getDummyNodeId(data.successorNodeId, 0))) animator.removeNode(getDummyNodeId(data.successorNodeId, 0), true);
    if (animator.nodeExists(getDummyNodeId(data.successorNodeId, 1))) animator.removeNode(getDummyNodeId(data.successorNodeId, 1), true);

    let newChildPos = animator.getPosition(data.childNodeId);
    let newSuccessorPos = { x: newChildPos.x, y: newChildPos.y - 50 };

    animator.snapNodeTo(data.childNodeId, originalChildPos.x, originalChildPos.y);
    animator.snapNodeTo(data.successorNodeId, originalSuccessorPos.x, originalSuccessorPos.y);

    await Promise.all([
        animator.animateNodeMovement(data.childNodeId, originalChildPos, newChildPos),
        animator.animateNodeMovement(data.successorNodeId, originalSuccessorPos, newSuccessorPos),
    ]);
}

async function handleRelinkSuccessorChildBackward(animator: AVLTreeAnimator, annotator: DataStructureAnnotator, data: Step.AVLTree.RelinkSuccessorChildData) {
    annotator.annotateNode(`Relink inorder successor's child`, data.newParentNodeId);
    animator.ensureTree(data.startSnapshot! as AVLTree);
}

async function handleReplaceWithInorderSuccessorForward(animator: AVLTreeAnimator, annotator: DataStructureAnnotator, data: Step.AVLTree.ReplaceWithInorderSuccessorData) {
    if (animator.nodeExists(getDummyNodeId(data.successorNodeId, 0))) animator.removeNode(getDummyNodeId(data.successorNodeId, 0), true);
    if (animator.nodeExists(getDummyNodeId(data.successorNodeId, 1))) animator.removeNode(getDummyNodeId(data.successorNodeId, 1), true);

    let promises: Promise<void>[] = [];

    let oldSuccPos = animator.getPosition(data.successorNodeId);

    // Unlink successor from its parent if its the parents left child
    if (animator.areNodesConnected(data.successorParentId, data.successorNodeId)) {
        animator.unlinkNode(data.successorParentId, data.successorNodeId);
        animator.addDummyNode(data.successorParentId, 0);
    }

    annotator.annotateNode(`Replace node with inorder successor`, data.oldNodeId);

    // Move back to position
    animator.snapNodeTo(data.successorNodeId, oldSuccPos.x, oldSuccPos.y);

    // Shrink old node
    promises.push(animator.animateNodeShrink(data.oldNodeId));

    // Move successor to old node's position
    promises.push(
        animator.animateNodeMovement(
            data.successorNodeId,
            animator.getPosition(data.successorNodeId),
            animator.getPosition(data.oldNodeId),
        ),
    );

    await Promise.all(promises);

    // animator.snapNodeTo(data.successorNodeId, animator.getPosition(data.oldNodeId).x, animator.getPosition(data.oldNodeId).y);
}

async function handleReplaceWithInorderSuccessorBackward(animator: AVLTreeAnimator, annotator: DataStructureAnnotator, data: Step.AVLTree.ReplaceWithInorderSuccessorData) {
    animator.ensureTree(data.startSnapshot! as AVLTree);
    animator.resetFormatting();
    animator.setNodeColor(data.successorNodeId, Colors.Green);
    animator.setNodeColor(data.oldNodeId, Colors.Red);
    annotator.annotateNode(`Replace node with inorder successor`, data.oldNodeId);
}

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
                if (isForward) await handleStartForward(animator, annotator, operationManager);
                else await handleStartBackward(animator, annotator, operationManager);
                break;
            case StepType.AVLTree.End:
                if (isForward) await handleEndForward(animator, annotator, operationManager);
                else await handleEndBackward(animator, annotator, operationManager);
                break;
            case StepType.AVLTree.CreateRoot:
                if (isForward) await handleCreateRootForward(animator, annotator, currentStep.data as any);
                else await handleCreateRootBackward(animator, annotator, currentStep.data as any);
                break;
            case StepType.AVLTree.CreateLeaf:
                if (isForward) await handleCreateLeafForward(animator, annotator, currentStep.data as any);
                else await handleCreateLeafBackward(animator, annotator, currentStep.data as any);
                break;
            case StepType.AVLTree.Compare:
                if (isForward) await handleCompareForward(animator, annotator, currentStep.data as any);
                else await handleCompareBackward(animator, annotator, currentStep.data as any);
                break;
            case StepType.AVLTree.Traverse:
                if (isForward) await handleTraverseForward(animator, annotator, currentStep.data as any);
                else await handleTraverseBackward(animator, annotator, currentStep.data as any);
                break;
            case StepType.AVLTree.Drop:
                if (isForward) await handleDropForward(animator, annotator, currentStep.data as any);
                else await handleDropBackward(animator, annotator, currentStep.data as any);
                break;
            case StepType.AVLTree.Found:
                if (isForward) await handleFoundForward(animator, annotator, currentStep.data as any);
                else await handleFoundBackward(animator, annotator, currentStep.data as any);
                break;
            case StepType.AVLTree.MarkToDelete:
                if (isForward) await handleMarkToDeleteForward(animator, annotator, currentStep.data as any);
                else await handleMarkToDeleteBackward(animator, annotator, currentStep.data as any);
                break;
            case StepType.AVLTree.Delete:
                if (isForward) await handleDeleteForward(animator, annotator, currentStep.data as any);
                else await handleDeleteBackward(animator, annotator, currentStep.data as any);
                break;
            case StepType.AVLTree.ReplaceWithChild:
                if (isForward) await handleReplaceWithChildForward(animator, annotator, currentStep.data as any);
                else await handleReplaceWithChildBackward(animator, annotator, currentStep.data as any);
                break;
            case StepType.AVLTree.FoundInorderSuccessor:
                if (isForward) await handleFoundInorderSuccessorForward(animator, annotator, currentStep.data as any);
                else await handleFoundInorderSuccessorBackward(animator, annotator, currentStep.data as any);
                break;
            case StepType.AVLTree.RelinkSuccessorChild:
                if (isForward) await handleRelinkSuccessorChildForward(animator, annotator, currentStep.data as any);
                else await handleRelinkSuccessorChildBackward(animator, annotator, currentStep.data as any);
                break;
            case StepType.AVLTree.ReplaceWithInorderSuccessor:
                if (isForward) await handleReplaceWithInorderSuccessorForward(animator, annotator, currentStep.data as any);
                else await handleReplaceWithInorderSuccessorBackward(animator, annotator, currentStep.data as any);
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
