import { Colors } from '$lib/assets/colors';
import type { AVLTreeAnimator } from '$lib/data-structures/structures/avlTree/avlTreeAnimator';
import type { BSTreeAnimator } from '$lib/data-structures/structures/bsTree/bsTreeAnimator';
import { getDummyNodeId } from '$lib/data-structures/utils/graphs';
import { relationTextToSymbol } from '$lib/data-structures/utils/utils';
import type { DataStructureAnnotator } from '$lib/data-structures/visual/annotators/dataStructureAnnotator';

// Use `any` for animator so this common module can work with BSTreeAnimator, AVLTreeAnimator, etc.
// These concrete animator classes extend the project's BinaryTreeAnimator and expose methods
// like `addNode`, `animateNodeGrowth`, `animateLegsGrowth`, `unlinkNode`, `linkNode`, etc.
type AnyAnimator = BSTreeAnimator | AVLTreeAnimator;

// Shared implementations of handlers used by both BST and AVL step handlers.
// Functions use the generic DataStructureAnimator API so both specific animators can call them.

export async function handleStartForwardCommon(animator: AnyAnimator, annotator: DataStructureAnnotator, operationManager: any) {
	if (animator.ensureTree) animator.ensureTree(operationManager.getCurrentOperation().startSnapshot);
	if (animator.resetFormatting) animator.resetFormatting();

	if (operationManager.getCurrentOperation().operation == 'Empty') {
		const info = `The tree is empty`;
		annotator.annotateNode(info, null);
		return;
	}

	const info = `Starting ${operationManager.getCurrentOperation().operation.toString()} operation`;
	annotator.annotateNode(info, null);

	if (animator.hasNodes && animator.hasNodes()) {
		const value = operationManager.getCurrentOperation().operation.split(' ')[1];
		annotator.createValueAnnotation(value, null);
	}
}

export async function handleStartBackwardCommon(animator: AnyAnimator, annotator: DataStructureAnnotator, operationManager: any) {
	if (operationManager.getCurrentOperation().operation == 'Empty') {
		const info = `The tree is empty`;
		annotator.annotateNode(info, null);
		return;
	}

	const info = `Starting ${operationManager.getCurrentOperation().operation.toString()} operation`;
	annotator.annotateNode(info, null);
	annotator.removeValueAnnotation();
}

export function handleEndForwardCommon(animator: AnyAnimator, annotator: DataStructureAnnotator, operationManager: any) {
	if (animator.ensureTree) animator.ensureTree(operationManager.getCurrentOperation().endSnapshot);

	annotator.clearAnnotation();
	annotator.clearValueAnnotation();
}

export function handleEndBackwardCommon(animator: AnyAnimator, annotator: DataStructureAnnotator, operationManager: any) {
	annotator.clearAnnotation();
	annotator.clearValueAnnotation();
	if (animator.ensureTree) animator.ensureTree(operationManager.getCurrentOperation().endSnapshot);
}

export async function handleCreateRootForwardCommon(animator: AnyAnimator, annotator: DataStructureAnnotator, data: any) {
	animator.addNode(data.nodeId, data.value);
	annotator.annotateNode(`Create root node with value ${data.value}`, data.nodeId);

	await Promise.all([animator.animateNodeGrowth(data.nodeId), animator.animateLegsGrowth(data.nodeId)]);
}

export async function handleCreateRootBackwardCommon(animator: AnyAnimator, annotator: DataStructureAnnotator, data: any) {
	annotator.annotateNode(`Create root node with value ${data.value}`, data.nodeId);
	await Promise.all([
		animator.animateNodeShrink(data.nodeId),
		animator.animateLegsShrink(data.nodeId),
	]);
	animator.removeNode(data.nodeId);
}

export async function handleCreateLeafForwardCommon(animator: AnyAnimator, annotator: DataStructureAnnotator, data: any) {
	const info = `Create ${data.direction} child with value ${data.value}`;
	const childNumber = data.direction === 'left' ? 0 : 1;

	animator.addNode(data.nodeId, data.value, data.parentId, childNumber);
	annotator.annotateNode(info, data.nodeId);

	await Promise.all([
		animator.animateNodeGrowth(data.nodeId),
		animator.animateLegsGrowth(data.nodeId),
		annotator.moveValueAnnotationTo(data.nodeId),
	]);
	annotator.clearValueAnnotation();
}

export async function handleCreateLeafBackwardCommon(animator: AnyAnimator, annotator: DataStructureAnnotator, data: any) {
	const info = `Create ${data.direction} child with value ${data.value}`;
	annotator.annotateNode(info, data.parentId);
	annotator.createValueAnnotation(String(data.value), data.nodeId);

	await Promise.all([
		animator.animateNodeShrink(data.nodeId),
		animator.animateLegsShrink(data.nodeId),
		annotator.moveValueAnnotationTo(data.parentId),
	]);

	animator.removeNode(data.nodeId);
}

export async function handleCompareForwardCommon(animator: AnyAnimator, annotator: DataStructureAnnotator, data: any) {
	annotator.annotateNode(`${data.value} ${relationTextToSymbol(data.result)} ${data.comparisonValue}`, data.comparisonId);
}

export async function handleCompareBackwardCommon(animator: AnyAnimator, annotator: DataStructureAnnotator, data: any) {
	annotator.annotateNode(`${data.value} ${relationTextToSymbol(data.result)} ${data.comparisonValue}`, data.comparisonId);
}

export async function handleTraverseForwardCommon(animator: AnyAnimator, annotator: DataStructureAnnotator, data: any) {
	if (data.toId !== -1) {
		await annotator.moveValueAnnotationTo(data.toId);
	} else {
		await annotator.moveValueAnnotationTo(data.fromId);
	}
	annotator.annotateNode(`Traverse to ${data.direction} child`, data.fromId);
}

export async function handleTraverseBackwardCommon(animator: AnyAnimator, annotator: DataStructureAnnotator, data: any) {
	await annotator.moveValueAnnotationTo(data.fromId);
	annotator.annotateNode(`Traverse to ${data.direction} child`, data.fromId);
}

export async function handleDropForwardCommon(animator: AnyAnimator, annotator: DataStructureAnnotator, data: any) {
	annotator.annotateNode(`Drop value ${data.value}`, data.fromId);
	annotator.clearValueAnnotation();
}

export async function handleDropBackwardCommon(animator: AnyAnimator, annotator: DataStructureAnnotator, data: any) {
	annotator.annotateNode(`Drop value ${data.value}`, data.fromId);
	annotator.createValueAnnotation(String(data.value), data.fromId);
}

export function handleFoundForwardCommon(animator: AnyAnimator, annotator: DataStructureAnnotator, data: any) {
	annotator.annotateNode(`Found node with value ${data.value}`, data.nodeId);
	animator.setNodeColor(data.nodeId, Colors.Green);
	annotator.clearValueAnnotation();
}

export function handleFoundBackwardCommon(animator: AnyAnimator, annotator: DataStructureAnnotator, data: any) {
	annotator.annotateNode(`Found node with value ${data.value}`, data.nodeId);
	animator.resetNodeColor(data.nodeId);
	annotator.createValueAnnotation(String(data.value), data.nodeId);
}

export function handleMarkToDeleteForwardCommon(animator: AnyAnimator, annotator: DataStructureAnnotator, data: any) {
	annotator.annotateNode(`Mark node with value ${data.value} to delete`, data.nodeId);
	animator.setNodeColor(data.nodeId, Colors.Red);
	annotator.clearValueAnnotation();
}

export function handleMarkToDeleteBackwardCommon(animator: AnyAnimator, annotator: DataStructureAnnotator, data: any) {
	annotator.annotateNode(`Mark node with value ${data.value} to delete`, data.nodeId);
	animator.resetNodeColor(data.nodeId);
	annotator.createValueAnnotation(String(data.value), data.nodeId);
}

export async function handleDeleteForwardCommon(animator: AnyAnimator, annotator: DataStructureAnnotator, data: any) {
	annotator.annotateNode(`Delete node with value ${data.value}`, data.nodeId);
	await Promise.all([animator.animateNodeShrink(data.nodeId), animator.animateLegsShrink(data.nodeId)]);
}

export async function handleDeleteBackwardCommon(animator: AnyAnimator, annotator: DataStructureAnnotator, data: any) {
	if (animator.ensureTree) animator.ensureTree(data.startSnapshot);
	annotator.annotateNode(`Delete node with value ${data.value}`, data.nodeId);
	animator.setNodeColor(data.nodeId, Colors.Red);
	await Promise.all([animator.animateNodeGrowth(data.nodeId), animator.animateLegsGrowth(data.nodeId)]);
}

export async function handleReplaceWithChildForwardCommon(animator: AnyAnimator, annotator: DataStructureAnnotator, data: any) {
	annotator.annotateNode(`Replace node with its ${data.direction} child`, data.oldNodeId);
	await Promise.all([
		animator.animateNodeMovement(data.newNodeId, animator.getPosition(data.newNodeId), animator.getPosition(data.oldNodeId)),
		animator.animateNodeShrink(data.oldNodeId),
		animator.animateLegsShrink(data.oldNodeId),
	]);
}

export async function handleReplaceWithChildBackwardCommon(animator: AnyAnimator, annotator: DataStructureAnnotator, data: any) {
	if (animator.ensureTree) animator.ensureTree(data.startSnapshot);
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

export async function handleFoundInorderSuccessorForwardCommon(animator: AnyAnimator, annotator: DataStructureAnnotator, data: any) {
	annotator.annotateNode(`Found inorder successor`, data.successorId);
	animator.setNodeColor(data.successorId, Colors.Blue);
}

export async function handleFoundInorderSuccessorBackwardCommon(animator: AnyAnimator, annotator: DataStructureAnnotator, data: any) {
	annotator.annotateNode(`Found inorder successor`, data.successorId);
	animator.resetNodeColor(data.successorId);
}

export async function handleRelinkSuccessorChildForwardCommon(animator: AnyAnimator, annotator: DataStructureAnnotator, data: any) {
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

export async function handleRelinkSuccessorChildBackwardCommon(animator: AnyAnimator, annotator: DataStructureAnnotator, data: any) {
	annotator.annotateNode(`Relink inorder successor's child`, data.newParentNodeId);
	if (animator.ensureTree) animator.ensureTree(data.startSnapshot);
}

export async function handleReplaceWithInorderSuccessorForwardCommon(animator: AnyAnimator, annotator: DataStructureAnnotator, data: any) {
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
}

export async function handleReplaceWithInorderSuccessorBackwardCommon(animator: AnyAnimator, annotator: DataStructureAnnotator, data: any) {
	if (animator.ensureTree) animator.ensureTree(data.startSnapshot);
	if (animator.resetFormatting) animator.resetFormatting();
	animator.setNodeColor(data.successorNodeId, Colors.Blue);
	animator.setNodeColor(data.oldNodeId, Colors.Red);
	annotator.annotateNode(`Replace node with inorder successor`, data.oldNodeId);
}
