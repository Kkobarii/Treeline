import type { Node } from 'vis-network';

import { RBTreeColor } from '$lib/data-structures/structures/rbTree/rbTree';
import { NodeData } from '$lib/data-structures/utils/graphs';
import { Colors, shadeColor } from '$lib/utils/colors';

import { VIS_NETWORK_TOP_BB_OFFSET } from '../constants';
import { DataStructureAnnotator } from '../dataStructureAnnotator';
import BaseAnnotation from './annotation';

const LEG_LENGTH = 16;
const DASH_LENGTH = 4;
const X_PADDING = 10;

const DEFAULT_COLOR = Colors.Node;

export class LegsAnnotation extends BaseAnnotation {
	color: string = '#0000000';
	legs: boolean[] = [];

	constructor(
		public annotator: DataStructureAnnotator,
		public followingNodeId: string | number,
	) {
		super(annotator);
		let nodeData: Node = this.annotator.nodes.get(this.followingNodeId) as Node;
		if (nodeData && nodeData.title) {
			let data = NodeData.fromNode(nodeData);
			this.legs = data.legs;

			let color = DEFAULT_COLOR;
			let titleObj = JSON.parse(nodeData.title as string);
			if (titleObj.color) {
				color = titleObj.color === RBTreeColor.Red ? Colors.RBTreeRed : Colors.RBTreeBlack;
			}
			this.color = shadeColor(color, -20);
		}
	}

	getLegPositions(): { x: number; y: number }[] {
		if (this.legs.length === 0) return [];

		try {
			let box = this.annotator.network.getBoundingBox(this.followingNodeId as any);

			const interval = {
				left: box.left + VIS_NETWORK_TOP_BB_OFFSET + X_PADDING,
				right: box.right - VIS_NETWORK_TOP_BB_OFFSET - X_PADDING,
			};
			const y = box.bottom - VIS_NETWORK_TOP_BB_OFFSET + 2; // a bit farther for good measure

			const positions: { x: number; y: number }[] = [];

			const totalWidth = interval.right - interval.left;
			for (let i = 0; i < this.legs.length; i++) {
				const x = interval.left + (totalWidth * i) / (this.legs.length - 1);
				positions.push({ x, y });
			}

			return positions;
		} catch {
			return [];
		}
	}

	draw() {
		const positions = this.getLegPositions();

		for (let i = 0; i < this.legs.length; i++) {
			if (!this.legs[i]) continue;

			const pos = positions[i];
			if (!pos) continue;

			const scale = this.annotator.getScale();
			const domStart = this.annotator.network.canvasToDOM(pos);
			const domEnd = this.annotator.network.canvasToDOM({ x: pos.x, y: pos.y + LEG_LENGTH });

			this.annotator.drawLine(domStart.x, domStart.y, domEnd.x, domEnd.y, this.color, scale, {
				length: DASH_LENGTH * scale,
				gap: DASH_LENGTH * scale,
			});
		}
	}
}
