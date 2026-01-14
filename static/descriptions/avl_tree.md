# AVL Tree (Self-Balancing Binary Search Tree)

An **AVL Tree** (named after inventors Adelson-Velsky and Landis) is a self-balancing version of a Binary Search Tree. While a standard BST can become unbalanced and slow, an AVL Tree ensures that the height of the left and right subtrees of any node differs by at most **one**. This balance is maintained through a property called the **Balance Factor** and various **Rotations**.

## Complexity Analysis

Because the tree automatically rebalances itself after every insertion and deletion, the height is guaranteed to remain logarithmic. This ensures that operations remain efficient even in the worst-case scenarios.

| Operation | Worst Case |
| --------- | ---------- |
| Find      | O(log n)   |
| Insert    | O(log n)   |
| Delete    | O(log n)   |

## Key Concepts

- **Height**: The length of the longest path from a node to a leaf.
- **Balance Factor**: Calculated as `Height(Left Subtree) - Height(Right Subtree)`. A node is considered balanced if its factor is **-1, 0, or 1**.
- **Rotations**: Specific movements used to restructure the tree when a node becomes unbalanced (factor > 1 or < -1). The four types of rotations are:
    - **Left-Left (LL) Rotation**
    - **Right-Right (RR) Rotation**
    - **Left-Right (LR) Rotation**
    - **Right-Left (RL) Rotation**

## Search (Find)

Searching in an AVL tree is identical to a standard Binary Search Tree.

1. **Compare**: Start at the root and compare the target value to the current node.
2. **Match**: If they are equal, the value is found.
3. **Traverse**:
    - If the target is **smaller**, move to the **left child**.
    - If the target is **larger**, move to the **right child**.

4. **Drop**: If you reach an empty spot, the value does not exist in the tree.

## Insertion

Insertion is a two-phase process: finding the spot to insert and then "fixing" the tree as you walk back up to the root.

**Phase 1: Standard BST Insertion**

- Navigate the tree using comparisons until an empty spot is found.
- **Create Leaf**: A new node is created at that position.
- **Handle Duplicates**: If the value already exists, the operation is dropped.

**Phase 2: Rebalancing**:
The algorithm walks back up the path taken during insertion:

1. **Update Height & Balance**: For every node in the path, the height is updated, and the balance factor is recalculated.
2. **Check Balance**: If a node's balance factor is greater than 1 or less than -1, a rotation is performed based on the "shape" of the imbalance:
    - **Left-Left (LL)**: Right Rotation.
    - **Right-Right (RR)**: Left Rotation.
    - **Left-Right (LR)**: Left Rotate the child, then Right Rotate the node.
    - **Right-Left (RL)**: Right Rotate the child, then Left Rotate the node.

## Deletion (Remove)

Deletion is the most rigorous operation, as it combines BST deletion logic with a potential series of rebalancing rotations.

**Phase 1: Search and Mark**

- The tree is traversed to find the target node, keeping track of the path taken.
- Once found, the node is **marked for deletion**.

**Phase 2: Remove Node**

- **No Child / Single Child**: The node is removed, and its child (if any) is promoted to take its place.
- **Two Children**: The algorithm finds the **Inorder Successor** (the smallest node in the right subtree). The successor's value and identity are moved into the target node's position, and the original successor node is removed from the bottom of the tree.

**Phase 3: Rebalancing**:
Just like insertion, the algorithm walks back up the stored path to the root:

1. **Update Height & Balance**: At each step, heights are recalculated.
2. **Check Balance**: If a node becomes unbalanced due to the removal, the appropriate rotation (LL, RR, LR, or RL) is applied to restore the AVL property. Unlike insertion, a single deletion might require multiple rotations as you move up the tree.
