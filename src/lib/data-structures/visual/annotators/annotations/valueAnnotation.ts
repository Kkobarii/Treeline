import { addAnimation, getGlobalAnimationDuration } from '$lib/utils/animator';
import { Colors } from '$lib/utils/colors';

import { BaseAnnotation } from './annotation';
import type { DataStructureAnnotator } from './dataStructureAnnotator';

export class ValueAnnotation extends BaseAnnotation {
	aboveOffset: number = 40;
	color: string = Colors.ValueNode;
	hidden: boolean = false;

	public followingNodeId: string | number | null = null;

	private animPos: { x: number; y: number } = { x: 0, y: 0 };

	constructor(
		public annotator: DataStructureAnnotator,
		public text: string,
		public startFollowingNodeId: string | number | null = null,
	) {
		super(annotator);
		this.fontSize = 16;
		this.followingNodeId = startFollowingNodeId;

		if (this.followingNodeId === null) {
			this.followingNodeId = annotator.findRootNodeId();
		}

		if (this.followingNodeId !== null) {
			try {
				const p = this.annotator.network.getPosition(this.followingNodeId as any);
				this.animPos = { x: p.x, y: p.y - this.aboveOffset };
			} catch {
				this.animPos = { x: 0, y: 0 };
			}
		}
	}

	getPosition(): { x: number; y: number } {
		if (this.followingNodeId !== null) {
			try {
				const nodePos = this.annotator.network.getPosition(this.followingNodeId as any);
				return { x: nodePos.x, y: nodePos.y - this.aboveOffset };
			} catch {
				// fallthrough to animPos
			}
		}
		return this.animPos;
	}

	draw() {
		if (!this.hidden) {
			const pos = this.getPosition();
			this.renderBoxedText(pos, this.text, this.fontSize, this.padding, this.color, 'center', 'middle');
		}
	}

	clear() {
		const pos = this.getPosition();
		const { width: textWidth, height: textHeight } = this.measure(this.text, this.fontSize);
		const box = this.computeBox(pos, textWidth, textHeight, this.padding, 'center', 'middle');
		const scale = this.annotator.getScale();
		const domTopLeft = this.annotator.network.canvasToDOM({ x: box.x, y: box.y });
		this.annotator.clearRectangle(domTopLeft.x, domTopLeft.y, box.width * scale, box.height * scale);
	}

	async moveToNode(nodeId: string | number): Promise<void> {
		const start = this.getPosition();
		let targetPos = { x: 0, y: 0 };
		try {
			const p = this.annotator.network.getPosition(nodeId as any);
			targetPos = { x: p.x, y: p.y - this.aboveOffset };
		} catch {
			targetPos = start;
		}

		const previousFollowing = this.followingNodeId;
		this.followingNodeId = null;

		try {
			await new Promise<void>(resolve => {
				const cancel = addAnimation((dt, elapsed) => {
					const tNorm = Math.min(1, Math.max(0, elapsed / getGlobalAnimationDuration()));
					const ease = tNorm < 0.5 ? 2 * tNorm * tNorm : -1 + (4 - 2 * tNorm) * tNorm;
					this.animPos = {
						x: start.x + (targetPos.x - start.x) * ease,
						y: start.y + (targetPos.y - start.y) * ease,
					};

					this.annotator.redrawCanvas();

					if (tNorm >= 1) {
						this.animPos = targetPos;
						this.followingNodeId = nodeId;
						this.annotator.redrawCanvas();
						cancel();
						resolve();
						return false;
					}

					return true;
				});
			});
		} finally {
			if (this.followingNodeId === null) this.followingNodeId = previousFollowing;
		}
		return;
	}
}

export default ValueAnnotation;
