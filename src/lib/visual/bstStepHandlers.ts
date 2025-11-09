import type { OperationManager } from '$lib/operation/operationManager';
import { Step } from '$lib/operation/stepData';
import type { BSTree } from '$lib/structures/bsTree';
import { getDummyNodeId } from '$lib/utils/graphs';
import { relationTextToSymbol } from '$lib/utils/utils';

// Minimal renderer API expected by handlers. Implementations may be more permissive.
export type RendererAPI = {
	ensureTree: (t: BSTree) => void;
	addNode: (id: number, value: number, parentId?: number, direction?: 'left' | 'right') => void;
	removeNode: (id: number, parentId?: number, direction?: 'left' | 'right') => void;
	clearDisconnectedDummyNodes: () => void;
	animateFit: () => Promise<void>;
	animateNodeGrowth: (id: number | string) => Promise<void>;
	animateNodeShrink: (id: number | string) => Promise<void>;
	animateLegsGrowth: (id: number | string) => Promise<void>;
	animateLegsShrink: (id: number | string) => Promise<void>;
	animateAnnotateNode: (text: string, id: number | string | null) => Promise<void>;
	changeInfoNodeAnnotation: (text: string) => Promise<void>;
	hideInfoNode: () => void;
	getPositionAbove: (id: number | string) => { x: number; y: number };
	getPosition: (id: number | string) => { x: number; y: number };
	animateNodeMovement: (id: number | string, from: any, to: any) => Promise<void>;
	animateNodeOpacityChange: (id: number | string, from: number, to: number) => Promise<void>;
	snapNodeAbove: (nodeId: number | string, parentId: number) => void;
	snapNodeTo: (nodeId: number | string, x: number, y: number) => void;
	setNodeColor: (nodeId: number | string, color: string) => void;
	resetNodeColor: (nodeId: number | string) => void;
	// nodes & edges are optional, used by some handlers
	nodes?: any;
	edges?: any;
};

// Split handlers into explicit forward and backward functions to make
// step inversion clearer. Each step has two exported functions: handleXForward and handleXBackward.

export async function handleStartForward(renderer: RendererAPI, operationManager: OperationManager) {
	const info = `Starting ${operationManager.getCurrentOperation().operation.toString()} operation`;
	await Promise.all([renderer.animateAnnotateNode(info, null), renderer.animateNodeGrowth('info-node')]);
}

export function handleStartBackward(renderer: RendererAPI, _operationManager: OperationManager) {
	renderer.hideInfoNode();
}

export function handleEndForward(renderer: RendererAPI, operationManager: OperationManager) {
	renderer.hideInfoNode();
	// ensure tree has the state of operation end
	renderer.ensureTree(operationManager.getCurrentOperation().endSnapshot as BSTree);
}

export function handleEndBackward(renderer: RendererAPI, _operationManager: OperationManager) {
	// same as forward for now; orchestrator will restore snapshots
	renderer.hideInfoNode();
}

export async function handleCreateRootForward(renderer: RendererAPI, data: Step.BSTree.CreateRootData) {
	renderer.addNode(data.nodeId, data.value);
	renderer.animateAnnotateNode(`Create root node with value ${data.value}`, data.nodeId);
	await Promise.all([renderer.animateNodeGrowth(data.nodeId), renderer.animateLegsGrowth(data.nodeId)]);
}

export async function handleCreateRootBackward(renderer: RendererAPI, data: Step.BSTree.CreateRootData) {
	await Promise.all([
		renderer.animateAnnotateNode(`Create root node with value ${data.value}`, data.nodeId),
		renderer.animateNodeShrink(data.nodeId),
		renderer.animateLegsShrink(data.nodeId),
	]);
	renderer.removeNode(data.nodeId);
}

export async function handleCreateLeafForward(renderer: RendererAPI, data: Step.BSTree.CreateLeafData) {
	const info = `Create ${data.direction} child with value ${data.value}`;
	renderer.addNode(data.nodeId, data.value, data.parentId, data.direction);
	await Promise.all([
		renderer.animateAnnotateNode(info, data.parentId),
		renderer.animateNodeGrowth(data.nodeId),
		renderer.animateLegsGrowth(data.nodeId),
		renderer.animateNodeMovement('info-node', renderer.getPositionAbove(data.parentId), renderer.getPositionAbove(data.nodeId)),
	]);
}

export async function handleCreateLeafBackward(renderer: RendererAPI, data: Step.BSTree.CreateLeafData) {
	const info = `Create ${data.direction} child with value ${data.value}`;
	await Promise.all([
		renderer.animateAnnotateNode(info, data.nodeId),
		renderer.animateNodeShrink(data.nodeId),
		renderer.animateLegsShrink(data.nodeId),
		renderer.animateNodeMovement('info-node', renderer.getPositionAbove(data.nodeId), renderer.getPositionAbove(data.parentId)),
	]);
	renderer.removeNode(data.nodeId, data.parentId, data.direction);
	renderer.snapNodeAbove('info-node', data.parentId);
}

export async function handleCompareForward(renderer: RendererAPI, data: Step.BSTree.CompareData) {
	await renderer.animateAnnotateNode(`${data.value} ${relationTextToSymbol(data.result)} ${data.comparisonValue}`, data.comparisonId);
}

export async function handleCompareBackward(renderer: RendererAPI, data: Step.BSTree.CompareData) {
	await renderer.animateAnnotateNode(`${data.value} ${relationTextToSymbol(data.result)} ${data.comparisonValue}`, data.comparisonId);
}

export async function handleTraverseForward(renderer: RendererAPI, data: Step.BSTree.TraverseData) {
	const positionFrom = renderer.getPositionAbove(data.fromId);
	const positionTo =
		data.toId === -1 ? renderer.getPositionAbove(getDummyNodeId(data.fromId, data.direction)) : renderer.getPositionAbove(data.toId);
	await renderer.animateAnnotateNode(`Traverse to ${data.direction} child`, data.fromId);
	renderer.animateNodeMovement('info-node', positionFrom, positionTo);
}

export async function handleTraverseBackward(renderer: RendererAPI, data: Step.BSTree.TraverseData) {
	const positionFrom = renderer.getPositionAbove(data.fromId);
	const positionTo =
		data.toId === -1 ? renderer.getPositionAbove(getDummyNodeId(data.fromId, data.direction)) : renderer.getPositionAbove(data.toId);
	await renderer.animateAnnotateNode(`Traverse to ${data.direction} child`, data.toId);
	renderer.animateNodeMovement('info-node', positionTo, positionFrom);
}

export async function handleDropForward(renderer: RendererAPI, data: Step.BSTree.DropData) {
	await renderer.animateAnnotateNode(`Drop value ${data.value}`, data.fromId);
	const positionFrom = renderer.getPositionAbove(data.fromId);
	const positionTo = { x: positionFrom.x, y: positionFrom.y + 200 };
	await Promise.all([
		renderer.animateNodeMovement('info-node', positionFrom, positionTo),
		renderer.animateNodeOpacityChange('info-node', 1, 0),
	]);
	renderer.hideInfoNode();
}

export async function handleDropBackward(renderer: RendererAPI, data: Step.BSTree.DropData) {
	await renderer.changeInfoNodeAnnotation(`Drop value ${data.value}`);

	const positionFrom = renderer.getPositionAbove(data.fromId);
	const positionTo = { x: positionFrom.x, y: positionFrom.y + 200 };
	await Promise.all([
		renderer.animateNodeMovement('info-node', positionTo, positionFrom),
		renderer.animateNodeOpacityChange('info-node', 0, 1),
	]);
}

export function handleFoundForward(renderer: RendererAPI, data: Step.BSTree.FoundData) {
	renderer.animateAnnotateNode(`Found node with value ${data.value}`, data.nodeId);
	renderer.setNodeColor(data.nodeId, '#7CFC00');
}

export function handleFoundBackward(renderer: RendererAPI, data: Step.BSTree.FoundData) {
	renderer.animateAnnotateNode(`Found node with value ${data.value}`, data.nodeId);
	renderer.resetNodeColor(data.nodeId);
}

export function handleMarkToDeleteForward(renderer: RendererAPI, data: Step.BSTree.MarkToDeleteData) {
	renderer.animateAnnotateNode(`Mark node with value ${data.value} to delete`, data.nodeId);
	renderer.setNodeColor(data.nodeId, '#FF4500');
}

export function handleMarkToDeleteBackward(renderer: RendererAPI, data: Step.BSTree.MarkToDeleteData) {
	renderer.animateAnnotateNode(`Mark node with value ${data.value} to delete`, data.nodeId);
	renderer.resetNodeColor(data.nodeId);
}

export async function handleDeleteForward(renderer: RendererAPI, data: Step.BSTree.DeleteData) {
	renderer.animateAnnotateNode(`Delete node with value ${data.value}`, data.nodeId);
	await Promise.all([renderer.animateNodeShrink(data.nodeId), renderer.animateLegsShrink(data.nodeId)]);
	renderer.removeNode(data.nodeId);
}

export async function handleDeleteBackward(renderer: RendererAPI, data: Step.BSTree.DeleteData) {
	// restore authoritative snapshot handled by orchestrator; highlight node as deleted state
	renderer.ensureTree(data.startSnapshot! as BSTree);
	renderer.animateAnnotateNode(`Delete node with value ${data.value}`, data.nodeId);
	renderer.setNodeColor(data.nodeId, '#FF4500');
	await Promise.all([renderer.animateNodeGrowth(data.nodeId), renderer.animateLegsGrowth(data.nodeId)]);
}

export async function handleReplaceWithChildForward(renderer: RendererAPI, data: Step.BSTree.ReplaceWithChildData) {
	renderer.animateAnnotateNode(`Replace node with its ${data.direction} child`, data.oldNodeId);
	await Promise.all([
		renderer.animateNodeMovement(data.newNodeId, renderer.getPosition(data.newNodeId), renderer.getPosition(data.oldNodeId)),
		renderer.animateNodeShrink(data.oldNodeId),
		renderer.animateLegsShrink(data.oldNodeId),
	]);
}

export async function handleReplaceWithChildBackward(renderer: RendererAPI, data: Step.BSTree.ReplaceWithChildData) {
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

export async function handleFoundInorderSuccessorForward(renderer: RendererAPI, data: Step.BSTree.FoundInorderSuccessorData) {
	renderer.animateAnnotateNode(`Found inorder successor`, data.successorId);
	renderer.setNodeColor(data.successorId, '#7CFC00');
}

export async function handleFoundInorderSuccessorBackward(renderer: RendererAPI, data: Step.BSTree.FoundInorderSuccessorData) {
	renderer.animateAnnotateNode(`Found inorder successor`, data.successorId);
	renderer.resetNodeColor(data.successorId);
}

export async function handleRelinkSuccessorChildForward(renderer: RendererAPI, data: Step.BSTree.RelinkSuccessorChildData) {
	renderer.animateAnnotateNode(`Relink inorder successor's child`, data.childNodeId);
	if (renderer.edges) {
		const leftOrRight = data.childValue < data.newParentValue ? 'left' : 'right';
		renderer.edges.remove(`edge-${data.successorNodeId}-${leftOrRight}`);
		renderer.edges.add({ id: `edge-${data.newParentNodeId}-${leftOrRight}`, from: data.newParentNodeId, to: data.childNodeId });
	}
}

export async function handleRelinkSuccessorChildBackward(renderer: RendererAPI, data: Step.BSTree.RelinkSuccessorChildData) {
	renderer.ensureTree(data.startSnapshot! as BSTree);
}

export async function handleReplaceWithInorderSuccessorForward(renderer: RendererAPI, data: Step.BSTree.ReplaceWithInorderSuccessorData) {
	await renderer.animateAnnotateNode(`Replace node with inorder successor`, data.oldNodeId);

	await renderer.animateLegsShrink(data.successorNodeId);

	if (renderer.edges) {
		renderer.edges.remove(`edge-${data.successorNodeId}-left`);
		renderer.edges.remove(`edge-${data.successorNodeId}-right`);
	}

	await renderer.animateNodeMovement(
		data.successorNodeId,
		renderer.getPosition(data.successorNodeId),
		renderer.getPosition(data.oldNodeId),
	);

	await renderer.animateNodeShrink(data.oldNodeId);
}

export async function handleReplaceWithInorderSuccessorBackward(renderer: RendererAPI, data: Step.BSTree.ReplaceWithInorderSuccessorData) {
	renderer.ensureTree(data.startSnapshot! as BSTree);
	await renderer.animateAnnotateNode(`Replace node with inorder successor`, data.oldNodeId);
}

export default {};
