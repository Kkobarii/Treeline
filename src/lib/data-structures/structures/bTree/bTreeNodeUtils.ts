import type { BTreeNode } from './bTree';

// Helper to find the index where value should be inserted
export function findInsertIndex(node: BTreeNode, value: number): number {
	let i = 0;
	while (i < node.values.length && value > node.values[i]) {
		i++;
	}
	return i;
}

// Check if node is full
export function isFull(node: BTreeNode, order: number): boolean {
	return node.values.length >= 2 * order - 1;
}

// Insert a value into this node (assumes node is not full)
export function insertNonFull(node: BTreeNode, value: number): void {
	const idx = findInsertIndex(node, value);
	node.values.splice(idx, 0, value);
}

// Remove value at index
export function removeAt(node: BTreeNode, index: number): number {
	return node.values.splice(index, 1)[0];
}

// Insert child at index
export function insertChild(node: BTreeNode, index: number, child: BTreeNode): void {
	node.children.splice(index, 0, child);
}

// Remove child at index
export function removeChild(node: BTreeNode, index: number): BTreeNode {
	return node.children.splice(index, 1)[0];
}
