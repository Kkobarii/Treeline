import { DataStructure, OperationType, type OperationTypeValue } from '$lib/data-structures/structures/dataStructure';

import { EndData, StartData } from './stepData';

export class OperationData {
	type: OperationTypeValue;
	value: number | null;

	startSnapshot: DataStructure;
	steps: StepData[];
	endSnapshot: DataStructure | null;

	constructor(type: OperationTypeValue, value: number | null, startSnapshot: DataStructure) {
		this.type = type;
		this.value = value;
		this.startSnapshot = startSnapshot;
		this.steps = [StepData.new(new StartData())];
		this.endSnapshot = null;
	}

	step(step: StepData) {
		step.id = this.steps.length;
		this.steps.push(step);
	}

	end(endSnapshot: DataStructure) {
		this.step(StepData.new(new EndData()));
		this.endSnapshot = endSnapshot;
	}

	static Ignored(): OperationData {
		let opData = new OperationData(OperationType.Empty, null, new DataStructure());
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
	isTransitory: boolean = false;

	constructor(
		id: number,
		type: string,
		data: object,
		startSnapshot: DataStructure | null = null,
		endSnapshot: DataStructure | null = null,
		isTransitory: boolean = false,
	) {
		this.id = id;
		this.type = type;
		this.data = data;
		this.startSnapshot = startSnapshot;
		this.endSnapshot = endSnapshot;
		this.isTransitory = isTransitory;
	}

	static new(data: object, startSnapshot: DataStructure | null = null, endSnapshot: DataStructure | null = null): StepData {
		const type = (data as any).type || 'Unknown';
		if (!startSnapshot && (data as any).startSnapshot) {
			startSnapshot = (data as any).startSnapshot;
		}
		if (!endSnapshot && (data as any).endSnapshot) {
			endSnapshot = (data as any).endSnapshot;
		}
		return new StepData(0, type, data, startSnapshot, endSnapshot, (data as any).isTransitory);
	}
}
