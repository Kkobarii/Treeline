# Quick Sort

Quick Sort is a highly efficient, comparison-based sorting algorithm that uses a divide-and-conquer strategy. It works by selecting a "pivot" element from the array and partitioning the other elements into two sub-arrays, according to whether they are less than or greater than the pivot. The sub-arrays are then sorted recursively. This process results in a very fast sort on average, making it one of the most widely used sorting algorithms in modern computing.

### Properties

- **Space:** In-place. While it requires `O(log n)` auxiliary space for the recursive call stack, it does not require additional arrays to store data.
- **Stability:** Unstable. The partitioning process involves swapping elements over large distances, which can change the relative order of equal elements.
- **Paradigm:** Divide and Conquer.

### Complexity Analysis

The performance of Quick Sort is heavily dependent on the choice of the pivot. In the best and average cases, the pivot consistently divides the array into roughly equal halves, leading to logarithmic depth. The worst-case scenario occurs when the pivot is consistently the smallest or largest element (e.g., picking the last element in an already sorted array), which results in a highly unbalanced tree with a depth of `n`.

| Best Case    | Average Case | Worst Case | Space      |
| :----------- | :----------- | :--------- | :--------- |
| `O(n log n)` | `O(n log n)` | `O(n^2)`   | `O(log n)` |

## Execution

The execution is divided into the partitioning phase and the recursive calls.

### Partitioning

The goal of this phase is to place a chosen pivot in its final sorted position and ensure all smaller elements are to its left and all larger elements are to its right.

1.  **Select Pivot**: In this implementation, the last element of the current range is selected as the pivot.
2.  **Initialize Boundary**: A boundary index is set to the start of the range. This index tracks the position where the next element smaller than the pivot should be placed.
3.  **Scan**: The algorithm iterates through the range from the start to the element just before the pivot.
4.  **Compare and Swap**: For each element in the scan:
    - **Compare**: The element is compared with the pivot value.
    - **Swap**: If the element is smaller than or equal to the pivot, it is swapped with the element at the boundary index, and the boundary index is incremented.
5.  **Place Pivot**: Once the scan is complete, the pivot (currently at the end) is swapped with the element at the boundary index. The pivot is now in its final, permanently sorted position.

### Recursion

1.  **Divide**: The index of the successfully placed pivot is returned to the main function.
2.  **Recurse Left**: The Quick Sort function is called recursively for the sub-array to the left of the pivot (elements smaller than the pivot).
3.  **Recurse Right**: The Quick Sort function is called recursively for the sub-array to the right of the pivot (elements larger than the pivot).
4.  **Base Case**: The recursion stops when a sub-array has fewer than two elements, as it is already considered sorted.

## Notes

Quick Sort is the standard sorting algorithm used in many systems; for example, the `sort()` function in many C++ and Java libraries often utilizes a variant of Quick Sort (like Dual-Pivot Quicksort).

**When NOT to use this:** Quick Sort should be avoided if stability is required (preserving the order of equal items). Additionally, in safety-critical systems where a worst-case `O(n^2)` performance could lead to a system hang or "Denial of Service" (via a "Quick Sort Killer" dataset), a guaranteed `O(n log n)` algorithm like Merge Sort or Heap Sort is preferred.

### Optimizations

Because the choice of pivot is so important, several optimizations are commonly used to avoid the `O(n^2)` worst case:

- **Median-of-Three**: Instead of picking the last element, the algorithm looks at the first, middle, and last elements and chooses their median as the pivot. This significantly reduces the chance of encountering the worst-case behavior on sorted or nearly-sorted data.
- **Randomized Pivot**: Choosing a random index for the pivot makes it mathematically impossible for a specific fixed data pattern to consistently trigger the worst-case scenario.
- **Introsort**: Many production implementations monitor the recursion depth. If the depth exceeds a certain limit (indicating a likely `O(n^2)` path), the algorithm automatically switches to Heap Sort to guarantee `O(n log n)` completion.
