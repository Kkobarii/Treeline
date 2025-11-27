import type { DataStructureAnnotator } from './dataStructureAnnotator';

export class BaseAnnotation {
    fontSize: number = 14;
    padding: number = 4;
    roundRadius: number = 6;

    constructor(public annotator: DataStructureAnnotator) {}

    measure(text: string, fontSize: number) {
        const ctx = this.annotator.ctx;
        ctx.font = `${fontSize * this.annotator.getScale()}px Arial`;
        const width = ctx.measureText(text).width;
        const height = fontSize * this.annotator.getScale();
        return { width, height };
    }

    /**
     * Compute box rect given a reference position and alignment.
     * pos is interpreted relative to alignment: e.g. alignX='right' means pos.x is the right edge.
     */
    computeBox(pos: { x: number; y: number }, textWidth: number, textHeight: number, padding: number, alignX: CanvasTextAlign, alignY: CanvasTextBaseline) {
        padding = padding * this.annotator.getScale();
        
        let boxX = 0;
        if (alignX === 'center') boxX = pos.x - textWidth / 2 - padding;
        else if (alignX === 'left') boxX = pos.x - padding;
        else boxX = pos.x - textWidth - padding; // right

        let boxY = 0;
        if (alignY === 'middle') boxY = pos.y - textHeight / 2 - padding;
        else if (alignY === 'top') boxY = pos.y;
        else boxY = pos.y - textHeight - padding; // bottom

        const boxW = textWidth + padding * 2;
        const boxH = textHeight + padding * 2;
        return { x: boxX, y: boxY, width: boxW, height: boxH };
    }

    /** Draw a single-line boxed text using alignment rules. */
    renderBoxedText(pos: { x: number; y: number }, text: string, fontSize: number, padding: number, color: string, alignX: CanvasTextAlign = 'center', alignY: CanvasTextBaseline = 'middle') {
        const { width: textWidth, height: textHeight } = this.measure(text, fontSize);
        const box = this.computeBox(pos, textWidth, textHeight, padding, alignX, alignY);

        this.annotator.drawRectangle(box.x, box.y, box.width, box.height, color, this.roundRadius);

        // compute text coordinates and alignment for drawing
        padding = padding * this.annotator.getScale();
        let textX = pos.x;
        if (alignX === 'left') { textX = pos.x + padding; }
        else if (alignX === 'right') { textX = pos.x; }

        let textY = pos.y;
        if (alignY === 'top') { textY = pos.y + padding; }
        else if (alignY === 'bottom') { textY = pos.y - padding; }

        this.annotator.drawText(text, textX, textY, fontSize, alignX, alignY);
    }
}

export default BaseAnnotation;
