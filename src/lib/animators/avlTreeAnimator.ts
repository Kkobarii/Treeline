import { avlTreeToGraph } from '$lib/utils/graphs';

import { type DataStructureAnimatorOpts } from './dataStructureAnimator';
import { BinaryTreeAnimator } from './binaryTreeAnimator';

export class AVLTreeAnimator extends BinaryTreeAnimator {

	constructor(opts: DataStructureAnimatorOpts) {
		super(opts);
	}

	ensureTree(tree: any) {
		console.log('AVLTreeAnimator.ensureTree called');
		try {
			const newData = avlTreeToGraph(tree.root ?? null);
			console.log('AVLTreeAnimator.ensureTree newData:', newData);

			// update existing nodes or add new ones
			for (const n of newData.nodes.get()) {
				if (this.nodes.get(n.id!)) {
					this.updateNodeRaw(n);
				} else {
					this.addNodeRaw(n);
				}
			}

			// remove nodes that are no longer present (except info node)
			const newNodeIds = new Set(newData.nodes.get().map((n: any) => n.id));
			for (const existingNode of this.nodes.get()) {
				if (!newNodeIds.has(existingNode.id) && existingNode.id !== this.infoNodeId) {
					this.removeNodeRaw(existingNode.id!);
				}
			}

			// rebuild edges from authoritative graph
			try {
				this.edges.clear();
			} catch {}
			for (const e of newData.edges.get()) {
				if (!this.edges.get(e.id!)) this.addEdgeRaw(e);
			}

			for (const node of newData.nodes.get()) {
				this.reorderChildNodes(node.id!);
			}

			this.clearDisconnectedDummyNodes();
		} catch (err) {
			console.warn('AVLTreeAnimator.ensureTree error', err);
		}
	}
}
