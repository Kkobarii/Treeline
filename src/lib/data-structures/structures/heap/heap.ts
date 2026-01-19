import { OperationData } from '$lib/data-structures/operation/operationData';
import { Step } from '$lib/data-structures/operation/stepData';
import { deepCopy } from '$lib/data-structures/utils/utils';

import { DataNode, DataStructure, OperationType, type OperationTypeValue } from '../dataStructure';

export class HeapNode extends DataNode {
	value: number;
	arrayIndex: number;
	left: HeapNode | null = null;
	right: HeapNode | null = null;

	constructor(id: number, value: number, arrayIndex: number) {
		super(id);
		this.value = value;
		this.arrayIndex = arrayIndex;
	}
}

export class Heap extends DataStructure {
	nodes: HeapNode[] = [];
	root: HeapNode | null = null;

	snapshot(): Heap {
		return Object.assign(new Heap(), deepCopy(this));
	}

	protected doOperation(type: OperationTypeValue, value: number | null, data: OperationData): void {
		switch (type) {
			case OperationType.Heap.Insert:
				this.insert(value as number, data);
				break;
			case OperationType.Heap.ExtractRoot:
				this.extractRoot(data);
				break;
			default:
				throw new Error(`Operation type ${type} not supported for Heap.`);
		}
	}

	insert(value: number, data: OperationData): HeapNode {
		const index = this.nodes.length;
		const newNode = new HeapNode(this.generateId(), value, index);

		if (this.nodes.length === 0) {
			const startSnapshot = this.snapshot();
			this.nodes.push(newNode);
			this.rebuildPointers();
			data.step(Step.Common.CreateRoot(newNode.id, value, startSnapshot, this.snapshot()));
			return newNode;
		}

		const parentIndex = Math.floor((index - 1) / 2);
		const parent = this.nodes[parentIndex];

		const startSnapshot = this.snapshot();
		this.nodes.push(newNode);
		this.rebuildPointers();
		data.step(Step.Heap.Append(newNode.id, value, parent.id, startSnapshot, this.snapshot()));

		this.bubbleUp(index, data);
		return newNode;
	}

	extractRoot(data: OperationData): HeapNode | null {
		if (this.nodes.length === 0) {
			data.step(Step.Common.Drop(-1, 'heap empty', 'root'));
			return null;
		}

		if (this.nodes.length === 1) {
			const startSnapshot = this.snapshot();
			const removed = this.nodes.pop()!;
			this.rebuildPointers();
			data.step(Step.Common.Delete(removed.id, removed.value, startSnapshot, this.snapshot()));
			return removed;
		}

		const root = this.nodes[0];
		const lastIndex = this.nodes.length - 1;
		const lastNode = this.nodes[lastIndex];
		const rootValue = root.value;
		const lastValue = lastNode.value;

		data.step(Step.Common.MarkToDelete(root.id, root.value));

		const swapStart = this.snapshot();
		this.swapNodes(0, lastIndex);
		this.rebuildPointers();
		data.step(Step.Heap.ReplaceRootWithLast(root.id, lastNode.id, rootValue, lastValue, swapStart, this.snapshot()));

		const deleteStart = this.snapshot();
		const removed = this.nodes.pop()!;
		this.rebuildPointers();
		data.step(Step.Common.Delete(removed.id, removed.value, deleteStart, this.snapshot()));

		this.bubbleDown(0, data);
		return removed;
	}

	private bubbleUp(index: number, data: OperationData) {
		let currentIndex = index;
		while (currentIndex > 0) {
			const parentIndex = Math.floor((currentIndex - 1) / 2);
			const child = this.nodes[currentIndex];
			const parent = this.nodes[parentIndex];
			const childValue = child.value;
			const parentValue = parent.value;

			const needsSwap = child.value > parent.value;
			data.step(Step.Heap.CompareWithParent(child.id, parent.id, needsSwap));
			if (!needsSwap) break;

			const startSnapshot = this.snapshot();
			this.swapNodes(currentIndex, parentIndex);
			this.rebuildPointers();
			const endSnapshot = this.snapshot();
			data.step(Step.Heap.Swap(child.id, parent.id, childValue, parentValue, startSnapshot, endSnapshot));

			currentIndex = parentIndex;
		}
	}

	private bubbleDown(index: number, data: OperationData) {
		let currentIndex = index;
		const length = this.nodes.length;

		while (true) {
			const leftIndex = 2 * currentIndex + 1;
			const rightIndex = 2 * currentIndex + 2;

			let largestIndex = currentIndex;

			if (leftIndex < length) {
				if (this.nodes[leftIndex].value > this.nodes[largestIndex].value) {
					largestIndex = leftIndex;
				}
			}

			if (rightIndex < length) {
				if (this.nodes[rightIndex].value > this.nodes[largestIndex].value) {
					largestIndex = rightIndex;
				}
			}

			data.step(
				Step.Heap.CompareWithChildren(
					this.nodes[currentIndex].id,
					largestIndex !== currentIndex ? this.nodes[largestIndex].id : null,
				),
			);

			if (largestIndex !== currentIndex) {
				data.step(
					Step.Heap.FindLargestChild(this.nodes[currentIndex].id, this.nodes[largestIndex].id, this.nodes[largestIndex].value),
				);

				const currentNode = this.nodes[currentIndex];
				const targetNode = this.nodes[largestIndex];
				const currentValue = currentNode.value;
				const targetValue = targetNode.value;

				const startSnapshot = this.snapshot();
				this.swapNodes(currentIndex, largestIndex);
				this.rebuildPointers();
				const endSnapshot = this.snapshot();
				data.step(Step.Heap.Swap(currentNode.id, targetNode.id, currentValue, targetValue, startSnapshot, endSnapshot));

				currentIndex = largestIndex;
			} else {
				break;
			}
		}
	}

	private swapNodes(i: number, j: number) {
		const temp = this.nodes[i];
		this.nodes[i] = this.nodes[j];
		this.nodes[j] = temp;

		// Update arrayIndex to reflect new positions
		this.nodes[i].arrayIndex = i;
		this.nodes[j].arrayIndex = j;
	}

	private rebuildPointers() {
		for (let i = 0; i < this.nodes.length; i++) {
			const node = this.nodes[i];
			node.left = this.nodes[2 * i + 1] ?? null;
			node.right = this.nodes[2 * i + 2] ?? null;
		}

		this.root = this.nodes[0] ?? null;
	}
}
