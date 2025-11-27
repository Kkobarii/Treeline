import { Colors } from "$lib/assets/colors";
import type { DataStructureAnnotator } from "./dataStructureAnnotator";

export class Annotation {
    fontSize: number = 16;
    aboveOffset: number = 40;
    color: string = Colors.Info;
    padding: number = 5;
    roundRadius: number = 8;

    constructor(
        public annotator: DataStructureAnnotator,
        public text: string, 
        public followingNodeId: string | number | null = null,
    ) {
    }

    getPosition(): { x: number, y: number } {
        if (this.followingNodeId !== null) {
            try {
                let nodePos = this.annotator.network.getPosition(this.followingNodeId as any);
                let domPos = this.annotator.network.canvasToDOM(nodePos);
                return { x: domPos.x, y: domPos.y - this.aboveOffset * this.annotator.getScale() };
            } catch {
                // node might not exist
            }
        }
        return this.annotator.network.canvasToDOM({ x: 0, y: 0 });
    }

    getBoundingRect(): { x: number, y: number, width: number, height: number } {
        let pos = this.getPosition();
        let ctx = this.annotator.ctx;
        ctx.font = `${this.fontSize * this.annotator.getScale()}px Arial`;
        let padding = this.padding * this.annotator.getScale();
        
        let textWidth = ctx.measureText(this.text).width;
        let textHeight = this.fontSize * this.annotator.getScale();

        let boxX = pos.x - textWidth / 2 - padding;
        let boxY = pos.y - textHeight / 2 - padding;
        let boxWidth = textWidth + padding * 2;
        let boxHeight = textHeight + padding * 2;

        return { x: boxX, y: boxY, width: boxWidth, height: boxHeight };
    }

    draw() {
        let pos = this.getPosition();
        let rect = this.getBoundingRect();

        this.annotator.drawRectangle(rect.x, rect.y, rect.width, rect.height, this.color);
        this.annotator.drawText(this.text, pos.x, pos.y, this.fontSize);
    }

    clear() {
        let rect = this.getBoundingRect();
        this.annotator.clearRectangle(rect.x, rect.y, rect.width, rect.height);
    }
}

export default Annotation;
