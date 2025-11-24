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
            if (nodePos) {
                let domPos = this.annotator.network.canvasToDOM(nodePos);
                return { x: domPos.x, y: domPos.y - this.aboveOffset * this.annotator.getScale() };
            }
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

    draw(ctx: CanvasRenderingContext2D) {
        let pos = this.getPosition();
        let fontSize = this.fontSize * this.annotator.getScale();
        let padding = this.padding * this.annotator.getScale();
        ctx.font = `${fontSize}px Arial`;
        let textHeight = fontSize;
        let textWidth = ctx.measureText(this.text).width;

        let boxX = pos.x - textWidth / 2 - padding;
        let boxY = pos.y - textHeight / 2 - padding;
        let boxWidth = textWidth + padding * 2;
        let boxHeight = textHeight + padding * 2;

        // draw box
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = shadeColor(this.color, -40);
        ctx.lineWidth = 2;
        ctx.roundRect(boxX, boxY, boxWidth, boxHeight, this.roundRadius);
        ctx.stroke();
        ctx.fill();

        // draw text
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = 'black';
        ctx.fillText(this.text, pos.x, pos.y);
    }

    clear(ctx: CanvasRenderingContext2D) {
        let rect = this.getBoundingRect();
        ctx.clearRect(rect.x - 2, rect.y - 2, rect.width + 4, rect.height + 4);
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
            this.currentAnnotation.draw(this.ctx);
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
                if (isRoot && !node.id!.toString().includes("height") && !node.id!.toString().includes("info")) {
                    nodeId = node.id!;
                    break;
                }
            }
        }

        if (this.currentAnnotation) {
            this.currentAnnotation.clear(this.ctx);
        }

        this.currentAnnotation = new Annotation(this, text, nodeId);
        this.currentAnnotation.draw(this.ctx);
    }

    public clearAnnotation() {
        if (this.currentAnnotation) {
            this.currentAnnotation.clear(this.ctx);
            this.currentAnnotation = null;
        }
    }
}