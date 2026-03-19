import { StepDetail } from '$lib/data-structures/operation/stepData';
import { DataStructure } from '$lib/data-structures/structures/dataStructure';

export class PushData extends StepDetail {
	constructor(
		public nodeId: number,
		public value: number,
		public startSnapshot: DataStructure,
		public endSnapshot: DataStructure,
	) {
		super('steps.dataStructures.stack.pushData', { value });
	}
}

export class PopData extends StepDetail {
	constructor(
		public nodeId: number,
		public value: number,
		public startSnapshot: DataStructure,
		public endSnapshot: DataStructure,
	) {
		super('steps.dataStructures.stack.popData', { value });
	}
}

export class PeekData extends StepDetail {
	constructor(
		public nodeId: number,
		public value: number,
	) {
		super('steps.dataStructures.stack.peekData', { value });
	}
}

export class EmptyData extends StepDetail {
	constructor() {
		super('steps.dataStructures.stack.emptyData');
	}
}
