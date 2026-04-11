import { OperationData, StepData } from '$lib/data-structures/operations/operationData';
import {
	CASE_LEAF_NODE,
	CASE_SINGLE_CHILD,
	CASE_TWO_CHILDREN,
	DIRECTION_LEFT,
	DIRECTION_RIGHT,
	DROP_REASON_DUPLICATE_VALUE,
	DROP_REASON_NOT_FOUND,
} from '$lib/data-structures/operations/stepConstants';
import {
	CaseAnalysisData,
	CompareData,
	CreateLeafData,
	CreateRootData,
	DeleteData,
	DropData,
	FoundData,
	FoundInorderSuccessorData,
	MarkToDeleteData,
	RelinkSuccessorChildData,
	ReplaceWithChildData,
	ReplaceWithInorderSuccessorData,
	TraverseData,
} from '$lib/data-structures/operations/stepData';
import { getDummyNodeId } from '$lib/data-structures/utils/graphs';
import { deepCopy } from '$lib/data-structures/utils/utils';

import { DataNode, DataStructure, OperationType, type OperationTypeValue } from '../dataStructure';

export class BSTreeNode extends DataNode {
	value: number;
	left: BSTreeNode | null = null;
	right: BSTreeNode | null = null;

	constructor(id: number, value: number) {
		super(id);
		this.value = value;
	}
}

export class BSTree extends DataStructure {
	root: BSTreeNode | null = null;

	snapshot(): BSTree {
		return Object.assign(new BSTree(), deepCopy(this));
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
				throw new Error(`Operation type ${type} not supported for BSTree.`);
		}
	}

	insert(value: number, data: OperationData): BSTreeNode | null {
		const newNode = new BSTreeNode(this.generateId(), value);

		if (!this.root) {
			let startSnapshot = this.snapshot();
			this.root = newNode;
			data.step(StepData.new(new CreateRootData(newNode.id, value, startSnapshot, this.snapshot())));
			return newNode;
		}

		let current = this.root;
		while (true) {
			data.step(StepData.new(new CompareData(value, current.id, current.value)));
			if (value < current.value) {
				if (!current.left) {
					let startSnapshot = this.snapshot();
					current.left = newNode;
					data.step(
						StepData.new(new CreateLeafData(newNode.id, value, current.id, DIRECTION_LEFT, startSnapshot, this.snapshot())),
					);
					break;
				}

				data.step(StepData.new(new TraverseData(current.id, current.left.id, DIRECTION_LEFT)));
				current = current.left;
			} else if (value > current.value) {
				if (!current.right) {
					let startSnapshot = this.snapshot();
					current.right = newNode;
					data.step(
						StepData.new(new CreateLeafData(newNode.id, value, current.id, DIRECTION_RIGHT, startSnapshot, this.snapshot())),
					);
					break;
				}

				data.step(StepData.new(new TraverseData(current.id, current.right.id, DIRECTION_RIGHT)));
				current = current.right;
			} else {
				data.step(StepData.new(new DropData(value, DROP_REASON_DUPLICATE_VALUE, current.id.toString())));
				break;
			}
		}

		return newNode;
	}

	find(value: number, data: OperationData): BSTreeNode | null {
		let current = this.root;
		let last = current?.id.toString();

		while (current) {
			data.step(StepData.new(new CompareData(value, current.id, current.value)));
			if (value === current.value) {
				data.step(StepData.new(new FoundData(current.id, value)));
				return current;
			} else if (value < current.value) {
				data.step(StepData.new(new TraverseData(current.id, current.left ? current.left.id : -1, DIRECTION_LEFT)));
				last = current.left?.id.toString() ?? getDummyNodeId(current.id, 'left');
				current = current.left;
			} else {
				data.step(StepData.new(new TraverseData(current.id, current.right ? current.right.id : -1, DIRECTION_RIGHT)));
				last = current.right?.id.toString() ?? getDummyNodeId(current.id, 'right');
				current = current.right;
			}
		}

		data.step(StepData.new(new DropData(value, DROP_REASON_NOT_FOUND, last!)));
		return null;
	}

	remove(value: number, data: OperationData): boolean {
		if (!this.root) {
			data.step(StepData.new(new DropData(value, DROP_REASON_NOT_FOUND, 'root')));
			return false;
		}

		let current: BSTreeNode | null = this.root;
		let parent: BSTreeNode | null = null;
		let last = current ? current.id.toString() : 'root';

		while (current) {
			data.step(StepData.new(new CompareData(value, current.id, current.value)));
			if (value < current.value) {
				data.step(StepData.new(new TraverseData(current.id, current.left ? current.left.id : -1, DIRECTION_LEFT)));
				last = current.left?.id.toString() ?? getDummyNodeId(current.id, 'left');
				parent = current;
				current = current.left;
			} else if (value > current.value) {
				data.step(StepData.new(new TraverseData(current.id, current.right ? current.right.id : -1, DIRECTION_RIGHT)));
				last = current.right?.id.toString() ?? getDummyNodeId(current.id, 'right');
				parent = current;
				current = current.right;
			} else {
				break;
			}
		}

		if (!current) {
			data.step(StepData.new(new DropData(value, DROP_REASON_NOT_FOUND, last)));
			return false;
		}

		data.step(StepData.new(new MarkToDeleteData(current.id, value)));

		if (!current.left && !current.right) {
			data.step(StepData.new(new CaseAnalysisData(1, CASE_LEAF_NODE, current.id)));

			let startSnapshot = this.snapshot();
			if (!parent) {
				this.root = null;
			} else if (parent.left && parent.left.id === current.id) {
				parent.left = null;
			} else {
				parent.right = null;
			}
			data.step(StepData.new(new DeleteData(current.id, value, startSnapshot, this.snapshot())));
			return true;
		}

		if (!current.left || !current.right) {
			data.step(StepData.new(new CaseAnalysisData(2, CASE_SINGLE_CHILD, current.id)));

			const child = current.left ? current.left : current.right!;
			let startSnapshot = this.snapshot();
			if (!parent) {
				this.root = child;
			} else if (parent.left && parent.left.id === current.id) {
				parent.left = child;
			} else {
				parent.right = child;
			}
			data.step(
				StepData.new(
					new ReplaceWithChildData(
						current.id,
						child.id,
						child.value,
						current.left ? DIRECTION_LEFT : DIRECTION_RIGHT,
						startSnapshot,
						this.snapshot(),
					),
				),
			);
			return true;
		}

		data.step(StepData.new(new CaseAnalysisData(3, CASE_TWO_CHILDREN, current.id)));

		let succParent: BSTreeNode = current;
		let successor: BSTreeNode = current.right!;
		while (successor.left) {
			succParent = successor;
			successor = successor.left;
		}

		data.step(StepData.new(new FoundInorderSuccessorData(current.id, successor.id, successor.value)));

		let relinkedChildId = null;
		if (succParent !== current && successor.right) {
			let startSnapshot2 = this.snapshot();
			succParent.left = successor.right;
			data.step(
				StepData.new(
					new RelinkSuccessorChildData(
						successor.right!.id,
						successor.right!.value,
						succParent.id,
						succParent.value,
						successor.id,
						successor.value,
						startSnapshot2,
						this.snapshot(),
					),
				),
			);

			relinkedChildId = successor.right!.id;
		}

		let startSnapshot = this.snapshot();
		if (succParent !== current && !successor.right) {
			succParent.left = null;
		}

		if (current.right === successor) {
			current.right = successor.right;
		}

		current.value = successor.value;
		const prevCurrentId = current.id;
		current.id = successor.id;
		data.step(
			StepData.new(
				new ReplaceWithInorderSuccessorData(
					prevCurrentId,
					successor.id,
					successor.value,
					succParent.id,
					relinkedChildId,
					startSnapshot,
					this.snapshot(),
				),
			),
		);

		return true;
	}
}
