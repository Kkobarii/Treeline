import { getDummyNodeId, NodeData } from '$lib/data-structures/utils/graphs';
import { deepEqual } from '$lib/data-structures/utils/utils';
import { Timer } from '$lib/utils/timer';

import { DataStructureAnimator, type DataStructureAnimatorOpts } from './dataStructureAnimator';

export class BinaryTreeAnimator extends DataStructureAnimator {
	constructor(opts: DataStructureAnimatorOpts) {
		super(opts);
	}

	private isNodeConsistent(currentNode: any, expectedNode: any): boolean {
		for (const [key, value] of Object.entries(expectedNode)) {
			if (!deepEqual(currentNode?.[key], value)) return false;
		}
		return true;
	}

	private isEdgeConsistent(currentEdge: any, expectedEdge: any): boolean {
		for (const [key, value] of Object.entries(expectedEdge)) {
			if (!deepEqual(currentEdge?.[key], value)) return false;
		}
		return true;
	}

	private hasNodeInconsistencies(expectedNodes: any[]): boolean {
		const currentNodes = this.nodes.get();
		if (currentNodes.length !== expectedNodes.length) return true;

		const currentById = new Map(currentNodes.map(node => [node.id, node]));
		for (const expectedNode of expectedNodes) {
			const currentNode = currentById.get(expectedNode.id);
			if (!currentNode) return true;
			if (!this.isNodeConsistent(currentNode, expectedNode)) return true;
		}

		return false;
	}

	private hasEdgeInconsistencies(expectedEdges: any[]): boolean {
		const currentEdges = this.edges.get();
		if (currentEdges.length !== expectedEdges.length) return true;

		const currentByKey = new Map(currentEdges.map(edge => [edge.id, edge]));
		for (const expectedEdge of expectedEdges) {
			const currentEdge = currentByKey.get(expectedEdge.id);
			if (!currentEdge) return true;
			if (!this.isEdgeConsistent(currentEdge, expectedEdge)) return true;
		}

		return false;
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

	addNode(nodeId: number, value: number | string) {
		this.addNodeRaw({ id: nodeId, title: NodeData.toTitle(new NodeData(0)), label: value.toString() });
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

	protected ensureWithFn(tree: any, toGraphFn: (root: any) => { nodes: any; edges: any }) {
		try {
			const timer = new Timer();
			const newData = toGraphFn(tree.root ?? null);
			const expectedNodes = newData.nodes.get();
			const expectedEdges = newData.edges.get();

			timer.checkpoint('graph');

			const nodesInconsistent = this.hasNodeInconsistencies(expectedNodes);
			const edgesInconsistent = this.hasEdgeInconsistencies(expectedEdges);
			timer.checkpoint('check');

			if (nodesInconsistent) {
				// update existing nodes or add new ones
				for (const n of expectedNodes) {
					if (this.nodes.get(n.id!)) {
						this.updateNodeRaw(n);
					} else {
						this.addNodeRaw(n);
					}
				}

				// remove nodes that are no longer present
				const newNodeIds = new Set(expectedNodes.map((n: any) => n.id));
				for (const existingNode of this.nodes.get()) {
					if (!newNodeIds.has(existingNode.id)) {
						this.removeNodeRaw(existingNode.id!);
					}
				}
				timer.checkpoint('nodes');
			}

			if (edgesInconsistent) {
				// rebuild edges from authoritative graph
				try {
					this.edges.clear();
					this.edges.add(expectedEdges);
				} catch {}
				timer.checkpoint('edges');
			}

			if (nodesInconsistent || edgesInconsistent) {
				this.clearDisconnectedDummyNodes();
				timer.checkpoint('cleanup');
			}

			timer.printReport('BinaryTreeAnimator.ensureTree: ');
		} catch (err) {
			console.warn('BinaryTreeAnimator.ensureTree error', err);
		}
	}
}
