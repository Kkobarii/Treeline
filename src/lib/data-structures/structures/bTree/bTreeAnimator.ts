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

			// // update existing nodes or add new ones
			// for (const n of newData.nodes.get()) {
			// 	if (this.nodes.get(n.id!)) {
			// 		this.updateNodeRaw(n);
			// 	} else {
			// 		this.addNodeRaw(n);
			// 	}
			// }

			// // remove nodes that are no longer present
			// const newNodeIds = new Set(newData.nodes.get().map((n: any) => n.id));
			// for (const existingNode of this.nodes.get()) {
			// 	if (!newNodeIds.has(existingNode.id)) {
			// 		this.removeNodeRaw(existingNode.id!);
			// 	}
			// }
			// timer.checkpoint('nodes');

			// // for all new nodes, make sure they have correct order
			// // check all parent children and reorder nodes if necessary
			// // (vis-network does not guarantee order of nodes when multiple nodes are added at once)
			// for (const n of newData.nodes.get()) {
			//     const node = this.nodes.get(n.id!);
			//     if (!node) continue;

			//     const nodeData = NodeData.fromNode(n);
			//     if (nodeData.childNumber >= 0 && tree.root) {
			//         const parent = tree.findParentOfNode(tree.root, n.id);
			//         if (parent) {
			//             const correctIndex = parent.children.findIndex((child: any) => child.id === n.id);
			//             if (correctIndex >= 0 && correctIndex !== nodeData.childNumber) {
			//                 // reorder node by removing and re-adding with correct childNumber
			//                 const updatedNode = { ...node };
			//                 updatedNode.title = NodeData.toTitle(new NodeData(correctIndex));
			//                 this.updateNodeRaw(updatedNode);
			//             }
			//         }
			//     }
			// }

			try {
				this.nodes.clear();
				for (const n of newData.nodes.get()) {
					this.addNodeRaw(n);
				}
			} catch {}
			timer.checkpoint('nodes');

			// rebuild edges from authoritative graph
			try {
				this.edges.clear();
				this.edges.add(newData.edges.get());
			} catch {}
			timer.checkpoint('edges');

			// timer.printReport('BTreeAnimator.ensureTree: ');

			// console.log('BTreeAnimator.ensureWithFn completed');
			// console.log('Tree:', tree);
			// console.log('Nodes:', this.nodes.get());
			// console.log('Edges:', this.edges.get());
		} catch (err) {
			console.warn('BTreeAnimator.ensureTree error', err);
		}
	}
}
