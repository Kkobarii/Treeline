import { Tree } from '$lib/structures/generic';

export class OperationData {
	operation: string;
	startSnapshot: Tree | null;
	steps: StepData[];
	endSnapshot: Tree | null;

	constructor(operation: string, startSnapshot: Tree | null) {
		this.operation = operation;
		this.startSnapshot = startSnapshot;
		this.steps = [new StepData(0, 'Start')];
		this.endSnapshot = null;
	}

	addStep(step: string) {
		this.steps.push(new StepData(this.steps.length, step));
	}

	end(endSnapshot: Tree) {
		this.addStep('End');
		this.endSnapshot = endSnapshot;
	}
}

export class StepData {
	id: number = 0;
	tmp: string = '';

	constructor(id: number, tmp: string) {
		this.id = id;
		this.tmp = tmp;
	}
}
