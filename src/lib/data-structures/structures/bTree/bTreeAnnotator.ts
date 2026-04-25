import BaseAnnotation from '$lib/data-structures/visual/annotators/annotations/annotation';
import { DataStructureAnnotator } from '$lib/data-structures/visual/annotators/dataStructureAnnotator';
import { addAnimation, getGlobalAnimationDuration } from '$lib/utils/animator';
import { Colors } from '$lib/utils/colors';

export class TransplantedValueAnnotation extends BaseAnnotation {
	aboveOffset: number = 10;
	color: string = Colors.Blue;
	hidden: boolean = false;

	public followingNodeIds: (string | number | null)[] = [null];

	private animPos: { x: number; y: number } = { x: 0, y: 0 };

	constructor(
		public annotator: DataStructureAnnotator,
		public text: string,
		public startFollowingNodeIds: (string | number | null)[] = [null],
	) {
		super(annotator);
		this.fontSize = 20;
		this.padding = 6;
		this.followingNodeIds = [...startFollowingNodeIds];

		if (this.followingNodeIds.length === 0) {
			this.followingNodeIds = [annotator.findRootNodeId()];
		}

		this.updatePositionFromNodes();
	}

	private updatePositionFromNodes() {
		const validNodeIds = this.followingNodeIds.filter(id => id !== null);
		if (validNodeIds.length === 0) {
			this.animPos = { x: 0, y: 0 };
			console.warn('TransplantedValueAnnotation: no valid following nodes, using animPos', this.animPos);
			return;
		}

		if (validNodeIds.length === 1) {
			try {
				const p = this.annotator.network.getPosition(validNodeIds[0] as any);
				this.animPos = { x: p.x, y: p.y - this.aboveOffset };
			} catch {
				this.animPos = { x: 0, y: 0 };
			}
		} else {
			try {
				const p1 = this.annotator.network.getPosition(validNodeIds[0] as any);
				const p2 = this.annotator.network.getPosition(validNodeIds[1] as any);
				this.animPos = {
					x: (p1.x + p2.x) / 2,
					y: (p1.y + p2.y) / 2 - this.aboveOffset,
				};
			} catch {
				this.animPos = { x: 0, y: 0 };
			}
		}
	}

	getPosition(): { x: number; y: number } {
		const validNodeIds = this.followingNodeIds.filter(id => id !== null);
		if (validNodeIds.length === 0) {
			return this.animPos;
		}

		if (validNodeIds.length === 1) {
			try {
				const nodePos = this.annotator.network.getPosition(validNodeIds[0] as any);
				return { x: nodePos.x, y: nodePos.y - this.aboveOffset };
			} catch {
				// fallthrough to animPos
			}
		} else {
			try {
				const p1 = this.annotator.network.getPosition(validNodeIds[0] as any);
				const p2 = this.annotator.network.getPosition(validNodeIds[1] as any);
				return {
					x: (p1.x + p2.x) / 2,
					y: (p1.y + p2.y) / 2 - this.aboveOffset,
				};
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

	async moveTo(nodeIds: (string | number | null)[]): Promise<void> {
		const start = this.getPosition();
		const targetPos = this.calculateTargetPosition(nodeIds);

		const previousFollowing = [...this.followingNodeIds];
		this.followingNodeIds = [null];

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
						this.followingNodeIds = nodeIds;
						this.annotator.redrawCanvas();
						cancel();
						resolve();
						return false;
					}

					return true;
				});
			});
		} finally {
			if (this.followingNodeIds[0] === null) this.followingNodeIds = previousFollowing;
		}
		return;
	}

	private calculateTargetPosition(nodeIds: (string | number | null)[]): { x: number; y: number } {
		const validNodeIds = nodeIds.filter(id => id !== null);
		if (validNodeIds.length === 0) {
			return { x: 0, y: 0 };
		}

		if (validNodeIds.length === 1) {
			try {
				const p = this.annotator.network.getPosition(validNodeIds[0] as any);
				return { x: p.x, y: p.y - this.aboveOffset };
			} catch {
				return { x: 0, y: 0 };
			}
		} else {
			try {
				const p1 = this.annotator.network.getPosition(validNodeIds[0] as any);
				const p2 = this.annotator.network.getPosition(validNodeIds[1] as any);
				return {
					x: (p1.x + p2.x) / 2,
					y: (p1.y + p2.y) / 2 - this.aboveOffset,
				};
			} catch {
				return { x: 0, y: 0 };
			}
		}
	}
}

export class BTreeAnnotator extends DataStructureAnnotator {
	currentTransplantedValueAnnotation: TransplantedValueAnnotation | null = null;

	public createTransplantedValueAnnotation(text: string, startFollowingNodeIds: (string | number | null)[] = [null]) {
		if (this.currentTransplantedValueAnnotation) {
			this.currentTransplantedValueAnnotation.clear();
			this.currentTransplantedValueAnnotation = null;
		}
		this.currentTransplantedValueAnnotation = new TransplantedValueAnnotation(this, text, startFollowingNodeIds);
		this.currentTransplantedValueAnnotation.draw();
	}

	public async moveTransplantedValueAnnotationTo(nodeIds: (string | number | null)[]) {
		if (!this.currentTransplantedValueAnnotation) return;
		await this.currentTransplantedValueAnnotation.moveTo(nodeIds);
	}

	public clearTransplantedValueAnnotation() {
		if (!this.currentTransplantedValueAnnotation) return;
		this.currentTransplantedValueAnnotation.clear();
		this.currentTransplantedValueAnnotation = null;
		this.redrawCanvas();
	}

	public redrawCanvas(): void {
		super.redrawCanvas();

		this.currentTransplantedValueAnnotation?.draw();
	}
}
