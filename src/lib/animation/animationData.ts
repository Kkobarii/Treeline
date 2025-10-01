export class AnimationData {
    operation: string;
    startSnapshot: any;
    steps: AnimationStep[];
    endSnapshot: any;

    constructor(operation: string, startSnapshot: any) {
        this.operation = operation;
        this.startSnapshot = startSnapshot;
        this.steps = [new AnimationStep(0, "Start")];
        this.endSnapshot = "";
    }

    addStep(step: string) {
        this.steps.push(new AnimationStep(this.steps.length, step));
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