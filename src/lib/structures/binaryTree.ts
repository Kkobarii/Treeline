import { AnimationData } from "$lib/animation/animationData";
import { json } from "@sveltejs/kit";
import { TreeNode, Tree } from "./generic";

export class BinaryTreeNode<T> extends TreeNode {
    value: T;
    left: BinaryTreeNode<T> | null = null;
    right: BinaryTreeNode<T> | null = null;

    constructor(id: number, value: T) {
        super(id);
        this.value = value;
    }
}

export class BinaryTree<T> extends Tree<T> {
    root: BinaryTreeNode<T> | null = null;

    insert_node(value: T, data: AnimationData): BinaryTreeNode<T> | null {
        const newNode = new BinaryTreeNode(this.generateId(), value);

        if (!this.root) {
            data.addStep(`Inserting ${value} as root node.`);
            this.root = newNode;
            return newNode;
        }
        
        let current = this.root;
        while (true) {
            data.addStep(`Comparing ${value} with ${current.value}.`);
            if (value < current.value) {
                data.addStep(`Going left from ${current.value}.`);
                if (!current.left) {
                    data.addStep(`Inserting ${value} to the left of ${current.value}.`);
                    current.left = newNode;
                    break;
                }
                current = current.left;
            } else {
                data.addStep(`Going right from ${current.value}.`);
                if (!current.right) {
                    data.addStep(`Inserting ${value} to the right of ${current.value}.`);
                    current.right = newNode;
                    break;
                }
                current = current.right;
            }
        }
        return newNode;
    }

    find_node(value: T, data: AnimationData): BinaryTreeNode<T> | null {
        let current = this.root;

        while (current) {
            data.addStep(`Comparing ${value} with ${current.value}.`);
            if (value === current.value) {
                data.addStep(`Found ${value} in the tree.`);
                return current;
            } else if (value < current.value) {
                data.addStep(`Going left from ${current.value}.`);
                current = current.left;
            } else {
                data.addStep(`Going right from ${current.value}.`);
                current = current.right;
            }
        }

        data.addStep(`${value} not found in the tree.`);
        return null;
    }

    remove_node(value: T, data: AnimationData): boolean {

        const swap = (nodeA: BinaryTreeNode<T>, nodeB: BinaryTreeNode<T>) => {
            const temp = nodeA.value;
            nodeA.value = nodeB.value;
            nodeB.value = temp;
            data.addStep(`Swapped values ${nodeA.value} and ${nodeB.value}.`);
        }

        const deleteRecursively = (node: BinaryTreeNode<T> | null, value: T): BinaryTreeNode<T> | null => {    
            if (!node) {
                data.addStep(`${value} not found in the tree.`);
                return null;
            }
            data.addStep(`Comparing ${value} with ${node.value}.`);
            if (value < node.value) {
                data.addStep(`Going left from ${node.value}.`);
                node.left = deleteRecursively(node.left, value);
            } else if (value > node.value) {
                data.addStep(`Going right from ${node.value}.`);
                node.right = deleteRecursively(node.right, value);
            } else {
                data.addStep(`Found ${value}, deleting...`);
                if (!node.left && !node.right) {
                    data.addStep(`Deleting leaf node ${value}.`);
                    return null;
                }
                if (!node.left) {
                    data.addStep(`Replacing ${value} with right child.`);
                    return node.right;
                }
                if (!node.right) {
                    data.addStep(`Replacing ${value} with left child.`);
                    return node.left;
                }
                let temp = node.right;
                while (temp.left) temp = temp.left;
                data.addStep(`Replacing ${value} with inorder successor ${temp.value}.`);
                node.value = temp.value;
                node.right = deleteRecursively(node.right, temp.value);
            }
            return node;
        }
        this.root = deleteRecursively(this.root, value);
        return true;
    }
}