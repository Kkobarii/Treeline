import { OperationData } from '$lib/operation/operationData';
import { deepCopy } from '$lib/utils/utils';
import { Tree, TreeNode } from './generic';

export class BinaryTreeNode extends TreeNode {
	value: number;
	left: BinaryTreeNode | null = null;
	right: BinaryTreeNode | null = null;

	constructor(id: number, value: number) {
		super(id);
		this.value = value;
	}
}

export class BinaryTree extends Tree {
	root: BinaryTreeNode | null = null;

	snapshot(): BinaryTree {
		return Object.assign(new BinaryTree(), deepCopy(this));
	}

	insert_node(value: number, data: OperationData): BinaryTreeNode | null {
		const newNode = new BinaryTreeNode(this.generateId(), value);

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

	find_node(value: number, data: OperationData): BinaryTreeNode | null {
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

	remove_node(value: number, data: OperationData): boolean {
		const deleteRecursively = (node: BinaryTreeNode | null, value: number): BinaryTreeNode | null => {
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
