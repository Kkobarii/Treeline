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
} from '$lib/data-structures/operations/stepConstants';
import { deepCopy } from '$lib/data-structures/utils/utils';

import { CaseAnalysisData, CreateRootData, DropData, FoundData, MarkToDeleteData } from '../../operations/stepData';
import { DataNode, DataStructure, OperationType, type OperationTypeValue } from '../dataStructure';
import { insertChild, insertNonFull, removeAt, removeChild } from './bTreeNodeUtils';
import {
	BorrowFromSiblingData,
	ChooseBranchData,
	CollapseRootData,
	FindInorderReplacementData,
	InsertValueData,
	MarkOverfullData,
	MarkUnderfullData,
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

export type TranslationPair = { oldId: number; newId: number };
export type IdTranslationMap = Array<TranslationPair>;

export class BTree extends DataStructure {
	root: BTreeNode | null = null;
	order: number;

	constructor(order: number = 5) {
		super();
		if (order < 3) {
			throw new Error('B-Tree order must be at least 3');
		}
		this.order = order;
	}

	recalculateIds(): IdTranslationMap {
		const translationMap: IdTranslationMap = [];
		let currentId = 0;
		const assignPostorderIds = (node: BTreeNode | null): void => {
			if (!node) return;
			for (const child of node.children) {
				assignPostorderIds(child);
			}
			translationMap.push({ oldId: node.id, newId: currentId });
			node.id = currentId;
			currentId++;
		};
		assignPostorderIds(this.root);
		this.currentId = currentId;
		return translationMap;
	}

	// private captureTranslation(start: BTree): IdTranslationMap {
	// 	const translationMap: IdTranslationMap = [];
	// 	const mapNodeIds = (node: BTreeNode | null, startTree: BTree): void => {
	// 		if (!node) return;
	// 		const startNode = this.findNodeByValues(start.root, node.values, node.isLeaf);
	// 		if (startNode && startNode.id !== node.id) {
	// 			translationMap.push({ oldId: startNode.id, newId: node.id });
	// 		}
	// 		if (!node.isLeaf) {
	// 			for (const child of node.children) {
	// 				mapNodeIds(child, start);
	// 			}
	// 		}
	// 	};
	// 	mapNodeIds(this.root, start);
	// 	return Object.keys(translationMap).length > 0 ? translationMap : {};
	// }

	private findNodeByValues(node: BTreeNode | null, values: number[], isLeaf: boolean): BTreeNode | null {
		if (!node) return null;
		if (node.isLeaf === isLeaf && node.values.length === values.length && node.values.every((v, i) => v === values[i])) {
			return node;
		}
		for (const child of node.children) {
			const found = this.findNodeByValues(child, values, isLeaf);
			if (found) return found;
		}
		return null;
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

		data.step(StepData.new(new DropData(value, DROP_REASON_NOT_FOUND, current['id'])));
		return null;
	}

	// Split an overfull node (after insertion)
	private splitNode(node: BTreeNode, parent: BTreeNode | null, data: OperationData): BTreeNode {
		const t = Math.ceil(this.order / 2);
		const midIndex = t - 1;

		const startSnapshot = this.snapshot();
		const startId = node.id;

		data.step(StepData.new(new MarkOverfullData(node.id, node.values.length, this.order - 1)));

		// Create new node for the second half
		const newNode = new BTreeNode(node.id, node.isLeaf);

		// Move the second half of values to new node
		newNode.values = node.values.splice(midIndex + 1);

		// Get the middle value
		const middleValue = removeAt(node, midIndex);

		// Move the second half of children if not a leaf
		if (!node.isLeaf) {
			newNode.children = node.children.splice(t);
		}

		if (!parent) {
			const newRoot = new BTreeNode(startId, false);
			newRoot.children.push(node, newNode);
			this.root = newRoot;

			const translationMap = this.recalculateIds();
			const splitSnapshot = this.snapshot();

			data.step(StepData.new(new SplitData(startId, middleValue, node.id, newNode.id, translationMap, startSnapshot, splitSnapshot)));

			newRoot.values.push(middleValue);
			data.step(
				StepData.new(new PromoteMiddleData(middleValue, newRoot.id, node.id, newNode.id, true, splitSnapshot, this.snapshot())),
			);
			return newRoot;
		} else {
			const parentChildIndex = parent.children.indexOf(node);
			insertChild(parent, parentChildIndex + 1, newNode);

			const translationMap = this.recalculateIds();
			const splitSnapshot = this.snapshot();
			data.step(StepData.new(new SplitData(startId, middleValue, node.id, newNode.id, translationMap, startSnapshot, splitSnapshot)));

			insertNonFull(parent, middleValue);
			data.step(
				StepData.new(new PromoteMiddleData(middleValue, parent.id, node.id, newNode.id, false, splitSnapshot, this.snapshot())),
			);
			return parent;
		}
	}

	insert(value: number, data: OperationData): BTreeNode | null {
		if (!this.root) {
			const newNode = new BTreeNode(0, true);
			this.currentId = 1;
			const startSnapshot = this.snapshot();
			newNode.values.push(value);
			this.root = newNode;
			data.step(StepData.new(new CreateRootData(newNode.id, value, startSnapshot, this.snapshot())));
			return newNode;
		}

		this.insertAndSplit(this.root, null, value, data);
		return null;
	}

	private insertAndSplit(node: BTreeNode, parent: BTreeNode | null, value: number, data: OperationData): void {
		if (node.values.includes(value)) {
			data.step(StepData.new(new DropData(value, DROP_REASON_DUPLICATE_VALUE, node.id.toString())));
			return;
		}
		if (node.isLeaf) {
			const startSnapshot = this.snapshot();
			insertNonFull(node, value);
			data.step(StepData.new(new InsertValueData(node.id, value, startSnapshot, this.snapshot())));

			if (node.values.length > this.order - 1) {
				this.splitNode(node, parent, data);
				if (parent && parent.values.length > this.order - 1) {
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

		this.removeFromNode(this.root, null, value, data);

		if (this.root.values.length === 0) {
			if (!this.root.isLeaf && this.root.children.length > 0) {
				this.root = this.root.children[0];
			} else {
				this.root = null;
			}
		}

		return true;
	}

	private removeFromNode(
		node: BTreeNode,
		parent: BTreeNode | null,
		value: number,
		data: OperationData,
		ignoreUntilFix: boolean = false,
	): void {
		const t = Math.floor(this.order / 2);
		let idx = 0;

		// Find the index of the value or the child where it might be
		while (idx < node.values.length && value > node.values[idx]) {
			idx++;
		}

		// Value is in this node
		if (idx < node.values.length && value === node.values[idx]) {
			if (!ignoreUntilFix) data.step(StepData.new(new MarkToDeleteData(node.id, value)));
			if (node.isLeaf) {
				// Case 1: Value is in this node and it's a leaf
				if (!ignoreUntilFix) data.step(StepData.new(new CaseAnalysisData(1, BTREE_VALUE_IN_LEAF_NODE, node.id)));
				const startSnapshot = this.snapshot();
				removeAt(node, idx);
				if (!ignoreUntilFix) data.step(StepData.new(new RemoveValueData(node.id, value, startSnapshot, this.snapshot())));

				if (parent && node.values.length < t) {
					const parentIdx = parent.children.indexOf(node);
					if (parentIdx !== -1) {
						this.fillChild(parent, parentIdx, data);
					}
				}
				return;
			} else {
				// Case 2: Value is in this node and it's an internal node
				if (!ignoreUntilFix) data.step(StepData.new(new CaseAnalysisData(2, BTREE_VALUE_IN_INTERNAL_NODE, node.id)));
				this.removeFromNonLeaf(node, idx, data);
				return;
			}
		}

		// Case 3: Value is not in this node
		if (node.isLeaf) {
			if (!ignoreUntilFix) data.step(StepData.new(new DropData(value, DROP_REASON_NOT_FOUND, node.id.toString())));
			return;
		}

		const childId = node.children[idx] ? node.children[idx].id : -1;
		const lowerBound = idx > 0 ? node.values[idx - 1] : null;
		const upperBound = idx < node.values.length ? node.values[idx] : null;
		if (!ignoreUntilFix) data.step(StepData.new(new ChooseBranchData(node.id, value, idx, childId, lowerBound, upperBound)));

		this.removeFromNode(node.children[idx], node, value, data, ignoreUntilFix);
	}

	private removeFromNonLeaf(node: BTreeNode, idx: number, data: OperationData): void {
		const t = Math.ceil(this.order / 2);
		const value = node.values[idx];

		// Case 2a: Left child has at least t keys
		if (node.children[idx].values.length >= t) {
			data.step(StepData.new(new CaseAnalysisData(2.1, BTREE_GET_PREDECESSOR, node.children[idx].id)));
			const predecessor = this.getPredecessor(node.children[idx]);
			data.step(StepData.new(new FindInorderReplacementData(node.id, predecessor.node.id, predecessor.value, 'predecessor')));
			const startSnapshot = this.snapshot();

			node.values[idx] = predecessor.value;
			const valuesArray = deepCopy(predecessor.node.values);
			predecessor.node.values.pop();
			data.step(
				StepData.new(
					new ReplaceValueData(
						node.id,
						value,
						predecessor.value,
						predecessor.node.id,
						'predecessor',
						startSnapshot,
						this.snapshot(),
					),
				),
			);

			predecessor.node.values = valuesArray;
			this.removeFromNode(node.children[idx], node, predecessor.value, data, true);
		}
		// Case 2b: Right child has at least t keys
		else if (node.children[idx + 1].values.length >= t) {
			data.step(StepData.new(new CaseAnalysisData(2.2, BTREE_GET_SUCCESSOR, node.children[idx + 1].id)));
			const successor = this.getSuccessor(node.children[idx + 1]);
			data.step(StepData.new(new FindInorderReplacementData(node.id, successor.node.id, successor.value, 'successor')));
			const startSnapshot = this.snapshot();

			node.values[idx] = successor.value;
			const valuesArray = deepCopy(successor.node.values);
			successor.node.values.shift();
			data.step(
				StepData.new(
					new ReplaceValueData(node.id, value, successor.value, successor.node.id, 'successor', startSnapshot, this.snapshot()),
				),
			);

			successor.node.values = valuesArray;
			this.removeFromNode(node.children[idx + 1], node, successor.value, data, true);
		}
		// Case 2c: Both children have t-1 keys, merge
		else {
			data.step(StepData.new(new CaseAnalysisData(2.3, BTREE_MERGE_CHILDREN, node.id)));
			this.mergeChildren(node, idx, data, false);
			// this.removeFromNode(node.children[idx], node, value, OperationData.Ignored());
		}
	}

	private getPredecessor(node: BTreeNode): { node: BTreeNode; value: number } {
		// Get the rightmost value in the subtree
		while (!node.isLeaf) {
			node = node.children[node.children.length - 1];
		}
		return { node, value: node.values[node.values.length - 1] };
	}

	private getSuccessor(node: BTreeNode): { node: BTreeNode; value: number } {
		// Get the leftmost value in the subtree
		while (!node.isLeaf) {
			node = node.children[0];
		}
		return { node, value: node.values[0] };
	}

	private fillChild(node: BTreeNode, idx: number, data: OperationData): void {
		const t = Math.ceil(this.order / 2);

		// Borrow from left sibling
		if (idx !== 0 && node.children[idx - 1].values.length >= t) {
			data.step(StepData.new(new CaseAnalysisData(3.1, BTREE_BORROW_FROM_LEFT_SIBLING, node.children[idx].id)));
			this.borrowFromLeft(node, idx, data);
		}
		// Borrow from right sibling
		else if (idx !== node.children.length - 1 && node.children[idx + 1].values.length >= t) {
			data.step(StepData.new(new CaseAnalysisData(3.2, BTREE_BORROW_FROM_RIGHT_SIBLING, node.children[idx].id)));
			this.borrowFromRight(node, idx, data);
		}
		// Merge with sibling
		else {
			data.step(StepData.new(new CaseAnalysisData(3.3, BTREE_MERGE_WITH_SIBLING, node.children[idx].id)));
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

		data.step(
			StepData.new(
				new BorrowFromSiblingData(
					child.id,
					sibling.id,
					node.id,
					borrowedValue,
					parentValue,
					'left',
					startSnapshot,
					this.snapshot(),
				),
			),
		);
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

		data.step(
			StepData.new(
				new BorrowFromSiblingData(
					child.id,
					sibling.id,
					node.id,
					borrowedValue,
					parentValue,
					'right',
					startSnapshot,
					this.snapshot(),
				),
			),
		);
	}

	private mergeChildren(node: BTreeNode, idx: number, data: OperationData, keepParent: boolean = true): void {
		const child = node.children[idx];
		const sibling = node.children[idx + 1];
		const parentValue = node.values[idx];
		const startChildId = child.id;
		const startSiblingId = sibling.id;
		let startSnapshot = this.snapshot();

		if (keepParent) {
			child.values.push(parentValue);
		} else {
			removeAt(node, idx);
			data.step(StepData.new(new RemoveValueData(node.id, parentValue, startSnapshot, this.snapshot())));
			startSnapshot = this.snapshot();
		}
		child.values.push(...sibling.values);

		if (!child.isLeaf) {
			child.children.push(...sibling.children);
		}

		if (keepParent) {
			removeAt(node, idx);
		}

		removeChild(node, idx + 1);
		const originalParentId = node.id;

		const translationMap = this.recalculateIds();
		translationMap.push({ oldId: sibling.id, newId: child.id });
		data.step(
			StepData.new(
				new MergeChildrenData(
					child.id,
					node.id,
					startChildId,
					startSiblingId,
					originalParentId,
					keepParent ? parentValue : null,
					translationMap,
					startSnapshot,
					this.snapshot(),
				),
			),
		);

		// if parent is now underfull, we either need to call merge on it or borrow if possible
		if (node.values.length < Math.ceil(this.order / 2) - 1) {
			if (node === this.root) {
				if (node.values.length === 0) {
					let startSnapshot = this.snapshot();
					this.root = child;
					data.step(StepData.new(new CollapseRootData(node.id, child.id, startSnapshot, this.snapshot())));
				}
			} else {
				data.step(StepData.new(new MarkUnderfullData(node.id, node.values.length, Math.ceil(this.order / 2) - 1)));
				const parent = this.findParent(this.root, node);
				if (parent) {
					const parentIdx = parent.children.indexOf(node);
					this.fillChild(parent, parentIdx, data);
				}
			}
		}
	}

	private findParent(current: BTreeNode | null, target: BTreeNode): BTreeNode | null {
		if (!current || current.isLeaf) return null;
		for (const child of current.children) {
			if (child === target) {
				return current;
			}
			const found = this.findParent(child, target);
			if (found) return found;
		}
		return null;
	}
}
