import { Colors } from '$lib/assets/colors';
import { LinkedListNodeData } from '$lib/data-structures/utils/graphs';
import { BaseAnnotation } from '$lib/data-structures/visual/annotators/baseAnnotation';
import { VIS_NETWORK_TOP_BB_OFFSET } from '$lib/data-structures/visual/annotators/constants';
import { DataStructureAnnotator } from '$lib/data-structures/visual/annotators/dataStructureAnnotator';

class TopAnnotation extends BaseAnnotation {
	color: string = Colors.Info;
	arrowLength: number = 10;
	arrowHeadSize: number = 8;
	marginAboveNode: number = 15;

	constructor(
		public annotator: DataStructureAnnotator,
		public followingNodeId: string | number,
	) {
		super(annotator);
		this.fontSize = 12;
		this.padding = 3;
	}

	getPosition(): { x: number; y: number } {
		try {
			let nodePos = this.annotator.network.getBoundingBox(this.followingNodeId as any);
			// Position above the node
			return {
				x: (nodePos.left + nodePos.right) / 2,
				y: nodePos.top + VIS_NETWORK_TOP_BB_OFFSET - this.arrowLength - this.marginAboveNode,
			};
		} catch {
			// node might not exist
		}
		return { x: 0, y: 0 };
	}

	draw() {
		const pos = this.getPosition();

		// Draw the label text box
		this.renderBoxedText(pos, 'top', this.fontSize, this.padding, this.color, 'center', 'middle');

		// Draw arrow pointing down to the node
		this.drawArrow(pos);
	}

	drawArrow(pos: { x: number; y: number }) {
		if (!this.shown) return;

		const scale = this.annotator.getScale();
		const ctx = this.annotator.ctx;

		// Calculate arrow start and end positions
		const { height: textHeight } = this.measure('top', this.fontSize);
		const arrowStartY = pos.y + textHeight / 2 + this.padding + 2;
		const arrowEndY = arrowStartY + this.arrowLength;

		// Convert to DOM coordinates
		const domStart = this.annotator.network.canvasToDOM({ x: pos.x, y: arrowStartY });
		const domEnd = this.annotator.network.canvasToDOM({ x: pos.x, y: arrowEndY });

		// Draw the arrow line
		ctx.beginPath();
		ctx.strokeStyle = this.color;
		ctx.lineWidth = 2 * scale;
		ctx.moveTo(domStart.x, domStart.y);
		ctx.lineTo(domEnd.x, domEnd.y - (this.arrowHeadSize * scale) / 2);
		ctx.stroke();

		// Draw the arrowhead
		const arrowHeadSize = this.arrowHeadSize * scale;
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.moveTo(domEnd.x, domEnd.y + arrowHeadSize / 2 - 2 * scale);
		ctx.lineTo(domEnd.x - arrowHeadSize / 2, domEnd.y - arrowHeadSize + 2);
		ctx.lineTo(domEnd.x + arrowHeadSize / 2, domEnd.y - arrowHeadSize + 2);
		ctx.closePath();
		ctx.fill();
	}
}

export class StackAnnotator extends DataStructureAnnotator {
	getTopId(): string | number | null {
		let topId: string | number | null = null;

		for (const node of this.nodes.get()) {
			if (node && node.title) {
				const nodeData = LinkedListNodeData.fromNode(node);
				if (nodeData.isHead) {
					topId = node.id;
					break;
				}
			}
		}
		return topId;
	}

	redrawCanvas() {
		super.redrawCanvas();

		const topId = this.getTopId();

		// Draw top annotation
		if (topId !== null) {
			const topAnnotation = new TopAnnotation(this, topId);
			topAnnotation.draw();
		}
	}
}
