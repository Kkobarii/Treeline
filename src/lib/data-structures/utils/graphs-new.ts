import { Colors } from '$lib/assets/colors';
import type { AVLTreeNode } from '$lib/data-structures/structures/avlTree/avlTree';
import type { BSTreeNode } from '$lib/data-structures/structures/bsTree/bsTree';
import type { BTreeNode } from '$lib/data-structures/structures/bTree/bTree';
import { RBTreeColor, type RBTreeNode } from '$lib/data-structures/structures/rbTree/rbTree';

// Cytoscape node and edge type definitions
export interface CytoscapeNode {
	data: {
		id: string;
		label: string;
		title?: string;
		[key: string]: any;
	};
	[key: string]: any;
}

export interface CytoscapeEdge {
	data: {
		id: string;
		source: string | number;
		target: string | number;
		[key: string]: any;
	};
	[key: string]: any;
}

export interface GraphData {
	nodes: CytoscapeNode[];
	edges: CytoscapeEdge[];
}

function log(...args: any[]) {
	// Uncomment the next line to enable logging
	// console.log(...args);
}

function binaryTreeToGraph<T extends { id: number; value: number }>(
	root: T | null,
	getLeftChild: (node: T) => T | null,
	getRightChild: (node: T) => T | null,
	createNodeData: (node: T, childNumber: number) => NodeData,
	nodes: CytoscapeNode[] = [],
	edges: CytoscapeEdge[] = [],
	successorInfo: SuccessorInfo | null = null,
	createNodeOverrides?: (node: T, childNumber: number) => Record<string, any>,
): { nodes: CytoscapeNode[]; edges: CytoscapeEdge[] } {
	if (!root) return { nodes, edges };

	log('binaryTreeToGraph called with root:', root);
	log('SuccessorInfo:', successorInfo);

	const nodeId = root.id;
	const nodeData = createNodeData(root, 0);
	const nodeOverrides = createNodeOverrides ? createNodeOverrides(root, 0) : {};

	nodes.push({
		data: {
			id: nodeId.toString(),
			label: root.value.toString(),
			title: NodeData.toTitle(nodeData),
			...(nodeOverrides.data || {}),
		},
		...nodeOverrides,
	});

	if (successorInfo !== null) {
		const edgeId = getEdgeId(successorInfo.parentId, successorInfo.childNumber);
		log(`Adding edge ${edgeId} from ${successorInfo.parentId} to ${nodeId}`);
		edges.push({
			data: {
				id: edgeId,
				source: successorInfo.parentId.toString(),
				target: nodeId.toString(),
			},
		});
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
		nodes.push({
			data: {
				id: dummyId,
				label: '',
				title: NodeData.toTitle(dummyNodeData),
				isDummy: true,
			},
		});
		edges.push({
			data: {
				id: getEdgeId(nodeId, 0),
				source: nodeId.toString(),
				target: dummyId,
				isDashed: true,
			},
		});
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
		nodes.push({
			data: {
				id: dummyId,
				label: '',
				title: NodeData.toTitle(dummyNodeData),
				isDummy: true,
			},
		});
		edges.push({
			data: {
				id: getEdgeId(nodeId, 1),
				source: nodeId.toString(),
				target: dummyId,
				isDashed: true,
			},
		});
	}

	return { nodes, edges };
}

export function bsTreeToGraph(
	root: BSTreeNode | null,
	nodes: CytoscapeNode[] = [],
	edges: CytoscapeEdge[] = [],
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
	nodes: CytoscapeNode[] = [],
	edges: CytoscapeEdge[] = [],
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
	nodes: CytoscapeNode[] = [],
	edges: CytoscapeEdge[] = [],
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
				data: {
					bgColor: nodeColor,
					fontColor: fontColor,
				},
				style: {
					backgroundColor: nodeColor,
					color: fontColor,
					borderColor: nodeColor,
				},
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

	static fromNode(nodeData: any): NodeData {
		let childNumber = -1;
		if (nodeData.title && typeof nodeData.title === 'string') {
			let titleObj = JSON.parse(nodeData.title);
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

	static fromNode(nodeData: any): AVLTreeNodeData {
		let childNumber = -1;
		let height = NaN;
		let balance = NaN;
		if (nodeData.title && typeof nodeData.title === 'string') {
			let titleObj = JSON.parse(nodeData.title);

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

	static fromNode(nodeData: any): RBTreeNodeData {
		let childNumber = -1;
		let color: RBTreeColor = RBTreeColor.Black;
		if (nodeData.title && typeof nodeData.title === 'string') {
			let titleObj = JSON.parse(nodeData.title);

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
	nodes: CytoscapeNode[] = [],
	edges: CytoscapeEdge[] = [],
	successorInfo: SuccessorInfo | null = null,
): { nodes: CytoscapeNode[]; edges: CytoscapeEdge[] } {
	if (!root) return { nodes, edges };

	const nodeId = root.id;
	// Display all values in the node
	const label = root.values.join('  ') || '';
	const nodeData = new NodeData(successorInfo?.childNumber ?? -1);

	nodes.push({
		data: {
			id: nodeId.toString(),
			label: label,
			title: NodeData.toTitle(nodeData),
			shape: 'box',
		},
		style: {
			backgroundColor: Colors.Node,
			color: 'black',
			fontSize: 20,
			minWidth: 60,
		},
	});

	// Add edge from parent if we have successor info
	if (successorInfo !== null) {
		const edgeId = getEdgeId(successorInfo.parentId, successorInfo.childNumber);
		edges.push({
			data: {
				id: edgeId,
				source: successorInfo.parentId.toString(),
				target: nodeId.toString(),
			},
		});
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
	}

	return { nodes, edges };
}
