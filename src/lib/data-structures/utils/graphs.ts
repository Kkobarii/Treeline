import { DataSet } from 'vis-data';
import { type Edge, type Node } from 'vis-network';

import type { AVLTreeNode } from '$lib/data-structures/structures/avlTree/avlTree';
import type { BSTreeNode } from '$lib/data-structures/structures/bsTree/bsTree';

function log(...args: any[]) {
	// Uncomment the next line to enable logging
	// console.log(...args);
}

/**
 * Generic binary tree to graph converter.
 * @param root - The root node of the tree
 * @param getLeftChild - Function to get the left child of a node
 * @param getRightChild - Function to get the right child of a node
 * @param createNodeData - Function to create NodeData for a node (receives node, childNumber)
 * @param nodes - DataSet to accumulate nodes
 * @param edges - DataSet to accumulate edges
 * @param successorInfo - Parent link information
 */
function binaryTreeToGraph<T extends { id: number; value: number }>(
	root: T | null,
	getLeftChild: (node: T) => T | null,
	getRightChild: (node: T) => T | null,
	createNodeData: (node: T, childNumber: number) => NodeData,
	nodes: DataSet<Node> = new DataSet<Node>(),
	edges: DataSet<Edge> = new DataSet<Edge>(),
	successorInfo: SuccessorInfo | null = null,
) {
	if (!root) return { nodes, edges };

	log('binaryTreeToGraph called with root:', root);
	log('SuccessorInfo:', successorInfo);

	const nodeId = root.id;
	const nodeData = createNodeData(root, 0);

	if (!nodes.get(nodeId)) {
		nodes.add({ id: nodeId, label: root.value.toString(), title: NodeData.toTitle(nodeData) });
	} else {
		console.warn('Updating existing node in binaryTreeToGraph:', nodeId);
		nodes.update({ id: nodeId, label: root.value.toString(), title: NodeData.toTitle(nodeData) });
	}

	if (successorInfo !== null) {
		const parentNodeData = createNodeData(root, successorInfo.childNumber);
		nodes.update({
			id: nodeId,
			label: root.value.toString(),
			title: NodeData.toTitle(parentNodeData),
		});
		const edgeId = getEdgeId(successorInfo.parentId, successorInfo.childNumber);
		log(`Adding edge ${edgeId} from ${successorInfo.parentId} to ${nodeId}`);
		edges.add({ id: edgeId, from: successorInfo.parentId, to: nodeId });
	}

	// Process left child
	const leftChild = getLeftChild(root);
	if (leftChild) {
		const result = binaryTreeToGraph(
			leftChild,
			getLeftChild,
			getRightChild,
			createNodeData,
			nodes,
			edges,
			new SuccessorInfo(nodeId, 0),
		);
		nodes = result.nodes;
		edges = result.edges;
	} else {
		const dummyId = getDummyNodeId(nodeId, 0);
		const dummyNodeData = createNodeData(root, 0);
		nodes.add({
			id: dummyId,
			label: '',
			shape: 'point',
			size: 0.1,
			color: 'transparent',
			title: NodeData.toTitle(dummyNodeData),
		});
		edges.add({ id: getEdgeId(nodeId, 0), from: nodeId, to: dummyId, dashes: true });
	}

	// Process right child
	const rightChild = getRightChild(root);
	if (rightChild) {
		const result = binaryTreeToGraph(
			rightChild,
			getLeftChild,
			getRightChild,
			createNodeData,
			nodes,
			edges,
			new SuccessorInfo(nodeId, 1),
		);
		nodes = result.nodes;
		edges = result.edges;
	} else {
		const dummyId = getDummyNodeId(nodeId, 1);
		const dummyNodeData = createNodeData(root, 1);
		nodes.add({
			id: dummyId,
			label: '',
			shape: 'point',
			size: 0.1,
			color: 'transparent',
			title: NodeData.toTitle(dummyNodeData),
		});
		edges.add({ id: getEdgeId(nodeId, 1), from: nodeId, to: dummyId, dashes: true });
	}

	return { nodes, edges };
}

export function bsTreeToGraph(
	root: BSTreeNode | null,
	nodes: DataSet<Node> = new DataSet<Node>(),
	edges: DataSet<Edge> = new DataSet<Edge>(),
	successorInfo: SuccessorInfo | null = null,
) {
	return binaryTreeToGraph(
		root,
		node => node.left,
		node => node.right,
		(_node, childNumber) => new NodeData(childNumber),
		nodes,
		edges,
		successorInfo,
	);
}

export function avlTreeToGraph(
	root: AVLTreeNode | null,
	nodes: DataSet<Node> = new DataSet<Node>(),
	edges: DataSet<Edge> = new DataSet<Edge>(),
	successorInfo: SuccessorInfo | null = null,
) {
	function getBalanceValue(n: AVLTreeNode | null): number {
		if (!n) return 0;
		const leftH = n.left && typeof n.left.height === 'number' ? n.left.height : 0;
		const rightH = n.right && typeof n.right.height === 'number' ? n.right.height : 0;
		return rightH - leftH;
	}

	return binaryTreeToGraph(
		root,
		node => node.left,
		node => node.right,
		(node, childNumber) => new AVLTreeNodeData(childNumber, node.height ?? 0, getBalanceValue(node)),
		nodes,
		edges,
		successorInfo,
	);
}

class SuccessorInfo {
	constructor(
		public parentId: number,
		public childNumber: number,
	) {}
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
	constructor(
		childNumber: number,
		public height: number,
		public balance: number,
	) {
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
