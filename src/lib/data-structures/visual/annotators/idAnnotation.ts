import { Colors } from '$lib/assets/colors';

import { BaseAnnotation } from './baseAnnotation';
import { VIS_NETWORK_TOP_BB_OFFSET } from './constants';
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
			let nodePos = this.annotator.network.getBoundingBox(this.followingNodeId as any);
			return { x: nodePos.left - 1, y: nodePos.top + VIS_NETWORK_TOP_BB_OFFSET };
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
		const domTopLeft = this.annotator.network.canvasToDOM({ x: box.x, y: box.y });
		this.annotator.clearRectangle(domTopLeft.x, domTopLeft.y, box.width * scale, box.height * scale);
	}
}

export default IdAnnotation;
