import { StepDetail } from '$lib/data-structures/operations/stepData';
import { DataStructure, StepType } from '$lib/data-structures/structures/dataStructure';

export class EnqueueData extends StepDetail {
	constructor(
		public nodeId: number,
		public value: number,
		public startSnapshot: DataStructure,
		public endSnapshot: DataStructure,
	) {
		super(StepType.Queue.Enqueue, 'steps.dataStructures.queue.enqueueData', { value });
	}
}

export class DequeueData extends StepDetail {
	constructor(
		public nodeId: number,
		public value: number,
		public startSnapshot: DataStructure,
		public endSnapshot: DataStructure,
	) {
		super(StepType.Queue.Dequeue, 'steps.dataStructures.queue.dequeueData', { value });
	}
}

export class PeekData extends StepDetail {
	constructor(
		public nodeId: number,
		public value: number,
	) {
		super(StepType.Queue.Peek, 'steps.dataStructures.queue.peekData', { value });
	}
}

export class EmptyData extends StepDetail {
	constructor() {
		super(StepType.Queue.Empty, 'steps.dataStructures.queue.emptyData');
	}
}
