import type { BSTreeNode } from '$lib/structures/bsTree';
import { DataSet } from 'vis-data';
import { type Edge, type Node } from 'vis-network';

export function bsTreetoGraph(
	root: BSTreeNode | null,
	nodes: DataSet<Node> = new DataSet<Node>(),
	edges: DataSet<Edge> = new DataSet<Edge>(),
	parent: string | number | null = null,
) {
	if (!root) return { nodes, edges };

	const nodeId = root.id;
	if (!nodes.get(nodeId)) {
		nodes.add({ id: nodeId, label: root.value.toString(), title: `Node ${nodeId}: ${root.value}` });
	} else {
		nodes.update({ id: nodeId, label: root.value.toString(), title: `Node ${nodeId}: ${root.value}` });
	}

	if (parent !== null) {
		const parentNode = nodes.get(parent);
		const parentLabel = parentNode ? parentNode.label : undefined;
		const parentValue =
			typeof parentLabel === 'number' ? parentLabel : typeof parentLabel === 'string' ? Number(parentLabel) : undefined;
		const direction = parentValue !== undefined && !Number.isNaN(parentValue) ? (root.value < parentValue ? 'left' : 'right') : 'left';
		const edgeId = getEdgeId(parent, direction);
		edges.add({ id: edgeId, from: parent, to: nodeId });
	}

	if (root.left) {
		const result = bsTreetoGraph(root.left, nodes, edges, nodeId);
		nodes = result.nodes;
		edges = result.edges;
	} else {
		const dummyId = getDummyNodeId(nodeId, 'left');
		nodes.add({
			id: dummyId,
			label: '',
			shape: 'point',
			size: 0.1,
			color: 'transparent',
		});
		edges.add({ id: `edge-${nodeId}-left`, from: nodeId, to: dummyId, dashes: true });
	}

	if (root.right) {
		const result = bsTreetoGraph(root.right, nodes, edges, nodeId);
		nodes = result.nodes;
		edges = result.edges;
	} else {
		const dummyId = getDummyNodeId(nodeId, 'right');
		nodes.add({
			id: dummyId,
			label: '',
			shape: 'point',
			size: 0.1,
			color: 'transparent',
		});
		edges.add({ id: `edge-${nodeId}-right`, from: nodeId, to: dummyId, dashes: true });
	}

	return { nodes, edges };
}

export function getDummyNodeId(parentId: number | string, direction: 'left' | 'right'): string {
	return `dummy-${parentId}-${direction == 'left' ? 'L' : 'R'}`;
}

export function getEdgeId(parentId: number | string, direction: 'left' | 'right'): string {
	return `edge-${parentId}-${direction}`;
}
