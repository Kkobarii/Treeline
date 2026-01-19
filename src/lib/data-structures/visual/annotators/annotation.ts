import { Colors } from '$lib/assets/colors';

import { BaseAnnotation } from './baseAnnotation';
import type { DataStructureAnnotator } from './dataStructureAnnotator';

export class Annotation extends BaseAnnotation {
	aboveOffset: number = 30;
	color: string = Colors.Info;

	constructor(
		public annotator: DataStructureAnnotator,
		public text: string,
		public followingNodeId: string | number | null = null,
	) {
		super(annotator);
	}

	getPosition(): { x: number; y: number } {
		if (this.followingNodeId !== null) {
			try {
				const node = this.annotator.cy.getElementById(this.followingNodeId);
				if (node && node.isNode()) {
					const pos = node.position();
					return { x: pos.x, y: pos.y - this.aboveOffset };
				}
			} catch {
				// node might not exist
			}
		}
		return { x: 0, y: 0 };
	}

	draw() {
		const pos = this.getPosition();
		this.renderBoxedText(pos, this.text, this.fontSize, this.padding, this.color, 'center', 'middle');
	}

	clear() {
		const pos = this.getPosition();
		const { width: textWidth, height: textHeight } = this.measure(this.text, this.fontSize);
		const box = this.computeBox(pos, textWidth, textHeight, this.padding, 'center', 'middle');

		const scale = this.annotator.getScale();

		this.annotator.clearRectangle(box.x, box.y, box.width * scale, box.height * scale);
	}
}

export default Annotation;
