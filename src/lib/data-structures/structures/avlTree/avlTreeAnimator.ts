import { avlTreeToGraph } from '$lib/data-structures/utils/graphs';
import { Timer } from '$lib/utils/timer';

import { BinaryTreeAnimator } from '../../visual/animators/binaryTreeAnimator';
import { type DataStructureAnimatorOpts } from '../../visual/animators/dataStructureAnimator';

export class AVLTreeAnimator extends BinaryTreeAnimator {

	constructor(opts: DataStructureAnimatorOpts) {
		super(opts);
	}

	ensureTree(tree: any) {
		try {
			const timer = new Timer();
			const newData = avlTreeToGraph(tree.root ?? null);
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

			this.clearDisconnectedDummyNodes();
			timer.checkpoint('cleanup');

			timer.printReport('AVLTreeAnimator.ensureTree: ');
		} catch (err) {
			console.warn('AVLTreeAnimator.ensureTree error', err);
		}
	}
}
