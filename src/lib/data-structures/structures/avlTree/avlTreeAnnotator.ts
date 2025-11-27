import { Colors } from "$lib/assets/colors";
import { AVLTreeNodeData, isDummyNodeId } from "$lib/data-structures/utils/graphs";
import { VIS_NETWORK_TOP_BB_OFFSET } from "$lib/data-structures/visual/annotators/constants";
import { DataStructureAnnotator } from "$lib/data-structures/visual/annotators/dataStructureAnnotator";

import { BaseAnnotation } from "$lib/data-structures/visual/annotators/baseAnnotation";

class HeightBalanceAnnotation extends BaseAnnotation {
    rightOffset: number = 1;
    color: string = Colors.Yellow;

    heightText: string;
    balanceText: string;

    constructor(public annotator: DataStructureAnnotator, public followingNodeId: string | number) {
        super(annotator);
        this.fontSize = 9;
        this.padding = 2;

        let nodeData = this.annotator.nodes.get(followingNodeId);
        if (nodeData && nodeData.title) {
            let avlData = AVLTreeNodeData.fromNode(nodeData);
            this.heightText = `H: ${avlData.height}`;
            this.balanceText = `B: ${avlData.balance}`;
        } else {
            this.heightText = `H: ?`;
            this.balanceText = `B: ?`;
        }
    }

    getPosition(): { x: number, y: number } {
        try {
            let box = this.annotator.network.getBoundingBox(this.followingNodeId as any);
            let pos = this.annotator.network.canvasToDOM({ x: box.right + this.rightOffset, y: box.top + VIS_NETWORK_TOP_BB_OFFSET });
            return { x: pos.x, y: pos.y };
        } catch {
            // node might not exist
        }
        return this.annotator.network.canvasToDOM({ x: 0, y: 0 });
    }

    draw() {
        const pos = this.getPosition();
        // measure both lines and compute box
        const h = this.measure(this.heightText, this.fontSize);
        const b = this.measure(this.balanceText, this.fontSize);
        const textWidth = Math.max(h.width, b.width);
        const textHeight = (h.height + b.height);

        const box = this.computeBox(pos, textWidth, textHeight, this.padding, 'left', 'top');
        this.annotator.drawRectangle(box.x, box.y, box.width, box.height, this.color);

        // draw two lines stacked
        const scale = this.annotator.getScale();
        const line1Y = pos.y + this.padding * scale;
        this.annotator.drawText(this.heightText, pos.x, line1Y, this.fontSize, 'left', 'top');
        const line2Y = line1Y + (this.fontSize * scale);
        this.annotator.drawText(this.balanceText, pos.x, line2Y, this.fontSize, 'left', 'top');
    }
}

export class AVLTreeAnnotator extends DataStructureAnnotator {
    
    redrawCanvas() {
        super.redrawCanvas();

        // draw height/balance annotations
        for (let nodeId of this.nodes.getIds()) {
            if (isDummyNodeId(nodeId)) continue;
            let annotation = new HeightBalanceAnnotation(this, nodeId);
            annotation.draw();
        }
    }
}