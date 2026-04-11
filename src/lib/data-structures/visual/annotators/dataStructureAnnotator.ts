import type { DataSet } from 'vis-data';
import type { Edge, Network, Node } from 'vis-network';

import { isDummyNodeId } from '$lib/data-structures/utils/graphs';
import type { Locale } from '$lib/i18n';
import { shadeColor } from '$lib/utils/colors';

import { IdAnnotation } from './annotations/idAnnotation';
import { Annotation } from './annotations/infoAnnotation';
import { LegsAnnotation } from './annotations/legsAnnotation';
import { ValueAnnotation } from './annotations/valueAnnotation';

export interface DataStructureAnnotatorOpts {
	canvas: HTMLCanvasElement;

	network: Network;
	nodes: DataSet<Node>;
	edges: DataSet<Edge>;

	locale: Locale;
}

export class DataStructureAnnotator {
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;

	network: Network;
	nodes: DataSet<Node>;
	edges: DataSet<Edge>;

	currentAnnotation: Annotation | null = null;
	currentValueAnnotation: ValueAnnotation | null = null;

	public locale: Locale = 'en';

	constructor(opts: DataStructureAnnotatorOpts) {
		this.canvas = opts.canvas;
		this.ctx = this.canvas.getContext('2d')!;

		this.network = opts.network;
		this.nodes = opts.nodes;
		this.edges = opts.edges;

		this.locale = opts.locale;
	}

	public debugMode: boolean = false;
	shown: boolean = true;
	showAnnotation: boolean = true;

	public setDebugMode(v: boolean): void {
		this.debugMode = v;
		this.redrawCanvas();
	}

	public getScale(): number {
		return this.network.getScale();
	}

	public redrawCanvas() {
		this.clearCanvas();

		if (!this.shown) {
			return;
		}

		for (const node of this.nodes.get() as Node[]) {
			const legsAnnot = new LegsAnnotation(this, node.id!);
			legsAnnot.draw();
		}

		if (this.debugMode) {
			for (const node of this.nodes.get() as Node[]) {
				if (node.id === undefined || isDummyNodeId(node.id)) continue;
				const idAnnot = new IdAnnotation(this, node.id);
				idAnnot.draw();
			}
		}

		if (this.currentAnnotation) {
			this.currentAnnotation.draw();
		}

		if (this.currentValueAnnotation) {
			this.currentValueAnnotation.draw();
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

	public toggleShown() {
		this.shown = !this.shown;
		if (this.shown) {
			this.redrawCanvas();
		} else {
			this.clearCanvas();
		}
	}

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

	public async moveValueAnnotationTo(nodeId: string | number) {
		if (!this.currentValueAnnotation) return;
		await this.currentValueAnnotation.moveToNode(nodeId);
	}

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
		if (this.shown === false) return;

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

	public drawText(
		text: string,
		x: number,
		y: number,
		fontSize: number,
		textAlign: CanvasTextAlign = 'center',
		textBaseline: CanvasTextBaseline = 'middle',
		color: string = 'black',
	) {
		if (this.shown === false) return;

		this.ctx.font = `${fontSize * this.getScale()}px Arial`;
		this.ctx.fillStyle = color;
		this.ctx.textAlign = textAlign;
		this.ctx.textBaseline = textBaseline;
		this.ctx.fillText(text, x, y);
	}

	public drawLine(
		x1: number,
		y1: number,
		x2: number,
		y2: number,
		color: string,
		lineWidth: number = 2,
		dashed: null | { length: number; gap: number } = null,
	) {
		if (this.shown === false) return;

		this.ctx.strokeStyle = color;
		this.ctx.lineWidth = lineWidth;
		this.ctx.setLineDash(dashed ? [dashed.length, dashed.gap] : []);
		this.ctx.beginPath();
		this.ctx.moveTo(x1, y1);
		this.ctx.lineTo(x2, y2);
		this.ctx.stroke();
		this.ctx.setLineDash([]);
	}
}
