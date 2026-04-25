import { StepDetail } from '$lib/data-structures/operations/stepData';
import { DataStructure, StepType } from '$lib/data-structures/structures/dataStructure';

export class PushData extends StepDetail {
	constructor(
		public nodeId: number,
		public value: number,
		public topId: number | null,
		public startSnapshot: DataStructure,
		public endSnapshot: DataStructure,
	) {
		super(StepType.Stack.Push, 'steps.dataStructures.stack.pushData', { value });
	}
}

export class PopData extends StepDetail {
	constructor(
		public nodeId: number,
		public value: number,
		public topId: number | null,
		public startSnapshot: DataStructure,
		public endSnapshot: DataStructure,
	) {
		super(StepType.Stack.Pop, 'steps.dataStructures.stack.popData', { value });
	}
}

export class PeekData extends StepDetail {
	constructor(
		public nodeId: number,
		public value: number,
	) {
		super(StepType.Stack.Peek, 'steps.dataStructures.stack.peekData', { value });
	}
}

export class EmptyData extends StepDetail {
	constructor() {
		super(StepType.Stack.Empty, 'steps.dataStructures.stack.emptyData');
	}
}
