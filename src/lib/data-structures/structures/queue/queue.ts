import { OperationData, StepData } from '$lib/data-structures/operations/operationData';
import { deepCopy } from '$lib/data-structures/utils/utils';

import { DataNode, DataStructure, OperationType, type OperationTypeValue } from '../dataStructure';
import { DequeueData, EmptyData, EnqueueData, PeekData } from './queueSteps';

export class QueueNode extends DataNode {
	value: number;
	next: QueueNode | null = null;

	constructor(id: number, value: number) {
		super(id);
		this.value = value;
	}
}

export class Queue extends DataStructure {
	front: QueueNode | null = null;
	rear: QueueNode | null = null;
	size: number = 0;

	snapshot(): Queue {
		return Object.assign(new Queue(), deepCopy(this));
	}

	protected doOperation(type: OperationTypeValue, value: number | null, data: OperationData): void {
		switch (type) {
			case OperationType.Queue.Enqueue:
				this.enqueue(value as number, data);
				break;
			case OperationType.Queue.Dequeue:
				this.dequeue(data);
				break;
			case OperationType.Queue.Peek:
				this.peek(data);
				break;
			default:
				throw new Error(`Operation type ${type} not supported for Queue.`);
		}
	}

	private getActualRear(): QueueNode | null {
		let current = this.front;
		if (!current) return null;
		while (current.next) {
			current = current.next;
		}
		return current;
	}

	enqueue(value: number, data: OperationData): QueueNode {
		const newNode = new QueueNode(this.generateId(), value);
		let startSnapshot = this.snapshot();

		if (!this.rear) {
			// Empty queue
			this.front = newNode;
			this.rear = newNode;
		} else {
			// Non-empty queue
			const actualRear = this.getActualRear();
			if (actualRear) {
				actualRear.next = newNode;
			}

			this.rear.next = newNode;
			this.rear = newNode;
		}

		this.size++;
		data.step(StepData.new(new EnqueueData(newNode.id, value, startSnapshot, this.snapshot())));
		return newNode;
	}

	dequeue(data: OperationData): number | null {
		if (!this.front) {
			data.step(StepData.new(new EmptyData()));
			return null;
		}

		let startSnapshot = this.snapshot();
		const value = this.front.value;
		const nodeId = this.front.id;

		this.front = this.front.next;
		if (!this.front) {
			this.rear = null; // Queue is now empty
		}

		this.size--;
		data.step(StepData.new(new DequeueData(nodeId, value, startSnapshot, this.snapshot())));
		return value;
	}

	peek(data: OperationData): number | null {
		if (!this.front) {
			data.step(StepData.new(new EmptyData()));
			return null;
		}

		data.step(StepData.new(new PeekData(this.front.id, this.front.value)));
		return this.front.value;
	}
}
