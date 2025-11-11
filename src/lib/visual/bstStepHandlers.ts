import type { OperationManager } from '$lib/operation/operationManager';
import { Step } from '$lib/operation/stepData';
import type { BSTree } from '$lib/structures/bsTree';
import { getDummyNodeId } from '$lib/utils/graphs';
import { relationTextToSymbol } from '$lib/utils/utils';
import type { BSTreeAnimator } from './bstAnimator';

export async function handleStartForward(renderer: BSTreeAnimator, operationManager: OperationManager) {
	const info = `Starting ${operationManager.getCurrentOperation().operation.toString()} operation`;
	await Promise.all([renderer.animateAnnotateNode(info, null), renderer.animateNodeGrowth('info-node')]);
}

export function handleStartBackward(renderer: BSTreeAnimator, _operationManager: OperationManager) {
	renderer.hideInfoNode();
}

export function handleEndForward(renderer: BSTreeAnimator, operationManager: OperationManager) {
	renderer.hideInfoNode();
	// ensure tree has the state of operation end
	renderer.ensureTree(operationManager.getCurrentOperation().endSnapshot as BSTree);
}

export function handleEndBackward(renderer: BSTreeAnimator, _operationManager: OperationManager) {
	// same as forward for now; orchestrator will restore snapshots
	renderer.hideInfoNode();
}

export async function handleCreateRootForward(renderer: BSTreeAnimator, data: Step.BSTree.CreateRootData) {
	renderer.addNode(data.nodeId, data.value);
	renderer.animateAnnotateNode(`Create root node with value ${data.value}`, data.nodeId);
	await Promise.all([renderer.animateNodeGrowth(data.nodeId), renderer.animateLegsGrowth(data.nodeId)]);
}

export async function handleCreateRootBackward(renderer: BSTreeAnimator, data: Step.BSTree.CreateRootData) {
	await Promise.all([
		renderer.animateAnnotateNode(`Create root node with value ${data.value}`, data.nodeId),
		renderer.animateNodeShrink(data.nodeId),
		renderer.animateLegsShrink(data.nodeId),
	]);
	renderer.removeNode(data.nodeId);
}

export async function handleCreateLeafForward(renderer: BSTreeAnimator, data: Step.BSTree.CreateLeafData) {
	const info = `Create ${data.direction} child with value ${data.value}`;
	renderer.addNode(data.nodeId, data.value, data.parentId, data.direction);
	await Promise.all([
		renderer.animateAnnotateNode(info, data.parentId),
		renderer.animateNodeGrowth(data.nodeId),
		renderer.animateLegsGrowth(data.nodeId),
		renderer.animateNodeMovement('info-node', renderer.getPositionAbove(data.parentId), renderer.getPositionAbove(data.nodeId)),
	]);
}

export async function handleCreateLeafBackward(renderer: BSTreeAnimator, data: Step.BSTree.CreateLeafData) {
	const info = `Create ${data.direction} child with value ${data.value}`;
	await Promise.all([
		renderer.animateAnnotateNode(info, data.nodeId),
		renderer.animateNodeShrink(data.nodeId),
		renderer.animateLegsShrink(data.nodeId),
		renderer.animateNodeMovement('info-node', renderer.getPositionAbove(data.nodeId), renderer.getPositionAbove(data.parentId)),
	]);
	renderer.removeNode(data.nodeId);
	renderer.snapNodeAbove('info-node', data.parentId);
}

export async function handleCompareForward(renderer: BSTreeAnimator, data: Step.BSTree.CompareData) {
	await renderer.animateAnnotateNode(`${data.value} ${relationTextToSymbol(data.result)} ${data.comparisonValue}`, data.comparisonId);
}

export async function handleCompareBackward(renderer: BSTreeAnimator, data: Step.BSTree.CompareData) {
	await renderer.animateAnnotateNode(`${data.value} ${relationTextToSymbol(data.result)} ${data.comparisonValue}`, data.comparisonId);
}

export async function handleTraverseForward(renderer: BSTreeAnimator, data: Step.BSTree.TraverseData) {
	const positionFrom = renderer.getPositionAbove(data.fromId);
	const positionTo =
		data.toId === -1 ? renderer.getPositionAbove(getDummyNodeId(data.fromId, data.direction)) : renderer.getPositionAbove(data.toId);
	await renderer.animateAnnotateNode(`Traverse to ${data.direction} child`, data.fromId);
	renderer.animateNodeMovement('info-node', positionFrom, positionTo);
}

export async function handleTraverseBackward(renderer: BSTreeAnimator, data: Step.BSTree.TraverseData) {
	const positionFrom = renderer.getPositionAbove(data.fromId);
	const positionTo =
		data.toId === -1 ? renderer.getPositionAbove(getDummyNodeId(data.fromId, data.direction)) : renderer.getPositionAbove(data.toId);
	await renderer.animateAnnotateNode(`Traverse to ${data.direction} child`, data.toId);
	renderer.animateNodeMovement('info-node', positionTo, positionFrom);
}

export async function handleDropForward(renderer: BSTreeAnimator, data: Step.BSTree.DropData) {
	await renderer.animateAnnotateNode(`Drop value ${data.value}`, data.fromId);
	const positionFrom = renderer.getPositionAbove(data.fromId);
	const positionTo = { x: positionFrom.x, y: positionFrom.y + 200 };
	await Promise.all([
		renderer.animateNodeMovement('info-node', positionFrom, positionTo),
		renderer.animateNodeOpacityChange('info-node', 1, 0),
	]);
	renderer.hideInfoNode();
}

export async function handleDropBackward(renderer: BSTreeAnimator, data: Step.BSTree.DropData) {
	await renderer.changeInfoNodeAnnotation(`Drop value ${data.value}`);

	const positionFrom = renderer.getPositionAbove(data.fromId);
	const positionTo = { x: positionFrom.x, y: positionFrom.y + 200 };
	await Promise.all([
		renderer.animateNodeMovement('info-node', positionTo, positionFrom),
		renderer.animateNodeOpacityChange('info-node', 0, 1),
	]);
}

export function handleFoundForward(renderer: BSTreeAnimator, data: Step.BSTree.FoundData) {
	renderer.animateAnnotateNode(`Found node with value ${data.value}`, data.nodeId);
	renderer.setNodeColor(data.nodeId, '#7CFC00');
}

export function handleFoundBackward(renderer: BSTreeAnimator, data: Step.BSTree.FoundData) {
	renderer.animateAnnotateNode(`Found node with value ${data.value}`, data.nodeId);
	renderer.resetNodeColor(data.nodeId);
}

export function handleMarkToDeleteForward(renderer: BSTreeAnimator, data: Step.BSTree.MarkToDeleteData) {
	renderer.animateAnnotateNode(`Mark node with value ${data.value} to delete`, data.nodeId);
	renderer.setNodeColor(data.nodeId, '#FF4500');
}

export function handleMarkToDeleteBackward(renderer: BSTreeAnimator, data: Step.BSTree.MarkToDeleteData) {
	renderer.animateAnnotateNode(`Mark node with value ${data.value} to delete`, data.nodeId);
	renderer.resetNodeColor(data.nodeId);
}

export async function handleDeleteForward(renderer: BSTreeAnimator, data: Step.BSTree.DeleteData) {
	renderer.animateAnnotateNode(`Delete node with value ${data.value}`, data.nodeId);
	await Promise.all([renderer.animateNodeShrink(data.nodeId), renderer.animateLegsShrink(data.nodeId)]);
	// renderer.removeNode(data.nodeId);
}

export async function handleDeleteBackward(renderer: BSTreeAnimator, data: Step.BSTree.DeleteData) {
	// restore authoritative snapshot handled by orchestrator; highlight node as deleted state
	renderer.ensureTree(data.startSnapshot! as BSTree);
	renderer.animateAnnotateNode(`Delete node with value ${data.value}`, data.nodeId);
	renderer.setNodeColor(data.nodeId, '#FF4500');
	await Promise.all([renderer.animateNodeGrowth(data.nodeId), renderer.animateLegsGrowth(data.nodeId)]);
}

export async function handleReplaceWithChildForward(renderer: BSTreeAnimator, data: Step.BSTree.ReplaceWithChildData) {
	renderer.animateAnnotateNode(`Replace node with its ${data.direction} child`, data.oldNodeId);
	await Promise.all([
		renderer.animateNodeMovement(data.newNodeId, renderer.getPosition(data.newNodeId), renderer.getPosition(data.oldNodeId)),
		renderer.animateNodeShrink(data.oldNodeId),
		renderer.animateLegsShrink(data.oldNodeId),
	]);
}

export async function handleReplaceWithChildBackward(renderer: BSTreeAnimator, data: Step.BSTree.ReplaceWithChildData) {
	renderer.ensureTree(data.startSnapshot! as BSTree);
	renderer.animateAnnotateNode(`Replace node with its ${data.direction} child`, data.oldNodeId);
	renderer.setNodeColor(data.oldNodeId, '#FF4500');

	const childPosition = renderer.getPosition(data.newNodeId);
	const deletedParentPosition = renderer.getPosition(data.oldNodeId);
	renderer.snapNodeTo(data.newNodeId, deletedParentPosition.x, deletedParentPosition.y);

	await Promise.all([
		renderer.animateNodeMovement(data.newNodeId, deletedParentPosition, childPosition),
		renderer.animateNodeGrowth(data.oldNodeId),
		renderer.animateLegsGrowth(data.oldNodeId),
	]);
}

export async function handleFoundInorderSuccessorForward(renderer: BSTreeAnimator, data: Step.BSTree.FoundInorderSuccessorData) {
	renderer.animateAnnotateNode(`Found inorder successor`, data.successorId);
	renderer.setNodeColor(data.successorId, '#7CFC00');
}

export async function handleFoundInorderSuccessorBackward(renderer: BSTreeAnimator, data: Step.BSTree.FoundInorderSuccessorData) {
	renderer.animateAnnotateNode(`Found inorder successor`, data.successorId);
	renderer.resetNodeColor(data.successorId);
}

export async function handleRelinkSuccessorChildForward(renderer: BSTreeAnimator, data: Step.BSTree.RelinkSuccessorChildData) {
	renderer.animateAnnotateNode(`Relink inorder successor's child`, data.childNodeId);
	if (renderer.edges) {
		const leftOrRight = data.childValue < data.newParentValue ? 'left' : 'right';
		renderer.edges.remove(`edge-${data.successorNodeId}-${leftOrRight}`);
		renderer.edges.add({ id: `edge-${data.newParentNodeId}-${leftOrRight}`, from: data.newParentNodeId, to: data.childNodeId });
	}
}

export async function handleRelinkSuccessorChildBackward(renderer: BSTreeAnimator, data: Step.BSTree.RelinkSuccessorChildData) {
	renderer.ensureTree(data.startSnapshot! as BSTree);
}

export async function handleReplaceWithInorderSuccessorForward(
	renderer: BSTreeAnimator,
	data: Step.BSTree.ReplaceWithInorderSuccessorData,
) {
	await renderer.animateAnnotateNode(`Replace node with inorder successor`, data.oldNodeId);

	// Remove dummy children of successor if any
	await renderer.animateLegsShrink(data.successorNodeId);
	renderer.removeNode(getDummyNodeId(data.successorNodeId, 'right'));
	renderer.removeNode(getDummyNodeId(data.successorNodeId, 'left'));

	// Unlink successor from its parent
	renderer.unlinkNode(data.successorParentId, data.successorNodeId);
	renderer.addDummyNode(data.successorParentId, 'left');

	// Move back to new dummy position
	const dummyPos = renderer.getPosition(getDummyNodeId(data.successorParentId, 'left'));
	renderer.snapNodeTo(data.successorNodeId, dummyPos.x, dummyPos.y);

	// Shrink old node
	await renderer.animateNodeShrink(data.oldNodeId);

	// Move successor to old node's position
	await renderer.animateNodeMovement(
		data.successorNodeId,
		renderer.getPosition(data.successorNodeId),
		renderer.getPosition(data.oldNodeId),
	);
}

export async function handleReplaceWithInorderSuccessorBackward(
	renderer: BSTreeAnimator,
	data: Step.BSTree.ReplaceWithInorderSuccessorData,
) {
	renderer.ensureTree(data.startSnapshot! as BSTree);
	await renderer.animateAnnotateNode(`Replace node with inorder successor`, data.oldNodeId);
}

export default {};
