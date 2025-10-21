import { OperationData } from '$lib/operation/operationData';
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
		}
	}

	insert(value: number, data: OperationData): BSTreeNode | null {
		const newNode = new BSTreeNode(this.generateId(), value);

		if (!this.root) {
			data.addStep(`Inserting ${value} as root node.`);
			this.root = newNode;
			return newNode;
		}

		let current = this.root;
		while (true) {
			data.addStep(`Comparing ${value} with ${current.value}.`);
			if (value < current.value) {
				data.addStep(`Going left from ${current.value}.`);
				if (!current.left) {
					data.addStep(`Inserting ${value} to the left of ${current.value}.`);
					current.left = newNode;
					break;
				}
				current = current.left;
			} else {
				data.addStep(`Going right from ${current.value}.`);
				if (!current.right) {
					data.addStep(`Inserting ${value} to the right of ${current.value}.`);
					current.right = newNode;
					break;
				}
				current = current.right;
			}
		}
		return newNode;
	}

	find(value: number, data: OperationData): BSTreeNode | null {
		let current = this.root;

		while (current) {
			data.addStep(`Comparing ${value} with ${current.value}.`);
			if (value === current.value) {
				data.addStep(`Found ${value} in the tree.`);
				return current;
			} else if (value < current.value) {
				data.addStep(`Going left from ${current.value}.`);
				current = current.left;
			} else {
				data.addStep(`Going right from ${current.value}.`);
				current = current.right;
			}
		}

		data.addStep(`${value} not found in the tree.`);
		return null;
	}

	remove(value: number, data: OperationData): boolean {
		const deleteRecursively = (node: BSTreeNode | null, value: number): BSTreeNode | null => {
			if (!node) {
				data.addStep(`${value} not found in the tree.`);
				return null;
			}
			data.addStep(`Comparing ${value} with ${node.value}.`);
			if (value < node.value) {
				data.addStep(`Going left from ${node.value}.`);
				node.left = deleteRecursively(node.left, value);
			} else if (value > node.value) {
				data.addStep(`Going right from ${node.value}.`);
				node.right = deleteRecursively(node.right, value);
			} else {
				data.addStep(`Found ${value}, deleting...`);
				if (!node.left && !node.right) {
					data.addStep(`Deleting leaf node ${value}.`);
					return null;
				}
				if (!node.left) {
					data.addStep(`Replacing ${value} with right child.`);
					return node.right;
				}
				if (!node.right) {
					data.addStep(`Replacing ${value} with left child.`);
					return node.left;
				}
				let temp = node.right;
				while (temp.left) temp = temp.left;
				data.addStep(`Replacing ${value} with inorder successor ${temp.value}.`);
				node.value = temp.value;
				node.right = deleteRecursively(node.right, temp.value);
			}
			return node;
		};
		this.root = deleteRecursively(this.root, value);
		return true;
	}
}
