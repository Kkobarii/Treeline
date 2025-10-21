import type { BSTreeNode } from '$lib/structures/bsTree';
import type { Edge, Node } from 'vis-network';

export function bsTreetoGraph(root: BSTreeNode | null, nodes: Node[] = [], edges: Edge[] = [], parent: string | number | null = null) {
	if (!root) return { nodes, edges };

	const nodeId = root.id;
	nodes.push({ id: nodeId, label: root.value.toString() });

	if (parent !== null) {
		edges.push({ from: parent, to: nodeId });
	}

	if (root.left) {
		const result = bsTreetoGraph(root.left, nodes, edges, nodeId);
		nodes = result.nodes;
		edges = result.edges;
	} else {
		const dummyId = `dummy-${nodeId}-L`;
		nodes.push({
			id: dummyId,
			label: '',
			shape: 'point',
			size: 0.1,
			color: 'transparent',
		});
		edges.push({ from: nodeId, to: dummyId, dashes: true });
	}

	if (root.right) {
		const result = bsTreetoGraph(root.right, nodes, edges, nodeId);
		nodes = result.nodes;
		edges = result.edges;
	} else {
		const dummyId = `dummy-${nodeId}-R`;
		nodes.push({
			id: dummyId,
			label: '',
			shape: 'point',
			size: 0.1,
			color: 'transparent',
		});
		edges.push({ from: nodeId, to: dummyId, dashes: true });
	}

	return { nodes, edges };
}
