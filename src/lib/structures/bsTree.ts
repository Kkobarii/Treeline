import { BSTreeSteps, OperationData } from '$lib/operation/operationData';
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
			data.step(BSTreeSteps.CreateRoot(newNode.id, value));
			this.root = newNode;
			return newNode;
		}

		let current = this.root;
		while (true) {
			data.step(BSTreeSteps.Compare(value, current.id, current.value));
			if (value < current.value) {
				if (!current.left) {
					data.step(BSTreeSteps.CreateLeaf(newNode.id, value, current.id, 'left'));
					current.left = newNode;
					break;
				}

				data.step(BSTreeSteps.Traverse(current.id, current.left.id, 'left'));
				current = current.left;
			} else if (value > current.value) {
				if (!current.right) {
					data.step(BSTreeSteps.CreateLeaf(newNode.id, value, current.id, 'right'));
					current.right = newNode;
					break;
				}

				data.step(BSTreeSteps.Traverse(current.id, current.right.id, 'right'));
				current = current.right;
			} else {
				data.step(BSTreeSteps.Drop(value, 'duplicate value'));
				break;
			}
		}
		return newNode;
	}

	find(value: number, data: OperationData): BSTreeNode | null {
		let current = this.root;

		while (current) {
			data.step(BSTreeSteps.Compare(value, current.id, current.value));
			if (value === current.value) {
				data.step(BSTreeSteps.Found(current.id, value));
				return current;
			} else if (value < current.value) {
				data.step(BSTreeSteps.Traverse(current.id, current.left ? current.left.id : -1, 'left'));
				current = current.left;
			} else {
				data.step(BSTreeSteps.Traverse(current.id, current.right ? current.right.id : -1, 'right'));
				current = current.right;
			}
		}

		data.step(BSTreeSteps.Drop(value, 'not found'));
		return null;
	}

	remove(value: number, data: OperationData): boolean {
		const deleteRecursively = (node: BSTreeNode | null, value: number): BSTreeNode | null => {
			if (!node) {
				data.step(BSTreeSteps.Drop(value, 'not found'));
				return null;
			}

			data.step(BSTreeSteps.Compare(value, node.id, node.value));
			if (value < node.value) {
				data.step(BSTreeSteps.Traverse(node.id, node.left ? node.left.id : -1, 'left'));
				node.left = deleteRecursively(node.left, value);
			} else if (value > node.value) {
				data.step(BSTreeSteps.Traverse(node.id, node.right ? node.right.id : -1, 'right'));
				node.right = deleteRecursively(node.right, value);
			} else {
				data.step(BSTreeSteps.MarkToDelete(node.id, value));
				if (!node.left && !node.right) {
					data.step(BSTreeSteps.Delete(node.id, value));
					return null;
				}

				if (!node.left) {
					data.step(BSTreeSteps.ReplaceWithChild(node.id, node.right!.id, node.right!.value, 'right'));
					return node.right;
				}

				if (!node.right) {
					data.step(BSTreeSteps.ReplaceWithChild(node.id, node.left!.id, node.left!.value, 'left'));
					return node.left;
				}

				let parent = node;
				let inorderSuccessor = node.right;
				while (inorderSuccessor.left) {
					parent = inorderSuccessor;
					inorderSuccessor = inorderSuccessor.left;
				}
				data.step(BSTreeSteps.FoundInorderSuccessor(node.id, inorderSuccessor.id, inorderSuccessor.value));
				
				if (parent !== node) {
					parent.left = inorderSuccessor.right;
					data.step(BSTreeSteps.RelinkSuccessorChild(inorderSuccessor.right!.id, inorderSuccessor.right!.value, parent.id, parent.value));
				}
				
				if (node.right === inorderSuccessor) {
					node.right = inorderSuccessor.right;
				}

				data.step(BSTreeSteps.ReplaceWithInorderSuccessor(node.id, inorderSuccessor.id, inorderSuccessor.value));
				node.value = inorderSuccessor.value;
				node.id = inorderSuccessor.id;
			}
			return node;
		};
		this.root = deleteRecursively(this.root, value);
		return true;
	}
}
