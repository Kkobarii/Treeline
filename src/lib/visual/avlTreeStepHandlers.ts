import { Colors } from '$lib/assets/colors';
import type { StepData } from '$lib/operation/operationData';
import type { OperationManager } from '$lib/operation/operationManager';
import { Step } from '$lib/operation/stepData';
import type { AVLTree } from '$lib/structures/avlTree';
import { StepType, type StepTypeValue } from '$lib/structures/dataStructure';
import { getDummyNodeId } from '$lib/utils/graphs';
import { relationTextToSymbol } from '$lib/utils/utils';

import type { AVLTreeAnimator } from '$lib/animators/avlTreeAnimator';
import type { DataStructureAnimator } from '../animators/dataStructureAnimator';
import { StepHandlersBase } from './stepHandlersBase';

async function handleStartForward(animator: AVLTreeAnimator, operationManager: OperationManager) {
    animator.ensureTree(operationManager.getCurrentOperation().startSnapshot as AVLTree);
    animator.resetFormatting();

    const info = `Starting ${operationManager.getCurrentOperation().operation.toString()} operation`;
    await Promise.all([animator.animateAnnotateNode(info, null), animator.animateNodeGrowth('info-node')]);
}

async function handleStartBackward(animator: AVLTreeAnimator, operationManager: OperationManager) {
    // animator.ensureTree(operationManager.getCurrentOperation().startSnapshot as AVLTree);

    const info = `Starting ${operationManager.getCurrentOperation().operation.toString()} operation`;
    await Promise.all([animator.animateAnnotateNode(info, null), animator.animateNodeGrowth('info-node')]);
}

function handleEndForward(animator: AVLTreeAnimator, operationManager: OperationManager) {
    animator.ensureTree(operationManager.getCurrentOperation().endSnapshot as AVLTree);

    animator.hideInfoNode();
}

function handleEndBackward(animator: AVLTreeAnimator, operationManager: OperationManager) {
    animator.hideInfoNode();

    animator.ensureTree(operationManager.getCurrentOperation().endSnapshot as AVLTree);
}

async function handleCreateRootForward(animator: AVLTreeAnimator, data: Step.AVLTree.CreateRootData) {
    animator.addNode(data.nodeId, data.value);
    animator.animateAnnotateNode(`Create root node with value ${data.value}`, data.nodeId);
    await Promise.all([animator.animateNodeGrowth(data.nodeId), animator.animateLegsGrowth(data.nodeId)]);
}

async function handleCreateRootBackward(animator: AVLTreeAnimator, data: Step.AVLTree.CreateRootData) {
    await Promise.all([
        animator.animateAnnotateNode(`Create root node with value ${data.value}`, data.nodeId),
        animator.animateNodeShrink(data.nodeId),
        animator.animateLegsShrink(data.nodeId),
    ]);
    animator.removeNode(data.nodeId);
}

async function handleCreateLeafForward(animator: AVLTreeAnimator, data: Step.AVLTree.CreateLeafData) {
    const info = `Create ${data.direction} child with value ${data.value}`;
    const childNumber = data.direction === 'left' ? 0 : 1;
    animator.addNode(data.nodeId, data.value, data.parentId, childNumber);
    await Promise.all([
        animator.animateAnnotateNode(info, data.parentId),
        animator.animateNodeGrowth(data.nodeId),
        animator.animateLegsGrowth(data.nodeId),
        animator.animateNodeMovement('info-node', animator.getPositionAbove(data.parentId), animator.getPositionAbove(data.nodeId)),
    ]);
}

async function handleCreateLeafBackward(animator: AVLTreeAnimator, data: Step.AVLTree.CreateLeafData) {
    const info = `Create ${data.direction} child with value ${data.value}`;
    await Promise.all([
        animator.animateAnnotateNode(info, data.nodeId),
        animator.animateNodeShrink(data.nodeId),
        animator.animateLegsShrink(data.nodeId),
        animator.animateNodeMovement('info-node', animator.getPositionAbove(data.nodeId), animator.getPositionAbove(data.parentId)),
    ]);
    animator.removeNode(data.nodeId);
    animator.snapNodeAbove('info-node', data.parentId);
}

async function handleCompareForward(animator: AVLTreeAnimator, data: Step.AVLTree.CompareData) {
    await animator.animateAnnotateNode(`${data.value} ${relationTextToSymbol(data.result)} ${data.comparisonValue}`, data.comparisonId);
}

async function handleCompareBackward(animator: AVLTreeAnimator, data: Step.AVLTree.CompareData) {
    await animator.animateAnnotateNode(`${data.value} ${relationTextToSymbol(data.result)} ${data.comparisonValue}`, data.comparisonId);
}

async function handleTraverseForward(animator: AVLTreeAnimator, data: Step.AVLTree.TraverseData) {
    const positionFrom = animator.getPositionAbove(data.fromId);
    const positionTo =
        data.toId === -1 ? animator.getPositionAbove(getDummyNodeId(data.fromId, data.direction)) : animator.getPositionAbove(data.toId);
    await animator.animateAnnotateNode(`Traverse to ${data.direction} child`, data.fromId);
    animator.animateNodeMovement('info-node', positionFrom, positionTo);
}

async function handleTraverseBackward(animator: AVLTreeAnimator, data: Step.AVLTree.TraverseData) {
    const positionFrom = animator.getPositionAbove(data.fromId);
    const positionTo =
        data.toId === -1 ? animator.getPositionAbove(getDummyNodeId(data.fromId, data.direction)) : animator.getPositionAbove(data.toId);
    await animator.animateAnnotateNode(`Traverse to ${data.direction} child`, data.toId);
    animator.animateNodeMovement('info-node', positionTo, positionFrom);
}

async function handleDropForward(animator: AVLTreeAnimator, data: Step.AVLTree.DropData) {
    await animator.animateAnnotateNode(`Drop value ${data.value}`, data.fromId);
    const positionFrom = animator.getPositionAbove(data.fromId);
    const positionTo = { x: positionFrom.x, y: positionFrom.y + 200 };
    await Promise.all([
        animator.animateNodeMovement('info-node', positionFrom, positionTo),
        animator.animateNodeOpacityChange('info-node', 1, 0),
    ]);
    animator.hideInfoNode();
}

async function handleDropBackward(animator: AVLTreeAnimator, data: Step.AVLTree.DropData) {
    await animator.changeInfoNodeAnnotation(`Drop value ${data.value}`);

    const positionFrom = animator.getPositionAbove(data.fromId);
    const positionTo = { x: positionFrom.x, y: positionFrom.y + 200 };
    await Promise.all([
        animator.animateNodeMovement('info-node', positionTo, positionFrom),
        animator.animateNodeOpacityChange('info-node', 0, 1),
    ]);
}

function handleFoundForward(animator: AVLTreeAnimator, data: Step.AVLTree.FoundData) {
    animator.animateAnnotateNode(`Found node with value ${data.value}`, data.nodeId);
    animator.setNodeColor(data.nodeId, Colors.Green);
}

function handleFoundBackward(animator: AVLTreeAnimator, data: Step.AVLTree.FoundData) {
    animator.animateAnnotateNode(`Found node with value ${data.value}`, data.nodeId);
    animator.resetNodeColor(data.nodeId);
}

function handleMarkToDeleteForward(animator: AVLTreeAnimator, data: Step.AVLTree.MarkToDeleteData) {
    animator.animateAnnotateNode(`Mark node with value ${data.value} to delete`, data.nodeId);
    animator.setNodeColor(data.nodeId, Colors.Red);
}

function handleMarkToDeleteBackward(animator: AVLTreeAnimator, data: Step.AVLTree.MarkToDeleteData) {
    animator.animateAnnotateNode(`Mark node with value ${data.value} to delete`, data.nodeId);
    animator.resetNodeColor(data.nodeId);
}

async function handleDeleteForward(animator: AVLTreeAnimator, data: Step.AVLTree.DeleteData) {
    animator.animateAnnotateNode(`Delete node with value ${data.value}`, data.nodeId);
    await Promise.all([animator.animateNodeShrink(data.nodeId), animator.animateLegsShrink(data.nodeId)]);
    // animator.removeNode(data.nodeId);
}

async function handleDeleteBackward(animator: AVLTreeAnimator, data: Step.AVLTree.DeleteData) {
    animator.ensureTree(data.startSnapshot! as AVLTree);
    animator.animateAnnotateNode(`Delete node with value ${data.value}`, data.nodeId);
    animator.setNodeColor(data.nodeId, Colors.Red);
    await Promise.all([animator.animateNodeGrowth(data.nodeId), animator.animateLegsGrowth(data.nodeId)]);
}

async function handleReplaceWithChildForward(animator: AVLTreeAnimator, data: Step.AVLTree.ReplaceWithChildData) {
    animator.animateAnnotateNode(`Replace node with its ${data.direction} child`, data.oldNodeId);
    await Promise.all([
        animator.animateNodeMovement(data.newNodeId, animator.getPosition(data.newNodeId), animator.getPosition(data.oldNodeId)),
        animator.animateNodeShrink(data.oldNodeId),
        animator.animateLegsShrink(data.oldNodeId),
    ]);
}

async function handleReplaceWithChildBackward(animator: AVLTreeAnimator, data: Step.AVLTree.ReplaceWithChildData) {
    animator.ensureTree(data.startSnapshot! as AVLTree);
    animator.animateAnnotateNode(`Replace node with its ${data.direction} child`, data.oldNodeId);
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

async function handleFoundInorderSuccessorForward(animator: AVLTreeAnimator, data: Step.AVLTree.FoundInorderSuccessorData) {
    animator.animateAnnotateNode(`Found inorder successor`, data.successorId);
    animator.setNodeColor(data.successorId, Colors.Green);
}

async function handleFoundInorderSuccessorBackward(animator: AVLTreeAnimator, data: Step.AVLTree.FoundInorderSuccessorData) {
    animator.animateAnnotateNode(`Found inorder successor`, data.successorId);
    animator.resetNodeColor(data.successorId);
}

async function handleRelinkSuccessorChildForward(animator: AVLTreeAnimator, data: Step.AVLTree.RelinkSuccessorChildData) {
    animator.animateAnnotateNode(`Relink inorder successor's child`, data.childNodeId);

    let originalChildPos = animator.getPosition(data.childNodeId);
    let originalSuccessorPos = animator.getPosition(data.successorNodeId);

    animator.unlinkNode(data.successorNodeId, data.childNodeId);
    animator.unlinkNode(data.newParentNodeId, data.successorNodeId);

    animator.addDummyNode(data.successorNodeId, 'right');

    animator.linkNode(data.newParentNodeId, data.childNodeId);

    let newChildPos = animator.getPosition(data.childNodeId);
    let newSuccessorPos = animator.getPosition(data.successorNodeId);

    animator.snapNodeTo(data.childNodeId, originalChildPos.x, originalChildPos.y);
    animator.snapNodeTo(data.successorNodeId, originalSuccessorPos.x, originalSuccessorPos.y);

    await Promise.all([
        animator.animateNodeMovement(data.childNodeId, originalChildPos, newChildPos),
        animator.animateNodeMovement(data.successorNodeId, originalSuccessorPos, newSuccessorPos),
    ]);
}

async function handleRelinkSuccessorChildBackward(animator: AVLTreeAnimator, data: Step.AVLTree.RelinkSuccessorChildData) {
    animator.animateAnnotateNode(`Relink inorder successor's child`, data.childNodeId);
    animator.ensureTree(data.startSnapshot! as AVLTree);
}

async function handleReplaceWithInorderSuccessorForward(animator: AVLTreeAnimator, data: Step.AVLTree.ReplaceWithInorderSuccessorData) {
    animator.removeNode(getDummyNodeId(data.successorNodeId, 'right'), true);
    animator.removeNode(getDummyNodeId(data.successorNodeId, 'left'), true);

    let promises: Promise<void>[] = [];

    let oldSuccPos = animator.getPosition(data.successorNodeId);

    // Unlink successor from its parent if its the parents left child
    if (animator.areNodesConnected(data.successorParentId, data.successorNodeId)) {
        animator.unlinkNode(data.successorParentId, data.successorNodeId);
        animator.addDummyNode(data.successorParentId, 'left');
    }

    await animator.animateAnnotateNode(`Replace node with inorder successor`, data.oldNodeId);

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

    animator.snapNodeTo(data.successorNodeId, animator.getPosition(data.oldNodeId).x, animator.getPosition(data.oldNodeId).y);
}

async function handleReplaceWithInorderSuccessorBackward(animator: AVLTreeAnimator, data: Step.AVLTree.ReplaceWithInorderSuccessorData) {
    animator.ensureTree(data.startSnapshot! as AVLTree);
    animator.resetFormatting();
    animator.setNodeColor(data.successorNodeId, Colors.Green);
    animator.setNodeColor(data.oldNodeId, Colors.Red);
    await animator.animateAnnotateNode(`Replace node with inorder successor`, data.oldNodeId);
}

export class AVLTreeStepHandlers extends StepHandlersBase {
    async stepSetup(currentStep: StepData, baseAnimator: DataStructureAnimator, isForward: boolean) {
        let animator = baseAnimator as AVLTreeAnimator;
        if (isForward && currentStep.startSnapshot) {
            animator.ensureTree(currentStep.startSnapshot);
        }
        if (!isForward && currentStep.endSnapshot) {
            animator.ensureTree(currentStep.endSnapshot);
        }
    }

    async stepCleanup(currentStep: StepData, baseAnimator: DataStructureAnimator, isForward: boolean) {
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
        baseAnimator: DataStructureAnimator,
        operationManager: OperationManager,
        isForward: boolean = true,
    ) {
        let animator = baseAnimator as AVLTreeAnimator;

        if (currentStep.type === StepType.AVLTree.Start) {
            animator.ensureTree(
                operationManager.getCurrentOperation().endSnapshot as AVLTree,
            );
        }

        // switch (currentStep.type as StepTypeValue) {
        //     case StepType.AVLTree.Start:
        //         if (isForward) await handleStartForward(animator, operationManager);
        //         else await handleStartBackward(animator, operationManager);
        //         break;
        //     case StepType.AVLTree.End:
        //         if (isForward) await handleEndForward(animator, operationManager);
        //         else await handleEndBackward(animator, operationManager);
        //         break;
        //     case StepType.AVLTree.CreateRoot:
        //         if (isForward) await handleCreateRootForward(animator, currentStep.data as any);
        //         else await handleCreateRootBackward(animator, currentStep.data as any);
        //         break;
        //     case StepType.AVLTree.CreateLeaf:
        //         if (isForward) await handleCreateLeafForward(animator, currentStep.data as any);
        //         else await handleCreateLeafBackward(animator, currentStep.data as any);
        //         break;
        //     case StepType.AVLTree.Compare:
        //         if (isForward) await handleCompareForward(animator, currentStep.data as any);
        //         else await handleCompareBackward(animator, currentStep.data as any);
        //         break;
        //     case StepType.AVLTree.Traverse:
        //         if (isForward) await handleTraverseForward(animator, currentStep.data as any);
        //         else await handleTraverseBackward(animator, currentStep.data as any);
        //         break;
        //     case StepType.AVLTree.Drop:
        //         if (isForward) await handleDropForward(animator, currentStep.data as any);
        //         else await handleDropBackward(animator, currentStep.data as any);
        //         break;
        //     case StepType.AVLTree.Found:
        //         if (isForward) await handleFoundForward(animator, currentStep.data as any);
        //         else await handleFoundBackward(animator, currentStep.data as any);
        //         break;
        //     case StepType.AVLTree.MarkToDelete:
        //         if (isForward) await handleMarkToDeleteForward(animator, currentStep.data as any);
        //         else await handleMarkToDeleteBackward(animator, currentStep.data as any);
        //         break;
        //     case StepType.AVLTree.Delete:
        //         if (isForward) await handleDeleteForward(animator, currentStep.data as any);
        //         else await handleDeleteBackward(animator, currentStep.data as any);
        //         break;
        //     case StepType.AVLTree.ReplaceWithChild:
        //         if (isForward) await handleReplaceWithChildForward(animator, currentStep.data as any);
        //         else await handleReplaceWithChildBackward(animator, currentStep.data as any);
        //         break;
        //     case StepType.AVLTree.FoundInorderSuccessor:
        //         if (isForward) await handleFoundInorderSuccessorForward(animator, currentStep.data as any);
        //         else await handleFoundInorderSuccessorBackward(animator, currentStep.data as any);
        //         break;
        //     case StepType.AVLTree.RelinkSuccessorChild:
        //         if (isForward) await handleRelinkSuccessorChildForward(animator, currentStep.data as any);
        //         else await handleRelinkSuccessorChildBackward(animator, currentStep.data as any);
        //         break;
        //     case StepType.AVLTree.ReplaceWithInorderSuccessor:
        //         if (isForward) await handleReplaceWithInorderSuccessorForward(animator, currentStep.data as any);
        //         else await handleReplaceWithInorderSuccessorBackward(animator, currentStep.data as any);
        //         break;
        // }
    }
}
