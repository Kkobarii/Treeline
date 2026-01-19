import { bTreeToGraph, NodeData } from '$lib/data-structures/utils/graphs';
import { Timer } from '$lib/utils/timer';

import { DataStructureAnimator, type DataStructureAnimatorOpts } from '../../visual/animators/dataStructureAnimator';

export class BTreeAnimator extends DataStructureAnimator {
	constructor(opts: DataStructureAnimatorOpts) {
		super(opts);
	}

	// B-Trees don't need special leg animations like binary trees
	async animateLegsGrowth(nodeId: string | number) {
		// No-op for B-Trees
	}

	async animateLegsShrink(nodeId: string | number) {
		// No-op for B-Trees
	}

	// Add node helper for step handlers
	addNode(nodeId: number, value: number | string) {
		this.addNodeRaw({
			data: {
				id: nodeId,
				title: NodeData.toTitle(new NodeData(0)),
				label: value.toString(),
			},
		});
	}

	ensure(tree: any) {
		this.ensureWithFn(tree, bTreeToGraph);
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

			// Run layout to position nodes properly and fit viewport
			this.runTreeLayout();

			// timer.printReport('BTreeAnimator.ensureTree: ');

			console.log('BTreeAnimator.ensureWithFn completed');
		} catch (err) {
			console.warn('BTreeAnimator.ensureTree error', err);
		}
	}
}
