import { Colors } from '$lib/assets/colors';
import { AVLTreeNodeData, isDummyNodeId } from '$lib/data-structures/utils/graphs';
import { BaseAnnotation } from '$lib/data-structures/visual/annotators/baseAnnotation';
import { CYTOSCAPE_NODE_BBOX_OFFSET } from '$lib/data-structures/visual/annotators/constants';
import { DataStructureAnnotator } from '$lib/data-structures/visual/annotators/dataStructureAnnotator';

class HeightBalanceAnnotation extends BaseAnnotation {
	rightOffset: number = 1;
	color: string = Colors.Yellow;

	heightText: string;
	balanceText: string;

	hidden: boolean = false;

	constructor(
		public annotator: DataStructureAnnotator,
		public followingNodeId: string | number,
	) {
		super(annotator);
		this.fontSize = 9;
		this.padding = 2;

		const node = this.annotator.cy.getElementById(followingNodeId);
		if (node && node.isNode() && node.data('title')) {
			let avlData = AVLTreeNodeData.fromNode(node);

			this.hidden = isNaN(avlData.height) || isNaN(avlData.balance);

			this.heightText = `H: ${avlData.height}`;
			this.balanceText = `B: ${avlData.balance}`;
		} else {
			this.heightText = `H: ?`;
			this.balanceText = `B: ?`;
		}
	}

	getPosition(): { x: number; y: number } {
		try {
			const node = this.annotator.cy.getElementById(this.followingNodeId);
			if (node && node.isNode()) {
				const pos = node.position();
				const width = node.width();
				const height = node.height();
				return {
					x: pos.x + width / 2 + this.rightOffset,
					y: pos.y - height / 2 + CYTOSCAPE_NODE_BBOX_OFFSET,
				};
			}
		} catch {
			// node might not exist
		}
		return { x: 0, y: 0 };
	}

	draw() {
		if (!this.shown || this.hidden) return;

		const pos = this.getPosition();
		// measure both lines and compute box (in network units)
		const h = this.measure(this.heightText, this.fontSize);
		const b = this.measure(this.balanceText, this.fontSize);
		const textWidth = Math.max(h.width, b.width);
		const textHeight = h.height + b.height;

		const box = this.computeBox(pos, textWidth, textHeight, this.padding, 'left', 'top');

		// Cytoscape works in canvas coordinates directly
		const scale = this.annotator.getScale();
		this.annotator.drawRectangle(box.x, box.y, box.width * scale, box.height * scale, this.color);

		// draw two lines stacked
		const line1Y = pos.y + this.padding;
		this.annotator.drawText(this.heightText, pos.x, line1Y, this.fontSize, 'left', 'top');
		const line2Y = line1Y + this.fontSize;
		this.annotator.drawText(this.balanceText, pos.x, line2Y, this.fontSize, 'left', 'top');
	}

	highlight() {
		this.color = Colors.ValueNodeHighlight;
	}
}

export class AVLTreeAnnotator extends DataStructureAnnotator {
	highlightedHBAnnotationNodeId: number | null = null;

	redrawCanvas() {
		super.redrawCanvas();

		// draw height/balance annotations
		for (let node of this.cy.nodes()) {
			const nodeId = node.id();
			if (isDummyNodeId(nodeId)) continue;
			let annotation = new HeightBalanceAnnotation(this, nodeId);
			if (this.highlightedHBAnnotationNodeId !== null && this.highlightedHBAnnotationNodeId === nodeId) {
				annotation.highlight();
			}
			annotation.draw();
		}
	}

	resetFormatting() {
		this.highlightedHBAnnotationNodeId = null;
		this.redrawCanvas();
		// console.log('AVLTreeAnnotator.resetFormatting called');
	}

	highlightNodeHeightBalance(nodeId: number) {
		this.highlightedHBAnnotationNodeId = nodeId;
		this.redrawCanvas();
		// console.log('AVLTreeAnnotator.highlightNodeHeightBalance called for nodeId:', nodeId);
	}

	public clearAnnotation(): void {
		super.clearAnnotation();
		this.highlightedHBAnnotationNodeId = null;
	}
}
