import { Colors } from '$lib/assets/colors';

import { BaseAnnotation } from './baseAnnotation';
import { CYTOSCAPE_NODE_BBOX_OFFSET } from './constants';
import type { DataStructureAnnotator } from './dataStructureAnnotator';

export class IdAnnotation extends BaseAnnotation {
	color: string = Colors.Id;

	constructor(
		public annotator: DataStructureAnnotator,
		public followingNodeId: string | number,
	) {
		super(annotator);
		this.fontSize = 10;
		this.padding = 2;
	}

	getPosition(): { x: number; y: number } {
		try {
			const node = this.annotator.cy.getElementById(this.followingNodeId);
			if (node && node.isNode()) {
				const pos = node.position();
				const width = node.width();
				const height = node.height();
				// Get bounding box-like coordinates
				return {
					x: pos.x - width / 2 - 1,
					y: pos.y - height / 2 + CYTOSCAPE_NODE_BBOX_OFFSET,
				};
			}
		} catch {
			// node might not exist
		}
		return { x: 0, y: 0 };
	}

	draw() {
		const pos = this.getPosition();
		// right/top alignment to match old behavior
		this.renderBoxedText(pos, String(this.followingNodeId), this.fontSize, this.padding, this.color, 'right', 'top');
	}

	clear() {
		const pos = this.getPosition();
		const { width: textWidth, height: textHeight } = this.measure(String(this.followingNodeId), this.fontSize);
		const box = this.computeBox(pos, textWidth, textHeight, this.padding, 'right', 'top');
		const scale = this.annotator.getScale();
		// Cytoscape doesn't have canvasToDOM, we work in canvas coordinates directly
		this.annotator.clearRectangle(box.x, box.y, box.width * scale, box.height * scale);
	}
}

export default IdAnnotation;
