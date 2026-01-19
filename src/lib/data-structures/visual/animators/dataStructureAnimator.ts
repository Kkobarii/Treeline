import type { Core } from 'cytoscape';

import type { CytoscapeNode } from '$lib/data-structures/utils/graphs';
import { addAnimation, DEFAULT_ANIMATION_DURATION_MS, getGlobalAnimationDuration, setGlobalAnimationDuration } from '$lib/utils/animator';

export interface Position {
	x: number;
	y: number;
}

export interface DataStructureAnimatorOpts {
	cy: Core;
	nodeOptions: Record<string, any>;
}

export class DataStructureAnimator {
	cy: Core;
	nodeOptions: Record<string, any>;
	animationDurationMs: number = getGlobalAnimationDuration();
	private hasFitOnce = false;

	protected runTreeLayout() {
		try {
			const prevZoom = this.cy.zoom();
			const prevPan = this.cy.pan();

			const realNodes = this.cy.nodes('[!isPlaceholder]');
			const rootIds = realNodes.filter(n => n.incomers('edge[!dashed]').length === 0).map(n => n.id());
			// include placeholders so dummy leaves are placed, but compute roots from real nodes only
			const elements = this.cy.elements();
			elements
				.layout({
					name: 'breadthfirst',
					directed: true,
					roots: rootIds.length ? rootIds : undefined,
					spacingFactor: 2,
					padding: 60,
					avoidOverlap: true,
					nodeDimensionsIncludeLabels: true,
					animate: false,
				})
				.run();

			if (!this.hasFitOnce) {
				this.cy.fit(elements, 40);
				this.hasFitOnce = true;
			} else {
				this.cy.fit(elements, 40);
				this.cy.zoom(prevZoom);
			}
		} catch (err) {
			console.warn('runTreeLayout failed', err);
		}
	}

	constructor(opts: DataStructureAnimatorOpts) {
		this.cy = opts.cy;
		this.nodeOptions = opts.nodeOptions;
	}

	public setAnimationDuration(durationMs: number) {
		this.animationDurationMs = durationMs;
		setGlobalAnimationDuration(durationMs);
	}

	public resetAnimationDuration() {
		this.setAnimationDuration(DEFAULT_ANIMATION_DURATION_MS);
	}

	// --- low-level node/edge ops ---
	protected async addNodeRaw(node: CytoscapeNode) {
		console.debug('addNodeRaw', node);
		try {
			this.cy.add({
				...node,
				data: {
					...node.data,
					id: String(node.data.id),
				},
			});
		} catch {
			console.warn('Failed to add node', node);
		}
	}

	protected updateNodeRaw(id: string | number, data: Record<string, any>) {
		console.debug('updateNodeRaw', id, data);
		try {
			const node = this.cy.getElementById(String(id));
			if (node && node.isNode()) {
				node.data(data);
			}
		} catch {
			console.warn('Failed to update node', id, data);
		}
	}

	protected removeNodeRaw(id: string | number) {
		console.debug('removeNodeRaw', id);
		try {
			this.cy.remove(`#${String(id)}`);
		} catch {
			console.warn('Failed to remove node', id);
		}
	}

	hasNodes(): boolean {
		try {
			return this.cy.nodes().length > 0;
		} catch {
			return false;
		}
	}

	// --- positioning and movement ---
	getPosition(nodeId: string | number): Position {
		try {
			const node = this.cy.getElementById(String(nodeId));
			if (node && node.isNode()) {
				const pos = node.position();
				return { x: pos.x, y: pos.y };
			}
			return { x: 0, y: 0 };
		} catch {
			return { x: 0, y: 0 };
		}
	}

	protected async moveNode(nodeId: string | number, x: number, y: number) {
		try {
			const node = this.cy.getElementById(String(nodeId));
			if (node && node.isNode()) {
				node.position({ x, y });
			}
		} catch {}
	}

	public async snapNodeTo(nodeId: string | number, x: number, y: number) {
		return this.moveNode(nodeId, x, y);
	}

	animateNodeMovement(nodeId: string | number, from: Position, to: Position): Promise<void> {
		return new Promise(resolve => {
			const cancel = addAnimation((dt, elapsed) => {
				const t = Math.min(1, elapsed / getGlobalAnimationDuration());
				const x = from.x + (to.x - from.x) * t;
				const y = from.y + (to.y - from.y) * t;
				try {
					const node = this.cy.getElementById(String(nodeId));
					if (node && node.isNode()) {
						node.position({ x, y });
					}
				} catch {
					console.warn('Failed to animate node movement', nodeId);
				}
				if (t >= 1) {
					cancel();
					resolve();
					return false;
				}
				return true;
			});
		});
	}

	// --- visual helpers ---
	protected getNodeFontSize(): number {
		return this.nodeOptions.font?.size ?? 14;
	}

	animateNodeGrowth(nodeId: string | number): Promise<void> {
		const finalSize = this.getNodeFontSize();
		return this.changeNodeSize(nodeId, 0, finalSize);
	}

	animateNodeShrink(nodeId: string | number): Promise<void> {
		const startSize = this.getNodeFontSize();
		return this.changeNodeSize(nodeId, startSize, 0);
	}

	protected changeNodeSize(nodeId: string | number, startSize: number, endSize: number): Promise<void> {
		return new Promise(resolve => {
			const cancel = addAnimation((dt, elapsed) => {
				const t = Math.min(1, elapsed / getGlobalAnimationDuration());
				const size = Math.max(0, startSize + (endSize - startSize) * t);
				try {
					this.updateNodeRaw(nodeId, { 'font-size': size });
				} catch {}
				if (t >= 1) {
					cancel();
					resolve();
					return false;
				}
				return true;
			});
		});
	}

	setNodeColor(nodeId: string | number, color: string) {
		try {
			const node = this.cy.getElementById(String(nodeId));
			if (node && node.isNode()) {
				node.style({ 'background-color': color });
			}
		} catch {}
	}

	resetNodeColor(nodeId: string | number) {
		try {
			const node = this.cy.getElementById(String(nodeId));
			if (node && node.isNode()) {
				node.style({ 'background-color': this.nodeOptions.color || '#555' });
			}
		} catch {}
	}

	setEdgeStyle(fromId: string | number, toId: string | number, color: string, width: number = 3) {
		try {
			const edge = this.cy
				.edges()
				.filter(e => e.source().id() === String(fromId) && e.target().id() === String(toId))
				.first();
			if (edge && edge.nonempty()) {
				edge.style({ 'line-color': color, 'target-arrow-color': color, width });
			}
		} catch {}
	}

	resetEdgeStyle(fromId: string | number, toId: string | number) {
		try {
			const edge = this.cy
				.edges()
				.filter(e => e.source().id() === String(fromId) && e.target().id() === String(toId))
				.first();
			if (edge && edge.nonempty()) {
				edge.style({ 'line-color': '#333', 'target-arrow-color': '#333', width: 2 });
			}
		} catch {}
	}

	resetFormatting() {
		for (const node of this.cy.nodes()) {
			try {
				if (node.id().toString().startsWith('dummy-')) continue;
				node.style({
					'background-color': this.nodeOptions.color || '#555',
					'font-size': this.nodeOptions.font?.size ?? 14,
				});
			} catch {}
		}
	}

	async animateFit(durationMs: number = 1000) {
		try {
			if (!this.hasFitOnce) {
				this.cy.fit();
				this.hasFitOnce = true;
			}
		} catch {}
	}

	getPositions(): { [nodeId: string]: Position } {
		const positions: { [nodeId: string]: Position } = {};
		for (const node of this.cy.nodes()) {
			const pos = node.position();
			positions[node.id()] = { x: pos.x, y: pos.y };
		}
		return positions;
	}

	async animateRelayout(fromPositions: { [nodeId: string]: Position }, newPositions: { [nodeId: string]: Position }) {
		// snap all nodes to fromPositions
		for (const [nodeId, fromPos] of Object.entries(fromPositions)) {
			try {
				if (!newPositions[nodeId]) continue; // node is gone
				await this.snapNodeTo(nodeId, fromPos.x, fromPos.y);
			} catch {}
		}

		// animate to newPositions
		const anims: Promise<void>[] = [];
		for (const [nodeId, newPos] of Object.entries(newPositions)) {
			const fromPos = fromPositions[nodeId];
			if (fromPos) {
				anims.push(this.animateNodeMovement(nodeId, fromPos, newPos));
			} else {
				// new node, just snap
				await this.snapNodeTo(nodeId, newPos.x, newPos.y);
			}
		}
		await Promise.all(anims);
	}

	ensure(tree: any) {
		// to be overridden in subclasses
		return;
	}

	async ensureAndAnimate(tree: any) {
		const oldPositions = this.getPositions();
		this.ensure(tree);
		const newPositions = this.getPositions();
		return this.animateRelayout(oldPositions, newPositions);
	}
}
