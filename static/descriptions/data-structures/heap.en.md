# Heap

A Heap is a specialized, tree-based data structure that satisfies a specific ordering property. While it is visualized as a binary tree, it is typically implemented internally as a flattened, one-dimensional array. This structure is highly efficient for continually retrieving the highest (or lowest) priority element from a dynamically changing dataset, making it the foundational structure for priority queues.

Based on the specific logic where parent nodes must be larger than their children, this implementation is a Max-Heap.

### Rules

- **The Shape Property:** The tree must be a complete binary tree. This means every level of the tree is fully populated with nodes, except possibly the very last level, which must be filled from left to right without any gaps.
- **The Heap Property:** For a Max-Heap, the value of any given node must always be greater than or equal to the values of its children. This guarantees that the largest value in the entire structure is always sitting at the root.
- **Array Mapping:** Because the tree is perfectly complete, it can be mathematically mapped to an array. A node at a given index `i` will always find its left child at `2i + 1`, its right child at `2i + 2`, and its parent at `(i - 1) / 2` rounded down.

### Complexity Analysis

Because the complete binary tree shape is strictly enforced, the tree is always perfectly balanced, as all things should be. The height is mathematically bound to `O(log n)`. Finding the maximum element is extremely fast because it is always the root, but modifying the heap requires walking up or down the height of the tree to restore the rules.

| Operation        | Worst Case |
| :--------------- | :--------- |
| **Peek**         | `O(1)`     |
| **Insert**       | `O(log n)` |
| **Extract Root** | `O(log n)` |

## Insert

Inserting a new value adds it to the bottom of the tree to maintain the shape property, and then filters it upward to restore the heap property.

1. **Append:** Add the new value to the very bottom level of the tree in the next available leftmost spot. In the array representation, this simply means appending the value to the end of the list.
2. **Compare:** Compare the newly added node with its parent.
3. **Bubble Up:** If the new value is larger than its parent, swap the two nodes. Continue this process of comparing and swapping upward until the node is either smaller than its parent or it reaches the root position.

## Peek

Retrieving the maximum value simply involves inspecting the root node at the top of the tree without altering the structure.

## Extract Root

Because the largest value is always at the root, extracting it is easy. The complexity comes from fixing the massive hole left at the top of the tree without breaking the shape or ordering rules.

1. **Swap:** Take the last inserted leaf node (the bottom-rightmost node) and swap its position with the root node.
2. **Delete:** Remove the original root node (which is now sitting at the bottom of the tree) from the structure entirely and return its value.
3. **Compare:** Starting from the newly placed root, compare its value with the values of both its left and right children to find the largest of the three.
4. **Bubble Down:** If one or both of the children are larger than the current node, swap the current node with the largest child. Continue this process of comparing and swapping downward until the node is larger than both of its children, or it becomes a leaf node at the bottom of the tree.
5. **Empty Heap:** If an extraction is attempted on a completely empty heap, the operation halts and is dropped.

## Notes

Heaps are the underlying engine for heapsort algorithms and priority queues, heavily used in graph algorithms like Dijkstra's shortest path or in operating system task scheduling.

**When NOT to use this:** A heap should not be used if the application requires searching for arbitrary values. Because a heap is only sorted vertically (parents are larger than children) and possesses no horizontal sorting (left children are not strictly smaller than right children), finding a specific random value requires a full linear scan of the entire structure `O(n)`.
