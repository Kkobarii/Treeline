import { bsTreetoGraph, getDummyNodeId, getEdgeId } from '$lib/utils/graphs';
import type { Node, NodeOptions, Position } from 'vis-network';
import { BaseNetworkAnimator, type NetworkAnimatorOpts } from './networkAnimator';

export class BSTreeAnimator extends BaseNetworkAnimator {
	infoNodeOptions: NodeOptions | undefined;
	infoNodeId: string = 'info-node';
	infoNodeAboveOffset: number = 50;

	constructor(opts: NetworkAnimatorOpts) {
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
		try {
			this.updateNodeRaw({ id: this.infoNodeId, hidden: true } as any);
		} catch {}
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

	protected async animateLegsMove(nodeId: string | number, grow: boolean, durationMs?: number) {
		const parentPos = this.getPosition(nodeId);
		const promises: Promise<void>[] = [];

		const left = getDummyNodeId(nodeId, 'left');
		const right = getDummyNodeId(nodeId, 'right');

		if (grow) {
			if (this.nodes.get(left)) {
				const leftFinal = this.getPosition(left);
				await this.snapNodeTo(left, parentPos.x, parentPos.y);
				promises.push(this.animateNodeMovement(left, parentPos, leftFinal, durationMs));
			}
			if (this.nodes.get(right)) {
				const rightFinal = this.getPosition(right);
				await this.snapNodeTo(right, parentPos.x, parentPos.y);
				promises.push(this.animateNodeMovement(right, parentPos, rightFinal, durationMs));
			}
		} else {
			if (this.nodes.get(left)) promises.push(this.animateNodeMovement(left, this.getPosition(left), parentPos, durationMs));
			if (this.nodes.get(right)) promises.push(this.animateNodeMovement(right, this.getPosition(right), parentPos, durationMs));
		}

		await Promise.all(promises);
	}

	async animateLegsGrowth(nodeId: string | number, durationMs?: number) {
		return this.animateLegsMove(nodeId, true, durationMs);
	}

	async animateLegsShrink(nodeId: string | number, durationMs?: number) {
		return this.animateLegsMove(nodeId, false, durationMs);
	}

	// --- BST-specific dataset operations ---
	ensureTree(tree: any) {
		try {
			const newData = bsTreetoGraph(tree?.root ?? null);

			// update existing nodes or add new ones
			for (const n of newData.nodes.get()) {
				if (this.nodes.get(n.id!)) {
					this.updateNodeRaw(n);
				} else {
					this.addNodeRaw(n);
					// animate growth for newly-added visible nodes
					this.animateNodeGrowth(n.id!);
				}
			}

			// remove nodes that are no longer present (except info node)
			const newNodeIds = new Set(newData.nodes.get().map((n: any) => n.id));
			for (const existingNode of this.nodes.get()) {
				if (!newNodeIds.has(existingNode.id) && existingNode.id !== this.infoNodeId) {
					this.removeNodeRaw(existingNode.id!);
				} else if (existingNode.id !== this.infoNodeId && !existingNode.id.toString().startsWith('dummy-')) {
					// ensure font size matches configured nodeOptions
					this.updateNodeRaw([{ id: existingNode.id!, font: { size: (this.nodeOptions as any).font.size } } as any]);
				}
			}

			// rebuild edges from authoritative graph
			try {
				this.edges.clear();
			} catch {}
			for (const e of newData.edges.get()) {
				if (!this.edges.get(e.id!)) this.addEdgeRaw(e);
			}

			this.clearDisconnectedDummyNodes();
		} catch {}
	}

	protected reorderChildNodes(parentId: number | string, addedNodeId: number | string) {
		for (const parentEdge of this.network.getConnectedEdges(parentId)) {
			const childId = (this.edges.get(parentEdge) as any).to;
			const rightChildNode = this.nodes.get(childId as number) as any;

			if (rightChildNode) {
				if (rightChildNode.id === addedNodeId) continue;

				this.removeNodeRaw(rightChildNode.id!);
				this.addNodeRaw(rightChildNode);
			}
		}
	}

	addNode(nodeId: number, value: number, parentId?: number, direction?: 'left' | 'right') {
		if (this.nodes.get(nodeId)) return;
		this.addNodeRaw({ id: nodeId, title: `Node ${nodeId}`, label: `${value}` });

		if (parentId !== undefined && direction !== undefined) {
			const edgeId = getEdgeId(parentId, direction);
			this.removeNodeRaw(getDummyNodeId(parentId, direction));
			this.removeEdgeRaw(edgeId);
			this.addEdgeRaw({ id: edgeId, from: parentId, to: nodeId });

			console.log('Added edge', edgeId, 'from', parentId, 'to', nodeId);

			if (direction === 'left') {
				this.reorderChildNodes(parentId, nodeId);
			}
		}

		if (!this.nodes.get(getDummyNodeId(nodeId, 'left'))) this.addNodeRaw({ id: getDummyNodeId(nodeId, 'left'), color: 'transparent' });
		if (!this.nodes.get(getDummyNodeId(nodeId, 'right')))
			this.addNodeRaw({ id: getDummyNodeId(nodeId, 'right'), color: 'transparent' });

		this.addEdgeRaw({ id: getEdgeId(nodeId, 'left'), from: nodeId, to: getDummyNodeId(nodeId, 'left'), dashes: true });
		this.addEdgeRaw({ id: getEdgeId(nodeId, 'right'), from: nodeId, to: getDummyNodeId(nodeId, 'right'), dashes: true });
	}

	removeNode(nodeId: number | string) {
		let parent = this.getParent(nodeId);
		let direction = this.getDirectionFromParent(nodeId);

		// remove node and its edges
		try {
			const connectedEdges = (this.network as any).getConnectedEdges(nodeId);
			this.removeEdgeRaw(connectedEdges);
		} catch {}
		this.removeNodeRaw(nodeId);

		// recreate dummy children
		try {
			if (this.nodes.get(getDummyNodeId(nodeId as any, 'left'))) this.removeNodeRaw(getDummyNodeId(nodeId as any, 'left'));
		} catch {}
		try {
			if (this.nodes.get(getDummyNodeId(nodeId as any, 'right'))) this.removeNodeRaw(getDummyNodeId(nodeId as any, 'right'));
		} catch {}

		if (parent === null || direction === null) return;

		// recreate dummy node for parent
		this.addNodeRaw({ id: getDummyNodeId(parent.id, direction), color: 'transparent' });
		this.addEdgeRaw({ id: `edge-${parent.id}-${direction}`, from: parent.id, to: getDummyNodeId(parent.id, direction), dashes: true });
		if (direction === 'left') {
			this.reorderChildNodes(parent.id, getDummyNodeId(parent.id, direction));
		}
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

	// Recreate the dummy child for a parent in the given direction.
	public addDummyNode(parentId: number, direction: 'left' | 'right') {
		try {
			this.addNodeRaw({ id: getDummyNodeId(parentId, direction), color: 'transparent' });
			this.addEdgeRaw({ id: `edge-${parentId}-${direction}`, from: parentId, to: getDummyNodeId(parentId, direction), dashes: true });
			if (direction === 'left') {
				const rightChildEdgeId = `edge-${parentId}-right`;
				const rightChildEdge: any = this.edges.get(rightChildEdgeId as any);
				if (!rightChildEdge || !(rightChildEdge as any).to) return;

				const node = this.nodes.get((rightChildEdge as any).to as number) as any;
				if (!node) return;

				this.removeNodeRaw(node.id!);
				this.addNodeRaw(node);
			}
		} catch {}
	}
}
