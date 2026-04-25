import { DataSet } from 'vis-data';
import { type Edge, type Node } from 'vis-network';

import type { AVLTreeNode } from '$lib/data-structures/structures/avlTree/avlTree';
import type { BSTreeNode } from '$lib/data-structures/structures/bsTree/bsTree';
import type { BTreeNode } from '$lib/data-structures/structures/bTree/bTree';
import type { HeapNode } from '$lib/data-structures/structures/heap/heap';
import { RBTreeColor, type RBTreeNode } from '$lib/data-structures/structures/rbTree/rbTree';
import { Colors, shadeColor } from '$lib/utils/colors';

function log(...args: any[]) {
	// Uncomment the next line to enable logging
	// console.log(...args);
}

function binaryTreeToGraph<T extends { id: number; value: number }>(
	root: T | null,
	getLeftChild: (node: T) => T | null,
	getRightChild: (node: T) => T | null,
	createNodeData: (node: T, childNumber: number, legs: boolean[]) => NodeData,
	nodes: DataSet<Node> = new DataSet<Node>(),
	edges: DataSet<Edge> = new DataSet<Edge>(),
	successorInfo: SuccessorInfo | null = null,
	createNodeOverrides?: (node: T, childNumber: number) => Partial<Node>,
) {
	if (!root) return { nodes, edges };

	log('binaryTreeToGraph called with root:', root);
	log('SuccessorInfo:', successorInfo);

	const nodeId = root.id;
	const leftChild = getLeftChild(root);
	const rightChild = getRightChild(root);
	const legs = leftChild || rightChild ? [false, false] : [true, true];
	const nodeData = createNodeData(root, 0, legs);
	const nodeOverrides = createNodeOverrides ? createNodeOverrides(root, 0) : {};

	nodes.add({ id: nodeId, label: root.value.toString(), title: NodeData.toTitle(nodeData), ...nodeOverrides });

	if (successorInfo !== null) {
		const parentNodeData = createNodeData(root, successorInfo.childNumber, legs);
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
	} else if (rightChild) {
		const dummyId = getDummyNodeId(nodeId, 0);
		const dummyNodeData = createNodeData(root, 0, []);
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
	} else if (leftChild) {
		const dummyId = getDummyNodeId(nodeId, 1);
		const dummyNodeData = createNodeData(root, 1, []);
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
		(_node, childNumber, legs) => new NodeData(childNumber, legs),
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
		(node, childNumber, legs) => new AVLTreeNodeData(childNumber, node.height ?? 0, getBalanceValue(node), legs),
		nodes,
		edges,
		successorInfo,
	);
}

export function heapToGraph(
	root: HeapNode | null,
	nodes: DataSet<Node> = new DataSet<Node>(),
	edges: DataSet<Edge> = new DataSet<Edge>(),
	successorInfo: SuccessorInfo | null = null,
) {
	return binaryTreeToGraph(
		root,
		node => node.left,
		node => node.right,
		(_node, childNumber, legs) => new NodeData(childNumber, legs),
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
		(node, childNumber, legs) => new RBTreeNodeData(childNumber, node.color, legs),
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
	constructor(
		public childNumber: number,
		public legs: boolean[] = [],
	) {}

	static fromNode(node: Node): NodeData {
		let childNumber = -1;
		let legs: boolean[] = [];
		if (node.title && typeof node.title === 'string') {
			let titleObj = JSON.parse(node.title);
			if ('childNumber' in titleObj) {
				childNumber = titleObj.childNumber;
			}
			if ('legs' in titleObj) {
				legs = titleObj.legs;
			}
		}
		return new NodeData(childNumber, legs);
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
		legs: boolean[] = [],
	) {
		super(childNumber, legs);
	}

	static fromNode(node: Node): AVLTreeNodeData {
		let childNumber = -1;
		let height = NaN;
		let balance = NaN;
		let legs: boolean[] = [];
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
			if ('legs' in titleObj) {
				legs = titleObj.legs;
			}
		}
		return new AVLTreeNodeData(childNumber, height, balance, legs);
	}
}

export class RBTreeNodeData extends NodeData {
	constructor(
		childNumber: number,
		public color: RBTreeColor,
		legs: boolean[] = [],
	) {
		super(childNumber, legs);
	}

	static fromNode(node: Node): RBTreeNodeData {
		let childNumber = -1;
		let color: RBTreeColor = RBTreeColor.Black;
		let legs: boolean[] = [];
		if (node.title && typeof node.title === 'string') {
			let titleObj = JSON.parse(node.title);

			if ('childNumber' in titleObj) {
				childNumber = titleObj.childNumber;
			}
			if ('color' in titleObj) {
				color = titleObj.color;
			}
			if ('legs' in titleObj) {
				legs = titleObj.legs;
			}
		}
		return new RBTreeNodeData(childNumber, color, legs);
	}
}

export class LinkedListNodeData extends NodeData {
	constructor(isHead: boolean, isTail: boolean) {
		super(-1);
		this.isHead = isHead;
		this.isTail = isTail;
	}

	isHead: boolean;
	isTail: boolean;

	static fromNode(node: Node): LinkedListNodeData {
		let isHead = false;
		let isTail = false;
		if (node.title && typeof node.title === 'string') {
			let titleObj = JSON.parse(node.title);

			if ('isHead' in titleObj) {
				isHead = titleObj.isHead;
			}
			if ('isTail' in titleObj) {
				isTail = titleObj.isTail;
			}
		}
		return new LinkedListNodeData(isHead, isTail);
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

	function buildGraph(
		node: BTreeNode,
		nodes: DataSet<Node>,
		edges: DataSet<Edge>,
		successorInfo: SuccessorInfo | null,
	): { nodes: DataSet<Node>; edges: DataSet<Edge> } {
		const graphNodeId = node.id;
		const label = node.values.join('  ') || '';
		const legs = new Array(node.values.length + 1).fill(node.isLeaf);
		const nodeData = new NodeData(successorInfo?.childNumber ?? -1, legs);

		nodes.add({
			id: graphNodeId,
			label: label,
			title: NodeData.toTitle(nodeData),
		});

		if (successorInfo !== null) {
			const edgeId = getEdgeId(successorInfo.parentId, successorInfo.childNumber);
			edges.add({ id: edgeId, from: successorInfo.parentId, to: graphNodeId });
		}

		if (!node.isLeaf) {
			for (let i = 0; i < node.children.length; i++) {
				const child = node.children[i];
				if (child) {
					const result = buildGraph(child, nodes, edges, new SuccessorInfo(graphNodeId, i));
					nodes = result.nodes;
					edges = result.edges;
				}
			}
		}

		return { nodes, edges };
	}

	return { ...buildGraph(root, nodes, edges, successorInfo) };
}

export function linkedListToGraph(list: any, nodes: DataSet<Node> = new DataSet<Node>(), edges: DataSet<Edge> = new DataSet<Edge>()) {
	if (!list || !list.head) return { nodes, edges };

	let current = list.head;
	let position = 0;

	while (current) {
		const nodeId = current.id;
		let isHead = false;
		if (list.head && list.head.id === nodeId) {
			isHead = true;
		}
		let isTail = false;
		if (list.tail && list.tail.id === nodeId) {
			isTail = true;
		}
		const nodeData = new LinkedListNodeData(isHead, isTail);

		nodes.add({
			id: nodeId,
			label: current.value.toString(),
			title: NodeData.toTitle(nodeData),
			x: position * 150, // Arrange horizontally
			y: 0,
		});

		if (current.next) {
			const edgeId = `${nodeId}->${current.next.id}`;
			edges.add({
				id: edgeId,
				from: nodeId,
				to: current.next.id,
				arrows: 'to',
			});
			current = current.next;
			position++;
		} else {
			break;
		}
	}

	return { nodes, edges };
}

export function stackToGraph(stack: any, nodes: DataSet<Node> = new DataSet<Node>(), edges: DataSet<Edge> = new DataSet<Edge>()) {
	if (!stack || !stack.top) return { nodes, edges };

	let current = stack.top;
	let position = 0;

	while (current) {
		const nodeId = current.id;
		const isTop = stack.top && stack.top.id === nodeId;
		const nodeData = new LinkedListNodeData(isTop, false);

		nodes.add({
			id: nodeId,
			label: current.value.toString(),
			title: NodeData.toTitle(nodeData),
		});

		if (current.next) {
			const edgeId = `${nodeId}->${current.next.id}`;
			edges.add({
				id: edgeId,
				from: nodeId,
				to: current.next.id,
				arrows: 'to',
			});
			current = current.next;
			position++;
		} else {
			break;
		}
	}

	return { nodes, edges };
}

export function queueToGraph(queue: any, nodes: DataSet<Node> = new DataSet<Node>(), edges: DataSet<Edge> = new DataSet<Edge>()) {
	if (!queue || !queue.front) return { nodes, edges };

	let current = queue.front;
	let position = 0;

	while (current) {
		const nodeId = current.id;
		let isFront = false;
		if (queue.front && queue.front.id === nodeId) {
			isFront = true;
		}
		let isRear = false;
		if (queue.rear && queue.rear.id === nodeId) {
			isRear = true;
		}
		const nodeData = new LinkedListNodeData(isFront, isRear);

		nodes.add({
			id: nodeId,
			label: current.value.toString(),
			title: NodeData.toTitle(nodeData),
		});

		if (current.next) {
			const edgeId = `${nodeId}->${current.next.id}`;
			edges.add({
				id: edgeId,
				from: nodeId,
				to: current.next.id,
				arrows: 'to',
			});
			current = current.next;
			position++;
		} else {
			break;
		}
	}

	return { nodes, edges };
}
