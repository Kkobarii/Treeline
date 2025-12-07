import { Colors } from '$lib/assets/colors';
import type { OperationManager } from '$lib/data-structures/operation/operationManager';
import type { Step } from '$lib/data-structures/operation/stepData';
import type { AVLTreeAnimator } from '$lib/data-structures/structures/avlTree/avlTreeAnimator';
import type { BSTreeAnimator } from '$lib/data-structures/structures/bsTree/bsTreeAnimator';
import type { RBTreeAnimator } from '$lib/data-structures/structures/rbTree/rbTreeAnimator';
import { comparisonValuesToSymbol } from '$lib/data-structures/utils/utils';
import type { DataStructureAnnotator } from '$lib/data-structures/visual/annotators/dataStructureAnnotator';

type AnyAnimator = BSTreeAnimator | AVLTreeAnimator | RBTreeAnimator;

export async function handleStartForwardCommon(
	animator: AnyAnimator,
	annotator: DataStructureAnnotator,
	operationManager: OperationManager,
) {
	animator.resetFormatting();
	annotator.clearAnnotation();
	annotator.clearValueAnnotation();
	const startPositions = animator.getPositions();

	animator.ensure(operationManager.getCurrentOperation().startSnapshot);

	if (operationManager.getCurrentOperation().operation == 'Empty') {
		const info = `Start an operation to begin!`;
		annotator.annotateNode(info, null);
		return;
	}

	const info = `Starting ${operationManager.getCurrentOperation().operation.toString()} operation`;
	annotator.annotateNode(info, null);

	if (animator.hasNodes()) {
		const value = operationManager.getCurrentOperation().operation.split(' ')[1];
		annotator.createValueAnnotation(value, null);
	}
	const endPositions = animator.getPositions();
	await animator.animateRelayout(startPositions, endPositions);
}

export async function handleStartBackwardCommon(
	animator: AnyAnimator,
	annotator: DataStructureAnnotator,
	operationManager: OperationManager,
) {
	if (operationManager.getCurrentOperation().operation == 'Empty') {
		const info = `The tree is empty`;
		annotator.annotateNode(info, null);
		return;
	}

	const info = `Starting ${operationManager.getCurrentOperation().operation.toString()} operation`;
	annotator.annotateNode(info, null);
	annotator.removeValueAnnotation();
}

export async function handleEndForwardCommon(animator: AnyAnimator, annotator: DataStructureAnnotator, operationManager: OperationManager) {
	annotator.clearAnnotation();
	annotator.clearValueAnnotation();
	animator.resetFormatting();

	await animator.ensureAndAnimate(operationManager.getCurrentOperation().endSnapshot);
}

export async function handleEndBackwardCommon(
	animator: AnyAnimator,
	annotator: DataStructureAnnotator,
	operationManager: OperationManager,
) {
	annotator.clearAnnotation();
	annotator.clearValueAnnotation();
	animator.resetFormatting();

	await animator.ensureAndAnimate(operationManager.getCurrentOperation().endSnapshot);
}

export async function handleCreateRootForwardCommon(
	animator: AnyAnimator,
	annotator: DataStructureAnnotator,
	data: Step.Common.CreateRootData,
) {
	animator.ensure(data.endSnapshot);
	annotator.annotateNode(`Create root node with value ${data.value}`, data.nodeId);

	await Promise.all([animator.animateNodeGrowth(data.nodeId), animator.animateLegsGrowth(data.nodeId)]);
}

export async function handleCreateRootBackwardCommon(
	animator: AnyAnimator,
	annotator: DataStructureAnnotator,
	data: Step.Common.CreateRootData,
) {
	annotator.annotateNode(`Create root node with value ${data.value}`, data.nodeId);
	await Promise.all([animator.animateNodeShrink(data.nodeId), animator.animateLegsShrink(data.nodeId)]);
	await animator.ensureAndAnimate(data.startSnapshot);
}

export async function handleCreateLeafForwardCommon(
	animator: AnyAnimator,
	annotator: DataStructureAnnotator,
	data: Step.Common.CreateLeafData,
) {
	const info = `Create ${data.direction} child with value ${data.value}`;
	annotator.annotateNode(info, data.parentId);

	annotator.clearValueAnnotation();
	await animator.ensureAndAnimate(data.endSnapshot);
}

export async function handleCreateLeafBackwardCommon(
	animator: AnyAnimator,
	annotator: DataStructureAnnotator,
	data: Step.Common.CreateLeafData,
) {
	const info = `Create ${data.direction} child with value ${data.value}`;
	annotator.annotateNode(info, data.parentId);

	await animator.ensureAndAnimate(data.startSnapshot);
	annotator.createValueAnnotation(String(data.value), data.parentId);
}

export async function handleCompareForwardCommon(animator: AnyAnimator, annotator: DataStructureAnnotator, data: Step.Common.CompareData) {
	annotator.annotateNode(
		`${data.value} ${comparisonValuesToSymbol(data.value, data.comparisonValue)} ${data.comparisonValue}`,
		data.comparisonId,
	);
}

export async function handleCompareBackwardCommon(animator: AnyAnimator, annotator: DataStructureAnnotator, data: Step.Common.CompareData) {
	annotator.annotateNode(
		`${data.value} ${comparisonValuesToSymbol(data.value, data.comparisonValue)} ${data.comparisonValue}`,
		data.comparisonId,
	);
}

export async function handleTraverseForwardCommon(
	animator: AnyAnimator,
	annotator: DataStructureAnnotator,
	data: Step.Common.TraverseData,
) {
	annotator.annotateNode(`Traverse to ${data.direction} child`, data.fromId);
	await annotator.moveValueAnnotationTo(data.toId);
}

export async function handleTraverseBackwardCommon(
	animator: AnyAnimator,
	annotator: DataStructureAnnotator,
	data: Step.Common.TraverseData,
) {
	await annotator.moveValueAnnotationTo(data.fromId);
	annotator.annotateNode(`Traverse to ${data.direction} child`, data.fromId);
}

export async function handleDropForwardCommon(animator: AnyAnimator, annotator: DataStructureAnnotator, data: Step.Common.DropData) {
	annotator.annotateNode(`Drop value ${data.value}`, data.fromId);
	annotator.clearValueAnnotation();
}

export async function handleDropBackwardCommon(animator: AnyAnimator, annotator: DataStructureAnnotator, data: Step.Common.DropData) {
	annotator.annotateNode(`Drop value ${data.value}`, data.fromId);
	annotator.createValueAnnotation(String(data.value), data.fromId);
}

export function handleFoundForwardCommon(animator: AnyAnimator, annotator: DataStructureAnnotator, data: Step.Common.FoundData) {
	annotator.annotateNode(`Found node with value ${data.value}`, data.nodeId);
	animator.setNodeColor(data.nodeId, Colors.Green);
	annotator.clearValueAnnotation();
}

export function handleFoundBackwardCommon(animator: AnyAnimator, annotator: DataStructureAnnotator, data: Step.Common.FoundData) {
	annotator.annotateNode(`Found node with value ${data.value}`, data.nodeId);
	animator.resetNodeColor(data.nodeId);
	annotator.createValueAnnotation(String(data.value), data.nodeId);
}

export function handleMarkToDeleteForwardCommon(
	animator: AnyAnimator,
	annotator: DataStructureAnnotator,
	data: Step.Common.MarkToDeleteData,
) {
	annotator.annotateNode(`Mark node with value ${data.value} to delete`, data.nodeId);
	animator.setNodeColor(data.nodeId, Colors.Red);
	annotator.clearValueAnnotation();
}

export function handleMarkToDeleteBackwardCommon(
	animator: AnyAnimator,
	annotator: DataStructureAnnotator,
	data: Step.Common.MarkToDeleteData,
) {
	annotator.annotateNode(`Mark node with value ${data.value} to delete`, data.nodeId);
	animator.resetNodeColor(data.nodeId);
	annotator.createValueAnnotation(String(data.value), data.nodeId);
}

export async function handleDeleteForwardCommon(animator: AnyAnimator, annotator: DataStructureAnnotator, data: Step.Common.DeleteData) {
	annotator.annotateNode(`Delete node with value ${data.value}`, data.nodeId);
	await Promise.all([animator.animateNodeShrink(data.nodeId), animator.animateLegsShrink(data.nodeId)]);
	annotator.clearAnnotation();
	await animator.ensureAndAnimate(data.endSnapshot);
}

export async function handleDeleteBackwardCommon(animator: AnyAnimator, annotator: DataStructureAnnotator, data: Step.Common.DeleteData) {
	await animator.ensureAndAnimate(data.startSnapshot);
	annotator.annotateNode(`Delete node with value ${data.value}`, data.nodeId);
	animator.setNodeColor(data.nodeId, Colors.Red);
	await Promise.all([animator.animateNodeGrowth(data.nodeId), animator.animateLegsGrowth(data.nodeId)]);
}

export async function handleReplaceWithChildForwardCommon(
	animator: AnyAnimator,
	annotator: DataStructureAnnotator,
	data: Step.Common.ReplaceWithChildData,
) {
	await animator.ensureAndAnimate(data.endSnapshot);
	annotator.annotateNode(`Replace node with its ${data.direction} child`, data.newNodeId);
}

export async function handleReplaceWithChildBackwardCommon(
	animator: AnyAnimator,
	annotator: DataStructureAnnotator,
	data: Step.Common.ReplaceWithChildData,
) {
	await animator.ensureAndAnimate(data.startSnapshot);
	annotator.annotateNode(`Replace node with its ${data.direction} child`, data.oldNodeId);

	animator.setNodeColor(data.oldNodeId, Colors.Red);
	animator.setNodeColor(data.newNodeId, Colors.Blue);
}

export async function handleFoundInorderSuccessorForwardCommon(
	animator: AnyAnimator,
	annotator: DataStructureAnnotator,
	data: Step.Common.FoundInorderSuccessorData,
) {
	annotator.annotateNode(`Found inorder successor`, data.successorId);
	animator.setNodeColor(data.successorId, Colors.Blue);
}

export async function handleFoundInorderSuccessorBackwardCommon(
	animator: AnyAnimator,
	annotator: DataStructureAnnotator,
	data: Step.Common.FoundInorderSuccessorData,
) {
	annotator.annotateNode(`Found inorder successor`, data.successorId);
	animator.resetNodeColor(data.successorId);
}

export async function handleRelinkSuccessorChildForwardCommon(
	animator: AnyAnimator,
	annotator: DataStructureAnnotator,
	data: Step.Common.RelinkSuccessorChildData,
) {
	annotator.annotateNode(`Relink inorder successor's child`, data.childNodeId);

	const oldPositions = animator.getPositions();

	animator.ensure(data.endSnapshot);

	animator.addNode(data.successorNodeId, data.successorValue);
	animator.setNodeColor(data.successorNodeId, Colors.Blue);

	const posAboveChild = animator.getPosition(data.childNodeId);
	posAboveChild.y -= 50;
	animator.snapNodeTo(data.successorNodeId, posAboveChild.x, posAboveChild.y);

	const newPositions = animator.getPositions();
	await animator.animateRelayout(oldPositions, newPositions);
}

export async function handleRelinkSuccessorChildBackwardCommon(
	animator: AnyAnimator,
	annotator: DataStructureAnnotator,
	data: Step.Common.RelinkSuccessorChildData,
) {
	annotator.annotateNode(`Relink inorder successor's child`, data.childNodeId);
	await animator.ensureAndAnimate(data.startSnapshot);
}

export async function handleReplaceWithInorderSuccessorForwardCommon(
	animator: AnyAnimator,
	annotator: DataStructureAnnotator,
	data: Step.Common.ReplaceWithInorderSuccessorData,
) {
	annotator.annotateNode(`Replace node with inorder successor`, data.successorNodeId);
	animator.setNodeColor(data.successorNodeId, Colors.Blue);
	animator.setNodeColor(data.oldNodeId, Colors.Red);

	await animator.ensureAndAnimate(data.endSnapshot);
}

export async function handleReplaceWithInorderSuccessorBackwardCommon(
	animator: AnyAnimator,
	annotator: DataStructureAnnotator,
	data: Step.Common.ReplaceWithInorderSuccessorData,
) {
	let startPositions = animator.getPositions();
	animator.ensure(data.startSnapshot);
	animator.addNode(data.successorNodeId, data.successorValue);

	if (data.relinkedChildId !== null) {
		const posAboveChild = animator.getPosition(data.relinkedChildId);
		posAboveChild.y -= 50;
		animator.snapNodeTo(data.successorNodeId, posAboveChild.x, posAboveChild.y);
	}

	let endPositions = animator.getPositions();

	animator.animateRelayout(startPositions, endPositions);

	animator.setNodeColor(data.successorNodeId, Colors.Blue);
	animator.setNodeColor(data.oldNodeId, Colors.Red);

	annotator.annotateNode(`Replace node with inorder successor`, data.successorNodeId);
}
