import { LinkedListNodeData } from '$lib/data-structures/utils/graphs';
import BaseAnnotation from '$lib/data-structures/visual/annotators/annotations/annotation';
import { DataStructureAnnotator } from '$lib/data-structures/visual/annotators/dataStructureAnnotator';
import { Colors } from '$lib/utils/colors';

class FrontRearAnnotation extends BaseAnnotation {
	color: string = Colors.Info;
	arrowLength: number = 10;
	arrowHeadSize: number = 8;
	marginSide: number = 10;

	constructor(
		public annotator: DataStructureAnnotator,
		public label: 'front' | 'rear',
		public followingNodeId: string | number,
	) {
		super(annotator);
		this.fontSize = 12;
		this.padding = 3;
	}

	getPosition(): { x: number; y: number } {
		try {
			let nodePos = this.annotator.network.getBoundingBox(this.followingNodeId as any);
			const { width: textWidth } = this.measure(this.label, this.fontSize);
			const nodeCenterY = (nodePos.top + nodePos.bottom) / 2;
			if (this.label === 'front') {
				return {
					x: nodePos.left - this.marginSide - this.arrowLength - textWidth / 2,
					y: nodeCenterY,
				};
			} else {
				return {
					x: nodePos.right + this.marginSide + this.arrowLength + textWidth / 2,
					y: nodeCenterY,
				};
			}
		} catch {
			// node might not exist
		}
		return { x: 0, y: 0 };
	}

	draw() {
		const pos = this.getPosition();

		this.renderBoxedText(pos, this.label, this.fontSize, this.padding, this.color, 'center', 'middle');

		this.drawArrow(pos);
	}

	drawArrow(pos: { x: number; y: number }) {
		if (!this.shown) return;

		const scale = this.annotator.getScale();
		const ctx = this.annotator.ctx;

		const { width: textWidth } = this.measure(this.label, this.fontSize);
		let arrowStartX: number;
		let arrowEndX: number;

		if (this.label === 'front') {
			arrowStartX = pos.x + textWidth / 2 + this.padding + 2;
			arrowEndX = arrowStartX + this.arrowLength;
		} else {
			arrowStartX = pos.x - textWidth / 2 - this.padding - 2;
			arrowEndX = arrowStartX - this.arrowLength;
		}

		const domStart = this.annotator.network.canvasToDOM({ x: arrowStartX, y: pos.y });
		const domEnd = this.annotator.network.canvasToDOM({ x: arrowEndX, y: pos.y });

		ctx.beginPath();
		ctx.strokeStyle = this.color;
		ctx.lineWidth = 2 * scale;
		ctx.moveTo(domStart.x, domStart.y);
		ctx.lineTo(domEnd.x, domEnd.y);
		ctx.stroke();

		const arrowHeadSize = this.arrowHeadSize * scale;
		ctx.beginPath();
		ctx.fillStyle = this.color;
		if (this.label === 'front') {
			ctx.moveTo(domEnd.x - arrowHeadSize / 2 + 2 * scale, domEnd.y - arrowHeadSize / 2);
			ctx.lineTo(domEnd.x + arrowHeadSize - 2 * scale, domEnd.y);
			ctx.lineTo(domEnd.x - arrowHeadSize / 2 + 2 * scale, domEnd.y + arrowHeadSize / 2);
		} else {
			ctx.moveTo(domEnd.x + arrowHeadSize / 2 - 2 * scale, domEnd.y - arrowHeadSize / 2);
			ctx.lineTo(domEnd.x - arrowHeadSize + 2 * scale, domEnd.y);
			ctx.lineTo(domEnd.x + arrowHeadSize / 2 - 2 * scale, domEnd.y + arrowHeadSize / 2);
		}
		ctx.closePath();
		ctx.fill();
	}
}

export class QueueAnnotator extends DataStructureAnnotator {
	// findRootNodeId(): string | number | null {
	// 	// returns the rear id
	// 	const { rearId } = this.getFrontRear();
	// 	return rearId;
	// }

	getFrontRear(): { frontId: string | number | null; rearId: string | number | null } {
		let frontId: string | number | null = null;
		let rearId: string | number | null = null;

		for (const node of this.nodes.get()) {
			if (node && node.title) {
				const queueData = LinkedListNodeData.fromNode(node);
				if (queueData.isHead) {
					frontId = node.id;
				}
				if (queueData.isTail) {
					rearId = node.id;
				}
			}
		}
		return { frontId, rearId };
	}

	redrawCanvas() {
		super.redrawCanvas();

		const { frontId, rearId } = this.getFrontRear();

		// Draw front annotation
		if (frontId !== null) {
			const frontAnnotation = new FrontRearAnnotation(this, 'front', frontId);
			frontAnnotation.draw();
		}

		// Draw rear annotation
		if (rearId !== null) {
			const rearAnnotation = new FrontRearAnnotation(this, 'rear', rearId);
			rearAnnotation.draw();
		}
	}
}
