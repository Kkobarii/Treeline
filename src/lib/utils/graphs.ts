import { DataSet } from 'vis-data';
import { type Edge, type Node } from 'vis-network';

import type { BSTreeNode } from '$lib/structures/bsTree';
import type { AVLTreeNode } from '$lib/structures/avlTree';

function log(...args: any[]) {
	// Uncomment the next line to enable logging
	// console.log(...args);
}

export function bsTreeToGraph(
	root: BSTreeNode | null,
	nodes: DataSet<Node> = new DataSet<Node>(),
	edges: DataSet<Edge> = new DataSet<Edge>(),
	successorInfo: SuccessorInfo | null = null,
) {
	if (!root) return { nodes, edges };

	const nodeId = root.id;
	if (!nodes.get(nodeId)) {
		nodes.add({ id: nodeId, label: root.value.toString(), title: `Node ${nodeId}: ${root.value}` });
	} else {
		nodes.update({ id: nodeId, label: root.value.toString(), title: `Node ${nodeId}: ${root.value}` });
	}

	if (successorInfo !== null) {
		const parentNode = nodes.get(successorInfo.parentId);
		const edgeId = getEdgeId(successorInfo.parentId, successorInfo.childNumber);
		edges.add({ id: edgeId, from: successorInfo.parentId, to: nodeId });
	}

	if (root.left) {
		const result = bsTreeToGraph(root.left, nodes, edges, new SuccessorInfo(nodeId, 0));
		nodes = result.nodes;
		edges = result.edges;
	} else {
		const dummyId = getDummyNodeId(nodeId, 0);
		nodes.add({
			id: dummyId,
			label: '',
			shape: 'point',
			size: 0.1,
			color: 'transparent',
			value: 0,
		});
		edges.add({ id: getEdgeId(nodeId, 0), from: nodeId, to: dummyId, dashes: true });
	}

	if (root.right) {
		const result = bsTreeToGraph(root.right, nodes, edges, new SuccessorInfo(nodeId, 1));
		nodes = result.nodes;
		edges = result.edges;
	} else {
		const dummyId = getDummyNodeId(nodeId, 1);
		nodes.add({
			id: dummyId,
			label: '',
			shape: 'point',
			size: 0.1,
			color: 'transparent',
			value: 1,
		});
		edges.add({ id: getEdgeId(nodeId, 1), from: nodeId, to: dummyId, dashes: true });
	}

	return { nodes, edges };
}

export function avlTreeToGraph(
	root: AVLTreeNode | null,
	nodes: DataSet<Node> = new DataSet<Node>(),
	edges: DataSet<Edge> = new DataSet<Edge>(),
	successorInfo: SuccessorInfo | null = null,
) {
	if (!root) return { nodes, edges };
	log('avlTreeToGraph called with root:', root);

	// add node to graph
	const nodeId = root.id;
	if (!nodes.get(nodeId)) {
		nodes.add({ id: nodeId, label: root.value.toString() + ` (h=${root.height})`, title: `Node ${nodeId}: ${root.value}` });
	} else {
		nodes.update({ id: nodeId, label: root.value.toString() + ` (h=${root.height})`, title: `Node ${nodeId}: ${root.value}` });
	}

	// link to parent if successorInfo is provided
	if (successorInfo !== null) {
		nodes.update({ id: nodeId, label: root.value.toString() + ` (h=${root.height})`, title: `Node ${nodeId}: ${root.value}`, value: successorInfo.childNumber });
		const edgeId = getEdgeId(successorInfo.parentId, successorInfo.childNumber);
		log(`Adding edge ${edgeId} from ${successorInfo.parentId} to ${nodeId}`);
		edges.add({ id: edgeId, from: successorInfo.parentId, to: nodeId });
	}

	// recurse left and right
	if (root.left) {
		log(`Recursing left from node ${nodeId} to node ${root.left.id}`);
		const result = avlTreeToGraph(root.left, nodes, edges, new SuccessorInfo(nodeId, 0));
		nodes = result.nodes;
		edges = result.edges;
	} else {
		log(`Adding dummy left child for node ${nodeId}`);
		const dummyId = getDummyNodeId(nodeId, 0);
		nodes.add({
			id: dummyId,
			label: '',
			shape: 'point',
			size: 0.1,
			color: 'transparent',
			value: 0,
		});
		edges.add({ id: getEdgeId(nodeId, 0), from: nodeId, to: dummyId, dashes: true });
	}

	if (root.right) {
		log(`Recursing right from node ${nodeId} to node ${root.right.id}`);
		const result = avlTreeToGraph(root.right, nodes, edges, new SuccessorInfo(nodeId, 1));
		nodes = result.nodes;
		edges = result.edges;
	} else {
		log(`Adding dummy right child for node ${nodeId}`);
		const dummyId = getDummyNodeId(nodeId, 1);
		nodes.add({
			id: dummyId,
			label: '',
			shape: 'point',
			size: 0.1,
			color: 'transparent',
			value: 1,
		});
		edges.add({ id: getEdgeId(nodeId, 1), from: nodeId, to: dummyId, dashes: true });
	}

	return { nodes, edges };
}

class SuccessorInfo {
	constructor(public parentId: number, public childNumber: number) {}
}

export function getDummyNodeId(parentId: number | string, direction: 'left' | 'right' | number): string {
	return `dummy-${parentId}-${direction}`;
}

export function getEdgeId(parentId: number | string, direction: 'left' | 'right' | number): string {
	return `edge-${parentId}-${direction}`;
}
