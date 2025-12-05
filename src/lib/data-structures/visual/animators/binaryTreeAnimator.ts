import type { Node } from 'vis-network';

import { getDummyNodeId, NodeData } from '$lib/data-structures/utils/graphs';

import { DataStructureAnimator, type DataStructureAnimatorOpts } from './dataStructureAnimator';

export class BinaryTreeAnimator extends DataStructureAnimator {
	constructor(opts: DataStructureAnimatorOpts) {
		super(opts);
	}

	findRootNode(): Node | null {
		for (const node of this.nodes.get() as Node[]) {
			if (this.network.getConnectedEdges(node.id!).length == 2) return node;
		}
		return null;
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
		const childrenList: Node[] = [];
		// console.log(`Reordering children of parent ${parentId}`);

		for (const parentEdge of this.network.getConnectedEdges(parentId)) {
			const childId = (this.edges.get(parentEdge) as any).to;

			if (childId === parentId) continue; // skip self-loops

			const childNode = this.nodes.get(childId as number) as Node;
			if (childNode) childrenList.push(childNode);
		}
		// console.log(`Children of parent ${parentId}:`, childrenList.map(c => `${c.title}: ${c.id}`));

		// sort children by title
		childrenList.sort((a, b) => {
			// title is NodeData serialized as string
			const aData = NodeData.fromNode(a);
			const bData = NodeData.fromNode(b);
			return aData.compareTo(bData);
		});
		// console.log(`Reordered children of parent ${parentId}:`, childrenList.map(c => `${c.title}: ${c.id}`));

		// remove and re-add nodes in sorted order
		for (const childNode of childrenList) {
			// console.log(`Re-linking child node ${childNode.id} with title ${childNode.title}`);
			this.removeNodeRaw(childNode.id!);
			this.addNodeRaw(childNode);
			this.reorderChildNodes(childNode.id!);
		}
	}

	addNode(nodeId: number, value: number | string) {
		this.addNodeRaw({ id: nodeId, title: NodeData.toTitle(new NodeData(0)), label: value.toString() });
	}

	removeNode(nodeId: number | string) {
		// remove node and its edges
		try {
			const connectedEdges = (this.network as any).getConnectedEdges(nodeId);
			this.removeEdgeRaw(connectedEdges);
		} catch {}
		this.removeNodeRaw(nodeId);
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

	public unlinkNode(parentId: number, childId: number) {
		try {
			const childEdges = (this.network as any).getConnectedEdges(childId) as string[];
			console.log(`Unlinking child node ${childId} from parent ${parentId}`);
			console.log(`Child edges:`, childEdges);
			for (const edgeId of childEdges) {
				const edge = this.edges.get(edgeId);
				console.log(`Checking edge ${edgeId} from ${edge?.from} to ${edge?.to}`);
				if (edge && edge.from === parentId) {
					this.removeEdgeRaw(edgeId as any);
					break;
				}
			}
		} catch (ex) {
			console.warn(`Failed to unlink child node ${childId} from parent ${parentId}:`, ex);
		}
		console.log(`Unlinked child node ${childId} from parent ${parentId}`);
	}

	public linkNode(parentId: number, childId: number, childNumber: number) {
		try {
			const parentNode = this.nodes.get(parentId) as any;
			const childNode = this.nodes.get(childId) as any;
			if (!parentNode || !childNode) return;

			this.addEdgeRaw({ id: `edge-${parentId}-${childNumber}`, from: parentId, to: childId });
			this.updateNodeRaw({ id: childId, title: NodeData.toTitle(new NodeData(childNumber)) });

			console.log(`Linked node ${childId} to parent ${parentId} as child number ${childNumber}`);
			this.reorderChildNodes(parentId);
		} catch (ex) {
			console.warn(`Failed to link node ${childId} to parent ${parentId} as child number ${childNumber}:`, ex);
		}
	}

	public addDummyNode(parentId: number, direction: number) {
		try {
			this.addNodeRaw({
				id: getDummyNodeId(parentId, direction),
				color: 'transparent',
				title: NodeData.toTitle(new NodeData(direction as number)),
			});
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
