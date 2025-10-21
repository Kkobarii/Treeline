import { OperationData } from '$lib/operation/operationData';
import { deepCopy } from '$lib/utils/utils';
import { BSTree } from './bsTree';

export enum StructureType {
	BSTree = 'BSTree',
}

export const OperationType = {
	BSTree: {
		Insert: 'BSTree.Insert',
		Find: 'BSTree.Find',
		Remove: 'BSTree.Remove',
	},
	// Stack: {
	// 	Push: 'Stack.Push',
	// 	Pop: 'Stack.Pop',
	// },
} as const;

export type OperationTypeValue = (typeof OperationType.BSTree)[keyof typeof OperationType.BSTree];
// | (typeof OperationType.Stack)[keyof typeof OperationType.Stack];

export function createEmptyTree(type: StructureType): DataStructure {
	const x: Record<StructureType, DataStructure> = {
		[StructureType.BSTree]: new BSTree(),
	};

	return x[type];
}

export function deepCopyStructure(type: StructureType, struct: DataStructure): DataStructure {
	const x: Record<StructureType, (tree: DataStructure) => DataStructure> = {
		[StructureType.BSTree]: (tree: DataStructure) => Object.assign(new BSTree(), deepCopy(tree)),
	};
	return x[type](struct);
}

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
		const data: OperationData = new OperationData(type + ' ' + value, this.snapshot());
		this.doOperation(type, value, data);
		data.end(this.snapshot());
		return data;
	}

	protected doOperation(type: OperationTypeValue, value: number | null, data: OperationData): void {
		throw new Error('doOperation not implemented in base DataStructure class');
	}
}
