import { OperationData } from '$lib/data-structures/operation/operationData';
import { deepCopy } from '$lib/data-structures/utils/utils';

export enum StructureType {
	BSTree = 'BSTree',
	AVLTree = 'AVLTree',
	RBTree = 'RBTree',
}

export const OperationType = {
	Tree: {
		Insert: 'Tree.Insert',
		Find: 'Tree.Find',
		Remove: 'Tree.Remove',
	},
	// Stack: {
	// 	Push: 'Stack.Push',
	// 	Pop: 'Stack.Pop',
	// },
} as const;

export type OperationTypeValue = (typeof OperationType.Tree)[keyof typeof OperationType.Tree];
// | (typeof OperationType.Stack)[keyof typeof OperationType.Stack];

// centralize common tree step names so BST and AVL share the same base values
const BaseTreeSteps = {
	Start: 'Start',
	End: 'End',
	CreateRoot: 'CreateRoot',
	CreateLeaf: 'CreateLeaf',
	Compare: 'Compare',
	Traverse: 'Traverse',
	Drop: 'Drop',
	Found: 'Found',
	MarkToDelete: 'MarkToDelete',
	Delete: 'Delete',
	ReplaceWithChild: 'ReplaceWithChild',
	FoundInorderSuccessor: 'FoundInorderSuccessor',
	RelinkSuccessorChild: 'RelinkSuccessorChild',
	ReplaceWithInorderSuccessor: 'ReplaceWithInorderSuccessor',
} as const;

export const StepType = {
	BSTree: BaseTreeSteps,
	AVLTree: {
		...BaseTreeSteps,
		UpdateHeightBalance: 'UpdateHeightBalance',
		RotateLeft: 'RotateLeft',
		RotateRight: 'RotateRight',
	},
	RBTree: {
		...BaseTreeSteps,
		ColorNode: 'ColorNode',
		RotateLeft: 'RotateLeft',
		RotateRight: 'RotateRight',
		Fixup: 'Fixup',
	},
} as const;

export type StepTypeValue =
	| (typeof StepType.BSTree)[keyof typeof StepType.BSTree]
	| (typeof StepType.AVLTree)[keyof typeof StepType.AVLTree]
	| (typeof StepType.RBTree)[keyof typeof StepType.RBTree];

export class DataNode {
	id: number;

	constructor(id: number) {
		this.id = id;
	}
}

export class DataStructure {
	currentId: number = 0;

	protected generateId(): number {
		return this.currentId++;
	}

	snapshot(): DataStructure {
		return Object.assign(new DataStructure(), deepCopy(this));
	}

	operation(type: OperationTypeValue, value: number | null): OperationData {
		const data: OperationData = new OperationData(type.split('.')[1] + ' ' + value, this.snapshot());
		this.doOperation(type, value, data);
		data.end(this.snapshot());
		return data;
	}

	protected doOperation(type: OperationTypeValue, value: number | null, data: OperationData): void {
		throw new Error('doOperation not implemented in base DataStructure class');
	}
}
