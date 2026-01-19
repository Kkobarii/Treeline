import { OperationData } from '$lib/data-structures/operation/operationData';
import { deepCopy } from '$lib/data-structures/utils/utils';

export enum StructureType {
	BSTree = 'BSTree',
	AVLTree = 'AVLTree',
	RBTree = 'RBTree',
	BTree = 'BTree',
	Heap = 'Heap',
}

export const OperationType = {
	Tree: {
		Insert: 'Tree.Insert',
		Find: 'Tree.Find',
		Remove: 'Tree.Remove',
	},
	Heap: {
		Insert: 'Heap.Insert',
		ExtractRoot: 'Heap.ExtractRoot',
	},
	// Stack: {
	// 	Push: 'Stack.Push',
	// 	Pop: 'Stack.Pop',
	// },
} as const;

export type OperationTypeValue =
	| (typeof OperationType.Tree)[keyof typeof OperationType.Tree]
	| (typeof OperationType.Heap)[keyof typeof OperationType.Heap];
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
	CaseAnalysis: 'CaseAnalysis',
} as const;

export const StepType = {
	BSTree: BaseTreeSteps,
	AVLTree: {
		...BaseTreeSteps,
		UpdateHeightBalance: 'UpdateHeightBalance',
		RotateLeft: 'RotateLeft',
		RotateRight: 'RotateRight',
	},
	Heap: {
		...BaseTreeSteps,
		Swap: 'HeapSwap',
		FindLargestChild: 'FindLargestChild',
		Append: 'HeapAppend',
		CompareWithChildren: 'CompareWithChildren',
		CompareWithParent: 'CompareWithParent',
		ReplaceRootWithLast: 'ReplaceRootWithLast',
	},
	RBTree: {
		...BaseTreeSteps,
		ColorNode: 'ColorNode',
		RotateLeft: 'RotateLeft',
		RotateRight: 'RotateRight',
		Fixup: 'Fixup',
	},
	BTree: {
		...BaseTreeSteps,
		MarkOverfull: 'MarkOverfull',
		Split: 'Split',
		PromoteMiddle: 'PromoteMiddle',
		ChooseBranch: 'ChooseBranch',
		InsertValue: 'InsertValue',
		RemoveValue: 'RemoveValue',
		ReplaceValue: 'ReplaceValue',
		BorrowFromLeft: 'BorrowFromLeft',
		BorrowFromRight: 'BorrowFromRight',
		MergeChildren: 'MergeChildren',
		FindInorderReplacement: 'FindInorderReplacement',
	},
} as const;

export type StepTypeValue =
	| (typeof StepType.BSTree)[keyof typeof StepType.BSTree]
	| (typeof StepType.AVLTree)[keyof typeof StepType.AVLTree]
	| (typeof StepType.Heap)[keyof typeof StepType.Heap]
	| (typeof StepType.BTree)[keyof typeof StepType.BTree]
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
		const name = type.split('.')[1];
		const label = value === null || value === undefined ? name : `${name} ${value}`;
		const data: OperationData = new OperationData(label, this.snapshot());
		this.doOperation(type, value, data);
		data.end(this.snapshot());
		return data;
	}

	protected doOperation(type: OperationTypeValue, value: number | null, data: OperationData): void {
		throw new Error('doOperation not implemented in base DataStructure class');
	}
}
