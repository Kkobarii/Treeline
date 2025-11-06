import { addAnimation } from '$lib/animation/animator';
import type { DataSet } from 'vis-data';
import type { Network, Position } from 'vis-network';

type Node = any;

export interface NetworkAnimatorOpts {
	network: Network;
	nodes: DataSet<Node>;
	edges: DataSet<any>;
	infoNodeId: string | number;
	infoNodeAboveOffset?: number;
	movementDurationMs?: number;
	infoNodeSize?: number;
}

export class NetworkAnimator {
	network: Network;
	nodes: DataSet<Node>;
	edges: DataSet<any>;
	infoNodeId: string | number;
	infoNodeAboveOffset: number;
	movementDurationMs: number;
	infoNodeSize: number;

	constructor(opts: NetworkAnimatorOpts) {
		this.network = opts.network;
		this.nodes = opts.nodes;
		this.edges = opts.edges;
		this.infoNodeId = opts.infoNodeId;
		this.infoNodeAboveOffset = opts.infoNodeAboveOffset ?? 50;
		this.movementDurationMs = opts.movementDurationMs ?? 500;
		this.infoNodeSize = opts.infoNodeSize ?? 15;
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

	snapNodeTo(nodeId: string | number, x: number, y: number) {
		try {
			(this.network as any).moveNode(nodeId, x, y);
		} catch {
			try {
				this.nodes.update({ id: nodeId, x, y } as any);
			} catch {}
		}
	}

	snapNodeAbove(infoNodeId: string | number, nodeId: string | number, offset?: number) {
		const pos = this.getPosition(nodeId);
		this.snapNodeTo(infoNodeId, pos.x, pos.y - (offset ?? this.infoNodeAboveOffset));
	}

	private getNodeFontSize(nodeId: string | number): number {
		try {
			const n: any = this.nodes.get(nodeId as any);
			if (!n) return this.infoNodeSize;
			const font = n.font;
			if (!font) return this.infoNodeSize;
			if (typeof font === 'string') {
				const m = font.match(/(\d+(?:\.\d+)?)/);
				if (m) return parseFloat(m[1]);
				return this.infoNodeSize;
			}
			return font.size ?? this.infoNodeSize;
		} catch {
			return this.infoNodeSize;
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
		const startSize = this.getNodeFontSize(nodeId);
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

	async animateLegsGrowth(nodeId: string | number, durationMs?: number) {
		const left = `dummy-${Number(nodeId)}-L`;
		const right = `dummy-${Number(nodeId)}-R`;
		const initial = this.getPosition(nodeId);
		const leftFinal = this.getPosition(left);
		const rightFinal = this.getPosition(right);
		this.snapNodeTo(left, initial.x - this.infoNodeAboveOffset, initial.y);
		this.snapNodeTo(right, initial.x + this.infoNodeAboveOffset, initial.y);
		await Promise.all([
			this.animateNodeMovement(left, { x: initial.x - this.infoNodeAboveOffset, y: initial.y }, leftFinal, durationMs),
			this.animateNodeMovement(right, { x: initial.x + this.infoNodeAboveOffset, y: initial.y }, rightFinal, durationMs),
		]);
	}

	async animateLegsShrink(nodeId: string | number, durationMs?: number) {
		const left = `dummy-${Number(nodeId)}-L`;
		const right = `dummy-${Number(nodeId)}-R`;
		const final = this.getPosition(nodeId);
		const promises: Promise<void>[] = [];
		try {
			if (this.nodes.get(left)) promises.push(this.animateNodeMovement(left, this.getPosition(left), final, durationMs));
		} catch {}
		try {
			if (this.nodes.get(right)) promises.push(this.animateNodeMovement(right, this.getPosition(right), final, durationMs));
		} catch {}
		await Promise.all(promises);
	}

	async changeInfoNodeAnnotation(annotation: string) {
		try {
			this.nodes.update({
				id: this.infoNodeId,
				label: annotation,
				hidden: false,
				color: '#aaaaaa',
				font: { color: 'black', size: this.infoNodeSize },
			} as any);
		} catch {}
	}

	async animateAnnotateNode(annotation: string, nodeId?: string | number) {
		try {
			await this.changeInfoNodeAnnotation(annotation);
			if (nodeId === undefined) this.snapNodeTo(this.infoNodeId, 0, 0);
			else this.snapNodeAbove(this.infoNodeId, nodeId, this.infoNodeAboveOffset);
		} catch {}
	}
}
