# Binary Search Tree (BST)

A **Binary Search Tree (BST)** is a fundamental hierarchical data structure used for efficient data storage and retrieval. It is composed of nodes, where each node contains a value and up to two "children," typically referred to as the left child and the right child.

The defining characteristic of a BST is its ordering principle:

- The **Left Subtree** of a node contains only values strictly less than the node’s value.
- The **Right Subtree** of a node contains only values strictly greater than the node’s value.
- Duplicate values are generally not permitted.

This organizational structure allows the tree to act like a sorted list while maintaining the hierarchical advantages of a tree, significantly narrowing the search space during operations.

## Complexity Analysis

The efficiency of a Binary Search Tree is directly tied to its **height** (). In a well-balanced tree, the height is logarithmic relative to the number of nodes (); however, in the worst-case scenario (such as inserting sorted data), the tree can become a "degenerate" line.

| Operation | Average Case | Worst Case |
| --------- | ------------ | ---------- |
| Find      | O(log n)     | O(n)       |
| Insert    | O(log n)     | O(n)       |
| Delete    | O(log n)     | O(n)       |

## Search (Find)

To find a specific value, the process begins at the **Root** node. The algorithm performs a series of comparisons to navigate the tree:

1. **Compare**: The target value is compared to the current node's value.
2. **Match**: If the values are equal, the search is successful.
3. **Traverse**:
    - If the target value is **smaller** than the current node, the search moves to the **left child**.
    - If the target value is **larger** than the current node, the search moves to the **right child**.

4. **Drop**: If the search reaches an empty branch (a null reference) without finding a match, the value does not exist in the tree.

## Insertion

Insertion follows a path similar to searching to ensure the new value is placed in the correct location to maintain the tree's properties.

1. **Check for Empty Tree**: If the tree has no nodes, the new value is placed at the **Root**.
2. **Comparison Loop**: If the tree is not empty, the algorithm compares the new value against the current node:
    - **Go Left**: If the new value is smaller, it checks the left child. If the left spot is empty, it **creates a new leaf** there. Otherwise, it traverses deeper into the left subtree.
    - **Go Right**: If the new value is larger, it checks the right child. If the right spot is empty, it **creates a new leaf** there. Otherwise, it traverses deeper into the right subtree.

3. **Handle Duplicates**: If the value already exists in the tree, the operation is **dropped** because BSTs typically require unique keys.

## Deletion (Remove)

Deletion is the most complex operation because the tree must be restructured to remain valid after a node is removed. The process first involves searching for the node and then analyzing one of three cases:

### Phase 1: Search and Mark

The algorithm traverses the tree to find the target value. Once found, the node is **marked for deletion**.

### Phase 2: Case Analysis

Depending on the number of children the marked node has, one of the following strategies is used:

- **Case 1: Leaf Node (No Children)**
  The node is simply removed from the tree, and the parent's reference to it is cleared.
- **Case 2: Single Child**
  The node is removed, and its only child is promoted to take its place. The parent of the deleted node is **relinked** directly to this child.
- **Case 3: Two Children**
  To maintain the BST order, the node cannot simply be removed. Instead, the algorithm finds the **Inorder Successor** (the smallest value in the right subtree).
    1. **Identify Successor**: Navigate to the right child, then move left as far as possible.
    2. **Relink Successor Child**: If the successor has a right child, that child is relinked to the successor's parent to ensure no data is lost.
    3. **Replace**: The value and identity of the node marked for deletion are replaced by the successor's value and identity, effectively "swapping" the successor into the target position.
