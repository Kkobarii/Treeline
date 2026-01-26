import { AVLTree } from '$lib/data-structures/structures/avlTree/avlTree';
import { BSTree } from '$lib/data-structures/structures/bsTree/bsTree';
import { BTree } from '$lib/data-structures/structures/bTree/bTree';
import { StructureType, type DataStructure } from '$lib/data-structures/structures/dataStructure';
import { Heap } from '$lib/data-structures/structures/heap/heap';
import { LinkedList } from '$lib/data-structures/structures/linkedList/linkedList';
import { Queue } from '$lib/data-structures/structures/queue/queue';
import { RBTree } from '$lib/data-structures/structures/rbTree/rbTree';
import { Stack } from '$lib/data-structures/structures/stack/stack';

import { deepCopy } from '../utils/utils';

export function createEmptyStructure(type: StructureType): DataStructure {
	const x: Record<StructureType, DataStructure> = {
		[StructureType.BSTree]: new BSTree(),
		[StructureType.AVLTree]: new AVLTree(),
		[StructureType.RBTree]: new RBTree(),
		[StructureType.BTree]: new BTree(),
		[StructureType.Heap]: new Heap(),
		[StructureType.LinkedList]: new LinkedList(),
		[StructureType.Stack]: new Stack(),
		[StructureType.Queue]: new Queue(),
	};

	return x[type];
}

export function deepCopyStructure(type: StructureType, struct: DataStructure): DataStructure {
	const x: Record<StructureType, (tree: DataStructure) => DataStructure> = {
		[StructureType.BSTree]: (tree: DataStructure) => Object.assign(new BSTree(), deepCopy(tree)),
		[StructureType.AVLTree]: (tree: DataStructure) => Object.assign(new AVLTree(), deepCopy(tree)),
		[StructureType.BTree]: (tree: DataStructure) => Object.assign(new BTree(), deepCopy(tree)),
		[StructureType.RBTree]: (tree: DataStructure) => Object.assign(new RBTree(), deepCopy(tree)),
		[StructureType.Heap]: (tree: DataStructure) => Object.assign(new Heap(), deepCopy(tree)),
		[StructureType.LinkedList]: (tree: DataStructure) => Object.assign(new LinkedList(), deepCopy(tree)),
		[StructureType.Stack]: (tree: DataStructure) => Object.assign(new Stack(), deepCopy(tree)),
		[StructureType.Queue]: (tree: DataStructure) => Object.assign(new Queue(), deepCopy(tree)),
	};

	return x[type](struct);
}
