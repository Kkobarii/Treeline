import { AVLTree } from '$lib/data-structures/structures/avlTree/avlTree';
import { BSTree } from '$lib/data-structures/structures/bsTree/bsTree';
import { BTree } from '$lib/data-structures/structures/bTree/bTree';
import { StructureType, type DataStructure } from '$lib/data-structures/structures/dataStructure';
import { RBTree } from '$lib/data-structures/structures/rbTree/rbTree';

import { deepCopy } from '../utils/utils';

export function createEmptyStructure(type: StructureType): DataStructure {
	const x: Record<StructureType, DataStructure> = {
		[StructureType.BSTree]: new BSTree(),
		[StructureType.AVLTree]: new AVLTree(),
		[StructureType.RBTree]: new RBTree(),
		[StructureType.BTree]: new BTree(),
	};

	return x[type];
}

export function deepCopyStructure(type: StructureType, struct: DataStructure): DataStructure {
	const x: Record<StructureType, (tree: DataStructure) => DataStructure> = {
		[StructureType.BSTree]: (tree: DataStructure) => Object.assign(new BSTree(), deepCopy(tree)),
		[StructureType.AVLTree]: (tree: DataStructure) => Object.assign(new AVLTree(), deepCopy(tree)),
		[StructureType.BTree]: (tree: DataStructure) => Object.assign(new BTree(), deepCopy(tree)),
		[StructureType.RBTree]: (tree: DataStructure) => Object.assign(new RBTree(), deepCopy(tree)),
	};

	return x[type](struct);
}
