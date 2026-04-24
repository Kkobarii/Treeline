# AVL Tree

An AVL Tree is a highly structured, self-balancing Binary Search Tree. Named after its inventors (Adelson-Velsky and Landis), it solves the primary flaw of a standard binary tree by ensuring the structure never degrades into a straight line. It does this by constantly monitoring its own shape and automatically reorganizing itself whenever it becomes too lopsided.

In the visual graph representation, there is a yellow rectangle to the right of each node. This displays two important pieces of information: **H** for the node's Height, and **B** for its Balance factor.

### Key Concepts

Understanding how this tree maintains its shape requires looking at the metrics used to measure it and the structural moves used to fix it.

- **Height (H):** This is the length of the longest path from a given node down to a leaf. A leaf node always has a height of 1.
- **Balance Factor (B):** This is calculated by taking the height of a node's left child and subtracting the height of its right child.
- **Rotations:** When the tree detects an imbalance, it uses structural shifts called rotations to fix it.
    - **Right Rotation:** Used to fix left-heavy imbalances. It pulls the left child up and pushes the current root down to the right.
    - **Left Rotation:** Used to fix right-heavy imbalances. It pulls the right child up and pushes the current root down to the left.
    - **Left Right Rotation:** A two-step fix. First, a left rotation on the left child, followed by a right rotation on the parent.
    - **Right Left Rotation:** A two-step fix. First, a right rotation on the right child, followed by a left rotation on the parent.

### Rules

- **BST Properties:** All standard Binary Search Tree rules apply. Left children must be strictly smaller, and right children strictly greater. Duplicate values are dropped.
- **The AVL Property:** For every single node in the tree, the Balance factor must always be `-1`, `0`, or `1`. If any operation causes a node's balance to hit `2` or `-2`, the tree is officially unbalanced and must immediately rotate to fix it.

### Complexity Analysis

Because the AVL Tree strictly enforces its balancing rules, the height of the tree is mathematically guaranteed to remain at `O(log n)`. This means the worst-case scenario of a standard binary tree simply cannot happen here, resulting in highly consistent performance.

| Operation  | Worst Case |
| :--------- | :--------- |
| **Insert** | `O(log n)` |
| **Find**   | `O(log n)` |
| **Delete** | `O(log n)` |

## Insert

Insertion begins identically to a standard tree, but adds a strict rebalancing phase on the way back up.

1.  **BST Insertion**: Traverse the tree and insert the new leaf node exactly as in a standard Binary Search Tree. Keep track of the path taken from the root to this new node.
2.  **Update and Check**: Walk backwards up the path from the new node to the root. At each step, update the node's Height (H) and recalculate its Balance factor (B).
3.  **Rebalance**: If a node with a balance factor of `2` or `-2` is encountered, the shape of the imbalance is analyzed to apply the correct rotation. The type of imbalance is determined by looking at the heavy subtree and its child:
    - **Left Left Imbalance:** The node is left-heavy (B = `2`), and its left child is also left-heavy or balanced. Fixed with a Right Rotation.
    - **Right Right Imbalance:** The node is right-heavy (B = `-2`), and its right child is also right-heavy or balanced. Fixed with a Left Rotation.
    - **Left Right Imbalance:** The node is left-heavy (B = `2`), but its left child is right-heavy. Fixed with a Left Right Rotation.
    - **Right Left Imbalance:** The node is right-heavy (B = `-2`), but its right child is left-heavy. Fixed with a Right Left Rotation.

## Find

Searching the tree uses the exact same traversal logic as a standard Binary Search Tree. Since finding a value does not alter the structure, no heights or balance factors need to be checked.

## Delete

Deletion is the most resource-intensive operation, as removing a node can cause a cascading effect of imbalances all the way up to the root.

1.  **BST Deletion**: Find the target node and remove it using standard BST rules (handling the leaf, single child, or two children cases). Track the path back to the root starting from the parent of the removed or moved node.
2.  **Update and Check**: Trace the steps back up the tree, updating the Height and Balance factor for every node along the path.
3.  **Rebalance**: Just like in insertion, apply rotations if any node's balance factor becomes invalid, identifying the specific imbalance type (Left Left, Right Right, Left Right, or Right Left) using the same logic. However, unlike insertion (which is fixed with a single rotation sequence), deleting a node shrinks a subtree and might trigger further imbalances higher up. This means rotations can cascade multiple times before the root is reached.

## Notes

The AVL Tree is an excellent choice for read-heavy applications where fast search times are essential. Because it is so rigidly balanced, extremely fast lookups are mathematically guaranteed.

**When NOT to use this:** AVL trees should be avoided if the application is write-heavy, meaning it requires a massive volume of constant insertions and deletions. The strict balance rules mean the tree has to spend a lot of computational effort constantly rotating and updating heights. In these scenarios, a slightly looser self-balancing structure, like a Red-Black Tree, is often preferred by engineers because it requires fewer rotations to maintain itself.
