import { OperationData } from '$lib/data-structures/operation/operationData';
import { deepCopy } from '$lib/data-structures/utils/utils';

export enum StructureType {
	BSTree = 'BSTree',
	AVLTree = 'AVLTree',
	RBTree = 'RBTree',
	BTree = 'BTree',
	Heap = 'Heap',
	LinkedList = 'LinkedList',
	Stack = 'Stack',
	Queue = 'Queue',
}

export const OperationType = {
	Empty: 'Empty',
	Tree: {
		Insert: 'Tree.Insert',
		Find: 'Tree.Find',
		Remove: 'Tree.Remove',
	},
	Heap: {
		Insert: 'Heap.Insert',
		ExtractRoot: 'Heap.ExtractRoot',
	},
	LinkedList: {
		InsertHead: 'LinkedList.InsertHead',
		InsertTail: 'LinkedList.InsertTail',
		Find: 'LinkedList.Find',
		Remove: 'LinkedList.Remove',
	},
	Stack: {
		Push: 'Stack.Push',
		Pop: 'Stack.Pop',
		Peek: 'Stack.Peek',
	},
	Queue: {
		Enqueue: 'Queue.Enqueue',
		Dequeue: 'Queue.Dequeue',
		Peek: 'Queue.Peek',
	},
} as const;

export type OperationTypeValue =
	| typeof OperationType.Empty
	| (typeof OperationType.Tree)[keyof typeof OperationType.Tree]
	| (typeof OperationType.Heap)[keyof typeof OperationType.Heap]
	| (typeof OperationType.LinkedList)[keyof typeof OperationType.LinkedList]
	| (typeof OperationType.Stack)[keyof typeof OperationType.Stack]
	| (typeof OperationType.Queue)[keyof typeof OperationType.Queue];

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
	LinkedList: {
		Start: 'Start',
		End: 'End',
		CreateHead: 'CreateHead',
		InsertAtHead: 'InsertAtHead',
		InsertAtTail: 'InsertAtTail',
		Compare: 'Compare',
		TraverseNext: 'TraverseNext',
		TraverseToTail: 'TraverseToTail',
		Found: 'Found',
		NotFound: 'NotFound',
		MarkToDelete: 'MarkToDelete',
		RemoveHead: 'RemoveHead',
		RemoveNode: 'RemoveNode',
		EmptyList: 'EmptyList',
	},
	Stack: {
		Start: 'Start',
		End: 'End',
		Push: 'Push',
		Pop: 'Pop',
		Peek: 'Peek',
		Empty: 'Empty',
	},
	Queue: {
		Start: 'Start',
		End: 'End',
		Enqueue: 'Enqueue',
		Dequeue: 'Dequeue',
		Peek: 'Peek',
		Empty: 'Empty',
	},
} as const;

export type StepTypeValue =
	| (typeof StepType.BSTree)[keyof typeof StepType.BSTree]
	| (typeof StepType.AVLTree)[keyof typeof StepType.AVLTree]
	| (typeof StepType.Heap)[keyof typeof StepType.Heap]
	| (typeof StepType.BTree)[keyof typeof StepType.BTree]
	| (typeof StepType.RBTree)[keyof typeof StepType.RBTree]
	| (typeof StepType.LinkedList)[keyof typeof StepType.LinkedList]
	| (typeof StepType.Stack)[keyof typeof StepType.Stack]
	| (typeof StepType.Queue)[keyof typeof StepType.Queue];

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
		const data: OperationData = new OperationData(type, value, this.snapshot());
		this.doOperation(type, value, data);
		data.end(this.snapshot());
		return data;
	}

	protected doOperation(type: OperationTypeValue, value: number | null, data: OperationData): void {
		throw new Error('doOperation not implemented in base DataStructure class');
	}
}

export function getInitOperation(structureType: StructureType): OperationTypeValue {
	switch (structureType) {
		case StructureType.BSTree:
		case StructureType.AVLTree:
		case StructureType.RBTree:
			return OperationType.Tree.Insert;
		case StructureType.BTree:
			return OperationType.Tree.Insert;
		case StructureType.Heap:
			return OperationType.Heap.Insert;
		case StructureType.LinkedList:
			return OperationType.LinkedList.InsertTail;
		case StructureType.Stack:
			return OperationType.Stack.Push;
		case StructureType.Queue:
			return OperationType.Queue.Enqueue;
		default:
			throw new Error(`Unsupported structure type: ${structureType}`);
	}
}
