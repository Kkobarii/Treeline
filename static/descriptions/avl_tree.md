# AVL Tree

## Overview

An **AVL tree** is a self-balancing binary search tree that maintains a strictly limited height to guarantee efficient operations. It extends the Binary Search Tree by enforcing an additional **balance condition** on every node.

An AVL tree requires that the **balance factor** of every node is **−1, 0, or 1**. If an insertion or deletion violates this condition, the tree is rebalanced using **rotations**, which are local restructuring operations that preserve the binary search tree property.

## General Properties and Complexity

| Operation | Worst Case |
| --------- | ---------- |
| Find      | O(log n)   |
| Insert    | O(log n)   |
| Delete    | O(log n)   |

Because the height of an AVL tree is always logarithmic, all fundamental operations execute in logarithmic time.

## Find (Search) Operation

The **find** operation in an AVL tree is identical to the find operation in a standard Binary Search Tree.

### Algorithm Description

1. Start at the root node.
2. Compare the searched key with the key of the current node.
3. Continue to the left subtree if the key is smaller, or to the right subtree if the key is larger.
4. Repeat until the key is found or a null reference is reached.

Balancing does not affect the logic of the search; it only guarantees that the number of visited nodes is limited.

## Insert Operation

Insertion into an AVL tree consists of two phases: **standard BST insertion** and **rebalancing**.

### Algorithm Description

1. Insert the new key using the standard Binary Search Tree insertion procedure.
2. Traverse upward from the inserted node toward the root.
3. At each visited node:
    - Update its height.
    - Compute its balance factor.

4. If a node becomes unbalanced, identify the imbalance type based on the structure of its subtrees.
5. Apply the appropriate rotation to restore balance.

During insertion, only the **lowest unbalanced node** requires rebalancing.

## Rotations in AVL Trees

Rotations are local operations that rearrange a small number of nodes to restore balance while preserving the in-order traversal of the tree.

### 1. Right Rotation (LL Case)

This rotation is used when a node becomes unbalanced due to insertion in the **left subtree of its left child**.

**Condition:**

- balance factor > 1
- left child has balance factor ≥ 0

**Transformation:**

```
    z                y
   /                / \
  y       →        x   z
 /
x
```

The right rotation moves node `y` up and node `z` down to the right.

### 2. Left Rotation (RR Case)

This rotation is symmetric to the right rotation and is used when insertion occurs in the **right subtree of the right child**.

**Condition:**

- balance factor < −1
- right child has balance factor ≤ 0

**Transformation:**

```
z                     y
 \                   / \
  y        →        z   x
   \
    x
```

The left rotation moves node `y` up and node `z` down to the left.

### 3. Left-Right Rotation (LR Case)

This rotation is used when insertion occurs in the **right subtree of the left child**.

**Condition:**

- balance factor > 1
- left child has balance factor < 0

**Transformation:**

```
    z               z               x
   /               /               / \
  y       →       x       →       y   z
   \             /
    x           y
```

This operation consists of:

1. A **left rotation** on the left child
2. A **right rotation** on the unbalanced node

### 4. Right-Left Rotation (RL Case)

This rotation is symmetric to the Left-Right case and is used when insertion occurs in the **left subtree of the right child**.

**Condition:**

- balance factor < −1
- right child has balance factor > 0

**Transformation:**

```
z                 z                   x
 \                 \                 / \
  y       →         x       →       z   y
 /                   \
x                     y
```

This operation consists of:

1. A **right rotation** on the right child
2. A **left rotation** on the unbalanced node

## Delete Operation

Deletion in an AVL tree follows the same logic as in a Binary Search Tree but requires additional rebalancing.

### Algorithm Description

1. Remove the node using standard BST deletion:
    - Remove leaf nodes directly.
    - Replace nodes with one child by their child.
    - Replace nodes with two children by their in-order successor.

2. Starting from the parent of the removed node, traverse upward toward the root.
3. At each visited node:
    - Update its height.
    - Compute its balance factor.

4. If a node becomes unbalanced, apply the appropriate rotation.
5. Continue until the root is reached.

Unlike insertion, deletion may cause multiple nodes to become unbalanced, requiring several rotations.
