import { LinkedListNodeData } from '$lib/data-structures/utils/graphs';
import BaseAnnotation from '$lib/data-structures/visual/annotators/annotations/annotation';
import { DataStructureAnnotator } from '$lib/data-structures/visual/annotators/dataStructureAnnotator';
import { Colors } from '$lib/utils/colors';

class HeadTailAnnotation extends BaseAnnotation {
	color: string = Colors.Info;
	arrowLength: number = 10;
	arrowHeadSize: number = 8;
	marginSide: number = 10;

	constructor(
		public annotator: DataStructureAnnotator,
		public label: 'head' | 'tail',
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
			if (this.label === 'head') {
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

		if (this.label === 'head') {
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
		if (this.label === 'head') {
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

export class LinkedListAnnotator extends DataStructureAnnotator {
	getHeadTail(): { headId: string | number | null; tailId: string | number | null } {
		let headId: string | number | null = null;
		let tailId: string | number | null = null;

		for (const node of this.nodes.get()) {
			if (node && node.title) {
				const llData = LinkedListNodeData.fromNode(node);
				if (llData.isHead) {
					headId = node.id;
				}
				if (llData.isTail) {
					tailId = node.id;
				}
			}
		}
		return { headId, tailId };
	}

	redrawCanvas() {
		super.redrawCanvas();

		const { headId, tailId } = this.getHeadTail();

		// Draw head annotation
		if (headId !== null) {
			const headAnnotation = new HeadTailAnnotation(this, 'head', headId);
			headAnnotation.draw();
		}

		// Draw tail annotation
		if (tailId !== null) {
			const tailAnnotation = new HeadTailAnnotation(this, 'tail', tailId);
			tailAnnotation.draw();
		}
	}
}
