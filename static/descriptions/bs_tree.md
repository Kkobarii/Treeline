# Binary Search Tree (BST)

## Overview

A **Binary Search Tree (BST)** is a hierarchical data structure designed to store and organize keys in a way that enables efficient search operations. Each element is stored in a **node**, and each node may have at most two children, referred to as the **left** and **right** child.

The defining characteristic of a BST is the **binary search tree property**, which states that for every node:

- all keys in the left subtree are strictly smaller than the key stored in the node, and
- all keys in the right subtree are strictly greater than the key stored in the node.

This property is applied recursively throughout the tree. The structure begins with a single node called the **root**, from which all operations originate.

## General Properties and Complexity

| Operation | Average Case | Worst Case |
| --------- | ------------ | ---------- |
| Find      | O(log n)     | O(n)       |
| Insert    | O(log n)     | O(n)       |
| Delete    | O(log n)     | O(n)       |

The worst-case time complexity occurs when the tree becomes degenerate, meaning that each node has only one child and the structure resembles a linear list.

## Find Operation

The **find** operation determines whether a given key exists in the tree.

### Algorithm Description

1. Start at the **root node**.
2. Compare the searched key with the key stored in the current node:
    - If the keys are **equal**, the search is successful and the node has been found.
    - If the searched key is **smaller**, continue searching in the **left subtree**.
    - If the searched key is **greater**, continue searching in the **right subtree**.

3. Repeat this process until the key is found or a null reference is reached.

## Insert Operation

The **insert** operation adds a new key to the tree while maintaining the binary search tree property.

### Algorithm Description

1. Start at the **root node**.
2. Compare the key to be inserted with the key of the current node:
    - If the new key is **smaller**, move to the **left child**.
    - If the new key is **greater**, move to the **right child**.

3. Continue this process until a **null position** is reached.
4. Insert the new key at this position by creating a new node.
5. The new node is inserted as a **leaf node**.

## Delete Operation

The **delete** operation removes a node with a given key while preserving the binary search tree property.

### Case 1: Node with No Children

1. Locate the node to be deleted.
2. Remove the node by setting the corresponding child reference of its parent to null.

### Case 2: Node with One Child

1. Locate the node to be deleted.
2. Replace the node with its single child.
3. Update the parent of the deleted node to point directly to this child.

### Case 3: Node with Two Children

1. Locate the node to be deleted.
2. Find the **in-order successor**, which is the smallest node in the right subtree.
3. Copy the successor’s key into the node being deleted.
4. Remove the successor node from its original position.
