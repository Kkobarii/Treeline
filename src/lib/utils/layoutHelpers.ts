import { DataSet } from 'vis-data';
import { Network } from 'vis-network';

import type { BSTree } from '$lib/structures/bsTree';
import { bsTreeToGraph } from '$lib/utils/graphs';

/**
 * Compute layout positions for a BSTree by creating a temporary offscreen
 * vis Network with the same options and reading node positions.
 * Returns a Map<nodeId, Position>.
 */
export async function computeLayoutForTree(tree: BSTree, options: any, containerSize?: { width: number; height: number }) {
	const { nodes: newNodes, edges: newEdges } = bsTreeToGraph(tree.root);

	// create offscreen div
	const tempDiv = document.createElement('div');
	tempDiv.style.position = 'absolute';
	tempDiv.style.left = '-9999px';
	tempDiv.style.top = '-9999px';
	if (containerSize) {
		tempDiv.style.width = containerSize.width + 'px';
		tempDiv.style.height = containerSize.height + 'px';
	} else {
		tempDiv.style.width = '800px';
		tempDiv.style.height = '600px';
	}
	document.body.appendChild(tempDiv);

	const tempNodes = new DataSet(newNodes.get().map(n => ({ ...n })));
	const tempEdges = new DataSet(newEdges.get().map(e => ({ ...e })));

	let tempNetwork: Network | null = null;
	const result = new Map<any, any>();
	try {
		tempNetwork = new Network(tempDiv, { nodes: tempNodes, edges: tempEdges }, options);

		for (const n of tempNodes.get()) {
			try {
				const p = tempNetwork.getPosition(n.id);
				result.set(n.id, p);
			} catch {
				if (typeof n.x === 'number' && typeof n.y === 'number') result.set(n.id, { x: n.x, y: n.y });
			}
		}
	} catch (err) {
		console.warn('computeLayoutForTree: temp network failed', err);
	} finally {
		try {
			if (tempNetwork) tempNetwork.destroy();
		} catch {}
		tempDiv.remove();
	}

	return result;
}
