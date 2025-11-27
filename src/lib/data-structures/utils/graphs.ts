import { DataSet } from 'vis-data';
import { type Edge, type Node } from 'vis-network';

import type { AVLTreeNode } from '$lib/data-structures/structures/avlTree/avlTree';
import type { BSTreeNode } from '$lib/data-structures/structures/bsTree/bsTree';

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
		nodes.add({ id: nodeId, label: root.value.toString(), title: NodeData.toTitle(new NodeData(0)) });
	} else {
		console.warn('Updating existing node in bsTreeToGraph:', nodeId);
		nodes.update({ id: nodeId, label: root.value.toString(), title: NodeData.toTitle(new NodeData(0)) });
	}

	if (successorInfo !== null) {
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
			title: NodeData.toTitle(new NodeData(0)),
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
			title: NodeData.toTitle(new NodeData(1)),
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

	function getBalanceValue(n: any): number {
		if (!n) return 0;

		const leftH = n.left && typeof n.left.height === 'number' ? n.left.height : 0;
		const rightH = n.right && typeof n.right.height === 'number' ? n.right.height : 0;

		return rightH - leftH;
	}

	// add node to graph
	const nodeId = root.id;
	const balance = getBalanceValue(root);
	if (!nodes.get(nodeId)) {
		nodes.add({
			id: nodeId, 
			label: root.value.toString(), 
			title: NodeData.toTitle(new AVLTreeNodeData(0, root.height ?? 0, balance))
		});
	} else {
		console.warn('Updating existing node in avlTreeToGraph:', nodeId);
		nodes.update({ id: nodeId, label: root.value.toString(), title: NodeData.toTitle(new AVLTreeNodeData(0, root.height ?? 0, balance)) });
	}

	// link to parent if successorInfo is provided
	if (successorInfo !== null) {
		nodes.update({ 
			id: nodeId, 
			label: root.value.toString(), 
			title: NodeData.toTitle(new AVLTreeNodeData(successorInfo.childNumber, root.height ?? 0, getBalanceValue(root)))
		});
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
			title: NodeData.toTitle(new AVLTreeNodeData(0, 0, 0)),
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
			title: NodeData.toTitle(new AVLTreeNodeData(1, 0, 0)),
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

export function isDummyNodeId(nodeId: string | number): boolean {
	return typeof nodeId === 'string' && nodeId.startsWith('dummy-');
}

export function getEdgeId(parentId: number | string, direction: 'left' | 'right' | number): string {
	return `edge-${parentId}-${direction}`;
}

export class NodeData {
	constructor(public childNumber: number) {}

	static fromNode(node: Node): NodeData {
		let childNumber = -1;
		if (node.title && typeof node.title === 'string') {
			let titleObj = JSON.parse(node.title);
			if ('childNumber' in titleObj) {
				childNumber = titleObj.childNumber;
			}
		}
		return new NodeData(childNumber);
	}

	static toTitle(nodeData: NodeData): string {
		return JSON.stringify(nodeData);
	}

	lessThan(other: NodeData | number): boolean {
		const otherChild = typeof other === 'number' ? other : other.childNumber;
		return this.childNumber < otherChild;
	}

	greaterThan(other: NodeData | number): boolean {
		const otherChild = typeof other === 'number' ? other : other.childNumber;
		return this.childNumber > otherChild;
	}

	compareTo(other: NodeData | number): number {
		const otherChild = typeof other === 'number' ? other : other.childNumber;
		if (this.childNumber < otherChild) return -1;
		if (this.childNumber > otherChild) return 1;
		return 0;
	}
}

export class AVLTreeNodeData extends NodeData {
	constructor(childNumber: number, public height: number, public balance: number) {
		super(childNumber);
	}

	static fromNode(node: Node): AVLTreeNodeData {
		let childNumber = -1;
		let height = NaN;
		let balance = NaN;
		if (node.title && typeof node.title === 'string') {
			let titleObj = JSON.parse(node.title);

			if ('childNumber' in titleObj) {
				childNumber = titleObj.childNumber;
			}
			if ('height' in titleObj) {
				height = titleObj.height;
			}
			if ('balance' in titleObj) {
				balance = titleObj.balance;
			}
		}
		return new AVLTreeNodeData(childNumber, height, balance);
	}
}