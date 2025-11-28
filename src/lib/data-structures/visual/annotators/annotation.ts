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
                return { x: nodePos.x, y: nodePos.y - this.aboveOffset };
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
        const domTopLeft = this.annotator.network.canvasToDOM({ x: box.x, y: box.y });
        
        this.annotator.clearRectangle(domTopLeft.x, domTopLeft.y, box.width * scale, box.height * scale);
    }
}

export default Annotation;
