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
            return { x: box.right + this.rightOffset, y: box.top + VIS_NETWORK_TOP_BB_OFFSET };
        } catch {
            // node might not exist
        }
        return { x: 0, y: 0 };
    }

    draw() {
        const pos = this.getPosition();
        // measure both lines and compute box (in network units)
        const h = this.measure(this.heightText, this.fontSize);
        const b = this.measure(this.balanceText, this.fontSize);
        const textWidth = Math.max(h.width, b.width);
        const textHeight = (h.height + b.height);

        const box = this.computeBox(pos, textWidth, textHeight, this.padding, 'left', 'top');

        // convert box to DOM and draw
        const scale = this.annotator.getScale();
        const domTopLeft = this.annotator.network.canvasToDOM({ x: box.x, y: box.y });
        this.annotator.drawRectangle(domTopLeft.x, domTopLeft.y, box.width * scale, box.height * scale, this.color);

        // draw two lines stacked — compute line positions in network units, then convert
        const line1Y = pos.y + this.padding;
        const domLine1 = this.annotator.network.canvasToDOM({ x: pos.x, y: line1Y });
        this.annotator.drawText(this.heightText, domLine1.x, domLine1.y, this.fontSize, 'left', 'top');
        const line2Y = line1Y + (this.fontSize);
        const domLine2 = this.annotator.network.canvasToDOM({ x: pos.x, y: line2Y });
        this.annotator.drawText(this.balanceText, domLine2.x, domLine2.y, this.fontSize, 'left', 'top');
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