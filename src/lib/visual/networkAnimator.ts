import { addAnimation } from '$lib/animation/animator';
import type { DataSet } from 'vis-data';
import type { Font, Network, NodeOptions, Position } from 'vis-network';
import { clamp } from './utils/positioning';

type Node = any;

export interface NetworkAnimatorOpts {
	network: Network;
	nodes: DataSet<Node>;
	edges: DataSet<any>;
	nodeOptions: NodeOptions;
	infoNodeOptions: NodeOptions;
}

export class NetworkAnimator {
	network: Network;
	nodes: DataSet<Node>;
	edges: DataSet<any>;
	nodeOptions: NodeOptions;
	infoNodeOptions: NodeOptions;
	movementDurationMs: number = 500;
	infoNodeId: string = 'info-node';
	infoNodeAboveOffset: number = 50;

	constructor(opts: NetworkAnimatorOpts) {
		this.network = opts.network;
		this.nodes = opts.nodes;
		this.edges = opts.edges;
		this.nodeOptions = opts.nodeOptions;
		this.infoNodeOptions = opts.infoNodeOptions;
	}

	createInfoNode() {
		try {
			this.nodes.add({
				id: this.infoNodeId,
				label: 'Info',
				x: 0,
				y: 0,
				font: this.infoNodeOptions.font,
				color: this.infoNodeOptions.color,
				hidden: true,
			});
		} catch {}
	}

	getPosition(nodeId: string | number): Position {
		try {
			return this.network.getPosition(nodeId);
		} catch {
			const node = this.nodes.get(nodeId as any) as any;
			return { x: node?.x ?? 0, y: node?.y ?? 0 };
		}
	}

	getPositionAbove(nodeId: string | number, offset?: number): Position {
		const pos = this.getPosition(nodeId);
		return { x: pos.x, y: pos.y - (offset ?? this.infoNodeAboveOffset) };
	}

	async snapNodeTo(nodeId: string | number, x: number, y: number) {
		try {
			await (this.network as any).moveNode(nodeId, x, y);
		} catch {
			try {
				this.nodes.update({ id: nodeId, x, y } as any);
			} catch {}
		}
	}

	async snapNodeAbove(infoNodeId: string | number, nodeId: string | number, offset?: number) {
		const pos = this.getPosition(nodeId);
		this.snapNodeTo(infoNodeId, pos.x, pos.y - (offset ?? this.infoNodeAboveOffset));
	}

	private getNodeFontSize(nodeId: string | number): number {
		let fontSize = (this.infoNodeOptions.font as Font).size!;
		try {
			const n: any = this.nodes.get(nodeId as any);
			if (!n) return fontSize;
			const font = n.font;
			if (!font) return fontSize;
			if (typeof font === 'string') {
				const m = font.match(/(\d+(?:\.\d+)?)/);
				if (m) return parseFloat(m[1]);
				return fontSize;
			}
			return font.size ?? fontSize;
		} catch {
			return fontSize;
		}
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

	animateNodeGrowth(nodeId: string | number, finalSize: number = 30, durationMs: number = 300): Promise<void> {
		const startSize = 0;

		if (nodeId === this.infoNodeId) {
			finalSize = (this.infoNodeOptions.font as Font).size!;
		}

		return new Promise(resolve => {
			const cancel = addAnimation((dt, elapsed) => {
				const t = Math.min(1, elapsed / durationMs);
				const size = Math.max(0, startSize + (finalSize - startSize) * t);
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

	animateNodeShrink(nodeId: string | number, durationMs: number = 300): Promise<void> {
		const startSize = this.getNodeFontSize(nodeId);
		return new Promise(resolve => {
			const cancel = addAnimation((dt, elapsed) => {
				const t = Math.min(1, elapsed / durationMs);
				const size = Math.max(0, startSize * (1 - t));
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
			this.nodes.update({ id: nodeId, color: this.nodeOptions.color } as any);
		} catch {}
	}

	async animateLegsGrowth(nodeId: string | number, durationMs?: number) {
		const initial = this.getPosition(nodeId);
		let promises: Promise<void>[] = [];

		const left = `dummy-${Number(nodeId)}-L`;
		if (this.nodes.get(left)) {
			const leftFinal = this.getPosition(left);
			this.snapNodeTo(left, initial.x, initial.y);
			promises.push(this.animateNodeMovement(left, initial, leftFinal, durationMs));
		}

		const right = `dummy-${Number(nodeId)}-R`;
		if (this.nodes.get(right)) {
			const rightFinal = this.getPosition(right);
			this.snapNodeTo(right, initial.x, initial.y);
			promises.push(this.animateNodeMovement(right, initial, rightFinal, durationMs));
		}

		await Promise.all(promises);
	}

	async animateLegsShrink(nodeId: string | number, durationMs?: number) {
		const final = this.getPosition(nodeId);
		const promises: Promise<void>[] = [];

		const left = `dummy-${Number(nodeId)}-L`;
		if (this.nodes.get(left)) promises.push(this.animateNodeMovement(left, this.getPosition(left), final, durationMs));

		const right = `dummy-${Number(nodeId)}-R`;
		if (this.nodes.get(right)) promises.push(this.animateNodeMovement(right, this.getPosition(right), final, durationMs));

		await Promise.all(promises);
	}

	async changeInfoNodeAnnotation(annotation: string) {
		try {
			this.nodes.update({
				id: this.infoNodeId,
				label: annotation,
				hidden: false,
				color: this.infoNodeOptions.color,
				font: this.infoNodeOptions.font,
			} as any);
		} catch {}
	}

	async hideInfoNode() {
		try {
			this.nodes.update({
				id: this.infoNodeId,
				hidden: true,
			} as any);
		} catch {}
	}

	findRootNode(): Node | null {
		let root: Node | null = null;
		for (const node of this.nodes.get()) {
			if (node.parent === undefined && node.id !== this.infoNodeId) {
				root = node;
				break;
			}
		}
		return root;
	}

	async animateAnnotateNode(annotation: string, nodeId: string | number | null) {
		try {
			await this.changeInfoNodeAnnotation(annotation);
			if (nodeId === null) {
				// find root node
				const root = this.findRootNode();
				if (root) await this.snapNodeAbove(this.infoNodeId, root.id, this.infoNodeAboveOffset);
				else await this.snapNodeTo(this.infoNodeId, 0, 0);
			} else {
				await this.snapNodeAbove(this.infoNodeId, nodeId, this.infoNodeAboveOffset);
			}
		} catch {}
	}

	/**
	 * Smoothly fit the network to the current nodes using network.moveTo animation.
	 * Computes a bounding box for visible nodes (skips info/dummy nodes) and
	 * calculates an approximate scale to fit them into the container with padding.
	 */
	async animateFit(durationMs: number = 1000, paddingPx: number = 40): Promise<void> {
		// this.network.fit({ animation: { duration: durationMs, easingFunction: 'easeInOutQuad' } });
		if (this.network) this.network.fit();
	}
}
