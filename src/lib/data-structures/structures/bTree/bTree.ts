import { OperationData, StepData } from '$lib/data-structures/operations/operationData';
import {
	BTREE_BORROW_FROM_LEFT_SIBLING,
	BTREE_BORROW_FROM_RIGHT_SIBLING,
	BTREE_GET_PREDECESSOR,
	BTREE_GET_SUCCESSOR,
	BTREE_MERGE_CHILDREN,
	BTREE_MERGE_WITH_SIBLING,
	BTREE_VALUE_IN_INTERNAL_NODE,
	BTREE_VALUE_IN_LEAF_NODE,
	DROP_REASON_DUPLICATE_VALUE,
	DROP_REASON_NOT_FOUND,
	DROP_REASON_UNKNOWN,
} from '$lib/data-structures/operations/stepConstants';
import { deepCopy } from '$lib/data-structures/utils/utils';

import { CaseAnalysisData, CreateRootData, DropData, FoundData, MarkToDeleteData } from '../../operations/stepData';
import { DataNode, DataStructure, OperationType, type OperationTypeValue } from '../dataStructure';
import { insertChild, insertNonFull, removeAt, removeChild } from './bTreeNodeUtils';
import {
	BorrowFromLeftData,
	BorrowFromRightData,
	ChooseBranchData,
	FindInorderReplacementData,
	InsertValueData,
	MarkOverfullData,
	MergeChildrenData,
	PromoteMiddleData,
	RemoveValueData,
	ReplaceValueData,
	SplitData,
} from './bTreeSteps';

export class BTreeNode extends DataNode {
	values: number[];
	children: BTreeNode[];
	isLeaf: boolean;

	constructor(id: number, isLeaf: boolean = true) {
		super(id);
		this.values = [];
		this.children = [];
		this.isLeaf = isLeaf;
	}
}

export class BTree extends DataStructure {
	root: BTreeNode | null = null;
	order: number; // maximum number of children, each node can have at most order-1 keys

	constructor(order: number = 5) {
		super();
		if (order < 3) {
			throw new Error('B-Tree order must be at least 3');
		}
		this.order = order;
	}

	snapshot(): BTree {
		const copy = Object.assign(new BTree(this.order), deepCopy(this));
		return copy;
	}

	protected doOperation(type: OperationTypeValue, value: number | null, data: OperationData): void {
		switch (type) {
			case OperationType.Tree.Insert:
				this.insert(value as number, data);
				break;
			case OperationType.Tree.Remove:
				this.remove(value as number, data);
				break;
			case OperationType.Tree.Find:
				this.find(value as number, data);
				break;
			default:
				throw new Error(`Operation type ${type} not supported for BTree.`);
		}
	}

	find(value: number, data: OperationData): BTreeNode | null {
		if (!this.root) {
			data.step(StepData.new(new DropData(value, DROP_REASON_NOT_FOUND, 'root')));
			return null;
		}

		let current: BTreeNode | null = this.root;

		while (current) {
			let i = 0;
			// Search within the current node
			while (i < current.values.length) {
				if (value === current.values[i]) {
					data.step(StepData.new(new FoundData(current.id, value)));
					return current;
				} else if (value < current.values[i]) {
					break;
				}
				i++;
			}

			// If leaf, value not found
			if (current.isLeaf) {
				data.step(StepData.new(new DropData(value, DROP_REASON_NOT_FOUND, current.id.toString())));
				return null;
			}

			// Move to appropriate child
			const childId = current.children[i] ? current.children[i].id : -1;
			const lowerBound = i > 0 ? current.values[i - 1] : null;
			const upperBound = i < current.values.length ? current.values[i] : null;
			data.step(StepData.new(new ChooseBranchData(current.id, value, i, childId, lowerBound, upperBound)));
			current = current.children[i] || null;
		}

		data.step(StepData.new(new DropData(value, DROP_REASON_NOT_FOUND, DROP_REASON_UNKNOWN)));
		return null;
	}

	// Split an overfull node (after insertion)
	private splitNode(node: BTreeNode, parent: BTreeNode | null, data: OperationData): BTreeNode {
		const t = Math.ceil(this.order / 2);
		const midIndex = t - 1;

		// Mark the node as invalid (overfull)
		const markSnapshot = this.snapshot();
		data.step(StepData.new(new MarkOverfullData(node.id, node.values.length, this.order - 1, markSnapshot, markSnapshot)));

		const startSnapshot = this.snapshot();

		// Create new node for the second half
		const newNode = new BTreeNode(this.generateId(), node.isLeaf);

		// Move the second half of values to new node
		newNode.values = node.values.splice(midIndex + 1);

		// Get the middle value
		const middleValue = removeAt(node, midIndex);

		// Move the second half of children if not a leaf
		if (!node.isLeaf) {
			newNode.children = node.children.splice(t);
		}

		if (!parent) {
			// If no parent, we'll record split after creating root structure
			const newRoot = new BTreeNode(this.generateId(), false);
			newRoot.children.push(node, newNode);
			this.root = newRoot;

			const splitSnapshot = this.snapshot();
			data.step(StepData.new(new SplitData(node.id, middleValue, node.id, newNode.id, startSnapshot, splitSnapshot)));

			newRoot.values.push(middleValue);
			data.step(StepData.new(new PromoteMiddleData(middleValue, newRoot.id, true, splitSnapshot, this.snapshot())));
			return newRoot;
		} else {
			// Insert new node as sibling first (without the middle value yet)
			const parentChildIndex = parent.children.indexOf(node);
			insertChild(parent, parentChildIndex + 1, newNode);

			const splitSnapshot = this.snapshot();
			data.step(StepData.new(new SplitData(node.id, middleValue, node.id, newNode.id, startSnapshot, splitSnapshot)));

			insertNonFull(parent, middleValue);
			data.step(StepData.new(new PromoteMiddleData(middleValue, parent.id, false, splitSnapshot, this.snapshot())));
			return parent;
		}
	}

	insert(value: number, data: OperationData): BTreeNode | null {
		// Empty tree
		if (!this.root) {
			const newNode = new BTreeNode(this.generateId(), true);
			const startSnapshot = this.snapshot();
			newNode.values.push(value);
			this.root = newNode;
			data.step(StepData.new(new CreateRootData(newNode.id, value, startSnapshot, this.snapshot())));
			return newNode;
		}

		// Check for duplicate
		const existing = this.find(value, OperationData.Ignored());
		if (existing) {
			data.step(StepData.new(new DropData(value, DROP_REASON_DUPLICATE_VALUE, existing.id.toString())));
			return existing;
		}

		// Insert and handle splits on the way back up
		this.insertAndSplit(this.root, null, value, data);
		return this.find(value, OperationData.Ignored());
	}

	private insertAndSplit(node: BTreeNode, parent: BTreeNode | null, value: number, data: OperationData): void {
		if (node.isLeaf) {
			// Insert into leaf node
			const startSnapshot = this.snapshot();
			insertNonFull(node, value);
			data.step(StepData.new(new InsertValueData(node.id, value, startSnapshot, this.snapshot())));

			// Check if node is now overfull
			if (node.values.length > this.order - 1) {
				this.splitNode(node, parent, data);
				// If parent is now overfull, it will be handled by the caller
				if (parent && parent.values.length > this.order - 1) {
					// This will be handled as we return up the recursion
				}
			}
		} else {
			// Find child to insert into
			let i = 0;
			while (i < node.values.length && value > node.values[i]) {
				i++;
			}

			const childId = node.children[i] ? node.children[i].id : -1;
			const lowerBound = i > 0 ? node.values[i - 1] : null;
			const upperBound = i < node.values.length ? node.values[i] : null;
			data.step(StepData.new(new ChooseBranchData(node.id, value, i, childId, lowerBound, upperBound)));

			// Recursively insert into child
			this.insertAndSplit(node.children[i], node, value, data);

			// After insertion, check if current node is overfull
			if (node.values.length > this.order - 1) {
				this.splitNode(node, parent, data);
			}
		}
	}

	remove(value: number, data: OperationData): boolean {
		if (!this.root) {
			data.step(StepData.new(new DropData(value, DROP_REASON_NOT_FOUND, 'root')));
			return false;
		}

		// Check if value exists
		const existing = this.find(value, OperationData.Ignored());
		if (!existing) {
			data.step(StepData.new(new DropData(value, DROP_REASON_NOT_FOUND, DROP_REASON_UNKNOWN)));
			return false;
		}

		data.step(StepData.new(new MarkToDeleteData(existing.id, value)));

		this.removeFromNode(this.root, value, data);

		// If root is empty after deletion, make its only child the new root
		if (this.root.values.length === 0) {
			if (!this.root.isLeaf && this.root.children.length > 0) {
				this.root = this.root.children[0];
			} else {
				this.root = null;
			}
		}

		return true;
	}

	private removeFromNode(node: BTreeNode, value: number, data: OperationData): void {
		const t = Math.ceil(this.order / 2);
		let idx = 0;

		// Find the index of the value or the child where it might be
		while (idx < node.values.length && value > node.values[idx]) {
			idx++;
		}

		// Case 1: Value is in this node and it's a leaf
		if (idx < node.values.length && value === node.values[idx] && node.isLeaf) {
			data.step(StepData.new(new CaseAnalysisData(1, BTREE_VALUE_IN_LEAF_NODE, node.id)));
			const startSnapshot = this.snapshot();
			removeAt(node, idx);
			data.step(StepData.new(new RemoveValueData(node.id, value, startSnapshot, this.snapshot())));
			return;
		}

		// Case 2: Value is in this node and it's an internal node
		if (idx < node.values.length && value === node.values[idx]) {
			data.step(StepData.new(new CaseAnalysisData(2, BTREE_VALUE_IN_INTERNAL_NODE, node.id)));
			this.removeFromNonLeaf(node, idx, data);
			return;
		}

		// Case 3: Value is not in this node
		if (node.isLeaf) {
			// Value doesn't exist
			return;
		}

		// Check if we need to fix the child before descending
		const isInLastChild = idx === node.values.length;
		if (node.children[idx].values.length < t) {
			this.fillChild(node, idx, data);
		}

		// After filling, the value might have moved
		if (isInLastChild && idx > node.values.length) {
			idx--;
		}

		this.removeFromNode(node.children[idx], value, data);
	}

	private removeFromNonLeaf(node: BTreeNode, idx: number, data: OperationData): void {
		const t = Math.ceil(this.order / 2);
		const value = node.values[idx];

		// Case 2a: Left child has at least t keys
		if (node.children[idx].values.length >= t) {
			data.step(StepData.new(new CaseAnalysisData(21, BTREE_GET_PREDECESSOR, node.children[idx].id)));
			const predecessor = this.getPredecessor(node.children[idx]);
			data.step(StepData.new(new FindInorderReplacementData(node.id, node.children[idx].id, predecessor, 'predecessor')));
			const startSnapshot = this.snapshot();
			node.values[idx] = predecessor;
			data.step(StepData.new(new ReplaceValueData(node.id, value, predecessor, 'predecessor', startSnapshot, this.snapshot())));
			this.removeFromNode(node.children[idx], predecessor, OperationData.Ignored());
		}
		// Case 2b: Right child has at least t keys
		else if (node.children[idx + 1].values.length >= t) {
			data.step(StepData.new(new CaseAnalysisData(22, BTREE_GET_SUCCESSOR, node.children[idx + 1].id)));
			const successor = this.getSuccessor(node.children[idx + 1]);
			data.step(StepData.new(new FindInorderReplacementData(node.id, node.children[idx + 1].id, successor, 'successor')));
			const startSnapshot = this.snapshot();
			node.values[idx] = successor;
			data.step(StepData.new(new ReplaceValueData(node.id, value, successor, 'successor', startSnapshot, this.snapshot())));
			this.removeFromNode(node.children[idx + 1], successor, OperationData.Ignored());
		}
		// Case 2c: Both children have t-1 keys, merge
		else {
			data.step(StepData.new(new CaseAnalysisData(23, BTREE_MERGE_CHILDREN, node.id)));
			this.mergeChildren(node, idx, data, false);
			this.removeFromNode(node.children[idx], value, data);
		}
	}

	private getPredecessor(node: BTreeNode): number {
		// Get the rightmost value in the subtree
		while (!node.isLeaf) {
			node = node.children[node.children.length - 1];
		}
		return node.values[node.values.length - 1];
	}

	private getSuccessor(node: BTreeNode): number {
		// Get the leftmost value in the subtree
		while (!node.isLeaf) {
			node = node.children[0];
		}
		return node.values[0];
	}

	private fillChild(node: BTreeNode, idx: number, data: OperationData): void {
		const t = Math.ceil(this.order / 2);

		// Borrow from left sibling
		if (idx !== 0 && node.children[idx - 1].values.length >= t) {
			data.step(StepData.new(new CaseAnalysisData(31, BTREE_BORROW_FROM_LEFT_SIBLING, node.children[idx].id)));
			this.borrowFromLeft(node, idx, data);
		}
		// Borrow from right sibling
		else if (idx !== node.children.length - 1 && node.children[idx + 1].values.length >= t) {
			data.step(StepData.new(new CaseAnalysisData(32, BTREE_BORROW_FROM_RIGHT_SIBLING, node.children[idx].id)));
			this.borrowFromRight(node, idx, data);
		}
		// Merge with sibling
		else {
			data.step(StepData.new(new CaseAnalysisData(33, BTREE_MERGE_WITH_SIBLING, node.children[idx].id)));
			if (idx !== node.children.length - 1) {
				this.mergeChildren(node, idx, data);
			} else {
				this.mergeChildren(node, idx - 1, data);
			}
		}
	}

	private borrowFromLeft(node: BTreeNode, childIdx: number, data: OperationData): void {
		const child = node.children[childIdx];
		const sibling = node.children[childIdx - 1];
		const borrowedValue = sibling.values[sibling.values.length - 1];
		const parentValue = node.values[childIdx - 1];
		const startSnapshot = this.snapshot();

		// Move a value from parent to child
		child.values.unshift(node.values[childIdx - 1]);

		// Move a value from sibling to parent
		node.values[childIdx - 1] = sibling.values.pop()!;

		// Move child pointer if not leaf
		if (!child.isLeaf) {
			child.children.unshift(sibling.children.pop()!);
		}

		data.step(StepData.new(new BorrowFromLeftData(child.id, sibling.id, borrowedValue, parentValue, startSnapshot, this.snapshot())));
	}

	private borrowFromRight(node: BTreeNode, childIdx: number, data: OperationData): void {
		const child = node.children[childIdx];
		const sibling = node.children[childIdx + 1];
		const borrowedValue = sibling.values[0];
		const parentValue = node.values[childIdx];
		const startSnapshot = this.snapshot();

		// Move a value from parent to child
		child.values.push(node.values[childIdx]);

		// Move a value from sibling to parent
		node.values[childIdx] = sibling.values.shift()!;

		// Move child pointer if not leaf
		if (!child.isLeaf) {
			child.children.push(sibling.children.shift()!);
		}

		data.step(StepData.new(new BorrowFromRightData(child.id, sibling.id, borrowedValue, parentValue, startSnapshot, this.snapshot())));
	}

	private mergeChildren(node: BTreeNode, idx: number, data: OperationData, keepParent: boolean = true): void {
		const child = node.children[idx];
		const sibling = node.children[idx + 1];
		const parentValue = node.values[idx];
		let startSnapshot = this.snapshot();

		// Pull value from parent and merge with right sibling
		if (keepParent) {
			child.values.push(parentValue);
		} else {
			removeAt(node, idx);
			data.step(StepData.new(new RemoveValueData(node.id, parentValue, startSnapshot, this.snapshot())));
			startSnapshot = this.snapshot();
		}
		child.values.push(...sibling.values);

		// Copy child pointers
		if (!child.isLeaf) {
			child.children.push(...sibling.children);
		}

		// Remove the value from parent
		if (keepParent) {
			removeAt(node, idx);
		}

		// Remove the sibling
		removeChild(node, idx + 1);

		data.step(
			StepData.new(new MergeChildrenData(child.id, sibling.id, keepParent ? parentValue : null, startSnapshot, this.snapshot())),
		);
	}
}
