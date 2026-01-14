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
		this.addNodeRaw({ id: nodeId, title: NodeData.toTitle(new NodeData(0)), label: value.toString() });
	}

	ensure(tree: any) {
		this.ensureWithFn(tree, bTreeToGraph);
	}

	protected ensureWithFn(tree: any, toGraphFn: (root: any) => { nodes: any; edges: any }) {
		try {
			const timer = new Timer();
			const newData = toGraphFn(tree.root ?? null);
			timer.checkpoint('graph');

			// update existing nodes or add new ones
			for (const n of newData.nodes.get()) {
				if (this.nodes.get(n.id!)) {
					this.updateNodeRaw(n);
				} else {
					this.addNodeRaw(n);
				}
			}

			// remove nodes that are no longer present
			const newNodeIds = new Set(newData.nodes.get().map((n: any) => n.id));
			for (const existingNode of this.nodes.get()) {
				if (!newNodeIds.has(existingNode.id)) {
					this.removeNodeRaw(existingNode.id!);
				}
			}
			timer.checkpoint('nodes');

			// rebuild edges from authoritative graph
			try {
				this.edges.clear();
				this.edges.add(newData.edges.get());
			} catch {}
			timer.checkpoint('edges');

			// timer.printReport('BTreeAnimator.ensureTree: ');
		} catch (err) {
			console.warn('BTreeAnimator.ensureTree error', err);
		}
	}
}
