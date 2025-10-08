import { OperationData } from '$lib/operation/operationData';
import { deepCopy } from '$lib/utils/utils';
import { BinaryTree } from './binaryTree';

export enum OperationType {
	Insert = 'Insert',
	Remove = 'Remove',
	Find = 'Find',
}

export enum TreeType {
	Binary = 'Binary',
}

export function createEmptyTree(type: TreeType): Tree {
	const x: Record<TreeType, Tree> = {
		[TreeType.Binary]: new BinaryTree(),
	};

	return x[type];
}

export function deepCopyTree(type: TreeType, tree: Tree): Tree {
	const x: Record<TreeType, (tree: Tree) => Tree> = {
		[TreeType.Binary]: (tree: Tree) => Object.assign(new BinaryTree(), deepCopy(tree)),
	};
	return x[type](tree);
}

export class TreeNode {
	id: number;

	constructor(id: number) {
		this.id = id;
	}
}

export class Tree {
	root: TreeNode | null = null;
	currentId: number = 0;

	protected generateId(): number {
		return this.currentId++;
	}

	snapshot(): Tree {
		return Object.assign(new Tree(), deepCopy(this));
	}

	doOperation(type: OperationType, value: number): OperationData {
		switch (type) {
			case OperationType.Insert:
				return this.insert(value);
			case OperationType.Find:
				return this.find(value);
			case OperationType.Remove:
				return this.remove(value);
			default:
				throw new Error('Unsupported operation type');
		}
	}

	insert(value: number): OperationData {
		const data: OperationData = new OperationData('Insert ' + value, this.snapshot());
		this.insert_node(value, data);
		data.end(this.snapshot());
		return data;
	}

	protected insert_node(value: number, data: OperationData): TreeNode | null {
		throw new Error('Calling base class method');
	}

	find(value: number): OperationData {
		const data: OperationData = new OperationData('Find ' + value, this.snapshot());
		const node = this.find_node(value, data);
		data.end(this.snapshot());
		return data;
	}

	protected find_node(value: number, data: OperationData): TreeNode | null {
		throw new Error('Calling base class method');
	}

	remove(value: number): OperationData {
		const data: OperationData = new OperationData('Remove ' + value, this.snapshot());
		const success = this.remove_node(value, data);
		data.end(this.snapshot());
		return data;
	}

	protected remove_node(value: number, data: OperationData): boolean {
		throw new Error('Calling base class method');
	}
}
