import { OperationData, StepData } from '$lib/data-structures/operations/operationData';
import { deepCopy } from '$lib/data-structures/utils/utils';

import { DataNode, DataStructure, OperationType, type OperationTypeValue } from '../dataStructure';
import {
	CompareData,
	CreateHeadData,
	EmptyListData,
	FoundData,
	InsertAtHeadData,
	InsertAtTailData,
	MarkToDeleteData,
	NotFoundData,
	RemoveHeadData,
	RemoveNodeData,
	TraverseNextData,
	TraverseToTailData,
} from './linkedListSteps';

export class LinkedListNode extends DataNode {
	value: number;
	next: LinkedListNode | null = null;

	constructor(id: number, value: number) {
		super(id);
		this.value = value;
	}
}

export class LinkedList extends DataStructure {
	head: LinkedListNode | null = null;
	tail: LinkedListNode | null = null;
	size: number = 0;

	snapshot(): LinkedList {
		return Object.assign(new LinkedList(), deepCopy(this));
	}

	protected doOperation(type: OperationTypeValue, value: number | null, data: OperationData): void {
		switch (type) {
			case OperationType.LinkedList.InsertHead:
				this.insertHead(value as number, data);
				break;
			case OperationType.LinkedList.InsertTail:
				this.insertTail(value as number, data);
				break;
			case OperationType.LinkedList.Remove:
				this.remove(value as number, data);
				break;
			case OperationType.LinkedList.Find:
				this.find(value as number, data);
				break;
			default:
				throw new Error(`Operation type ${type} not supported for LinkedList.`);
		}
	}

	insertHead(value: number, data: OperationData): LinkedListNode {
		const newNode = new LinkedListNode(this.generateId(), value);
		let startSnapshot = this.snapshot();

		if (!this.head) {
			// Empty list
			this.head = newNode;
			this.tail = newNode;
			data.step(StepData.new(new CreateHeadData(newNode.id, value, startSnapshot, this.snapshot())));
		} else {
			// Non-empty list
			newNode.next = this.head;
			this.head = newNode;
			data.step(StepData.new(new InsertAtHeadData(newNode.id, value, startSnapshot, this.snapshot())));
		}

		this.size++;
		return newNode;
	}

	insertTail(value: number, data: OperationData): LinkedListNode {
		const newNode = new LinkedListNode(this.generateId(), value);
		let startSnapshot = this.snapshot();

		if (!this.head) {
			// Empty list
			this.head = newNode;
			this.tail = newNode;
			data.step(StepData.new(new CreateHeadData(newNode.id, value, startSnapshot, this.snapshot())));
		} else {
			// Non-empty list - traverse to tail or use tail reference
			if (this.tail) {
				data.step(StepData.new(new TraverseToTailData(this.head.id)));

				let realTail = this.head;
				while (realTail.next) {
					realTail = realTail.next;
				}
				realTail.next = newNode;

				this.tail = newNode;

				data.step(StepData.new(new InsertAtTailData(newNode.id, value, startSnapshot, this.snapshot())));
			}
		}

		this.size++;
		return newNode;
	}

	find(value: number, data: OperationData): LinkedListNode | null {
		if (!this.head) {
			data.step(StepData.new(new EmptyListData()));
			return null;
		}

		let current = this.head;
		let position = 0;

		while (current) {
			data.step(StepData.new(new CompareData(value, current.id, current.value, position)));

			if (value === current.value) {
				data.step(StepData.new(new FoundData(current.id, value, position)));
				return current;
			}

			if (current.next) {
				data.step(StepData.new(new TraverseNextData(current.id, current.next.id)));
				current = current.next;
				position++;
			} else {
				data.step(StepData.new(new NotFoundData(value)));
				return null;
			}
		}

		data.step(StepData.new(new NotFoundData(value)));
		return null;
	}

	remove(value: number, data: OperationData): boolean {
		if (!this.head) {
			data.step(StepData.new(new EmptyListData()));
			return false;
		}

		// Special case: removing head
		if (this.head.value === value) {
			data.step(StepData.new(new MarkToDeleteData(this.head.id, value)));
			let startSnapshot = this.snapshot();

			this.head = this.head.next;
			if (!this.head) {
				this.tail = null; // List is now empty
			}

			data.step(StepData.new(new RemoveHeadData(startSnapshot, this.snapshot())));
			this.size--;
			return true;
		}

		// General case: find node to remove
		let current = this.head;
		let prev: LinkedListNode | null = null;
		let position = 0;

		while (current) {
			data.step(StepData.new(new CompareData(value, current.id, current.value, position)));

			if (current.value === value) {
				data.step(StepData.new(new MarkToDeleteData(current.id, value)));
				let startSnapshot = this.snapshot();

				if (prev) {
					prev.next = current.next;
					if (current === this.tail) {
						this.tail = prev;
					}
				}

				data.step(StepData.new(new RemoveNodeData(current.id, startSnapshot, this.snapshot())));
				this.size--;
				return true;
			}

			if (current.next) {
				data.step(StepData.new(new TraverseNextData(current.id, current.next.id)));
				prev = current;
				current = current.next;
				position++;
			} else {
				data.step(StepData.new(new NotFoundData(value)));
				return false;
			}
		}

		data.step(StepData.new(new NotFoundData(value)));
		return false;
	}
}
