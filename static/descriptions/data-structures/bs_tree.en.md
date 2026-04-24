# Binary Search Tree

A Binary Search Tree (BST) is a hierarchical, node-based data structure that keeps data sorted as it is inserted. Each node contains a value and pointers to a maximum of two children: a left child and a right child. The defining characteristic of a BST is its strict ordering, which allows for fast data retrieval, insertion, and deletion by halving the searchable data at every step, much like a binary search on a sorted array.

### Rules

- **Left Subtree Property:** All nodes in the left subtree must have values strictly less than the parent node's value.
- **Right Subtree Property:** All nodes in the right subtree must have values strictly greater than the parent node's value.
- **No Duplicates:** In this specific implementation, duplicate values are not allowed.

### Complexity Analysis

The efficiency of a Binary Search Tree is entirely dependent on its height, denoted as `h`. In an optimal, perfectly balanced tree, the height is `log2(n)`, leading to very fast logarithmic operations. However, if data is inserted in a sorted or nearly sorted order (like 1, 2, 3, 4, 5), the tree degrades into a straight line, essentially becoming a Linked List. In this worst-case scenario, the height becomes `n`, and the performance drops significantly.

| Operation  | Average Case | Worst Case |
| :--------- | :----------- | :--------- |
| **Insert** | `O(log n)`   | `O(n)`     |
| **Find**   | `O(log n)`   | `O(n)`     |
| **Delete** | `O(log n)`   | `O(n)`     |

## Insert

The insertion process walks down the tree to find the correct empty spot for a new value, ensuring the BST rules are preserved.

1. **Check for Root:** If the tree is completely empty, the new value immediately becomes the root node.
2. **Compare:** Compare the new value with the current node's value.
3. **Traverse:** Decide the path based on the comparison:
    - If the new value is less than the current node, look left. If there is no left child, create a new leaf node here. Otherwise, traverse to the left child and repeat step 2.
    - If the new value is greater than the current node, look right. If there is no right child, create a new leaf node here. Otherwise, traverse to the right child and repeat step 2.
4. **Drop Duplicate:** If the new value equals the current node's value, the operation halts and the value is dropped, as duplicates are rejected.

## Find

Searching the tree uses the exact same traversal logic as insertion.

1. **Compare:** Start at the root and compare the target value with the current node.
2. **Found:** If the values match, the node is successfully found.
3. **Traverse:** Decide the path based on the comparison:
    - If the target is smaller, traverse to the left child.
    - If the target is larger, traverse to the right child.
4. **Not Found:** On an attempt to traverse to a child that does not exist (a null pointer), the search is dropped, meaning the value is not in the tree.

## Delete

Removing a node is the most complex operation in a BST because the tree must reconnect itself without breaking the sorting rules. First, the tree searches for the target value, tracking the parent node along the way. Once found and marked for deletion, the tree analyzes the node's children to determine the removal strategy.

### Case 1: Leaf Node

This is the simplest case. If the node to be deleted has no children, it is simply removed by setting its parent's pointer to null.

### Case 2: Single Child

If the node has only one child (either left or right), we bypass the node entirely. The tree replaces the deleted node by linking its parent directly to its single child.

### Case 3: Two Children

If the node has both a left and right child, we cannot simply delete it without leaving its children disconnected.

1. **Find the In-order Successor:** The tree finds the node with the next highest value. This is done by stepping to the right child once, and then traversing as far left as possible.
2. **Relink Successor's Child:** If the successor happens to have a right child of its own, that child is relinked to the successor's parent.
3. **Replace:** The original target node's value is replaced with the successor's data. The original node's structural position remains intact, but the data is overwritten, effectively deleting the target value and maintaining a valid BST.

## Notes

While the Binary Search Tree is a brilliant introductory structure, its fatal flaw is the lack of self-balancing.

**When NOT to use this:** Standard BSTs should be avoided if the input data might be pre-sorted, as the worst-case `O(n)` complexity makes it unacceptably slow for large datasets.

In the real world, standard BSTs are rarely used in production code. Instead, they serve as the foundational logic for **self-balancing trees** (like AVL Trees and Red-Black Trees). These advanced structures use the exact same insertion and deletion logic, but add complex rotations at the end of the operations to guarantee the tree remains short and wide, locking in that optimal logarithmic time complexity.
