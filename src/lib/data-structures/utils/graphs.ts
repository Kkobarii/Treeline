import { DataSet } from 'vis-data';
import { type Edge, type Node } from 'vis-network';

import { Colors, shadeColor } from '$lib/assets/colors';
import type { AVLTreeNode } from '$lib/data-structures/structures/avlTree/avlTree';
import type { BSTreeNode } from '$lib/data-structures/structures/bsTree/bsTree';
import type { BTreeNode } from '$lib/data-structures/structures/bTree/bTree';
import { RBTreeColor, type RBTreeNode } from '$lib/data-structures/structures/rbTree/rbTree';

function log(...args: any[]) {
	// Uncomment the next line to enable logging
	// console.log(...args);
}

function binaryTreeToGraph<T extends { id: number; value: number }>(
	root: T | null,
	getLeftChild: (node: T) => T | null,
	getRightChild: (node: T) => T | null,
	createNodeData: (node: T, childNumber: number) => NodeData,
	nodes: DataSet<Node> = new DataSet<Node>(),
	edges: DataSet<Edge> = new DataSet<Edge>(),
	successorInfo: SuccessorInfo | null = null,
	createNodeOverrides?: (node: T, childNumber: number) => Partial<Node>,
) {
	if (!root) return { nodes, edges };

	log('binaryTreeToGraph called with root:', root);
	log('SuccessorInfo:', successorInfo);

	const nodeId = root.id;
	const nodeData = createNodeData(root, 0);
	const nodeOverrides = createNodeOverrides ? createNodeOverrides(root, 0) : {};

	nodes.add({ id: nodeId, label: root.value.toString(), title: NodeData.toTitle(nodeData), ...nodeOverrides });

	if (successorInfo !== null) {
		const parentNodeData = createNodeData(root, successorInfo.childNumber);
		const successorOverrides = createNodeOverrides ? createNodeOverrides(root, successorInfo.childNumber) : {};
		nodes.update({
			id: nodeId,
			label: root.value.toString(),
			title: NodeData.toTitle(parentNodeData),
			...successorOverrides,
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
			createNodeOverrides,
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
			createNodeOverrides,
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

export function rbTreeToGraph(
	root: RBTreeNode | null,
	nodes: DataSet<Node> = new DataSet<Node>(),
	edges: DataSet<Edge> = new DataSet<Edge>(),
	successorInfo: SuccessorInfo | null = null,
) {
	return binaryTreeToGraph(
		root,
		node => node.left,
		node => node.right,
		(node, childNumber) => new RBTreeNodeData(childNumber, node.color),
		nodes,
		edges,
		successorInfo,
		(node, _childNumber) => {
			const nodeColor = node.color === RBTreeColor.Red ? Colors.RBTreeRed : Colors.RBTreeBlack;
			const fontColor = node.color === RBTreeColor.Red ? Colors.Black : Colors.White;
			return {
				color: {
					background: nodeColor,
					border: nodeColor,
					highlight: {
						background: shadeColor(nodeColor, 40),
						border: shadeColor(nodeColor, -20),
					},
				},
				font: { color: fontColor },
			};
		},
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

export class RBTreeNodeData extends NodeData {
	constructor(
		childNumber: number,
		public color: RBTreeColor,
	) {
		super(childNumber);
	}

	static fromNode(node: Node): RBTreeNodeData {
		let childNumber = -1;
		let color: RBTreeColor = RBTreeColor.Black;
		if (node.title && typeof node.title === 'string') {
			let titleObj = JSON.parse(node.title);

			if ('childNumber' in titleObj) {
				childNumber = titleObj.childNumber;
			}
			if ('color' in titleObj) {
				color = titleObj.color;
			}
		}
		return new RBTreeNodeData(childNumber, color);
	}
}

// B-Tree specific graph conversion
export function bTreeToGraph(
	root: BTreeNode | null,
	nodes: DataSet<Node> = new DataSet<Node>(),
	edges: DataSet<Edge> = new DataSet<Edge>(),
	successorInfo: SuccessorInfo | null = null,
): { nodes: DataSet<Node>; edges: DataSet<Edge> } {
	if (!root) return { nodes, edges };

	const nodeId = root.id;
	// Display all values in the node
	const label = root.values.join('  ') || '';
	const nodeData = new NodeData(successorInfo?.childNumber ?? -1);

	nodes.add({
		id: nodeId,
		label: label,
		title: NodeData.toTitle(nodeData),
		shape: 'box',
		color: Colors.Node,
		font: { color: 'black', size: 20 },
		widthConstraint: { minimum: 60 },
	});

	// Add edge from parent if we have successor info
	if (successorInfo !== null) {
		const edgeId = getEdgeId(successorInfo.parentId, successorInfo.childNumber);
		edges.add({ id: edgeId, from: successorInfo.parentId, to: nodeId });
	}

	// Process all children
	if (!root.isLeaf) {
		for (let i = 0; i < root.children.length; i++) {
			const child = root.children[i];
			if (child) {
				const result = bTreeToGraph(child, nodes, edges, new SuccessorInfo(nodeId, i));
				nodes = result.nodes;
				edges = result.edges;
			}
		}
	} else {
		// For leaf nodes, add dummy children to show they have no children
		// for (let i = 0; i < root.values.length + 1; i++) {
		// 	const dummyId = getDummyNodeId(nodeId, i);
		// 	nodes.add({
		// 		id: dummyId,
		// 		label: '',
		// 		shape: 'point',
		// 		size: 0.1,
		// 		color: 'transparent',
		// 		title: NodeData.toTitle(new NodeData(i)),
		// 	});
		// 	edges.add({ id: getEdgeId(nodeId, i), from: nodeId, to: dummyId, dashes: true });
		// }
	}

	return { nodes, edges };
}
