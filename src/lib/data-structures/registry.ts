export interface DataStructure {
	id: string;
	nameKey: string;
}

export const dataStructures: DataStructure[] = [
	{ id: 'binary-search-tree', nameKey: 'dataStructures.binarySearchTree' },
	{ id: 'avl-tree', nameKey: 'dataStructures.avlTree' },
	{ id: 'red-black-tree', nameKey: 'dataStructures.redBlackTree' },
	{ id: 'b-tree', nameKey: 'dataStructures.bTree' },
	{ id: 'heap', nameKey: 'dataStructures.heap' },
	{ id: 'linked-list', nameKey: 'dataStructures.linkedList' },
	{ id: 'stack', nameKey: 'dataStructures.stack' },
	{ id: 'queue', nameKey: 'dataStructures.queue' },
];
