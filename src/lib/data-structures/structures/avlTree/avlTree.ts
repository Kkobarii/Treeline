import { OperationData } from '$lib/data-structures/operation/operationData';
import { Step } from '$lib/data-structures/operation/stepData';
import { deepCopy } from '$lib/data-structures/utils/utils';

import { DataNode, DataStructure, OperationType, type OperationTypeValue } from '../dataStructure';

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
    private rightRotate(y: AVLTreeNode): AVLTreeNode {
        const x = y.left as AVLTreeNode;
        const T2 = x.right;

        // perform rotation
        x.right = y;
        y.left = T2;

        // update heights
        this.updateHeight(y);
        this.updateHeight(x);

        return x;
    }

    //
    //   x                             y
    //  / \                           / \
    // T1  y     Left Rotate(x)      x   T3
    //    / \    - - - - - - - ->   / \
    //   T2  T3                   T1  T2
    //
    private leftRotate(x: AVLTreeNode): AVLTreeNode {
        const y = x.right as AVLTreeNode;
        const T2 = y.left;

        // perform rotation
        y.left = x;
        x.right = T2;

        // update heights
        this.updateHeight(x);
        this.updateHeight(y);

        return y;
    }

    insert(value: number, data: OperationData): AVLTreeNode | null {
        if (!this.root) {
            const newNode = new AVLTreeNode(this.generateId(), value);
            let startSnapshot = this.snapshot();
            this.root = newNode;
            data.step(Step.Common.CreateRoot(newNode.id, value, startSnapshot, this.snapshot()));
            return newNode;
        }

        const insertRec = (
            node: AVLTreeNode | null,
            parentId: number | null,
            direction: 'left' | 'right' | null,
        ): AVLTreeNode | null => {
                if (!node) {
                const newNode = new AVLTreeNode(this.generateId(), value);
                if (parentId === null) {
                    let startSnapshot = this.snapshot();
                        data.step(Step.Common.CreateRoot(newNode.id, value, startSnapshot, this.snapshot()));
                } else {
                    let startSnapshot = this.snapshot();
                    data.steps.pop();
                        data.step(Step.Common.CreateLeaf(newNode.id, value, parentId, direction as 'left' | 'right', startSnapshot, this.snapshot()));
                }
                return newNode;
            }

            data.step(Step.Common.Compare(value, node.id, node.value));
            if (value < node.value) {
                data.step(Step.Common.Traverse(node.id, node.left ? node.left.id : -1, 'left'));
                node.left = insertRec(node.left, node.id, 'left');
            } else if (value > node.value) {
                data.step(Step.Common.Traverse(node.id, node.right ? node.right.id : -1, 'right'));
                node.right = insertRec(node.right, node.id, 'right');
            } else {
                data.step(Step.Common.Drop(value, 'duplicate value', node.id.toString()));
                return node;
            }

            // update height and rebalance
            this.updateHeight(node);
            const balance = this.getBalance(node);
            data.step(Step.AVLTree.UpdateHeightBalance(node.id, node.height, balance, this.snapshot(), this.snapshot()));

            // Left Left
            if (balance > 1 && value < node.left!.value) {
                let startSnapshot = this.snapshot();
                const rotated = this.rightRotate(node);
                data.step(Step.AVLTree.RotateRight(node.id, rotated.id, startSnapshot, this.snapshot()));
                return rotated;
            }

            // Right Right
            if (balance < -1 && value > node.right!.value) {
                let startSnapshot = this.snapshot();
                const rotated = this.leftRotate(node);
                data.step(Step.AVLTree.RotateLeft(node.id, rotated.id, startSnapshot, this.snapshot()));
                return rotated;
            }

            // Left Right
            if (balance > 1 && value > node.left!.value) {
                let startSnapshot = this.snapshot();
                node.left = this.leftRotate(node.left!);
                const rotated = this.rightRotate(node);
                data.step(Step.AVLTree.RotateRight(node.id, rotated.id, startSnapshot, this.snapshot()));
                return rotated;
            }

            // Right Left
            if (balance < -1 && value < node.right!.value) {
                let startSnapshot = this.snapshot();
                node.right = this.rightRotate(node.right!);
                const rotated = this.leftRotate(node);
                data.step(Step.AVLTree.RotateLeft(node.id, rotated.id, startSnapshot, this.snapshot()));
                return rotated;
            }

            return node;
        };

        this.root = insertRec(this.root, null, null);
        let tmpData = new OperationData("temp", this.snapshot());
        return this.find(value, tmpData);
    }

    find(value: number, data: OperationData): AVLTreeNode | null {
        let current = this.root;
        let last = current?.id.toString();

        while (current) {
            data.step(Step.Common.Compare(value, current.id, current.value));
            if (value === current.value) {
                data.step(Step.Common.Found(current.id, value));
                return current;
            } else if (value < current.value) {
                data.step(Step.Common.Traverse(current.id, current.left ? current.left.id : -1, 'left'));
                last = current.left?.id.toString() ?? `dummy-${current.id}-L`;
                current = current.left;
            } else {
                data.step(Step.Common.Traverse(current.id, current.right ? current.right.id : -1, 'right'));
                last = current.right?.id.toString() ?? `dummy-${current.id}-R`;
                current = current.right;
            }
        }

        data.step(Step.Common.Drop(value, 'not found', last!));
        return null;
    }

    remove(value: number, data: OperationData): boolean {
        if (!this.root) {
            data.step(Step.Common.Drop(value, 'not found', 'root'));
            return false;
        }

        const removeRec = (node: AVLTreeNode | null): AVLTreeNode | null => {
            if (!node) return null;

            data.step(Step.Common.Compare(value, node.id, node.value));
            if (value < node.value) {
                data.step(Step.Common.Traverse(node.id, node.left ? node.left.id : -1, 'left'));
                node.left = removeRec(node.left);
            } else if (value > node.value) {
                data.step(Step.Common.Traverse(node.id, node.right ? node.right.id : -1, 'right'));
                node.right = removeRec(node.right);
            } else {
                // found node
                data.step(Step.Common.MarkToDelete(node.id, value));

                // node with only one child or no child
                if (!node.left || !node.right) {
                    const child = node.left ? node.left : node.right;
                    let startSnapshot = this.snapshot();
                    if (!child) {
                        // no child
                        data.step(Step.Common.Delete(node.id, value, startSnapshot, this.snapshot()));
                        return null;
                    } else {
                        data.step(Step.Common.ReplaceWithChild(node.id, child.id, child.value, node.left ? 'left' : 'right', startSnapshot, this.snapshot()));
                        return child;
                    }
                }

                // node with two children: get inorder successor
                let succParent = node;
                let successor = node.right as AVLTreeNode;
                while (successor.left) {
                    succParent = successor;
                    successor = successor.left;
                }

                data.step(Step.Common.FoundInorderSuccessor(node.id, successor.id, successor.value));

                if (succParent !== node && successor.right) {
                    let startSnapshot2 = this.snapshot();
                    succParent.left = successor.right;
                    data.step(Step.Common.RelinkSuccessorChild(successor.right!.id, successor.right!.value, succParent.id, succParent.value, successor.id, startSnapshot2, this.snapshot()));
                }

                let startSnapshot = this.snapshot();
                if (succParent !== node && !successor.right) {
                    succParent.left = null;
                }

                if (node.right === successor) {
                    node.right = successor.right;
                }

                node.value = successor.value;
                data.step(Step.Common.ReplaceWithInorderSuccessor(node.id, successor.id, successor.value, succParent.id, startSnapshot, this.snapshot()));
            }

            // if the tree had only one node
            if (!node) return null;

            // update height and balance
            this.updateHeight(node);
            const balance = this.getBalance(node);

            // Left Left
            if (balance > 1 && this.getBalance(node.left) >= 0) {
                let startSnapshot = this.snapshot();
                const rotated = this.rightRotate(node);
                data.step(Step.AVLTree.RotateRight(node.id, rotated.id, startSnapshot, this.snapshot()));
                return rotated;
            }

            // Left Right
            if (balance > 1 && this.getBalance(node.left) < 0) {
                let startSnapshot = this.snapshot();
                node.left = this.leftRotate(node.left as AVLTreeNode);
                const rotated = this.rightRotate(node);
                data.step(Step.AVLTree.RotateRight(node.id, rotated.id, startSnapshot, this.snapshot()));
                return rotated;
            }

            // Right Right
            if (balance < -1 && this.getBalance(node.right) <= 0) {
                let startSnapshot = this.snapshot();
                const rotated = this.leftRotate(node);
                data.step(Step.AVLTree.RotateLeft(node.id, rotated.id, startSnapshot, this.snapshot()));
                return rotated;
            }

            // Right Left
            if (balance < -1 && this.getBalance(node.right) > 0) {
                let startSnapshot = this.snapshot();
                node.right = this.rightRotate(node.right as AVLTreeNode);
                const rotated = this.leftRotate(node);
                data.step(Step.AVLTree.RotateLeft(node.id, rotated.id, startSnapshot, this.snapshot()));
                return rotated;
            }

            return node;
        };

        let tmpData = new OperationData("temp", this.snapshot());
        const before = this.find(value, tmpData);
        this.root = removeRec(this.root);
        const after = this.find(value, tmpData);

        return before !== null && after === null;
    }
}
