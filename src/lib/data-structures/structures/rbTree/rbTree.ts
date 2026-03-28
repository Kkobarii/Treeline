import { OperationData, StepData } from '$lib/data-structures/operation/operationData';
import {
	CASE_LEAF_NODE,
	CASE_SINGLE_CHILD,
	CASE_TWO_CHILDREN,
	DIRECTION_LEFT,
	DIRECTION_RIGHT,
	DROP_REASON_DUPLICATE_VALUE,
	DROP_REASON_NOT_FOUND,
	RBTREE_FIXING_DOUBLE_BLACK,
	RBTREE_SIBLING_BLACK_FAR_RED,
	RBTREE_SIBLING_BLACK_FAR_RED_SYM,
	RBTREE_SIBLING_BLACK_NEAR_RED,
	RBTREE_SIBLING_BLACK_NEAR_RED_SYM,
	RBTREE_SIBLING_BLACK_TWO_BLACK,
	RBTREE_SIBLING_BLACK_TWO_BLACK_SYM,
	RBTREE_SIBLING_RED,
	RBTREE_SIBLING_RED_SYM,
	RBTREE_UNCLE_BLACK_LINE_INSERT,
	RBTREE_UNCLE_BLACK_LINE_INSERT_SYM,
	RBTREE_UNCLE_BLACK_TRIANGLE_INSERT,
	RBTREE_UNCLE_BLACK_TRIANGLE_INSERT_SYM,
	RBTREE_UNCLE_RED_INSERT,
	RBTREE_UNCLE_RED_INSERT_SYM,
} from '$lib/data-structures/operation/stepConstants';
import {
	CaseAnalysisData,
	CompareData,
	CreateLeafData,
	CreateRootData,
	DeleteData,
	DropData,
	FoundData,
	FoundInorderSuccessorData,
	MarkToDeleteData,
	ReplaceWithChildData,
	ReplaceWithInorderSuccessorData,
	TraverseData,
} from '$lib/data-structures/operation/stepData';
import { getDummyNodeId } from '$lib/data-structures/utils/graphs';
import { deepCopy } from '$lib/data-structures/utils/utils';

import { DataNode, DataStructure, OperationType, type OperationTypeValue } from '../dataStructure';
import { ColorNodeData, RotateLeftData, RotateRightData } from './rbTreeSteps';

export enum RBTreeColor {
	Red = 'red',
	Black = 'black',
}

export class RBTreeNode extends DataNode {
	value: number;
	left: RBTreeNode | null = null;
	right: RBTreeNode | null = null;
	color: RBTreeColor = RBTreeColor.Red;
	parentId: number | null = null;

	constructor(id: number, value: number) {
		super(id);
		this.value = value;
	}
}

export class RBTree extends DataStructure {
	root: RBTreeNode | null = null;

	snapshot(): RBTree {
		return Object.assign(new RBTree(), deepCopy(this));
	}

	// Helper to find a node by ID
	private findNodeById(id: number | null): RBTreeNode | null {
		if (id === null) return null;
		const search = (node: RBTreeNode | null): RBTreeNode | null => {
			if (!node) return null;
			if (node.id === id) return node;
			return search(node.left) || search(node.right);
		};
		return search(this.root);
	}

	// Helper to get parent node
	private getParent(node: RBTreeNode): RBTreeNode | null {
		return this.findNodeById(node.parentId);
	}

	// Helper to get grandparent node
	private getGrandparent(node: RBTreeNode): RBTreeNode | null {
		const parent = this.getParent(node);
		return parent ? this.getParent(parent) : null;
	}

	protected doOperation(type: OperationTypeValue, value: number | null, data: OperationData): void {
		switch (type) {
			case OperationType.Tree.Insert:
				this.insert(value as number, data);
				break;
			case OperationType.Tree.Remove:
				this.remove(value as number, data);
				break;
			case OperationType.Tree.Find:
				this.find(value as number, data);
				break;
			default:
				throw new Error(`Operation type ${type} not supported for RBTree.`);
		}
	}

	private setColor(node: RBTreeNode, color: RBTreeColor, data: OperationData): void {
		if (node.color === color) return;
		const startSnapshot = this.snapshot();
		node.color = color;
		data.step(StepData.new(new ColorNodeData(node.id, color, startSnapshot, this.snapshot())));
	}

	private leftRotate(x: RBTreeNode, data: OperationData): void {
		const startSnapshot = this.snapshot();
		const y = x.right!;
		const T2 = y.left;
		const xParent = this.getParent(x);

		// perform rotation
		y.left = x;
		x.right = T2;

		// update parent IDs
		y.parentId = x.parentId;
		x.parentId = y.id;
		if (T2) T2.parentId = x.id;

		// attach rotated subtree to parent (or set as root)
		if (!xParent) {
			this.root = y;
		} else if (xParent.left === x) {
			xParent.left = y;
		} else {
			xParent.right = y;
		}

		data.step(StepData.new(new RotateLeftData(x.id, y.id, T2 ? T2.id : null, startSnapshot, this.snapshot())));
	}

	private rightRotate(y: RBTreeNode, data: OperationData): void {
		const startSnapshot = this.snapshot();
		const x = y.left!;
		const T2 = x.right;
		const yParent = this.getParent(y);

		// perform rotation
		x.right = y;
		y.left = T2;

		// update parent IDs
		x.parentId = y.parentId;
		y.parentId = x.id;
		if (T2) T2.parentId = y.id;

		// attach rotated subtree to parent (or set as root)
		if (!yParent) {
			this.root = x;
		} else if (yParent.left === y) {
			yParent.left = x;
		} else {
			yParent.right = x;
		}

		data.step(StepData.new(new RotateRightData(y.id, x.id, T2 ? T2.id : null, startSnapshot, this.snapshot())));
	}

	insert(value: number, data: OperationData): RBTreeNode | null {
		// standard BST insert
		const newNode = new RBTreeNode(this.generateId(), value);

		if (!this.root) {
			let startSnapshot = this.snapshot();
			this.root = newNode;
			data.step(StepData.new(new CreateRootData(newNode.id, value, startSnapshot, this.snapshot())));
			let colorSnapshot = this.snapshot();
			newNode.color = RBTreeColor.Black;
			data.step(StepData.new(new ColorNodeData(newNode.id, RBTreeColor.Black, colorSnapshot, this.snapshot())));
			return newNode;
		}

		// find insertion point iteratively
		let current: RBTreeNode | null = this.root;
		let parent: RBTreeNode | null = null;

		while (current) {
			parent = current;
			data.step(StepData.new(new CompareData(value, current.id, current.value)));
			if (value < current.value) {
				data.step(StepData.new(new TraverseData(current.id, current.left ? current.left.id : -1, DIRECTION_LEFT)));
				if (!current.left) break;
				current = current.left;
			} else if (value > current.value) {
				data.step(StepData.new(new TraverseData(current.id, current.right ? current.right.id : -1, DIRECTION_RIGHT)));
				if (!current.right) break;
				current = current.right;
			} else {
				data.step(StepData.new(new DropData(value, DROP_REASON_DUPLICATE_VALUE, current.id.toString())));
				return current;
			}
		}

		// attach new node
		newNode.parentId = parent!.id;
		let startSnapshot = this.snapshot();
		if (value < parent!.value) {
			parent!.left = newNode;
			data.step(StepData.new(new CreateLeafData(newNode.id, value, parent!.id, DIRECTION_LEFT, startSnapshot, this.snapshot())));
		} else {
			parent!.right = newNode;
			data.step(StepData.new(new CreateLeafData(newNode.id, value, parent!.id, DIRECTION_RIGHT, startSnapshot, this.snapshot())));
		}

		// fix RB tree properties
		this.insertFixup(newNode, data);

		return newNode;
	}

	private insertFixup(node: RBTreeNode, data: OperationData): void {
		let current = node;

		while (current.parentId !== null) {
			const parent = this.getParent(current)!;
			if (parent.color !== RBTreeColor.Red) break;

			const grandparent = this.getGrandparent(current);
			if (!grandparent) break;

			if (parent === grandparent.left) {
				// parent is left child of grandparent
				const uncle = grandparent.right;

				if (uncle && uncle.color === RBTreeColor.Red) {
					// Insert Case 1: uncle is red
					data.step(StepData.new(new CaseAnalysisData(1, RBTREE_UNCLE_RED_INSERT, grandparent.id)));
					this.setColor(parent, RBTreeColor.Black, data);
					this.setColor(uncle, RBTreeColor.Black, data);
					this.setColor(grandparent, RBTreeColor.Red, data);
					current = grandparent;
				} else {
					// Case 2: uncle is black
					if (current === parent.right) {
						// Insert Case 2: uncle is black, triangle case
						data.step(StepData.new(new CaseAnalysisData(2, RBTREE_UNCLE_BLACK_TRIANGLE_INSERT, grandparent.id)));
						current = parent;
						this.leftRotate(current, data);
					}
					// Insert Case 3: uncle is black, line case
					const currentParent = this.getParent(current)!;
					const currentGrandparent = this.getGrandparent(current)!;
					data.step(StepData.new(new CaseAnalysisData(3, RBTREE_UNCLE_BLACK_LINE_INSERT, currentGrandparent.id)));
					this.setColor(currentParent, RBTreeColor.Black, data);
					this.setColor(currentGrandparent, RBTreeColor.Red, data);
					this.rightRotate(currentGrandparent, data);
				}
			} else {
				// parent is right child of grandparent (symmetric)
				const uncle = grandparent.left;

				if (uncle && uncle.color === RBTreeColor.Red) {
					// Insert Case 1 (symmetric): uncle is red
					data.step(StepData.new(new CaseAnalysisData(1, RBTREE_UNCLE_RED_INSERT_SYM, grandparent.id)));
					this.setColor(parent, RBTreeColor.Black, data);
					this.setColor(uncle, RBTreeColor.Black, data);
					this.setColor(grandparent, RBTreeColor.Red, data);
					current = grandparent;
				} else {
					// Case 2: uncle is black
					if (current === parent.left) {
						// Insert Case 2 (symmetric): uncle is black, triangle case
						data.step(StepData.new(new CaseAnalysisData(2, RBTREE_UNCLE_BLACK_TRIANGLE_INSERT_SYM, grandparent.id)));
						current = parent;
						this.rightRotate(current, data);
					}
					// Insert Case 3 (symmetric): uncle is black, line case
					const currentParent = this.getParent(current)!;
					const currentGrandparent = this.getGrandparent(current)!;
					data.step(StepData.new(new CaseAnalysisData(3, RBTREE_UNCLE_BLACK_LINE_INSERT_SYM, currentGrandparent.id)));
					this.setColor(currentParent, RBTreeColor.Black, data);
					this.setColor(currentGrandparent, RBTreeColor.Red, data);
					this.leftRotate(currentGrandparent, data);
				}
			}
		}

		// root must always be black
		if (this.root!.color == RBTreeColor.Red) {
			this.setColor(this.root!, RBTreeColor.Black, data);
		}
	}

	find(value: number, data: OperationData): RBTreeNode | null {
		let current = this.root;
		let last = current?.id.toString();

		while (current) {
			data.step(StepData.new(new CompareData(value, current.id, current.value)));
			if (value === current.value) {
				data.step(StepData.new(new FoundData(current.id, value)));
				return current;
			} else if (value < current.value) {
				data.step(StepData.new(new TraverseData(current.id, current.left ? current.left.id : -1, DIRECTION_LEFT)));
				last = current.left?.id.toString() ?? getDummyNodeId(current.id, 'left');
				current = current.left;
			} else {
				data.step(StepData.new(new TraverseData(current.id, current.right ? current.right.id : -1, DIRECTION_RIGHT)));
				last = current.right?.id.toString() ?? getDummyNodeId(current.id, 'right');
				current = current.right;
			}
		}

		data.step(StepData.new(new DropData(value, DROP_REASON_NOT_FOUND, last!)));
		return null;
	}

	remove(value: number, data: OperationData): boolean {
		if (!this.root) {
			data.step(StepData.new(new DropData(value, DROP_REASON_NOT_FOUND, 'root')));
			return false;
		}

		// find node to delete
		let current: RBTreeNode | null = this.root;
		let last = current ? current.id.toString() : 'root';

		while (current) {
			data.step(StepData.new(new CompareData(value, current.id, current.value)));
			if (value < current.value) {
				data.step(StepData.new(new TraverseData(current.id, current.left ? current.left.id : -1, DIRECTION_LEFT)));
				last = current.left?.id.toString() ?? getDummyNodeId(current.id, 'left');
				current = current.left;
			} else if (value > current.value) {
				data.step(StepData.new(new TraverseData(current.id, current.right ? current.right.id : -1, DIRECTION_RIGHT)));
				last = current.right?.id.toString() ?? getDummyNodeId(current.id, 'right');
				current = current.right;
			} else {
				break; // found
			}
		}

		if (!current) {
			data.step(StepData.new(new DropData(value, DROP_REASON_NOT_FOUND, last)));
			return false;
		}

		data.step(StepData.new(new MarkToDeleteData(current.id, value)));

		let nodeToFixId: number | null = null;
		let nodeToFixParentId: number | null = null;
		const originalColor = current.color;

		if (!current.left) {
			// Node has at most one child (right)
			if (!current.right) {
				data.step(StepData.new(new CaseAnalysisData(1, CASE_LEAF_NODE, current.id)));
			} else {
				data.step(StepData.new(new CaseAnalysisData(2, CASE_SINGLE_CHILD, current.id)));
			}
			nodeToFixId = current.right?.id ?? null;
			nodeToFixParentId = current.parentId;
			this.transplant(current, current.right, data);
		} else if (!current.right) {
			// Node has one child (left)
			data.step(StepData.new(new CaseAnalysisData(2, CASE_SINGLE_CHILD, current.id)));
			nodeToFixId = current.left.id;
			nodeToFixParentId = current.parentId;
			this.transplant(current, current.left, data);
		} else {
			// Node has two children
			data.step(StepData.new(new CaseAnalysisData(3, CASE_TWO_CHILDREN, current.id)));
			let successor = current.right;
			while (successor.left) {
				successor = successor.left;
			}
			data.step(StepData.new(new FoundInorderSuccessorData(current.id, successor.id, successor.value)));

			const successorOriginalColor = successor.color;
			nodeToFixId = successor.right?.id ?? null;
			nodeToFixParentId = successor.id;

			if (successor.parentId === current.id) {
				if (successor.right) successor.right.parentId = successor.id;
			} else {
				const succParent = this.getParent(successor);
				nodeToFixParentId = successor.parentId;
				this.transplant(successor, successor.right, data);
				successor.right = current.right;
				if (successor.right) successor.right.parentId = successor.id;
			}

			this.transplant(current, successor, data);
			successor.left = current.left;
			if (successor.left) successor.left.parentId = successor.id;

			// copy color from deleted node to successor
			let startSnapshot = this.snapshot();
			successor.color = current.color;
			data.step(
				StepData.new(
					new ReplaceWithInorderSuccessorData(
						current.id,
						successor.id,
						successor.value,
						successor.parentId ?? -1,
						nodeToFixId,
						startSnapshot,
						this.snapshot(),
					),
				),
			);

			// if successor was black, we need fixup
			if (successorOriginalColor == RBTreeColor.Black) {
				if (nodeToFixId) {
					const nodeToFix = this.findNodeById(nodeToFixId);
					if (nodeToFix) this.removeFixup(nodeToFix, data);
				} else if (nodeToFixParentId) {
					const nodeToFixParent = this.findNodeById(nodeToFixParentId);
					if (nodeToFixParent) {
						this.removeFixupNull(nodeToFixParent, successor === nodeToFixParent.left, data);
					}
				}
			}

			return true;
		}

		// if deleted node was black, fix violations
		if (originalColor == RBTreeColor.Black) {
			if (nodeToFixId) {
				const nodeToFix = this.findNodeById(nodeToFixId);
				if (nodeToFix) this.removeFixup(nodeToFix, data);
			} else if (nodeToFixParentId) {
				const nodeToFixParent = this.findNodeById(nodeToFixParentId);
				if (nodeToFixParent) {
					const wasLeft = current === this.findNodeById(nodeToFixParentId)?.left;
					this.removeFixupNull(nodeToFixParent, wasLeft, data);
				}
			}
		}

		return true;
	}

	private transplant(u: RBTreeNode, v: RBTreeNode | null, data: OperationData): void {
		const startSnapshot = this.snapshot();
		const uParent = this.getParent(u);

		if (!uParent) {
			this.root = v;
		} else if (u === uParent.left) {
			uParent.left = v;
		} else {
			uParent.right = v;
		}
		if (v) {
			v.parentId = u.parentId;
		}

		if (v) {
			data.step(
				StepData.new(
					new ReplaceWithChildData(
						u.id,
						v.id,
						v.value,
						uParent && u === uParent.left ? DIRECTION_LEFT : DIRECTION_RIGHT,
						startSnapshot,
						this.snapshot(),
					),
				),
			);
		} else {
			data.step(StepData.new(new DeleteData(u.id, u.value, startSnapshot, this.snapshot())));
		}
	}

	private removeFixup(node: RBTreeNode, data: OperationData): void {
		let current = node;

		while (current !== this.root && current.color === 'black') {
			const parent = this.getParent(current);
			if (!parent) break;

			if (current === parent.left) {
				let sibling = parent.right;

				// Case 1: sibling is red
				if (sibling?.color === RBTreeColor.Red) {
					data.step(StepData.new(new CaseAnalysisData(1, RBTREE_SIBLING_RED, parent.id)));
					this.setColor(sibling, RBTreeColor.Black, data);
					this.setColor(parent, RBTreeColor.Red, data);
					this.leftRotate(parent, data);
					sibling = this.getParent(current)?.right ?? null;
				}

				// Case 2: sibling and its children are black
				if (
					sibling &&
					(!sibling.left || sibling.left.color === RBTreeColor.Black) &&
					(!sibling.right || sibling.right.color === RBTreeColor.Black)
				) {
					data.step(StepData.new(new CaseAnalysisData(2, RBTREE_SIBLING_BLACK_TWO_BLACK, parent.id)));
					this.setColor(sibling, RBTreeColor.Red, data);
					current = parent;
				} else if (sibling) {
					// Case 3: sibling's right child is black
					if (!sibling.right || sibling.right.color === RBTreeColor.Black) {
						data.step(StepData.new(new CaseAnalysisData(3, RBTREE_SIBLING_BLACK_NEAR_RED, parent.id)));
						if (sibling.left) this.setColor(sibling.left, RBTreeColor.Black, data);
						this.setColor(sibling, RBTreeColor.Red, data);
						this.rightRotate(sibling, data);
						sibling = this.getParent(current)?.right ?? null;
					}
					// Case 4: sibling's right child is red
					if (sibling) {
						const currentParent = this.getParent(current);
						if (currentParent) {
							data.step(StepData.new(new CaseAnalysisData(4, RBTREE_SIBLING_BLACK_FAR_RED, currentParent.id)));
							this.setColor(sibling, currentParent.color, data);
							this.setColor(currentParent, RBTreeColor.Black, data);
							if (sibling.right) this.setColor(sibling.right, RBTreeColor.Black, data);
							this.leftRotate(currentParent, data);
						}
					}
					current = this.root!;
				}
			} else {
				// symmetric case (current is right child)
				let sibling = parent.left;

				if (sibling?.color === RBTreeColor.Red) {
					data.step(StepData.new(new CaseAnalysisData(1, RBTREE_SIBLING_RED_SYM, parent.id)));
					this.setColor(sibling, RBTreeColor.Black, data);
					this.setColor(parent, RBTreeColor.Red, data);
					this.rightRotate(parent, data);
					sibling = this.getParent(current)?.left ?? null;
				}

				if (
					sibling &&
					(!sibling.left || sibling.left.color === RBTreeColor.Black) &&
					(!sibling.right || sibling.right.color === RBTreeColor.Black)
				) {
					data.step(StepData.new(new CaseAnalysisData(2, RBTREE_SIBLING_BLACK_TWO_BLACK_SYM, parent.id)));
					this.setColor(sibling, RBTreeColor.Red, data);
					current = parent;
				} else if (sibling) {
					if (!sibling.left || sibling.left.color === RBTreeColor.Black) {
						data.step(StepData.new(new CaseAnalysisData(3, RBTREE_SIBLING_BLACK_NEAR_RED_SYM, parent.id)));
						if (sibling.right) this.setColor(sibling.right, RBTreeColor.Black, data);
						this.setColor(sibling, RBTreeColor.Red, data);
						this.leftRotate(sibling, data);
						sibling = this.getParent(current)?.left ?? null;
					}
					if (sibling) {
						const currentParent = this.getParent(current);
						if (currentParent) {
							data.step(StepData.new(new CaseAnalysisData(4, RBTREE_SIBLING_BLACK_FAR_RED_SYM, currentParent.id)));
							this.setColor(sibling, currentParent.color, data);
							this.setColor(currentParent, RBTreeColor.Black, data);
							if (sibling.left) this.setColor(sibling.left, RBTreeColor.Black, data);
							this.rightRotate(currentParent, data);
						}
					}
					current = this.root!;
				}
			}
		}

		if (current.color === RBTreeColor.Red) {
			this.setColor(current, RBTreeColor.Black, data);
		}
	}

	private removeFixupNull(parent: RBTreeNode, isLeftChild: boolean, data: OperationData): void {
		// This handles a double-black violation on a conceptual null node.
		data.step(StepData.new(new CaseAnalysisData(0, RBTREE_FIXING_DOUBLE_BLACK, parent.id)));

		let sibling = isLeftChild ? parent.right : parent.left;
		if (sibling?.color === RBTreeColor.Red) {
			this.setColor(sibling, RBTreeColor.Black, data);
			this.setColor(parent, RBTreeColor.Red, data);
			if (isLeftChild) {
				this.leftRotate(parent, data);
			} else {
				this.rightRotate(parent, data);
			}
		}
	}
}
