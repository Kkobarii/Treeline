# Selection Sort

Selection Sort is a straightforward sorting algorithm that conceptually divides the array into a sorted left portion and an unsorted right portion. It repeatedly scans the unsorted portion to find the absolute minimum value and swaps it into the correct final position at the end of the sorted portion.

### Properties

- **Space:** In-place. It requires only a constant amount of additional memory to store the minimum index pointer.
- **Stability:** Unstable. Because the algorithm swaps elements across long distances to move the minimum to the front, it can easily jump over equal elements and disrupt their original relative order.
- **Paradigm:** Brute Force / Incremental.

### Complexity Analysis

Unlike other simple algorithms, Selection Sort is entirely blind to the existing order of the array. It must always scan the entire remaining unsorted section to guarantee it has found the true minimum value. Because it cannot break early, the best, average, and worst cases all require the exact same number of comparisons.

| Best Case | Average Case | Worst Case | Space  |
| :-------- | :----------- | :--------- | :----- |
| `O(n^2)`  | `O(n^2)`     | `O(n^2)`   | `O(1)` |

## Execution

The execution relies on tracking indices rather than continuously swapping elements, resulting in a maximum of one swap per outer pass.

1. **Outer Iteration**: The algorithm begins a pass to find the smallest element for the current position, starting from the beginning of the array. Everything to the left is considered permanently sorted. The current index is temporarily recorded as the minimum index.
2. **Scan**: An inner loop iterates through the remaining unsorted portion of the array, moving step-by-step to the right of the current position.
3. **Compare**: Each newly scanned element is compared against the value currently sitting at the recorded minimum index.
4. **Update Minimum**: If a scanned element is strictly smaller than the recorded minimum, its index overwrites the recorded minimum index.
5. **Swap**: After the inner scan fully reaches the end of the array, the algorithm checks the final minimum index. If it is different from the starting index of the pass, the elements at those two indices are swapped. This locks the absolute smallest remaining value into its correct sorted spot. The outer iteration then steps one position forward and repeats.

## Notes

Selection Sort is an excellent algorithm for teaching the concept of maintaining a running minimum and understanding worst-case structural limitations. It is also notable for minimizing the total number of physical memory write operations (swaps), as it never performs more than `n` swaps in total.

**When NOT to use this:** Selection Sort should never be used for large datasets. Furthermore, it should be avoided if the input data might already be partially sorted, as its rigid `O(n^2)` best-case scenario makes it drastically slower than Insertion Sort or optimized Bubble Sort in those specific situations.

### Optimizations

Standard Selection Sort is notoriously difficult to optimize because of its strict requirement to scan all unsorted elements on every pass.

A common structural optimization is the Bidirectional Selection Sort (often referred to as Double Selection Sort). Instead of just tracking the minimum value, the inner loop simultaneously tracks both the minimum and the maximum value. At the end of the pass, the minimum is swapped to the front of the unsorted section, and the maximum is swapped to the back. This effectively halves the total number of required outer iterations, although the underlying mathematical time complexity remains `O(n^2)`.
