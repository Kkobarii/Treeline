import { Colors, shadeColor } from "$lib/assets/colors";
import type { DataSet } from "vis-data";
import type { Edge, Network, Node } from "vis-network";

export interface DataStructureAnnotatorOpts {
    canvas: HTMLCanvasElement;
    
    network: Network;
    nodes: DataSet<Node>;
    edges: DataSet<Edge>;
}

class Annotation {
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
                let nodePos = this.annotator.network.getPosition(this.followingNodeId);
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

export class DataStructureAnnotator {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    network: Network;
    nodes: DataSet<Node>;
    edges: DataSet<Edge>;

    annotationCurrentNodeId: string | number | null = null;

    currentAnnotation: Annotation | null = null;

    constructor(opts: DataStructureAnnotatorOpts) {
        this.canvas = opts.canvas;
        this.ctx = this.canvas.getContext("2d")!;

        this.network = opts.network;
        this.nodes = opts.nodes;
        this.edges = opts.edges;
    }

    public getScale(): number {
        return this.network.getScale();
    }

    public redrawCanvas() {
        this.clearCanvas();
        if (this.currentAnnotation) {
            this.currentAnnotation.draw();
        }
    }

    public clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    public annotateNode(text: string, nodeId: string | number | null) {
        if (nodeId === null) {
            // find root node
            for (const node of this.nodes.get() as Node[]) {
                let isRoot = true;
                for (const edge of this.edges.get() as Edge[]) {
                    if (edge.to === node.id) {
                        isRoot = false;
                        break;
                    }
                }
                if (isRoot) {
                    nodeId = node.id!;
                    break;
                }
            }
        }

        if (this.currentAnnotation) {
            this.currentAnnotation.clear();
        }

        this.currentAnnotation = new Annotation(this, text, nodeId);
        this.currentAnnotation.draw();
    }

    public clearAnnotation() {
        if (this.currentAnnotation) {
            this.currentAnnotation.clear();
            this.currentAnnotation = null;
        }
    }

    public drawRectangle(x: number, y: number, width: number, height: number, color: string, roundRadius: number = 5) {
        this.ctx.beginPath();
        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = shadeColor(color, -40);
        this.ctx.lineWidth = 2;
        this.ctx.roundRect(x, y, width, height, roundRadius * this.getScale());
        this.ctx.stroke();
        this.ctx.fill();
    }

    public clearRectangle(x: number, y: number, width: number, height: number) {
        this.ctx.clearRect(x - 2, y - 2, width + 4, height + 4);
    }

    public drawText(text: string, x: number, y: number, fontSize: number, textAlign: CanvasTextAlign = "center", textBaseline: CanvasTextBaseline = "middle", color: string = 'black') {
        this.ctx.font = `${fontSize * this.getScale()}px Arial`;
        this.ctx.fillStyle = color;
        this.ctx.textAlign = textAlign;
        this.ctx.textBaseline = textBaseline;
        this.ctx.fillText(text, x, y);
    }
}