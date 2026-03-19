import { StepDetail } from '$lib/data-structures/operation/stepData';
import { DataStructure } from '$lib/data-structures/structures/dataStructure';

export class EnqueueData extends StepDetail {
	constructor(
		public nodeId: number,
		public value: number,
		public startSnapshot: DataStructure,
		public endSnapshot: DataStructure,
	) {
		super('steps.dataStructures.queue.enqueueData', { value });
	}
}

export class DequeueData extends StepDetail {
	constructor(
		public nodeId: number,
		public value: number,
		public startSnapshot: DataStructure,
		public endSnapshot: DataStructure,
	) {
		super('steps.dataStructures.queue.dequeueData', { value });
	}
}

export class PeekData extends StepDetail {
	constructor(
		public nodeId: number,
		public value: number,
	) {
		super('steps.dataStructures.queue.peekData', { value });
	}
}

export class EmptyData extends StepDetail {
	constructor() {
		super('steps.dataStructures.queue.emptyData');
	}
}
