import { AVLTree } from '$lib/data-structures/structures/avlTree/avlTree';
import { BSTree } from '$lib/data-structures/structures/bsTree/bsTree';
import { StructureType, type DataStructure } from '$lib/data-structures/structures/dataStructure';

import { deepCopy } from '../utils/utils';

export function createEmptyStructure(type: StructureType): DataStructure {
	const x: Record<StructureType, DataStructure> = {
		[StructureType.BSTree]: new BSTree(),
		[StructureType.AVLTree]: new AVLTree(),
	};

	return x[type];
}

export function deepCopyStructure(type: StructureType, struct: DataStructure): DataStructure {
	const x: Record<StructureType, (tree: DataStructure) => DataStructure> = {
		[StructureType.BSTree]: (tree: DataStructure) => Object.assign(new BSTree(), deepCopy(tree)),
		[StructureType.AVLTree]: (tree: DataStructure) => Object.assign(new AVLTree(), deepCopy(tree)),
	};

	return x[type](struct);
}
