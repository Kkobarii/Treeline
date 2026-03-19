import { DataStructure } from '$lib/data-structures/structures/dataStructure';

import { EndData, StartData } from './stepData';

export class OperationData {
	operation: string;

	startSnapshot: DataStructure;
	steps: StepData[];
	endSnapshot: DataStructure | null;

	constructor(operation: string, startSnapshot: DataStructure) {
		this.operation = operation;
		this.startSnapshot = startSnapshot;
		this.steps = [StepData.new('Start', new StartData())];
		this.endSnapshot = null;
	}

	step(step: StepData) {
		step.id = this.steps.length;
		this.steps.push(step);
	}

	end(endSnapshot: DataStructure) {
		this.step(StepData.new('End', new EndData()));
		this.endSnapshot = endSnapshot;
	}

	static Ignored(): OperationData {
		let opData = new OperationData('Ignored', new DataStructure());
		opData.end(new DataStructure());
		return opData;
	}
}

export class StepData {
	id: number = 0;
	type: string;
	data: object = {};
	startSnapshot: DataStructure | null = null;
	endSnapshot: DataStructure | null = null;

	constructor(
		id: number,
		type: string,
		data: object,
		startSnapshot: DataStructure | null = null,
		endSnapshot: DataStructure | null = null,
	) {
		this.id = id;
		this.type = type;
		this.data = data;
		this.startSnapshot = startSnapshot;
		this.endSnapshot = endSnapshot;
	}

	static new(type: string, data: object, startSnapshot: DataStructure | null = null, endSnapshot: DataStructure | null = null): StepData {
		return new StepData(0, type, data, startSnapshot, endSnapshot);
	}
}
