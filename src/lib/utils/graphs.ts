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
	nodes.add({ id: nodeId, label: root.value.toString(), title: `Node ${nodeId}: ${root.value}` });

	if (parent !== null) {
		edges.add({ from: parent, to: nodeId });
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

export function getDummyNodeId(parentId: number, direction: 'left' | 'right'): string {
	return `dummy-${parentId}-${direction == 'left' ? 'L' : 'R'}`;
}
