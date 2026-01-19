# Binary Heap

A **Binary Heap** is a specialized tree-based data structure that is primarily used to implement priority queues. It is a **Complete Binary Tree**, which means every level of the tree is fully filled, except possibly the last level, which is filled from left to right.

The most important feature of a heap is the **Heap Property**:

- **Min-Heap**: The value of every node is greater than or equal to the value of its parent. Consequently, the smallest value is always at the root.
- **Max-Heap**: The value of every node is less than or equal to the value of its parent. Consequently, the largest value is always at the root.

The simulation visualizes a Max-Heap, but the principles apply similarly to Min-Heaps with the comparisons reversed.

## Complexity Analysis

Because a heap is always a complete tree, its height is guaranteed to be logarithmic. This ensures that the elements can be rearranged quickly after any change.

| Operation        | Time Complexity |
| ---------------- | --------------- |
| **Peek (Root)**  | O(1)            |
| **Insert**       | O(log n)        |
| **Extract Root** | O(log n)        |

## Insertion

To add a new value while keeping the tree "complete," the algorithm follows a specific path from the bottom up.

1. **Initial Placement**: The new value is placed in the first available spot at the bottom of the tree (the leftmost empty position in the last level). This preserves the structural integrity of the complete tree.
2. **Comparison and Sift-Up**:
    - The algorithm compares the new value with its **parent**.
    - **The Swap**: If the heap property is violated (e.g., in a Max-Heap, if the new value is larger than its parent), the two nodes are swapped.

3. **Path Traversal**: This process repeats, moving the node up the tree until it either reaches the **root** or finds a parent that satisfies the heap property.

## Extract Root

Extracting the root is the process of removing the highest-priority element. Because we cannot leave the root empty, the tree must be restructured.

1. **Identify the Successor**: The value at the root is removed. To keep the tree complete, the **last node** (the rightmost node at the bottom level) is moved to the root position.
2. **Comparison and Sift-Down**:
    - The algorithm compares the new root value with its **children**.
    - **Identify Priority Child**: In a Max-Heap, the algorithm looks for the larger of the two children. In a Min-Heap, it looks for the smaller.

3. **The Swap**: If the child has a higher priority than the current node, they are swapped.
4. **Path Traversal**: The node continues to "sift down" the tree, swapping with its priority child at each level until it is correctly positioned (i.e., it is larger than its children or it has reached the bottom).
