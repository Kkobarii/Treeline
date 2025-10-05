import type { Network } from "vis-network";
import { AnimationData } from "./animationData";
import { treeToGraph } from "$lib/utils/trees";

export class OperationManager {
    private network: Network;
    private operations: AnimationData[] = [];
    private currentIndex: number = 0;

    constructor(network: Network) {
        this.network = network;
        this.operations.push(new AnimationData("Initial State", null));
    }

    private refreshNetwork() {
        const currentOperation = this.getCurrentOperation();
        if (!currentOperation || !currentOperation.endSnapshot) {
            this.network.setData({nodes: [], edges: []});
            return;
        }

        const {nodes, edges} = treeToGraph(currentOperation.endSnapshot.root);
        this.network.setData({nodes, edges});
    }

    newOperation(operation: AnimationData) {
        // If we are not at the end of the operations list, remove all operations after the current index
        if (this.currentIndex < this.operations.length - 1) {
            this.operations = this.operations.slice(0, this.currentIndex + 1);
        }
        this.operations.push(operation);
        this.currentIndex++;

        this.refreshNetwork();
    }

    getCurrentOperation(): AnimationData | null {
        if (this.currentIndex >= 0 && this.currentIndex < this.operations.length) {
            return this.operations[this.currentIndex];
        }
        return null;
    }

    getOperationHistory(): AnimationData[] {
        return this.operations;
    }

    canUndo(): boolean {
        return this.currentIndex > 0;
    }

    canRedo(): boolean {
        return this.currentIndex < this.operations.length - 1;
    }

    undo(): AnimationData | null {
        if (this.canUndo()) {
            this.currentIndex--;
            this.refreshNetwork();
            return this.getCurrentOperation();
        }
        return null;
    }

    redo(): AnimationData | null {
        if (this.canRedo()) {
            this.currentIndex++;
            this.refreshNetwork();
            return this.getCurrentOperation();
        }
        return null;
    }

    reset() {
        this.operations = [];
        this.currentIndex = -1;
    }

    getCurrentIndex(): number {
        return this.currentIndex;
    }
}
