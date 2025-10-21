import { DataStructure } from '$lib/structures/dataStructure';

export class OperationData {
	operation: string;

	startSnapshot: DataStructure;
	steps: StepData[];
	endSnapshot: DataStructure | null;

	constructor(operation: string, startSnapshot: DataStructure) {
		this.operation = operation;
		this.startSnapshot = startSnapshot;
		this.steps = [new StepData(0, 'Start')];
		this.endSnapshot = null;
	}

	addStep(step: string) {
		this.steps.push(new StepData(this.steps.length, step));
	}

	end(endSnapshot: DataStructure) {
		this.addStep('End');
		this.endSnapshot = endSnapshot;
	}
}

export class StepData {
	id: number = 0;
	data: string = '';

	constructor(id: number, data: string) {
		this.id = id;
		this.data = data;
	}
}
