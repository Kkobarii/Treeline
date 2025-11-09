import { OperationData } from '$lib/operation/operationData';
import { Step } from '$lib/operation/stepData';
import { deepCopy } from '$lib/utils/utils';
import { DataNode, DataStructure, OperationType, type OperationTypeValue } from './dataStructure';

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
			case OperationType.BSTree.Insert:
				this.insert(value as number, data);
				break;
			case OperationType.BSTree.Remove:
				this.remove(value as number, data);
				break;
			case OperationType.BSTree.Find:
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
			data.step(Step.BSTree.CreateRoot(newNode.id, value, startSnapshot, this.snapshot()));
			return newNode;
		}

		let current = this.root;
		while (true) {
			data.step(Step.BSTree.Compare(value, current.id, current.value));
			if (value < current.value) {
				if (!current.left) {
					let startSnapshot = this.snapshot();
					data.step(Step.BSTree.CreateLeaf(newNode.id, value, current.id, 'left', startSnapshot, this.snapshot()));
					current.left = newNode;
					break;
				}

				data.step(Step.BSTree.Traverse(current.id, current.left.id, 'left'));
				current = current.left;
			} else if (value > current.value) {
				if (!current.right) {
					let startSnapshot = this.snapshot();
					data.step(Step.BSTree.CreateLeaf(newNode.id, value, current.id, 'right', startSnapshot, this.snapshot()));
					current.right = newNode;
					break;
				}

				data.step(Step.BSTree.Traverse(current.id, current.right.id, 'right'));
				current = current.right;
			} else {
				data.step(Step.BSTree.Drop(value, 'duplicate value', current.id.toString()));
				break;
			}
		}
		return newNode;
	}

	find(value: number, data: OperationData): BSTreeNode | null {
		let current = this.root;
		let last = current?.id.toString();

		while (current) {
			data.step(Step.BSTree.Compare(value, current.id, current.value));
			if (value === current.value) {
				data.step(Step.BSTree.Found(current.id, value));
				return current;
			} else if (value < current.value) {
				data.step(Step.BSTree.Traverse(current.id, current.left ? current.left.id : -1, 'left'));
				last = current.left?.id.toString() ?? `dummy-${current.id}-L`;
				current = current.left;
			} else {
				data.step(Step.BSTree.Traverse(current.id, current.right ? current.right.id : -1, 'right'));
				last = current.right?.id.toString() ?? `dummy-${current.id}-R`;
				current = current.right;
			}
		}

		data.step(Step.BSTree.Drop(value, 'not found', last!));
		return null;
	}

	remove(value: number, data: OperationData): boolean {
		if (!this.root) {
			data.step(Step.BSTree.Drop(value, 'not found', 'root'));
			return false;
		}

		let current: BSTreeNode | null = this.root;
		let parent: BSTreeNode | null = null;
		let last = current ? current.id.toString() : 'root';

		// descend to the node to delete
		while (current) {
			data.step(Step.BSTree.Compare(value, current.id, current.value));
			if (value < current.value) {
				data.step(Step.BSTree.Traverse(current.id, current.left ? current.left.id : -1, 'left'));
				last = current.left?.id.toString() ?? `dummy-${current.id}-L`;
				parent = current;
				current = current.left;
			} else if (value > current.value) {
				data.step(Step.BSTree.Traverse(current.id, current.right ? current.right.id : -1, 'right'));
				last = current.right?.id.toString() ?? `dummy-${current.id}-R`;
				parent = current;
				current = current.right;
			} else {
				break; // found
			}
		}

		if (!current) {
			data.step(Step.BSTree.Drop(value, 'not found', last));
			return false;
		}

		// mark for deletion
		data.step(Step.BSTree.MarkToDelete(current.id, value));

		// Case 1: leaf
		if (!current.left && !current.right) {
			let startSnapshot = this.snapshot();
			if (!parent) {
				this.root = null;
			} else if (parent.left && parent.left.id === current.id) {
				parent.left = null;
			} else {
				parent.right = null;
			}
			data.step(Step.BSTree.Delete(current.id, value, startSnapshot, this.snapshot()));
			return true;
		}

		// Case 2: single child -> replace with child
		if (!current.left || !current.right) {
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
				Step.BSTree.ReplaceWithChild(
					current.id,
					child.id,
					child.value,
					current.left ? 'left' : 'right',
					startSnapshot,
					this.snapshot(),
				),
			);
			return true;
		}

		// Case 3: two children -> find inorder successor iteratively
		let succParent: BSTreeNode = current;
		let successor: BSTreeNode = current.right!;
		while (successor.left) {
			succParent = successor;
			successor = successor.left;
		}

		data.step(Step.BSTree.FoundInorderSuccessor(current.id, successor.id, successor.value));

		if (succParent !== current && successor.right) {
			let startSnapshot = this.snapshot();
			succParent.left = successor.right;
			data.step(
				Step.BSTree.RelinkSuccessorChild(
					successor.right!.id,
					successor.right!.value,
					succParent.id,
					succParent.value,
					successor.id,
					startSnapshot,
					this.snapshot(),
				),
			);
		}

		let startSnapshot = this.snapshot();
		if (current.right === successor) {
			current.right = successor.right;
		}

		current.value = successor.value;
		data.step(Step.BSTree.ReplaceWithInorderSuccessor(current.id, successor.id, successor.value, startSnapshot, this.snapshot()));
		current.id = successor.id;

		return true;
	}
}
