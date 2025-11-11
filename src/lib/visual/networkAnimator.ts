import { addAnimation } from '$lib/animation/animator';
import type { DataSet } from 'vis-data';
import type { Edge, Network, NodeOptions, Position } from 'vis-network';
import { clamp } from './utils/positioning';

type Node = any;

export interface NetworkAnimatorOpts {
	network: Network;
	nodes: DataSet<Node>;
	edges: DataSet<Edge>;
	nodeOptions: NodeOptions;
	infoNodeOptions?: NodeOptions;
}

// Re-export the BST-specific animator under the historical name so other
// modules that import `NetworkAnimator` from this module keep working.
export { BSTreeAnimator as NetworkAnimator } from './bstAnimator';

/**
 * BaseNetworkAnimator: provides low-level, structure-agnostic operations
 * on the vis Network and DataSets. Methods are public where callers may
 * use them, and protected where intended for subclass use only.
 */
export class BaseNetworkAnimator {
	network: Network;
	nodes: DataSet<Node>;
	edges: DataSet<Edge>;
	nodeOptions: NodeOptions;
	movementDurationMs: number = 500;

	constructor(opts: NetworkAnimatorOpts) {
		this.network = opts.network;
		this.nodes = opts.nodes;
		this.edges = opts.edges;
		this.nodeOptions = opts.nodeOptions;
	}

	// --- low-level dataset/network ops ---
	protected addNodeRaw(node: Node) {
		try {
			this.nodes.add(node);
		} catch {}
	}

	protected updateNodeRaw(node: Node) {
		try {
			this.nodes.update(node);
		} catch {}
	}

	protected removeNodeRaw(id: string | number) {
		try {
			this.nodes.remove(id);
		} catch {}
	}

	protected addEdgeRaw(edge: Edge) {
		try {
			this.edges.add(edge);
		} catch {}
	}

	protected removeEdgeRaw(id: string | number) {
		try {
			this.edges.remove(id);
		} catch {}
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

	getParent(nodeId: string | number): Node | null {
		console.log('getParent of', nodeId);
		console.log('nodes:', this.nodes.get());
		try {
			const connectedEdges = this.network.getConnectedEdges(nodeId);
			for (const edgeId of connectedEdges) {
				const edge = this.edges.get(edgeId);
				if (edge && edge.to! === nodeId) {
					return this.nodes.get(edge.from!);
				}
			}
		} catch {}
		return null;
	}

	getDirectionFromParent(nodeId: string | number): 'left' | 'right' | null {
		const parent = this.getParent(nodeId);
		if (!parent) return null;
		console.log('getDirectionFromParent', nodeId, 'parent', parent.id);

		for (const edgeId of this.network.getConnectedEdges(parent.id)) {
			const edge = this.edges.get(edgeId);
			if (edge && edge.to! === nodeId) {
				console.log('found edge', edge.id);
				if (edge.id!.toString().endsWith('-left')) return 'left';
				if (edge.id!.toString().endsWith('-right')) return 'right';
			}
		}
		return null;
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

	// Expose a public snap helper for callers that want an immediate move.
	public async snapNodeTo(nodeId: string | number, x: number, y: number) {
		return this.moveNode(nodeId, x, y);
	}

	animateNodeMovement(nodeId: string | number, from: Position, to: Position, durationMs?: number): Promise<void> {
		const dur = durationMs ?? this.movementDurationMs;
		return new Promise(resolve => {
			const cancel = addAnimation((dt, elapsed) => {
				const t = Math.min(1, elapsed / dur);
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

	animateNodeGrowth(nodeId: string | number, durationMs: number = 300): Promise<void> {
		const finalSize = this.getNodeFontSize(nodeId);
		return this.changeNodeSize(nodeId, 0, finalSize, durationMs);
	}

	animateNodeShrink(nodeId: string | number, durationMs: number = 300): Promise<void> {
		const startSize = this.getNodeFontSize(nodeId);
		return this.changeNodeSize(nodeId, startSize, 0, durationMs);
	}

	/**
	 * Generic helper to animate a node font-size from startSize to endSize
	 */
	protected changeNodeSize(nodeId: string | number, startSize: number, endSize: number, durationMs: number = 300): Promise<void> {
		return new Promise(resolve => {
			const cancel = addAnimation((dt, elapsed) => {
				const t = Math.min(1, elapsed / durationMs);
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

	animateNodeOpacityChange(nodeId: string | number, fromOpacity: number, toOpacity: number, durationMs: number = 300): Promise<void> {
		const fontSize = this.getNodeFontSize(nodeId);
		return new Promise(resolve => {
			const cancel = addAnimation((dt, elapsed) => {
				const t = Math.min(1, elapsed / durationMs);
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

	async animateFit(durationMs: number = 1000) {
		try {
			this.network.fit({ animation: { duration: durationMs, easingFunction: 'easeInOutQuad' } });
		} catch {
			try {
				this.network.fit();
			} catch {}
		}
	}
}
