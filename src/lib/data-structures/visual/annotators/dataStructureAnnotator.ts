import { shadeColor } from "$lib/assets/colors";
import { isDummyNodeId } from "$lib/data-structures/utils/graphs";
import type { DataSet } from "vis-data";
import type { Edge, Network, Node } from "vis-network";
import { Annotation } from './annotation';
import { IdAnnotation } from './idAnnotation';
import { ValueAnnotation } from './valueAnnotation';

export interface DataStructureAnnotatorOpts {
    canvas: HTMLCanvasElement;
    
    network: Network;
    nodes: DataSet<Node>;
    edges: DataSet<Edge>;
}

export class DataStructureAnnotator {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    network: Network;
    nodes: DataSet<Node>;
    edges: DataSet<Edge>;

    annotationCurrentNodeId: string | number | null = null;

    currentAnnotation: Annotation | null = null;
    currentValueAnnotation: ValueAnnotation | null = null;

    constructor(opts: DataStructureAnnotatorOpts) {
        this.canvas = opts.canvas;
        this.ctx = this.canvas.getContext("2d")!;

        this.network = opts.network;
        this.nodes = opts.nodes;
        this.edges = opts.edges;
    }

    // when true, draw per-node ids in the overlay for debugging
    public debugMode: boolean = false;

    public toggleDebugMode(): void {
        this.debugMode = !this.debugMode;
        if (this.debugMode) this.redrawCanvas();
        else this.clearCanvas();
    }

    public setDebugMode(v: boolean): void {
        this.debugMode = v;
        if (this.debugMode) this.redrawCanvas();
        else this.clearCanvas();
    }

    public getScale(): number {
        return this.network.getScale();
    }

    public redrawCanvas() {
        this.clearCanvas();
        // draw the normal annotation (textual) and any floating value annotation
        if (this.currentAnnotation) {
            this.currentAnnotation.draw();
        }

        if (this.currentValueAnnotation) {
            this.currentValueAnnotation.draw();
        }

        if (this.debugMode) {
            for (const node of this.nodes.get() as Node[]) {
                try {
                    if (isDummyNodeId(node.id!)) continue;
                    const idAnnot = new IdAnnotation(this, node.id!);
                    idAnnot.draw();
                } catch { }
            }
        }
    }

    public clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    public findRootNodeId(): string | number | null {
        for (const node of this.nodes.get() as Node[]) {
            let isRoot = true;
            for (const edge of this.edges.get() as Edge[]) {
                if (edge.to === node.id) {
                    isRoot = false;
                    break;
                }
            }
            if (isRoot) {
                return node.id!;
            }
        }
        return null;
    }

    public annotateNode(text: string, nodeId: string | number | null) {
        if (nodeId === null) {
            nodeId = this.findRootNodeId();
        }

        if (this.currentAnnotation) {
            this.currentAnnotation.clear();
        }

        this.currentAnnotation = new Annotation(this, text, nodeId);
        this.currentAnnotation.shown = this.showAnnotation;
        this.currentAnnotation.draw();
    }

    showAnnotation: boolean = true;

    public showAnnotationNode() {
        this.showAnnotation = true;
        if (this.currentAnnotation) {
            this.currentAnnotation.shown = true;
            this.redrawCanvas();
        }
    }

    public hideAnnotationNode() {
        this.showAnnotation = false;
        if (this.currentAnnotation) {
            this.currentAnnotation.shown = false;
            this.redrawCanvas();
        }
    }

    /**
     * Create a value annotation; the annotation will be drawn above `startNodeId` if provided,
     * otherwise at origin until moved.
     */
    public createValueAnnotation(text: string, startNodeId: string | number | null = null) {
        if (this.currentValueAnnotation) {
            this.currentValueAnnotation.clear();
            this.currentValueAnnotation = null;
        }
        this.currentValueAnnotation = new ValueAnnotation(this, text, startNodeId);
        this.currentValueAnnotation.draw();
    }

    public removeValueAnnotation() {
        if (this.currentValueAnnotation) {
            this.currentValueAnnotation.clear();
            this.currentValueAnnotation = null;
            this.redrawCanvas();
        }
    }

    /** Animate moving the current value annotation to be above `nodeId`. Resolves when move completes. */
    public async moveValueAnnotationTo(nodeId: string | number) {
        if (!this.currentValueAnnotation) return;
        await this.currentValueAnnotation.moveToNode(nodeId);
    }

    /** Remove the current value annotation */
    public clearValueAnnotation() {
        if (!this.currentValueAnnotation) return;
        this.currentValueAnnotation.clear();
        this.currentValueAnnotation = null;
        this.redrawCanvas();
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
