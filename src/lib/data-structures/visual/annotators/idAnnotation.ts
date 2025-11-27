import { Colors } from "$lib/assets/colors";
import { VIS_NETWORK_TOP_BB_OFFSET } from "./constants";
import type { DataStructureAnnotator } from "./dataStructureAnnotator";

export class IdAnnotation {
    fontSize: number = 10;
    padding: number = 2;
    color: string = Colors.Id;

    constructor(public annotator: DataStructureAnnotator, public followingNodeId: string | number) {}

    getPosition(): { x: number, y: number } {
        try {
            let nodePos = this.annotator.network.getBoundingBox(this.followingNodeId as any);
            let domPos = this.annotator.network.canvasToDOM({ x: nodePos.left - 1, y: nodePos.top + VIS_NETWORK_TOP_BB_OFFSET });
            return { x: domPos.x, y: domPos.y };
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

        let text = String(this.followingNodeId).trim();
        let textWidth = ctx.measureText(text).width;
        let textHeight = this.fontSize * this.annotator.getScale();

        let boxX = pos.x - textWidth - padding;
        let boxY = pos.y;
        let boxWidth = textWidth + padding * 2;
        let boxHeight = textHeight + padding * 2;

        return { x: boxX, y: boxY, width: boxWidth, height: boxHeight };
    }

    draw() {
        let pos = this.getPosition();
        let rect = this.getBoundingRect();

        this.annotator.drawRectangle(rect.x, rect.y, rect.width, rect.height, this.color);
        this.annotator.drawText(String(this.followingNodeId), pos.x, pos.y + this.padding * this.annotator.getScale(), this.fontSize, "right", "top");
    }

    clear() {
        let rect = this.getBoundingRect();
        this.annotator.clearRectangle(rect.x, rect.y, rect.width, rect.height);
    }
}

export default IdAnnotation;
