import { queueToGraph } from '$lib/data-structures/utils/graphs';

import { DataStructureAnimator, type DataStructureAnimatorOpts } from '../../visual/animators/dataStructureAnimator';

export class QueueAnimator extends DataStructureAnimator {
	constructor(opts: DataStructureAnimatorOpts) {
		super(opts);
	}

	ensure(queue: any) {
		try {
			const newData = queueToGraph(queue);

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

			// rebuild edges from authoritative graph
			try {
				this.edges.clear();
				this.edges.add(newData.edges.get());
			} catch {}
		} catch (err) {
			console.warn('QueueAnimator.ensure error', err);
		}
	}
}
