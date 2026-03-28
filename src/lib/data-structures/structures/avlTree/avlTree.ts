import { OperationData, StepData } from '$lib/data-structures/operation/operationData';
import {
	CASE_LEAF_NODE,
	CASE_LEFT_LEFT_ROTATE_RIGHT,
	CASE_LEFT_RIGHT_ROTATE,
	CASE_RIGHT_LEFT_ROTATE,
	CASE_RIGHT_RIGHT_ROTATE_LEFT,
	CASE_SINGLE_CHILD,
	CASE_TWO_CHILDREN,
	DIRECTION_LEFT,
	DIRECTION_RIGHT,
	DROP_REASON_DUPLICATE_VALUE,
	DROP_REASON_NOT_FOUND,
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
	RelinkSuccessorChildData,
	ReplaceWithChildData,
	ReplaceWithInorderSuccessorData,
	TraverseData,
} from '$lib/data-structures/operation/stepData';
import { deepCopy } from '$lib/data-structures/utils/utils';

import { DataNode, DataStructure, OperationType, type OperationTypeValue } from '../dataStructure';
import { RotateLeftData, RotateRightData, UpdateHeightBalanceData } from './avlTreeSteps';

export class AVLTreeNode extends DataNode {
	value: number;
	left: AVLTreeNode | null = null;
	right: AVLTreeNode | null = null;
	height: number = 1;

	constructor(id: number, value: number) {
		super(id);
		this.value = value;
	}
}

export class AVLTree extends DataStructure {
	root: AVLTreeNode | null = null;

	snapshot(): AVLTree {
		return Object.assign(new AVLTree(), deepCopy(this));
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
				throw new Error(`Operation type ${type} not supported for AVLTree.`);
		}
	}

	private height(node: AVLTreeNode | null): number {
		return node ? node.height : 0;
	}

	private updateHeight(node: AVLTreeNode): void {
		node.height = Math.max(this.height(node.left), this.height(node.right)) + 1;
	}

	private getBalance(node: AVLTreeNode | null): number {
		if (!node) return 0;
		return this.height(node.left) - this.height(node.right);
	}

	//
	//     y                             x
	//    / \                           / \
	//   x   T3     Right Rotate(y)    T1  y
	//  / \          - - - - - - - ->     / \
	// T1  T2                           T2  T3
	//
	private rightRotate(parent: AVLTreeNode | null, y: AVLTreeNode, data: OperationData): void {
		const startSnapshot = this.snapshot();

		const x = y.left as AVLTreeNode;
		const T2 = x.right;

		// perform rotation
		x.right = y;
		y.left = T2;

		// update heights
		this.updateHeight(y);
		this.updateHeight(x);

		// attach rotated subtree to parent (or set as root)
		if (!parent) {
			this.root = x;
		} else if (parent.left === y) {
			parent.left = x;
		} else {
			parent.right = x;
		}

		data.step(StepData.new(new RotateRightData(y.id, x.id, T2 ? T2.id : null, startSnapshot, this.snapshot())));
	}

	//
	//   x                             y
	//  / \                           / \
	// T1  y     Left Rotate(x)      x   T3
	//    / \    - - - - - - - ->   / \
	//   T2  T3                   T1  T2
	//
	private leftRotate(parent: AVLTreeNode | null, x: AVLTreeNode, data: OperationData): void {
		const startSnapshot = this.snapshot();

		const y = x.right as AVLTreeNode;
		const T2 = y.left;

		// perform rotation
		y.left = x;
		x.right = T2;

		// update heights
		this.updateHeight(x);
		this.updateHeight(y);

		// attach rotated subtree to parent (or set as root)
		if (!parent) {
			this.root = y;
		} else if (parent.left === x) {
			parent.left = y;
		} else {
			parent.right = y;
		}

		data.step(StepData.new(new RotateLeftData(x.id, y.id, T2 ? T2.id : null, startSnapshot, this.snapshot())));
	}

	insert(value: number, data: OperationData): AVLTreeNode | null {
		// iterative insert so the root is updated at each step (suitable for screenshots)
		if (!this.root) {
			const newNode = new AVLTreeNode(this.generateId(), value);
			let startSnapshot = this.snapshot();
			this.root = newNode;
			data.step(StepData.new(new CreateRootData(newNode.id, value, startSnapshot, this.snapshot())));
			return newNode;
		}

		// traverse to insertion point, keeping path from root to parent
		let current: AVLTreeNode | null = this.root;
		const path: AVLTreeNode[] = [];

		while (current) {
			path.push(current);
			data.step(StepData.new(new CompareData(value, current.id, current.value)));
			if (value < current.value) {
				data.step(StepData.new(new TraverseData(current.id, current.left ? current.left.id : -1, DIRECTION_LEFT)));
				if (!current.left) {
					const newNode = new AVLTreeNode(this.generateId(), value);
					let startSnapshot = this.snapshot();
					data.steps.pop();
					current.left = newNode;
					data.step(
						StepData.new(new CreateLeafData(newNode.id, value, current.id, DIRECTION_LEFT, startSnapshot, this.snapshot())),
					);
					break;
				}
				current = current.left;
			} else if (value > current.value) {
				data.step(StepData.new(new TraverseData(current.id, current.right ? current.right.id : -1, DIRECTION_RIGHT)));
				if (!current.right) {
					const newNode = new AVLTreeNode(this.generateId(), value);
					let startSnapshot = this.snapshot();
					data.steps.pop();
					current.right = newNode;
					data.step(
						StepData.new(new CreateLeafData(newNode.id, value, current.id, DIRECTION_RIGHT, startSnapshot, this.snapshot())),
					);
					break;
				}
				current = current.right;
			} else {
				data.step(StepData.new(new DropData(value, DROP_REASON_DUPLICATE_VALUE, current.id.toString())));
				return current;
			}
		}

		// walk back up the path and rebalance as needed
		while (path.length > 0) {
			const node = path.pop()!;
			let startSnapshot = this.snapshot();
			this.updateHeight(node);
			const balance = this.getBalance(node);
			data.step(StepData.new(new UpdateHeightBalanceData(node.id, node.height, balance, startSnapshot, this.snapshot())));

			// determine parent for potential attachment
			const parent = path.length > 0 ? path[path.length - 1] : null;

			// Left Left
			if (balance > 1 && value < (node.left as AVLTreeNode).value) {
				data.step(StepData.new(new CaseAnalysisData(1, CASE_LEFT_LEFT_ROTATE_RIGHT, node.id)));
				this.rightRotate(parent, node, data);
			}

			// Right Right
			else if (balance < -1 && value > (node.right as AVLTreeNode).value) {
				data.step(StepData.new(new CaseAnalysisData(2, CASE_RIGHT_RIGHT_ROTATE_LEFT, node.id)));
				this.leftRotate(parent, node, data);
			}

			// Left Right
			else if (balance > 1 && value > (node.left as AVLTreeNode).value) {
				data.step(StepData.new(new CaseAnalysisData(3, CASE_LEFT_RIGHT_ROTATE, node.id)));
				this.leftRotate(node, node.left as AVLTreeNode, data);
				this.rightRotate(parent, node, data);
			}

			// Right Left
			else if (balance < -1 && value < (node.right as AVLTreeNode).value) {
				data.step(StepData.new(new CaseAnalysisData(4, CASE_RIGHT_LEFT_ROTATE, node.id)));
				this.rightRotate(node, node.right as AVLTreeNode, data);
				this.leftRotate(parent, node, data);
			}
		}

		return this.find(value, OperationData.Ignored());
	}

	find(value: number, data: OperationData): AVLTreeNode | null {
		let current = this.root;
		let last = current?.id.toString();

		while (current) {
			data.step(StepData.new(new CompareData(value, current.id, current.value)));
			if (value === current.value) {
				data.step(StepData.new(new FoundData(current.id, value)));
				return current;
			} else if (value < current.value) {
				data.step(StepData.new(new TraverseData(current.id, current.left ? current.left.id : -1, DIRECTION_LEFT)));
				last = current.left?.id.toString() ?? `dummy-${current.id}-L`;
				current = current.left;
			} else {
				data.step(StepData.new(new TraverseData(current.id, current.right ? current.right.id : -1, DIRECTION_RIGHT)));
				last = current.right?.id.toString() ?? `dummy-${current.id}-R`;
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

		const before = this.find(value, OperationData.Ignored());

		// traverse to node to delete
		let current: AVLTreeNode | null = this.root;
		const path: AVLTreeNode[] = []; // nodes from root to parent of current
		let parent: AVLTreeNode | null = null;
		let found = false;

		while (current) {
			data.step(StepData.new(new CompareData(value, current.id, current.value)));
			if (value < current.value) {
				data.step(StepData.new(new TraverseData(current.id, current.left ? current.left.id : -1, DIRECTION_LEFT)));
				path.push(current);
				parent = current;
				current = current.left;
			} else if (value > current.value) {
				data.step(StepData.new(new TraverseData(current.id, current.right ? current.right.id : -1, DIRECTION_RIGHT)));
				path.push(current);
				parent = current;
				current = current.right;
			} else {
				// found
				data.step(StepData.new(new MarkToDeleteData(current.id, value)));
				found = true;
				break;
			}
		}

		if (!found) {
			data.step(StepData.new(new DropData(value, DROP_REASON_NOT_FOUND, parent ? parent.id.toString() : 'root')));
			return false;
		}

		// case: node with at most one child
		if (!current!.left || !current!.right) {
			if (!current!.left && !current!.right) {
				data.step(StepData.new(new CaseAnalysisData(1, CASE_LEAF_NODE, current!.id)));
			} else {
				data.step(StepData.new(new CaseAnalysisData(2, CASE_SINGLE_CHILD, current!.id)));
			}
			const child = current!.left ? current!.left : current!.right;
			let startSnapshot = this.snapshot();
			if (!child) {
				// no child
				if (!parent) {
					this.root = null;
				} else if (parent.left === current) {
					parent.left = null;
				} else {
					parent.right = null;
				}
				data.step(StepData.new(new DeleteData(current!.id, value, startSnapshot, this.snapshot())));
			} else {
				if (!parent) {
					this.root = child;
				} else if (parent.left && parent.left.id === current!.id) {
					parent.left = child;
				} else {
					parent.right = child;
				}
				data.step(
					StepData.new(
						new ReplaceWithChildData(
							current!.id,
							child.id,
							child.value,
							parent && parent.left === current ? DIRECTION_LEFT : DIRECTION_RIGHT,
							startSnapshot,
							this.snapshot(),
						),
					),
				);
			}

			// rebalance starting from parent upwards
		} else {
			// node with two children: find inorder successor
			data.step(StepData.new(new CaseAnalysisData(3, CASE_TWO_CHILDREN, current!.id)));
			let succParent = current!;
			let successor = current!.right as AVLTreeNode;
			// push current for rebalance path
			path.push(current!);
			while (successor.left) {
				path.push(successor);
				succParent = successor;
				successor = successor.left;
			}

			data.step(StepData.new(new FoundInorderSuccessorData(current!.id, successor.id, successor.value)));

			let relinkedChildId = null;
			if (succParent !== current! && successor.right) {
				let startSnapshot2 = this.snapshot();
				succParent.left = successor.right;
				data.step(
					StepData.new(
						new RelinkSuccessorChildData(
							successor.right!.id,
							successor.right!.value,
							succParent.id,
							succParent.value,
							successor.id,
							successor.value,
							startSnapshot2,
							this.snapshot(),
						),
					),
				);

				relinkedChildId = successor.right!.id;
			}

			let startSnapshot = this.snapshot();
			if (succParent !== current! && !successor.right) {
				succParent.left = null;
			}

			if (current!.right === successor) {
				current!.right = successor.right;
			}

			current!.value = successor.value;
			const prevCurrentId = current!.id;
			current!.id = successor.id;
			data.step(
				StepData.new(
					new ReplaceWithInorderSuccessorData(
						prevCurrentId,
						successor.id,
						successor.value,
						succParent.id,
						relinkedChildId,
						startSnapshot,
						this.snapshot(),
					),
				),
			);
		}

		// rebalance walking up the path
		while (path.length > 0) {
			const node = path.pop()!;
			let startSnapshot = this.snapshot();
			this.updateHeight(node);
			const balance = this.getBalance(node);
			data.step(StepData.new(new UpdateHeightBalanceData(node.id, node.height, balance, startSnapshot, this.snapshot())));
			const parentAttach = path.length > 0 ? path[path.length - 1] : null;

			// Left Left
			if (balance > 1 && this.getBalance(node.left) >= 0) {
				data.step(StepData.new(new CaseAnalysisData(1, CASE_LEFT_LEFT_ROTATE_RIGHT, node.id)));
				this.rightRotate(parentAttach, node, data);
			}

			// Left Right
			else if (balance > 1 && this.getBalance(node.left) < 0) {
				data.step(StepData.new(new CaseAnalysisData(2, CASE_LEFT_RIGHT_ROTATE, node.id)));
				this.leftRotate(node, node.left as AVLTreeNode, data);
				this.rightRotate(parentAttach, node, data);
			}

			// Right Right
			else if (balance < -1 && this.getBalance(node.right) <= 0) {
				data.step(StepData.new(new CaseAnalysisData(3, CASE_RIGHT_RIGHT_ROTATE_LEFT, node.id)));
				this.leftRotate(parentAttach, node, data);
			}

			// Right Left
			else if (balance < -1 && this.getBalance(node.right) > 0) {
				data.step(StepData.new(new CaseAnalysisData(4, CASE_RIGHT_LEFT_ROTATE, node.id)));
				this.rightRotate(node, node.right as AVLTreeNode, data);
				this.leftRotate(parentAttach, node, data);
			}
		}

		const after = this.find(value, OperationData.Ignored());
		return before !== null && after === null;
	}
}
