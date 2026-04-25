import type { Position } from 'vis-network';

import { bTreeToGraph, NodeData } from '$lib/data-structures/utils/graphs';
import { CheckpointTimer } from '$lib/utils/checkpointTimer';

import { DataStructureAnimator, type DataStructureAnimatorOpts } from '../../visual/animators/dataStructureAnimator';
import type { TranslationPair } from './bTree';

export class BTreeAnimator extends DataStructureAnimator {
	constructor(opts: DataStructureAnimatorOpts) {
		super(opts);
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
			const timer = new CheckpointTimer();
			const newData = toGraphFn(tree.root ?? null);
			timer.checkpoint('graph');

			// // perserve node colors
			// const oldNodes = this.nodes.get();

			try {
				this.nodes.clear();
				for (const n of newData.nodes.get()) {
					this.addNodeRaw(n);

					// const oldNode = oldNodes.find(on => on.id === n.id);
					// if (oldNode) {
					// 	this.setNodeColor(n.id, String(oldNode.color));
					// }
				}
			} catch {}
			timer.checkpoint('nodes');

			// rebuild edges from authoritative graph
			try {
				this.edges.clear();
				this.edges.add(newData.edges.get());
			} catch {}
			timer.checkpoint('edges');

			timer.printReport('BTreeAnimator.ensureTree: ');
		} catch (err) {
			console.warn('BTreeAnimator.ensureTree error', err);
		}
	}

	async ensureAndAnimateSplit(tree: any, translationMap: Array<TranslationPair>): Promise<void> {
		const oldPositions = this.getPositions();
		const translatedOldPositions: { [nodeId: string]: Position } = this.translateOldPositions(translationMap, oldPositions);

		this.ensure(tree);
		const newPositions = this.getPositions();
		await this.animateRelayout(translatedOldPositions, newPositions);
		await Promise.resolve(new Promise(resolve => setTimeout(resolve, 50))); // this just work and i dont know why
	}

	async ensureAndAnimateMerge(tree: any, translationMap: Array<TranslationPair>): Promise<void> {
		await this.ensureAndAnimateMergeFirstPart(tree, translationMap);
		await this.ensureAndAnimateMergeSecondPart(tree, translationMap);
	}

	getMergedNodeId(translationMap: Array<TranslationPair>): string {
		const newIdCounts: { [newId: number]: number } = {};
		for (const { newId } of translationMap) {
			newIdCounts[newId] = (newIdCounts[newId] || 0) + 1;
		}
		const mergedNewId = Object.entries(newIdCounts).find(([_, count]) => count > 1)?.[0];
		if (!mergedNewId) {
			console.warn('BTreeAnimator.ensureAndAnimateMergeFirstPart: no merged node found in translation map', translationMap);
			return '0';
		}
		return mergedNewId;
	}

	getMergedOldIdsAndPositions(
		translationMap: Array<TranslationPair>,
		oldPositions: { [nodeId: string]: Position },
	): { mergedOldIds: number[]; mergedOldPositions: Position[] } {
		const mergedNewId = this.getMergedNodeId(translationMap);
		const mergedOldIds = translationMap.filter(({ newId }) => newId.toString() === mergedNewId)?.map(({ oldId }) => oldId);
		const mergedOldPositions = mergedOldIds.map(oldId => oldPositions[oldId]).filter(pos => pos);
		return { mergedOldIds, mergedOldPositions };
	}

	getMiddlePosition(positions: Position[]): Position {
		return {
			x: positions.reduce((sum, pos) => sum + pos.x, 0) / positions.length,
			y: positions.reduce((sum, pos) => sum + pos.y, 0) / positions.length,
		};
	}

	async ensureAndAnimateMergeFirstPart(tree: any, translationMap: Array<TranslationPair>): Promise<void> {
		const oldPositions = this.getPositions();

		// find the new merged node
		const mergedNewId = this.getMergedNodeId(translationMap);

		// move merged nodes to the middle of their old positions before animating
		const movePromises: Promise<void>[] = [];
		const { mergedOldIds, mergedOldPositions } = this.getMergedOldIdsAndPositions(translationMap, oldPositions);

		const middlePosition = this.getMiddlePosition(mergedOldPositions);
		for (const oldId of mergedOldIds) {
			movePromises.push(this.animateNodeMovement(oldId, oldPositions[oldId], middlePosition));
		}
		await Promise.all(movePromises);
		await Promise.resolve(new Promise(resolve => setTimeout(resolve, 50))); // this just work and i dont know why
	}

	async ensureAndAnimateMergeSecondPart(tree: any, translationMap: Array<TranslationPair>): Promise<void> {
		const oldPositions = this.getPositions();
		this.ensure(tree);
		const newPositions = this.getPositions();
		const translatedOldPositions: { [nodeId: string]: Position } = this.translateOldPositions(translationMap, oldPositions);
		const mergedNewId = this.getMergedNodeId(translationMap);
		const { mergedOldPositions } = this.getMergedOldIdsAndPositions(translationMap, oldPositions);
		const middlePosition = this.getMiddlePosition(mergedOldPositions);

		translatedOldPositions[mergedNewId] = middlePosition; // ensure merged node starts from middle position
		await this.animateRelayout(translatedOldPositions, newPositions);
		await Promise.resolve(new Promise(resolve => setTimeout(resolve, 50))); // this just work and i dont know why
	}

	private translateOldPositions(translationMap: TranslationPair[], oldPositions: { [nodeId: string]: Position }) {
		const translatedOldPositions: { [nodeId: string]: Position } = {};
		for (const { newId, oldId } of translationMap) {
			const oldPos = oldPositions[oldId];
			if (oldPos) {
				translatedOldPositions[newId] = oldPos;
			}
		}
		return translatedOldPositions;
	}
}
