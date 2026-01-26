import { OperationData } from '$lib/data-structures/operation/operationData';
import { Step } from '$lib/data-structures/operation/stepData';
import { deepCopy } from '$lib/data-structures/utils/utils';

import { DataNode, DataStructure, OperationType, type OperationTypeValue } from '../dataStructure';

export class StackNode extends DataNode {
	value: number;
	next: StackNode | null = null;

	constructor(id: number, value: number) {
		super(id);
		this.value = value;
	}
}

export class Stack extends DataStructure {
	top: StackNode | null = null;
	size: number = 0;

	snapshot(): Stack {
		return Object.assign(new Stack(), deepCopy(this));
	}

	protected doOperation(type: OperationTypeValue, value: number | null, data: OperationData): void {
		switch (type) {
			case OperationType.Stack.Push:
				this.push(value as number, data);
				break;
			case OperationType.Stack.Pop:
				this.pop(data);
				break;
			case OperationType.Stack.Peek:
				this.peek(data);
				break;
			default:
				throw new Error(`Operation type ${type} not supported for Stack.`);
		}
	}

	push(value: number, data: OperationData): StackNode {
		const newNode = new StackNode(this.generateId(), value);
		let startSnapshot = this.snapshot();

		newNode.next = this.top;
		this.top = newNode;
		this.size++;

		data.step(Step.Stack.Push(newNode.id, value, startSnapshot, this.snapshot()));
		return newNode;
	}

	pop(data: OperationData): number | null {
		if (!this.top) {
			data.step(Step.Stack.Empty());
			return null;
		}

		let startSnapshot = this.snapshot();
		const value = this.top.value;
		const nodeId = this.top.id;

		this.top = this.top.next;
		this.size--;

		data.step(Step.Stack.Pop(nodeId, value, startSnapshot, this.snapshot()));
		return value;
	}

	peek(data: OperationData): number | null {
		if (!this.top) {
			data.step(Step.Stack.Empty());
			return null;
		}

		data.step(Step.Stack.Peek(this.top.id, this.top.value));
		return this.top.value;
	}
}
