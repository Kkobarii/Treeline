import { OperationData } from '$lib/operation/operationData';
import { deepCopy } from '$lib/utils/utils';

export enum StructureType {
	BSTree = 'BSTree',
	AVLTree = 'AVLTree',
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

export type OperationTypeValue =
	| (typeof OperationType.Tree)[keyof typeof OperationType.Tree]
// | (typeof OperationType.Stack)[keyof typeof OperationType.Stack];

export const StepType = {
	BSTree: {
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
	},
	AVLTree: {
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
		RotateLeft: 'RotateLeft',
		RotateRight: 'RotateRight',
		FoundInorderSuccessor: 'FoundInorderSuccessor',
		RelinkSuccessorChild: 'RelinkSuccessorChild',
		ReplaceWithInorderSuccessor: 'ReplaceWithInorderSuccessor',
	},
};

export type StepTypeValue =
	| (typeof StepType.BSTree)[keyof typeof StepType.BSTree]
	| (typeof StepType.AVLTree)[keyof typeof StepType.AVLTree];

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
