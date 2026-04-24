# Heap Sort

Heap Sort is an efficient, comparison-based sorting algorithm that leverages the structure of a Max-Heap to organize data. The algorithm works by first transforming the unsorted array into a heap and then repeatedly extracting the largest element from the top of the heap and placing it at the end of the array. This process effectively sorts the array in-place without requiring the extra memory typical of other efficient algorithms like Merge Sort.

### Properties

- **Space:** In-place. The sort is performed directly within the original array, requiring only `O(1)` auxiliary space.
- **Stability:** Unstable. The process of building the heap and swapping the root with the last element involves long-distance jumps that do not preserve the relative order of equal elements.
- **Paradigm:** Transform and Conquer. The algorithm first transforms the data into a specific structure (a heap) to make the subsequent sorting phase (conquering) more efficient.

### Complexity Analysis

Heap Sort is remarkably consistent. Unlike Quick Sort, it does not have a quadratic worst-case scenario. Whether the input is sorted, reverse-sorted, or random, the algorithm always performs the same structural transformations and extractions, guaranteeing a logarithmic time complexity across all cases.

| Best Case    | Average Case | Worst Case   | Space  |
| :----------- | :----------- | :----------- | :----- |
| `O(n log n)` | `O(n log n)` | `O(n log n)` | `O(1)` |

## Execution

The execution is divided into two distinct phases: building the initial heap and the subsequent sorting through root extraction.

### Phase 1: Build Heap

The goal is to rearrange the unsorted array into a Max-Heap structure.

1. **Iterate Internal Nodes**: The algorithm starts from the last non-leaf node (located at index `n/2 - 1`) and works backward to the root (index 0).
2. **Heapify**: For each node, a "bubble down" operation is performed:
    - **Compare**: The node's value is compared with its left and right children to identify the largest of the three.
    - **Swap**: If a child is larger than the parent, the parent is swapped with that child.
    - **Recursive Check**: The process continues downward from the swapped position to ensure the heap property is maintained throughout the subtree.

### Phase 2: Sort (Extract and Rebuild)

Once the Max-Heap is built, the largest element is at index 0.

1. **Extract Root**: The element at index 0 (the maximum) is swapped with the last element in the currently unsorted portion of the array.
2. **Mark Sorted**: The element now at the end is marked as permanently sorted and is no longer touched by the algorithm.
3. **Restore Heap**: Because a small value was moved to the root, the heap property is broken. The `heapify` (bubble down) logic is called on the root to move this new value down to its correct position, restoring the Max-Heap for the remaining unsorted elements.
4. **Repeat**: Steps 1-3 repeat until only one element remains in the unsorted portion.

## Notes

Heap Sort is highly valued in systems where a guaranteed worst-case performance is required and memory is at a premium. It is often used in embedded systems or for sorting large datasets that don't fit entirely into a cache.

**When NOT to use this:** Because Heap Sort has a relatively high constant factor in its time complexity, it is often slower in practice than Quick Sort on average cases. It should also be avoided if a stable sort is required.

### Optimizations

- **Bottom-Up Heapify**: A standard heapify compares a parent with two children. An optimized version (Floyd's version) can reduce the number of comparisons by first bubbling the hole down to a leaf and then bubbling the replacement value back up, which is statistically more efficient for large heaps.
- **D-ary Heap**: While standard Heap Sort uses a binary heap, using a heap with more than two children per node (a D-ary heap) can improve cache performance by increasing the branching factor and reducing the tree height.
