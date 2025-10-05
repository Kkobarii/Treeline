import type { BinaryTree } from "$lib/structures/binaryTree";

export class AnimationData {
    operation: string;
    startSnapshot: BinaryTree<number> | null;
    steps: AnimationStep[];
    endSnapshot: BinaryTree<number> | null;

    currentStepIndex: number = 0;

    constructor(operation: string, startSnapshot: BinaryTree<number> | null) {
        this.operation = operation;
        this.startSnapshot = startSnapshot;
        this.steps = [new AnimationStep(0, "Start")];
        this.endSnapshot = null;
    }

    addStep(step: string) {
        this.steps.push(new AnimationStep(this.steps.length, step));
    }

    getCurrentStep(): AnimationStep {
        return this.steps[this.currentStepIndex];
    }

    nextStep(): AnimationStep | null {
        if (this.currentStepIndex < this.steps.length - 1) {
            this.currentStepIndex++;
            return this.getCurrentStep();
        }
        return null;
    }

    previousStep(): AnimationStep | null {
        if (this.currentStepIndex > 0) {
            this.currentStepIndex--;
            return this.getCurrentStep();
        }
        return null;
    }
}

export class AnimationStep {
    id: number = 0;
    tmp: string = "";

    constructor(id: number, tmp: string) {
        this.id = id;
        this.tmp = tmp;
    }
}