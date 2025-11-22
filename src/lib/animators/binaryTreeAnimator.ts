import type { Node, NodeOptions, Position } from 'vis-network';

import { bsTreeToGraph, getDummyNodeId, getEdgeId } from '$lib/utils/graphs';

import { DataStructureAnimator, type DataStructureAnimatorOpts } from './dataStructureAnimator';

export class BinaryTreeAnimator extends DataStructureAnimator {
	infoNodeOptions: NodeOptions | undefined;
	infoNodeId: string = 'info-node';
	infoNodeAboveOffset: number = 50;

	constructor(opts: DataStructureAnimatorOpts) {
		super(opts);
		this.infoNodeOptions = opts.infoNodeOptions;
	}

	createInfoNode() {
		try {
			this.addNodeRaw({
				id: this.infoNodeId,
				label: 'Info',
				x: 0,
				y: 0,
				font: this.infoNodeOptions?.font,
				color: this.infoNodeOptions?.color,
				hidden: true,
			});
		} catch {}
	}

	public addNodeRaw(node: Node): void {
		super.addNodeRaw(node);
	}

	getPositionAbove(nodeId: string | number, offset?: number): Position {
		const pos = this.getPosition(nodeId);
		return { x: pos.x, y: pos.y - (offset ?? this.infoNodeAboveOffset) };
	}

	async snapNodeAbove(infoNodeId: string | number, nodeId: string | number, offset?: number) {
		const pos = this.getPosition(nodeId);
		await this.snapNodeTo(infoNodeId, pos.x, pos.y - (offset ?? this.infoNodeAboveOffset));
	}

	async changeInfoNodeAnnotation(annotation: string) {
		try {
			this.updateNodeRaw({
				id: this.infoNodeId,
				label: annotation,
				hidden: false,
				color: this.infoNodeOptions?.color,
				font: this.infoNodeOptions?.font,
			} as any);
		} catch {}
	}

	async hideInfoNode() {
		this.hideNode(this.infoNodeId);
	}

	findRootNode(): Node | null {
		for (const node of this.nodes.get() as Node[]) {
			if (this.network.getConnectedEdges(node.id!).length == 2) return node;
		}
		return null;
	}

	async animateAnnotateNode(annotation: string, nodeId: string | number | null) {
		try {
			await this.changeInfoNodeAnnotation(annotation);
			if (nodeId === null) {
				const root = this.findRootNode();
				if (root) await this.snapNodeAbove(this.infoNodeId, root.id!, this.infoNodeAboveOffset);
				else await this.snapNodeTo(this.infoNodeId, 0, 0);
			} else {
				await this.snapNodeAbove(this.infoNodeId, nodeId, this.infoNodeAboveOffset);
			}
		} catch {}
	}

	protected async animateLegsMove(nodeId: string | number, grow: boolean) {
		const parentPos = this.getPosition(nodeId);
		const promises: Promise<void>[] = [];

		const left = getDummyNodeId(nodeId, 0);
		const right = getDummyNodeId(nodeId, 1);

		if (grow) {
			if (this.nodes.get(left)) {
				const leftFinal = this.getPosition(left);
				await this.snapNodeTo(left, parentPos.x, parentPos.y);
				promises.push(this.animateNodeMovement(left, parentPos, leftFinal));
			}
			if (this.nodes.get(right)) {
				const rightFinal = this.getPosition(right);
				await this.snapNodeTo(right, parentPos.x, parentPos.y);
				promises.push(this.animateNodeMovement(right, parentPos, rightFinal));
			}
		} else {
			if (this.nodes.get(left)) promises.push(this.animateNodeMovement(left, this.getPosition(left), parentPos));
			if (this.nodes.get(right)) promises.push(this.animateNodeMovement(right, this.getPosition(right), parentPos));
		}

		await Promise.all(promises);
	}

	async animateLegsGrowth(nodeId: string | number) {
		return this.animateLegsMove(nodeId, true);
	}

	async animateLegsShrink(nodeId: string | number) {
		return this.animateLegsMove(nodeId, false);
	}

	protected reorderChildNodes(parentId: number | string) {
		const childrenList : Node[] = [];
		console.log(`Reordering children of parent ${parentId}`);

		for (const parentEdge of this.network.getConnectedEdges(parentId)) {
			const childId = (this.edges.get(parentEdge) as any).to;

			if (childId === parentId) continue; // skip self-loops

			const childNode = this.nodes.get(childId as number) as Node;
			if (childNode) childrenList.push(childNode);
		}
		console.log(`Children of parent ${parentId}:`, childrenList.map(c => `${c.value}: ${c.id}`));

		// sort children by value
		childrenList.sort((a, b) => {
			if (a.value === undefined || b.value === undefined) return 0;
			return (a.value as number) - (b.value as number);
		});
		console.log(`Reordered children of parent ${parentId}:`, childrenList.map(c => `${c.value}: ${c.id}`));

		// remove and re-add edges in sorted order
		for (const childNode of childrenList) {
			console.log(`Re-linking child node ${childNode.id} with value ${childNode.value}`);
			this.removeNodeRaw(childNode.id!);
			this.addNodeRaw(childNode);
		}
	}

	addNode(nodeId: number, value: number | string, parentId?: number, childNumber?: number) {
		if (this.nodes.get(nodeId)) return;
		this.addNodeRaw({ id: nodeId, title: `Node ${nodeId}`, label: `${value}` });

		if (parentId !== undefined && childNumber !== undefined) {
			this.updateNodeRaw({ id: nodeId, label: value.toString(), title: `Node ${nodeId}: ${value}`, value: childNumber });
			
			const edgeId = getEdgeId(parentId, childNumber);
			this.removeNodeRaw(getDummyNodeId(parentId, childNumber));
			this.removeEdgeRaw(edgeId);
			this.addEdgeRaw({ id: edgeId, from: parentId, to: nodeId });

			this.reorderChildNodes(parentId);
		}

		if (!this.nodes.get(getDummyNodeId(nodeId, 0))) 
			this.addNodeRaw({ id: getDummyNodeId(nodeId, 0), color: 'transparent' });
		if (!this.nodes.get(getDummyNodeId(nodeId, 1)))
			this.addNodeRaw({ id: getDummyNodeId(nodeId, 1), color: 'transparent' });

		this.addEdgeRaw({ id: getEdgeId(nodeId, 0), from: nodeId, to: getDummyNodeId(nodeId, 0), dashes: true });
		this.addEdgeRaw({ id: getEdgeId(nodeId, 1), from: nodeId, to: getDummyNodeId(nodeId, 1), dashes: true });
	}

	removeNode(nodeId: number | string, ignoreParent = false) {
		let parent = this.getParent(nodeId);
		let value = this.nodes.get(nodeId)!.value!;

		// remove node and its edges
		try {
			const connectedEdges = (this.network as any).getConnectedEdges(nodeId);
			this.removeEdgeRaw(connectedEdges);
		} catch {}
		this.removeNodeRaw(nodeId);

		// remove dummy children
		try {
			if (this.nodes.get(getDummyNodeId(nodeId as any, 0))) this.removeNodeRaw(getDummyNodeId(nodeId as any, 0));
		} catch {}
		try {
			if (this.nodes.get(getDummyNodeId(nodeId as any, 1))) this.removeNodeRaw(getDummyNodeId(nodeId as any, 1));
		} catch {}

		if (parent === null || ignoreParent) return;

		// recreate dummy node for parent
		this.addNodeRaw({ id: getDummyNodeId(parent.id!, value), color: 'transparent' });
		this.addEdgeRaw({ id: `edge-${parent.id}-${value}`, from: parent.id, to: getDummyNodeId(parent.id!, value), dashes: true });
		this.reorderChildNodes(parent.id!);
	}

	clearDisconnectedDummyNodes() {
		const toRemove: string[] = [];
		for (const node of this.nodes.get()) {
			if (typeof node.id === 'string' && node.id.startsWith('dummy-')) {
				const connected = (this.network as any).getConnectedNodes(node.id);
				if (connected.length === 0) toRemove.push(node.id as string);
			}
		}
		if (toRemove.length) this.removeNodeRaw(toRemove as any);
	}

	// Helper to unlink an edge between parent and child; used by higher-level BST operations.
	public unlinkNode(parentId: number, childId: number) {
		try {
			const childEdges = (this.network as any).getConnectedEdges(childId) as string[];
			for (const edgeId of childEdges) {
				const edge = this.edges.get(edgeId);
				if (edge && edge.from === parentId) {
					this.removeEdgeRaw(edgeId as any);
					break;
				}
			}
		} catch {}
	}

	public linkNode(parentId: number, childId: number) {
		try {
			const parentNode = this.nodes.get(parentId) as any;
			const childNode = this.nodes.get(childId) as any;
			if (!parentNode || !childNode) return;

			const childNodeValue = childNode.value!;

			this.addEdgeRaw({ id: `edge-${parentId}-${childNodeValue}`, from: parentId, to: childId });
			this.reorderChildNodes(parentId);
		} catch {}
	}

	// Recreate the dummy child for a parent in the given direction.
	public addDummyNode(parentId: number, direction: 'left' | 'right' | number) {
		try {
			this.addNodeRaw({ id: getDummyNodeId(parentId, direction), color: 'transparent' });
			this.addEdgeRaw({ id: `edge-${parentId}-${direction}`, from: parentId, to: getDummyNodeId(parentId, direction), dashes: true });
			
			this.reorderChildNodes(parentId);
		} catch {}
	}

	getParent(nodeId: string | number): Node | null {
		try {
			const connectedEdges = this.network.getConnectedEdges(nodeId);
			for (const edgeId of connectedEdges) {
				const edge = this.edges.get(edgeId);
				if (edge && edge.to! === nodeId) {
					return this.nodes.get(edge.from!);
				}
			}
		} catch {}
		return null;
	}
}
