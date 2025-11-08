import type { OperationManager } from '$lib/operation/operationManager';
import { Step } from '$lib/operation/stepData';
import type { BSTree } from '$lib/structures/bsTree';
import { getDummyNodeId } from '$lib/utils/graphs';

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
	animateAnnotateNode: (text: string, id: number | string) => Promise<void>;
	changeInfoNodeAnnotation: (text: string) => Promise<void>;
	hideInfoNode: () => void;
	getPositionAbove: (id: number | string) => { x: number; y: number };
	getPosition: (id: number | string) => { x: number; y: number };
	animateNodeMovement: (id: number | string, from: any, to: any) => Promise<void>;
	snapNodeAbove: (nodeId: number | string, parentId: number) => void;
	// nodes & edges are optional, used by some handlers
	nodes?: any;
	edges?: any;
};

// Split handlers into explicit forward and backward functions to make
// step inversion clearer. Each step has two exported functions: handleXForward and handleXBackward.

export async function handleStartForward(renderer: RendererAPI, operationManager: OperationManager) {
	const info = `Starting ${operationManager.getCurrentOperation().operation.toString()} operation`;
	const snapshot = operationManager.getCurrentOperation().startSnapshot as BSTree;
	renderer.ensureTree(snapshot);
	await Promise.all([renderer.changeInfoNodeAnnotation(info), renderer.animateNodeGrowth('info-node')]);
}

export function handleStartBackward(renderer: RendererAPI, _operationManager: OperationManager) {
	renderer.hideInfoNode();
}

export function handleEndForward(renderer: RendererAPI) {
	renderer.hideInfoNode();
}

export function handleEndBackward(renderer: RendererAPI) {
	// same as forward for now; orchestrator will restore snapshots
	renderer.hideInfoNode();
}

export async function handleCreateRootForward(renderer: RendererAPI, data: Step.BSTree.CreateRootData) {
	renderer.addNode(data.nodeId, data.value);
	await Promise.all([
		renderer.animateAnnotateNode(`Create root node with value ${data.value}`, data.nodeId),
		renderer.animateNodeGrowth(data.nodeId),
	]);
}

export async function handleCreateRootBackward(renderer: RendererAPI, data: Step.BSTree.CreateRootData) {
	await Promise.all([
		renderer.animateAnnotateNode(`Create root node with value ${data.value}`, data.nodeId),
		renderer.animateNodeShrink(data.nodeId),
	]);
	renderer.removeNode(data.nodeId);
}

export async function handleCreateLeafForward(renderer: RendererAPI, data: Step.BSTree.CreateLeafData) {
	const info = `Create ${data.direction} child with value ${data.value}`;
	renderer.addNode(data.nodeId, data.value, data.parentId, data.direction);
	await Promise.all([
		renderer.animateAnnotateNode(info, data.parentId),
		renderer.animateNodeGrowth(data.nodeId),
		renderer.animateNodeMovement('info-node', renderer.getPositionAbove(data.parentId), renderer.getPositionAbove(data.nodeId)),
	]);
}

export async function handleCreateLeafBackward(renderer: RendererAPI, data: Step.BSTree.CreateLeafData) {
	const info = `Create ${data.direction} child with value ${data.value}`;
	await Promise.all([
		renderer.animateAnnotateNode(info, data.nodeId),
		renderer.animateNodeShrink(data.nodeId),
		renderer.animateNodeMovement('info-node', renderer.getPositionAbove(data.nodeId), renderer.getPositionAbove(data.parentId)),
	]);
	renderer.removeNode(data.nodeId, data.parentId, data.direction);
	renderer.snapNodeAbove('info-node', data.parentId);
}

export async function handleCompareForward(renderer: RendererAPI, data: Step.BSTree.CompareData) {
	const relation = data.result;
	await renderer.animateAnnotateNode(`Compare ${data.value} ${relation} ${data.comparisonValue}`, data.comparisonId);
}

export async function handleCompareBackward(renderer: RendererAPI, data: Step.BSTree.CompareData) {
	// symmetric: show the same annotation (or clear) — keep as annotate for now
	await renderer.changeInfoNodeAnnotation(`Compare ${data.value} ${data.result} ${data.comparisonValue}`);
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
	const positionFrom = renderer.getPositionAbove(data.fromId);
	const positionTo = { x: positionFrom.x, y: positionFrom.y + 400 };
	await Promise.all([
		renderer.animateAnnotateNode(`Drop value ${data.value}`, data.fromId),
		renderer.animateNodeMovement('info-node', positionFrom, positionTo),
	]);
}

export async function handleDropBackward(renderer: RendererAPI, data: Step.BSTree.DropData) {
	const positionFrom = renderer.getPositionAbove(data.fromId);
	const positionTo = { x: positionFrom.x, y: positionFrom.y + 400 };
	await Promise.all([
		renderer.changeInfoNodeAnnotation(`Drop value ${data.value}`),
		renderer.animateNodeMovement('info-node', positionTo, positionFrom),
	]);
}

export function handleFoundForward(renderer: RendererAPI, data: Step.BSTree.FoundData) {
	renderer.animateAnnotateNode(`Found node with value ${data.value}`, data.nodeId);
	if (renderer.nodes) renderer.nodes.update([{ id: data.nodeId, color: { background: '#7CFC00' } }]);
}

export function handleFoundBackward(renderer: RendererAPI, data: Step.BSTree.FoundData) {
	renderer.animateAnnotateNode(`Found node with value ${data.value}`, data.nodeId);
	if (renderer.nodes) renderer.nodes.update([{ id: data.nodeId, color: undefined }]);
}

export function handleMarkToDeleteForward(renderer: RendererAPI, data: Step.BSTree.MarkToDeleteData) {
	renderer.animateAnnotateNode(`Mark node with value ${data.value} to delete`, data.nodeId);
	if (renderer.nodes) renderer.nodes.update([{ id: data.nodeId, color: { background: '#FF4500' } }]);
}

export function handleMarkToDeleteBackward(renderer: RendererAPI, data: Step.BSTree.MarkToDeleteData) {
	renderer.animateAnnotateNode(`Mark node with value ${data.value} to delete`, data.nodeId);
	if (renderer.nodes) renderer.nodes.update([{ id: data.nodeId, color: undefined }]);
}

export async function handleDeleteForward(renderer: RendererAPI, data: Step.BSTree.DeleteData) {
	renderer.animateAnnotateNode(`Delete node with value ${data.value}`, data.nodeId);
	await renderer.animateNodeShrink(data.nodeId);
}

export async function handleDeleteBackward(renderer: RendererAPI, data: Step.BSTree.DeleteData) {
	// restore authoritative snapshot handled by orchestrator; highlight node as deleted state
	renderer.ensureTree(data.startSnapshot! as BSTree);
	if (renderer.nodes) renderer.nodes.update([{ id: data.nodeId, color: { background: '#FF4500' } }]);
}

export async function handleReplaceWithChildForward(renderer: RendererAPI, data: Step.BSTree.ReplaceWithChildData) {
	renderer.animateAnnotateNode(`Replace node with its ${data.direction} child`, data.oldNodeId);
	await renderer.animateNodeMovement(data.newNodeId, renderer.getPosition(data.newNodeId), renderer.getPosition(data.oldNodeId));
	renderer.animateNodeShrink(data.oldNodeId);
}

export async function handleReplaceWithChildBackward(renderer: RendererAPI, data: Step.BSTree.ReplaceWithChildData) {
	renderer.ensureTree(data.startSnapshot! as BSTree);
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
	renderer.animateNodeShrink(data.oldNodeId);
}

export async function handleReplaceWithInorderSuccessorBackward(renderer: RendererAPI, data: Step.BSTree.ReplaceWithInorderSuccessorData) {
	renderer.ensureTree(data.startSnapshot! as BSTree);
	await renderer.animateAnnotateNode(`Replace node with inorder successor`, data.oldNodeId);
}

export default {};
