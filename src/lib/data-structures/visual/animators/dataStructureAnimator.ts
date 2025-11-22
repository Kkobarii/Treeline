import type { DataSet } from 'vis-data';
import type { Edge, Network, Node, NodeOptions, Position } from 'vis-network';

import { addAnimation } from '$lib/utils/animator';
import { clamp } from '../../utils/utils';


export interface DataStructureAnimatorOpts {
	network: Network;
	nodes: DataSet<Node>;
	edges: DataSet<Edge>;
	nodeOptions: NodeOptions;
	infoNodeOptions?: NodeOptions;
}

const DEFAULT_ANIMATION_DURATION_MS = 500;

export class DataStructureAnimator {
	network: Network;
	nodes: DataSet<Node>;
	edges: DataSet<Edge>;
	nodeOptions: NodeOptions;
	animationDurationMs: number = DEFAULT_ANIMATION_DURATION_MS;

	constructor(opts: DataStructureAnimatorOpts) {
		this.network = opts.network;
		this.nodes = opts.nodes;
		this.edges = opts.edges;
		this.nodeOptions = opts.nodeOptions;
	}

	public setAnimationDuration(durationMs: number) {
		this.animationDurationMs = durationMs;
	}

	public resetAnimationDuration() {
		this.animationDurationMs = DEFAULT_ANIMATION_DURATION_MS;
	}

	// --- low-level dataset/network ops ---
	protected async addNodeRaw(node: Node) {
		console.debug('addNodeRaw', node);
		try {
			this.nodes.add(node);
		} catch {}
	}

	protected updateNodeRaw(node: Node) {
		console.debug('updateNodeRaw', node);
		try {
			this.nodes.update(node);
		} catch {}
	}

	protected removeNodeRaw(id: string | number) {
		console.debug('removeNodeRaw', id);
		try {
			this.nodes.remove(id);
		} catch {}
	}

	protected addEdgeRaw(edge: Edge) {
		console.debug('addEdgeRaw', edge);
		try {
			this.edges.add(edge);
		} catch {}
	}

	protected removeEdgeRaw(id: string | number) {
		console.debug('removeEdgeRaw', id);
		try {
			this.edges.remove(id);
		} catch {}
	}

	protected updateEdgeRaw(edge: Edge) {
		console.debug('updateEdgeRaw', edge);
		try {
			this.edges.update(edge);
		} catch {}
	}

	nodeExists(nodeId: string | number): boolean {
		try {
			return this.nodes.get(nodeId as any) !== null;
		} catch {
			return false;
		}
	}

	// --- positioning and movement ---
	getPosition(nodeId: string | number): Position {
		try {
			return this.network.getPosition(nodeId);
		} catch {
			const node = this.nodes.get(nodeId as any) as any;
			return { x: node?.x ?? 0, y: node?.y ?? 0 };
		}
	}

	areNodesConnected(nodeId1: string | number, nodeId2: string | number): boolean {
		try {
			const connected = this.network.getConnectedNodes(nodeId1);
			return connected.includes(nodeId2 as any);
		} catch {
			return false;
		}
	}

	protected async moveNode(nodeId: string | number, x: number, y: number) {
		try {
			await (this.network as any).moveNode(nodeId, x, y);
		} catch {
			try {
				this.nodes.update({ id: nodeId, x, y } as any);
			} catch {}
		}
	}

	public async snapNodeTo(nodeId: string | number, x: number, y: number) {
		return this.moveNode(nodeId, x, y);
	}

	animateNodeMovement(nodeId: string | number, from: Position, to: Position): Promise<void> {
		return new Promise(resolve => {
			const cancel = addAnimation((dt, elapsed) => {
				const t = Math.min(1, elapsed / this.animationDurationMs);
				const x = from.x + (to.x - from.x) * t;
				const y = from.y + (to.y - from.y) * t;
				try {
					(this.network as any).moveNode(nodeId, x, y);
				} catch {
					try {
						this.nodes.update({ id: nodeId, x, y } as any);
					} catch {}
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
	protected getNodeFontSize(nodeId: string | number): number {
		let defaultFontSize = (this.nodeOptions as any).font?.size ?? 14;
		try {
			const n: any = this.nodes.get(nodeId as any);
			if (!n) return defaultFontSize;
			const font = n.font;
			if (!font) return defaultFontSize;
			if (typeof font === 'string') {
				const m = font.match(/(\d+(?:\.\d+)?)/);
				if (m) return parseFloat(m[1]);
				return defaultFontSize;
			}
			return font.size ?? defaultFontSize;
		} catch {
			return defaultFontSize;
		}
	}

	animateNodeGrowth(nodeId: string | number): Promise<void> {
		const finalSize = this.getNodeFontSize(nodeId);
		return this.changeNodeSize(nodeId, 0, finalSize);
	}

	animateNodeShrink(nodeId: string | number): Promise<void> {
		const startSize = this.getNodeFontSize(nodeId);
		return this.changeNodeSize(nodeId, startSize, 0);
	}

	protected changeNodeSize(nodeId: string | number, startSize: number, endSize: number): Promise<void> {
		return new Promise(resolve => {
			const cancel = addAnimation((dt, elapsed) => {
				const t = Math.min(1, elapsed / (this.animationDurationMs / 5));
				const size = Math.max(0, startSize + (endSize - startSize) * t);
				try {
					this.nodes.update({ id: nodeId, font: { size } } as any);
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

	animateNodeOpacityChange(nodeId: string | number, fromOpacity: number, toOpacity: number): Promise<void> {
		const fontSize = this.getNodeFontSize(nodeId);
		return new Promise(resolve => {
			const cancel = addAnimation((dt, elapsed) => {
				const t = Math.min(1, elapsed / this.animationDurationMs);
				const opacity = clamp(fromOpacity + (toOpacity - fromOpacity) * t, 0, 1);
				try {
					this.nodes.update({ id: nodeId, opacity: opacity, font: { size: fontSize * opacity } } as any);
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
			this.nodes.update({ id: nodeId, color } as any);
		} catch {}
	}

	resetNodeColor(nodeId: string | number) {
		try {
			this.nodes.update({ id: nodeId, color: (this.nodeOptions as any).color } as any);
		} catch {}
	}

	resetFormatting() {
		for (const node of this.nodes.get()) {
			try {
				if (node.id.toString().startsWith('dummy-') || node.id.toString().startsWith('height-') || node.id.toString().startsWith('info-')) continue;
				this.updateNodeRaw({ id: node.id, color: this.nodeOptions?.color, font: this.nodeOptions?.font } as any);
			} catch {}
		}
	}

	async animateFit(durationMs: number = 1000) {
		try {
			this.network.fit();
			// this.network.fit({ animation: { duration: durationMs, easingFunction: 'easeInOutQuad' } });
		} catch {
		}
	}

	async hideNode(nodeId: string | number) {
		try {
			this.updateNodeRaw({ id: nodeId, hidden: true } as any);
		} catch {}
	}

	async showNode(nodeId: string | number) {
		try {
			this.updateNodeRaw({ id: nodeId, hidden: false } as any);
		} catch {}
	}

	getNodePositions(): Map<string | number, Position> {
		const result = new Map<string | number, Position>();
		for (const node of this.nodes.get()) {
			try {
				const p = this.network.getPosition(node.id);
				result.set(node.id as string | number, p);
			} catch {
				if (typeof node.x === 'number' && typeof node.y === 'number') {
					result.set(node.id as string | number, { x: node.x, y: node.y });
				}
			}
		}
		return result;
	}

	async animateRelayout(fromPositions: Map<string | number, Position>, newPositions: Map<string | number, Position>) {
		const anims: Promise<void>[] = [];
		for (const [nodeId, newPos] of newPositions) {
			if (nodeId.toString().startsWith('info-')) continue;
			const fromPos = fromPositions.get(nodeId);
			if (fromPos) {
				anims.push(this.animateNodeMovement(nodeId, fromPos, newPos));
			} else {
				// new node, just snap
				await this.snapNodeTo(nodeId, newPos.x, newPos.y);
			}
		}
		await Promise.all(anims);
	}
}
