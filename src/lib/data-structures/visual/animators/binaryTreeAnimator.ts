import { getDummyNodeId, NodeData } from '$lib/data-structures/utils/graphs';
import { Timer } from '$lib/utils/timer';

import { DataStructureAnimator, type DataStructureAnimatorOpts } from './dataStructureAnimator';

export class BinaryTreeAnimator extends DataStructureAnimator {
	constructor(opts: DataStructureAnimatorOpts) {
		super(opts);
	}

	protected async animateLegsMove(nodeId: string | number, grow: boolean) {
		const parentPos = this.getPosition(nodeId);
		const promises: Promise<void>[] = [];

		const left = getDummyNodeId(nodeId, 0);
		const right = getDummyNodeId(nodeId, 1);

		if (grow) {
			const leftNode = this.cy.getElementById(left);
			if (leftNode && leftNode.isNode()) {
				const leftFinal = this.getPosition(left);
				await this.snapNodeTo(left, parentPos.x, parentPos.y);
				promises.push(this.animateNodeMovement(left, parentPos, leftFinal));
			}
			const rightNode = this.cy.getElementById(right);
			if (rightNode && rightNode.isNode()) {
				const rightFinal = this.getPosition(right);
				await this.snapNodeTo(right, parentPos.x, parentPos.y);
				promises.push(this.animateNodeMovement(right, parentPos, rightFinal));
			}
		} else {
			const leftNode = this.cy.getElementById(left);
			if (leftNode && leftNode.isNode()) promises.push(this.animateNodeMovement(left, this.getPosition(left), parentPos));
			const rightNode = this.cy.getElementById(right);
			if (rightNode && rightNode.isNode()) promises.push(this.animateNodeMovement(right, this.getPosition(right), parentPos));
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
		this.addNodeRaw({
			data: {
				id: nodeId,
				label: value.toString(),
				title: NodeData.toTitle(new NodeData(0)),
			},
		});
	}

	clearDisconnectedDummyNodes() {
		const toRemove: string[] = [];
		for (const node of this.cy.nodes()) {
			if (node.id().startsWith('dummy-')) {
				const connected = node.connectedEdges().length > 0;
				if (!connected) toRemove.push(node.id());
			}
		}
		if (toRemove.length) {
			for (const id of toRemove) {
				this.removeNodeRaw(id);
			}
		}
	}

	protected ensureWithFn(tree: any, toGraphFn: (root: any) => { nodes: any[]; edges: any[] }) {
		try {
			const timer = new Timer();
			const newData = toGraphFn(tree.root ?? null);
			timer.checkpoint('graph');

			// update existing nodes or add new ones
			for (const n of newData.nodes) {
				const nodeId = String(n.data.id);
				const existingNode = this.cy.getElementById(nodeId);
				if (existingNode && existingNode.isNode()) {
					existingNode.data({ ...n.data, id: nodeId });
				} else {
					this.addNodeRaw({ ...n, data: { ...n.data, id: nodeId } });
				}
			}

			// remove nodes that are no longer present
			const newNodeIds = new Set(newData.nodes.map((n: any) => String(n.data.id)));
			for (const existingNode of this.cy.nodes()) {
				if (!newNodeIds.has(existingNode.id())) {
					this.removeNodeRaw(existingNode.id());
				}
			}
			timer.checkpoint('nodes');

			// rebuild edges from authoritative graph
			try {
				this.cy.remove(this.cy.edges());
				for (const e of newData.edges) {
					this.cy.add({
						...e,
						data: {
							...e.data,
							id: String(e.data.id),
							source: String(e.data.source),
							target: String(e.data.target),
						},
					});
				}
			} catch {}
			timer.checkpoint('edges');

			this.clearDisconnectedDummyNodes();
			timer.checkpoint('cleanup');

			// Run layout to position nodes properly and fit viewport
			this.runTreeLayout();

			// timer.printReport('BinaryTreeAnimator.ensureTree: ');
		} catch (err) {
			console.warn('BinaryTreeAnimator.ensureTree error', err);
		}
	}
}
