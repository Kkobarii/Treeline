import { Colors } from "$lib/assets/colors";
import { AVLTreeNodeData, isDummyNodeId } from "$lib/data-structures/utils/graphs";
import { DataStructureAnnotator } from "$lib/data-structures/visual/annotators/dataStructureAnnotator";

class HeightBalanceAnnotation {
    fontSize: number = 9;
    rightOffset: number = 1;
    color: string = Colors.Yellow;
    padding: number = 2;

    heightText : string;
    balanceText : string;

    constructor(
        public annotator: DataStructureAnnotator,
        public followingNodeId: string | number,
    ) {
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
            let box = this.annotator.network.getBoundingBox(this.followingNodeId);
            let pos = this.annotator.network.canvasToDOM({ x: box.right + this.rightOffset, y: box.top + 6.2 }); // random offset that vis js puts to bounding box
            return { x: pos.x, y: pos.y };
        } catch {
            // node might not exist
        }
        return this.annotator.network.canvasToDOM({ x: 0, y: 0 });
    }

    getBoundingRect(): { x: number, y: number, width: number, height: number } {
        let pos = this.getPosition();
        let ctx = this.annotator.ctx;
        ctx.font = `${this.fontSize * this.annotator.getScale()}px Arial`;
        let padding = this.padding * this.annotator.getScale();

        let textWidth = Math.max(ctx.measureText(this.heightText).width, ctx.measureText(this.balanceText).width);
        let textHeight = this.fontSize * this.annotator.getScale() * 2; // two lines of text

        let boxX = pos.x - padding;
        let boxY = pos.y;
        let boxWidth = textWidth + padding * 2;
        let boxHeight = textHeight + padding * 2;

        return { x: boxX, y: boxY, width: boxWidth, height: boxHeight };
    }

    draw() {
        let pos = this.getPosition();
        let rect = this.getBoundingRect();

        pos.y += this.padding * this.annotator.getScale();

        this.annotator.drawRectangle(rect.x, rect.y, rect.width, rect.height, this.color);
        this.annotator.drawText(this.heightText, pos.x, pos.y, this.fontSize, 'left', 'top');
        this.annotator.drawText(this.balanceText, pos.x, pos.y + (this.fontSize * this.annotator.getScale()), this.fontSize, 'left', 'top');
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