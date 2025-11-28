import { Colors } from "$lib/assets/colors";
import { BaseAnnotation } from './baseAnnotation';
import type { DataStructureAnnotator } from './dataStructureAnnotator';

export class ValueAnnotation extends BaseAnnotation {
    aboveOffset: number = 40;
    color: string = Colors.ValueNode;

    // when followingNodeId is set, position is derived from that node
    public followingNodeId: string | number | null = null;

    // explicit position used during animations when not following a node
    private animPos: { x: number; y: number } = { x: 0, y: 0 };

    constructor(public annotator: DataStructureAnnotator, public text: string, public startFollowingNodeId: string | number | null = null) {
        super(annotator);
        this.followingNodeId = startFollowingNodeId;
        // initialize position to either the following node or origin
        if (this.followingNodeId !== null) {
            try {
                const p = this.annotator.network.getPosition(this.followingNodeId as any);
                this.animPos = { x: p.x, y: p.y - this.aboveOffset };
            } catch {
                this.animPos = { x: 0, y: 0 };
            }
        }
    }

    getPosition(): { x: number; y: number } {
        if (this.followingNodeId !== null) {
            try {
                const nodePos = this.annotator.network.getPosition(this.followingNodeId as any);
                return { x: nodePos.x, y: nodePos.y - this.aboveOffset };
            } catch {
                // fallthrough to animPos
            }
        }
        return this.animPos;
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

    /**
     * Animate moving the value annotation to be above `nodeId`.
     * Resolves when animation completes and the annotation is set to follow the target node.
     */
    async moveToNode(nodeId: string | number, duration: number = 400): Promise<void> {
        // compute start and target positions in network units
        const start = this.getPosition();
        let targetPos = { x: 0, y: 0 };
        try {
            const p = this.annotator.network.getPosition(nodeId as any);
            targetPos = { x: p.x, y: p.y - this.aboveOffset };
        } catch {
            // if node not found, just set to start
            targetPos = start;
        }

        const startTime = performance.now();

        // Temporarily stop following any node so getPosition() returns animPos during the animation
        const previousFollowing = this.followingNodeId;
        this.followingNodeId = null;

        try {
            await new Promise<void>((resolve) => {
                const step = (t: number) => {
                    const elapsed = t - startTime;
                    const tNorm = Math.min(1, Math.max(0, elapsed / duration));
                    // ease in-out (smoothstep-like)
                    const ease = tNorm < 0.5 ? 2 * tNorm * tNorm : -1 + (4 - 2 * tNorm) * tNorm;
                    this.animPos = {
                        x: start.x + (targetPos.x - start.x) * ease,
                        y: start.y + (targetPos.y - start.y) * ease,
                    };

                    // trigger redraw
                    this.annotator.redrawCanvas();

                    if (tNorm < 1) {
                        requestAnimationFrame(step);
                    } else {
                        // snap to exact target and start following the node
                        this.animPos = targetPos;
                        this.followingNodeId = nodeId;
                        this.annotator.redrawCanvas();
                        resolve();
                    }
                };

                requestAnimationFrame(step);
            });
        } finally {
            // If animation was interrupted, restore previous following state
            if (this.followingNodeId === null) this.followingNodeId = previousFollowing;
        }
        return;
    }
}

export default ValueAnnotation;
