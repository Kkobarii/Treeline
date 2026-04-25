# Bubble Sort

Bubble Sort is a straightforward, comparison-based sorting algorithm. It works by repeatedly stepping through the sequence, comparing adjacent elements, and swapping them if they are in the wrong order. This process is repeated until the entire list is fully sorted. The algorithm derives its name from the way larger elements conceptually "bubble" up to the end of the list with each subsequent pass.

### Properties

- **Space:** In-place. It only requires a constant amount of additional memory for the temporary variable used during swapping.
- **Stability:** Stable. If two elements have equal values, their relative order is strictly preserved because the algorithm only swaps when an element is strictly greater than its neighbor.
- **Paradigm:** Brute Force / Incremental.

### Complexity Analysis

The worst-case scenario occurs when the array is sorted in reverse order. In this state, every single element must be compared and swapped across the entire length of the array, maximizing the number of operations. The best case of `O(n)` is only achievable with a specific optimization flag; without it, the algorithm performs `O(n^2)` comparisons regardless of the initial order.

| Best Case | Average Case | Worst Case | Space  |
| :-------- | :----------- | :--------- | :----- |
| `O(n)`    | `O(n^2)`     | `O(n^2)`   | `O(1)` |

## Execution

The execution relies on two nested loops to systematically push the highest unsorted values to the back of the array.

1. **Outer Iteration**: The algorithm begins a pass through the array. With each full pass, the largest remaining unsorted element is guaranteed to move to its correct final position at the end of the sequence.
2. **Inner Iteration**: Within the current pass, the algorithm selects an element and establishes a boundary for the current unsorted portion. The range of this inner iteration shrinks by one with each outer pass, as the end of the array progressively becomes fully sorted.
3. **Compare**: Compare the currently selected element with its immediate adjacent neighbor to the right.
4. **Swap**: Decide the action based on the comparison:
    - If the current element is strictly greater than its neighbor, the two values are swapped.
    - If the current element is smaller or equal, they are left in their current positions.
    - The process then shifts one position to the right and repeats the compare and swap logic until the unsorted portion of the array is fully traversed.

## Notes

Bubble Sort is primarily used as an educational tool to introduce the concepts of algorithmic sorting and time complexity.

**When NOT to use this:** Bubble Sort should essentially never be used in a production environment for large datasets. Its quadratic time complexity makes it drastically inefficient compared to advanced algorithms like Quick Sort or Merge Sort.

### Optimizations

The standard implementation of Bubble Sort will naively complete every single pass even if the array becomes completely sorted halfway through the process.

A common optimization is to introduce a boolean `swapped` flag. At the start of each outer iteration, this flag is set to false. If any swap occurs during the inner iteration, the flag is flipped to true. If an entire outer iteration completes without a single swap happening, it mathematically proves the array is fully sorted. The algorithm can then safely break out of the loop early, granting it that `O(n)` best-case time complexity on already sorted lists.
