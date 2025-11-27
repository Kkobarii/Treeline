import { Colors } from '$lib/assets/colors';
import type { StepData } from '$lib/data-structures/operation/operationData';
import type { OperationManager } from '$lib/data-structures/operation/operationManager';
import { Step } from '$lib/data-structures/operation/stepData';
import type { BSTree } from '$lib/data-structures/structures/bsTree/bsTree';
import { StepType, type StepTypeValue } from '$lib/data-structures/structures/dataStructure';
import { getDummyNodeId } from '$lib/data-structures/utils/graphs';
import { relationTextToSymbol } from '$lib/data-structures/utils/utils';

import type { BSTreeAnimator } from '$lib/data-structures/structures/bsTree/bsTreeAnimator';
import { StepHandlerBase } from '$lib/data-structures/visual/orchestrators/stepHandlerBase';
import type { DataStructureAnimator } from '$lib/data-structures/visual/animators/dataStructureAnimator';
import type { DataStructureAnnotator } from '$lib/data-structures/visual/annotators/dataStructureAnnotator';

async function handleStartForward(animator: BSTreeAnimator, annotator: DataStructureAnnotator, operationManager: OperationManager) {
	animator.ensureTree(operationManager.getCurrentOperation().startSnapshot as BSTree);
	animator.resetFormatting();

	const info = `Starting ${operationManager.getCurrentOperation().operation.toString()} operation`;
	annotator.annotateNode(info, null);
}

async function handleStartBackward(animator: BSTreeAnimator, annotator: DataStructureAnnotator, operationManager: OperationManager) {
	// animator.ensureTree(operationManager.getCurrentOperation().startSnapshot as BSTree);

	const info = `Starting ${operationManager.getCurrentOperation().operation.toString()} operation`;
	annotator.annotateNode(info, null);
}

function handleEndForward(animator: BSTreeAnimator, annotator: DataStructureAnnotator, operationManager: OperationManager) {
	animator.ensureTree(operationManager.getCurrentOperation().endSnapshot as BSTree);

	annotator.clearAnnotation();
}

function handleEndBackward(animator: BSTreeAnimator, annotator: DataStructureAnnotator, operationManager: OperationManager) {
	annotator.clearAnnotation();
	animator.ensureTree(operationManager.getCurrentOperation().endSnapshot as BSTree);
}

async function handleCreateRootForward(animator: BSTreeAnimator, annotator: DataStructureAnnotator, data: Step.BSTree.CreateRootData) {
	animator.addNode(data.nodeId, data.value);
	annotator.annotateNode(`Create root node with value ${data.value}`, data.nodeId);
	await Promise.all([animator.animateNodeGrowth(data.nodeId), animator.animateLegsGrowth(data.nodeId)]);
}

async function handleCreateRootBackward(animator: BSTreeAnimator, annotator: DataStructureAnnotator, data: Step.BSTree.CreateRootData) {
	annotator.annotateNode(`Create root node with value ${data.value}`, data.nodeId);
	await Promise.all([
		animator.animateNodeShrink(data.nodeId),
		animator.animateLegsShrink(data.nodeId),
	]);
	animator.removeNode(data.nodeId);
}

async function handleCreateLeafForward(animator: BSTreeAnimator, annotator: DataStructureAnnotator, data: Step.BSTree.CreateLeafData) {
	const info = `Create ${data.direction} child with value ${data.value}`;
	const childNumber = data.direction === 'left' ? 0 : 1;
	animator.addNode(data.nodeId, data.value, data.parentId, childNumber);
	annotator.annotateNode(info, data.nodeId);
	await Promise.all([
		animator.animateNodeGrowth(data.nodeId),
		animator.animateLegsGrowth(data.nodeId),
	]);
}

async function handleCreateLeafBackward(animator: BSTreeAnimator, annotator: DataStructureAnnotator, data: Step.BSTree.CreateLeafData) {
	const info = `Create ${data.direction} child with value ${data.value}`;
	annotator.annotateNode(info, data.parentId);

	await Promise.all([
		animator.animateNodeShrink(data.nodeId),
		animator.animateLegsShrink(data.nodeId),
	]);

	animator.removeNode(data.nodeId);
}

async function handleCompareForward(animator: BSTreeAnimator, annotator: DataStructureAnnotator, data: Step.BSTree.CompareData) {
	annotator.annotateNode(`${data.value} ${relationTextToSymbol(data.result)} ${data.comparisonValue}`, data.comparisonId);
}

async function handleCompareBackward(animator: BSTreeAnimator, annotator: DataStructureAnnotator, data: Step.BSTree.CompareData) {
	annotator.annotateNode(`${data.value} ${relationTextToSymbol(data.result)} ${data.comparisonValue}`, data.comparisonId);
}

async function handleTraverseForward(animator: BSTreeAnimator, annotator: DataStructureAnnotator, data: Step.BSTree.TraverseData) {
	annotator.annotateNode(`Traverse to ${data.direction} child`, data.fromId);
}

async function handleTraverseBackward(animator: BSTreeAnimator, annotator: DataStructureAnnotator, data: Step.BSTree.TraverseData) {
	annotator.annotateNode(`Traverse to ${data.direction} child`, data.fromId);
}

async function handleDropForward(animator: BSTreeAnimator, annotator: DataStructureAnnotator, data: Step.BSTree.DropData) {
	annotator.annotateNode(`Drop value ${data.value}`, data.fromId);
	// todo animate drop
}

async function handleDropBackward(animator: BSTreeAnimator, annotator: DataStructureAnnotator, data: Step.BSTree.DropData) {
	annotator.annotateNode(`Drop value ${data.value}`, data.fromId);
	// todo animate drop
}

function handleFoundForward(animator: BSTreeAnimator, annotator: DataStructureAnnotator, data: Step.BSTree.FoundData) {
	annotator.annotateNode(`Found node with value ${data.value}`, data.nodeId);
	animator.setNodeColor(data.nodeId, Colors.Green);
}

function handleFoundBackward(animator: BSTreeAnimator, annotator: DataStructureAnnotator, data: Step.BSTree.FoundData) {
	annotator.annotateNode(`Found node with value ${data.value}`, data.nodeId);
	animator.resetNodeColor(data.nodeId);
}

function handleMarkToDeleteForward(animator: BSTreeAnimator, annotator: DataStructureAnnotator, data: Step.BSTree.MarkToDeleteData) {
	annotator.annotateNode(`Mark node with value ${data.value} to delete`, data.nodeId);
	animator.setNodeColor(data.nodeId, Colors.Red);
}

function handleMarkToDeleteBackward(animator: BSTreeAnimator, annotator: DataStructureAnnotator, data: Step.BSTree.MarkToDeleteData) {
	annotator.annotateNode(`Mark node with value ${data.value} to delete`, data.nodeId);
	animator.resetNodeColor(data.nodeId);
}

async function handleDeleteForward(animator: BSTreeAnimator, annotator: DataStructureAnnotator, data: Step.BSTree.DeleteData) {
	annotator.annotateNode(`Delete node with value ${data.value}`, data.nodeId);
	await Promise.all([animator.animateNodeShrink(data.nodeId), animator.animateLegsShrink(data.nodeId)]);
	// animator.removeNode(data.nodeId);
}

async function handleDeleteBackward(animator: BSTreeAnimator, annotator: DataStructureAnnotator, data: Step.BSTree.DeleteData) {
	animator.ensureTree(data.startSnapshot! as BSTree);
	annotator.annotateNode(`Delete node with value ${data.value}`, data.nodeId);
	animator.setNodeColor(data.nodeId, Colors.Red);
	await Promise.all([animator.animateNodeGrowth(data.nodeId), animator.animateLegsGrowth(data.nodeId)]);
}

async function handleReplaceWithChildForward(animator: BSTreeAnimator, annotator: DataStructureAnnotator, data: Step.BSTree.ReplaceWithChildData) {
	annotator.annotateNode(`Replace node with its ${data.direction} child`, data.oldNodeId);
	await Promise.all([
		animator.animateNodeMovement(data.newNodeId, animator.getPosition(data.newNodeId), animator.getPosition(data.oldNodeId)),
		animator.animateNodeShrink(data.oldNodeId),
		animator.animateLegsShrink(data.oldNodeId),
	]);
}

async function handleReplaceWithChildBackward(animator: BSTreeAnimator, annotator: DataStructureAnnotator, data: Step.BSTree.ReplaceWithChildData) {
	animator.ensureTree(data.startSnapshot! as BSTree);
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

async function handleFoundInorderSuccessorForward(animator: BSTreeAnimator, annotator: DataStructureAnnotator, data: Step.BSTree.FoundInorderSuccessorData) {
	annotator.annotateNode(`Found inorder successor`, data.successorId);
	animator.setNodeColor(data.successorId, Colors.Blue);
}

async function handleFoundInorderSuccessorBackward(animator: BSTreeAnimator, annotator: DataStructureAnnotator, data: Step.BSTree.FoundInorderSuccessorData) {
	annotator.annotateNode(`Found inorder successor`, data.successorId);
	animator.resetNodeColor(data.successorId);
}

async function handleRelinkSuccessorChildForward(animator: BSTreeAnimator, annotator: DataStructureAnnotator, data: Step.BSTree.RelinkSuccessorChildData) {
	annotator.annotateNode(`Relink inorder successor's child`, data.childNodeId);

	let originalChildPos = animator.getPosition(data.childNodeId);
	let originalSuccessorPos = animator.getPosition(data.successorNodeId);

	animator.unlinkNode(data.successorNodeId, data.childNodeId);
	animator.unlinkNode(data.newParentNodeId, data.successorNodeId);

	animator.addDummyNode(data.successorNodeId, 1);

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

async function handleRelinkSuccessorChildBackward(animator: BSTreeAnimator, annotator: DataStructureAnnotator, data: Step.BSTree.RelinkSuccessorChildData) {
	annotator.annotateNode(`Relink inorder successor's child`, data.childNodeId);
	animator.ensureTree(data.startSnapshot! as BSTree);
}

async function handleReplaceWithInorderSuccessorForward(animator: BSTreeAnimator, annotator: DataStructureAnnotator, data: Step.BSTree.ReplaceWithInorderSuccessorData) {
	if (animator.nodeExists(getDummyNodeId(data.successorNodeId, 0)))
		animator.removeNode(getDummyNodeId(data.successorNodeId, 0), true);
	if (animator.nodeExists(getDummyNodeId(data.successorNodeId, 1)))
		animator.removeNode(getDummyNodeId(data.successorNodeId, 1), true);

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

	animator.snapNodeTo(data.successorNodeId, animator.getPosition(data.oldNodeId).x, animator.getPosition(data.oldNodeId).y);
}

async function handleReplaceWithInorderSuccessorBackward(animator: BSTreeAnimator, annotator: DataStructureAnnotator, data: Step.BSTree.ReplaceWithInorderSuccessorData) {
	animator.ensureTree(data.startSnapshot! as BSTree);
	animator.resetFormatting();
	animator.setNodeColor(data.successorNodeId, Colors.Blue);
	animator.setNodeColor(data.oldNodeId, Colors.Red);
	annotator.annotateNode(`Replace node with inorder successor`, data.oldNodeId);
}

export class BSTreeStepHandler extends StepHandlerBase {
	async stepSetup(currentStep: StepData, baseAnimator: DataStructureAnimator, baseAnnotator: DataStructureAnnotator, isForward: boolean) {
		let animator = baseAnimator as BSTreeAnimator;
		if (isForward && currentStep.startSnapshot) {
			animator.ensureTree(currentStep.startSnapshot);
		}
		if (!isForward && currentStep.endSnapshot) {
			animator.ensureTree(currentStep.endSnapshot);
		}
	}

	async stepCleanup(currentStep: StepData, baseAnimator: DataStructureAnimator, baseAnnotator: DataStructureAnnotator, isForward: boolean) {
		let animator = baseAnimator as BSTreeAnimator;

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
		baseAnnotator: DataStructureAnnotator,
		operationManager: OperationManager,
		isForward: boolean = true,
	) {
		let animator = baseAnimator as BSTreeAnimator;
		let annotator = baseAnnotator as DataStructureAnnotator;

		switch (currentStep.type as StepTypeValue) {
			case StepType.BSTree.Start:
				if (isForward) await handleStartForward(animator, annotator, operationManager);
				else await handleStartBackward(animator, annotator, operationManager);
				break;
			case StepType.BSTree.End:
				if (isForward) await handleEndForward(animator, annotator, operationManager);
				else await handleEndBackward(animator, annotator, operationManager);
				break;
			case StepType.BSTree.CreateRoot:
				if (isForward) await handleCreateRootForward(animator, annotator, currentStep.data as any);
				else await handleCreateRootBackward(animator, annotator, currentStep.data as any);
				break;
			case StepType.BSTree.CreateLeaf:
				if (isForward) await handleCreateLeafForward(animator, annotator, currentStep.data as any);
				else await handleCreateLeafBackward(animator, annotator, currentStep.data as any);
				break;
			case StepType.BSTree.Compare:
				if (isForward) await handleCompareForward(animator, annotator, currentStep.data as any);
				else await handleCompareBackward(animator, annotator, currentStep.data as any);
				break;
			case StepType.BSTree.Traverse:
				if (isForward) await handleTraverseForward(animator, annotator, currentStep.data as any);
				else await handleTraverseBackward(animator, annotator, currentStep.data as any);
				break;
			case StepType.BSTree.Drop:
				if (isForward) await handleDropForward(animator, annotator, currentStep.data as any);
				else await handleDropBackward(animator, annotator, currentStep.data as any);
				break;
			case StepType.BSTree.Found:
				if (isForward) await handleFoundForward(animator, annotator, currentStep.data as any);
				else await handleFoundBackward(animator, annotator, currentStep.data as any);
				break;
			case StepType.BSTree.MarkToDelete:
				if (isForward) await handleMarkToDeleteForward(animator, annotator, currentStep.data as any);
				else await handleMarkToDeleteBackward(animator, annotator, currentStep.data as any);
				break;
			case StepType.BSTree.Delete:
				if (isForward) await handleDeleteForward(animator, annotator, currentStep.data as any);
				else await handleDeleteBackward(animator, annotator, currentStep.data as any);
				break;
			case StepType.BSTree.ReplaceWithChild:
				if (isForward) await handleReplaceWithChildForward(animator, annotator, currentStep.data as any);
				else await handleReplaceWithChildBackward(animator, annotator, currentStep.data as any);
				break;
			case StepType.BSTree.FoundInorderSuccessor:
				if (isForward) await handleFoundInorderSuccessorForward(animator, annotator, currentStep.data as any);
				else await handleFoundInorderSuccessorBackward(animator, annotator, currentStep.data as any);
				break;
			case StepType.BSTree.RelinkSuccessorChild:
				if (isForward) await handleRelinkSuccessorChildForward(animator, annotator, currentStep.data as any);
				else await handleRelinkSuccessorChildBackward(animator, annotator, currentStep.data as any);
				break;
			case StepType.BSTree.ReplaceWithInorderSuccessor:
				if (isForward) await handleReplaceWithInorderSuccessorForward(animator, annotator, currentStep.data as any);
				else await handleReplaceWithInorderSuccessorBackward(animator, annotator, currentStep.data as any);
				break;
		}
	}
}
