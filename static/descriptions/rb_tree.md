# Red–Black Tree

## Overview

A **Red–Black Tree** is a self-balancing binary search tree that ensures efficient operations by enforcing a set of structural rules based on **node coloring**. Each node is assigned one of two colors: **red** or **black**. These colors are not used for searching but serve to maintain balance in the tree.

A Red–Black Tree satisfies the following properties:

1. Every node is either red or black.
2. The root of the tree is always black.
3. All leaves (null references) are considered black.
4. If a node is red, both of its children must be black (no two red nodes may be adjacent).
5. Every path from a node to its descendant leaves contains the same number of black nodes.

These rules guarantee that the longest path from the root to any leaf is no more than twice the length of the shortest path, ensuring that the height of the tree remains logarithmic.

## General Properties and Complexity

| Operation | Worst Case |
| --------- | ---------- |
| Find      | O(log n)   |
| Insert    | O(log n)   |
| Delete    | O(log n)   |

The balancing rules ensure that all fundamental operations execute in logarithmic time.

## Find (Search) Operation

The **find** operation in a Red–Black Tree is identical to the find operation in a standard Binary Search Tree.

### Algorithm Description

1. Start at the root node.
2. Compare the searched key with the key of the current node.
3. If the searched key is smaller, continue in the left subtree; if larger, continue in the right subtree.
4. Repeat until the key is found or a null reference is reached.

The coloring of nodes does not affect the search logic. Its purpose is solely to maintain a balanced structure and guarantee efficient traversal.

## Insert Operation

Insertion into a Red–Black Tree consists of a standard BST insertion followed by a **fix-up procedure** to restore the Red–Black properties.

### Algorithm Description

1. Insert the new key using the standard Binary Search Tree insertion algorithm.
2. Color the newly inserted node **red**.
3. If the parent of the new node is black, no properties are violated and the algorithm terminates.
4. If the parent is red, a violation occurs and a fix-up procedure is required.
5. The fix-up process considers the color of the node’s **uncle** and applies recoloring and rotations as needed.
6. The process continues upward until all Red–Black properties are restored.
7. Ensure that the root is colored black.

## Insertion Fix-Up Cases

### Case 1: Red Uncle (Recoloring)

If both the parent and the uncle of the inserted node are red, the violation is resolved by recoloring.

**Action:**

- Color the parent and uncle black.
- Color the grandparent red.
- Continue the fix-up process from the grandparent.

```
    B            R
   / \          / \
  R   R   →    B   B
     /
    R
```

This case does not require rotations but may propagate the violation upward.

### Case 2: Black Uncle and Inner Child

If the uncle is black and the inserted node is an inner child (left child of a right parent or right child of a left parent), a rotation is performed to transform the situation into Case 3.

**Example (Left-Right case):**

```
    B            B
   /            /
  R      →     R
   \          /
    R        R
```

A rotation is applied to the parent, changing the structure but not fully resolving the violation.

### Case 3: Black Uncle and Outer Child

If the uncle is black and the inserted node is an outer child, a rotation and recoloring restore the properties.

**Action:**

- Rotate around the grandparent.
- Recolor the parent black.
- Recolor the grandparent red.

```
    B            R
   /            /
  R      →     B
 /
R
```

After this step, all Red–Black properties are restored locally.

## Delete Operation

Deletion in a Red–Black Tree is the most complex operation due to the strict balancing rules. It begins with standard BST deletion and may require a fix-up procedure if a black node is removed.

### Algorithm Description

1. Remove the node using the standard Binary Search Tree deletion algorithm.
2. If the removed node was red, no properties are violated and the algorithm terminates.
3. If the removed node was black, a **double-black** violation may occur.
4. A fix-up procedure is applied to eliminate the double-black condition.
5. The process continues upward until the Red–Black properties are restored or the root is reached.
6. Ensure that the root is colored black.

## Deletion Fix-Up Cases

### Case 1: Red Sibling

If the sibling of the double-black node is red, a rotation and recoloring are applied to convert the situation into a case with a black sibling.

```
    B            B
   / \          / \
  DB  R   →    R   B
```

### Case 2: Black Sibling with Black Children

If the sibling and both of its children are black, the sibling is recolored red, and the double-black violation moves up to the parent.

### Case 3: Black Sibling with One Red Child

A rotation and recoloring are performed to transform the structure into Case 4.

### Case 4: Black Sibling with Outer Red Child

A final rotation and recoloring resolve the double-black violation completely.

After this step, all Red–Black properties are restored.
