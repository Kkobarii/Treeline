import { Colors } from '$lib/assets/colors';
import { addAnimation, getGlobalAnimationDuration } from '$lib/utils/animator';

import { BaseAnnotation } from './baseAnnotation';
import type { DataStructureAnnotator } from './dataStructureAnnotator';

export class ValueAnnotation extends BaseAnnotation {
	aboveOffset: number = 40;
	color: string = Colors.ValueNode;
	hidden: boolean = false;

	// when followingNodeId is set, position is derived from that node
	public followingNodeId: string | number | null = null;

	// explicit position used during animations when not following a node
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
				const node = this.annotator.cy.getElementById(String(this.followingNodeId));
				if (node && node.isNode()) {
					const pos = node.position();
					this.animPos = { x: pos.x, y: pos.y - this.aboveOffset };
				}
			} catch {
				this.animPos = { x: 0, y: 0 };
			}
		}
	}

	getPosition(): { x: number; y: number } {
		if (this.followingNodeId !== null) {
			try {
				const node = this.annotator.cy.getElementById(String(this.followingNodeId));
				if (node && node.isNode()) {
					const pos = node.position();
					return { x: pos.x, y: pos.y - this.aboveOffset };
				}
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
		this.annotator.clearRectangle(box.x, box.y, box.width * scale, box.height * scale);
	}

	/**
	 * Animate moving the value annotation to be above `nodeId`.
	 * Resolves when animation completes and the annotation is set to follow the target node.
	 */
	async moveToNode(nodeId: string | number): Promise<void> {
		// compute start and target positions in cytoscape units
		const start = this.getPosition();
		let targetPos = { x: 0, y: 0 };
		try {
			const node = this.annotator.cy.getElementById(String(nodeId));
			if (node && node.isNode()) {
				const pos = node.position();
				targetPos = { x: pos.x, y: pos.y - this.aboveOffset };
			}
		} catch {
			// if node not found, just set to start
			targetPos = start;
		}

		// Use global duration when not specified

		// Temporarily stop following any node so getPosition() returns animPos during the animation
		const previousFollowing = this.followingNodeId;
		this.followingNodeId = null;

		try {
			await new Promise<void>(resolve => {
				const cancel = addAnimation((dt, elapsed) => {
					const tNorm = Math.min(1, Math.max(0, elapsed / getGlobalAnimationDuration()));
					// ease in-out (smoothstep-like)
					const ease = tNorm < 0.5 ? 2 * tNorm * tNorm : -1 + (4 - 2 * tNorm) * tNorm;
					this.animPos = {
						x: start.x + (targetPos.x - start.x) * ease,
						y: start.y + (targetPos.y - start.y) * ease,
					};

					// trigger redraw
					this.annotator.redrawCanvas();

					if (tNorm >= 1) {
						// snap to exact target and start following the node
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
			// If animation was interrupted, restore previous following state
			if (this.followingNodeId === null) this.followingNodeId = previousFollowing;
		}
		return;
	}

	hide() {
		this.hidden = true;
		this.clear();
	}

	show() {
		this.hidden = false;
		this.draw();
	}
}

export default ValueAnnotation;
