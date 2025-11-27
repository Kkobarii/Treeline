import { Colors } from "$lib/assets/colors";
import { BaseAnnotation } from "./baseAnnotation";
import type { DataStructureAnnotator } from "./dataStructureAnnotator";

export class Annotation extends BaseAnnotation {
    aboveOffset: number = 40;
    color: string = Colors.Info;

    constructor(public annotator: DataStructureAnnotator, public text: string, public followingNodeId: string | number | null = null) {
        super(annotator);
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

    draw() {
        const pos = this.getPosition();
        this.renderBoxedText(pos, this.text, this.fontSize, this.padding, this.color, 'center', 'middle');
    }

    clear() {
        const pos = this.getPosition();
        const { width: textWidth, height: textHeight } = this.measure(this.text, this.fontSize);
        const box = this.computeBox(pos, textWidth, textHeight, this.padding, 'center', 'middle');
        this.annotator.clearRectangle(box.x, box.y, box.width, box.height);
    }
}

export default Annotation;
