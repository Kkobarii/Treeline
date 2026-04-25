# Insertion Sort

Insertion Sort is a simple, intuitive sorting algorithm that builds the final sorted array one item at a time. It conceptually divides the array into a sorted and an unsorted part. Values from the unsorted part are picked and placed at the correct position in the sorted part, much like sorting a hand of playing cards.

### Properties

- **Space:** In-place. It only requires a constant amount of additional memory to perform its operations.
- **Stability:** Stable. If two elements have equal values, their relative order is strictly preserved because the algorithm stops shifting an element backward as soon as it encounters a value that is smaller or equal.
- **Paradigm:** Incremental.

### Complexity Analysis

The worst-case scenario occurs when the array is sorted in reverse order. In this state, every single newly selected element must be compared and swapped all the way to the very front of the array, maximizing the number of operations. Conversely, if the array is already sorted, the inner loop immediately breaks on the first comparison for every element, granting a highly efficient linear best-case time.

| Best Case | Average Case | Worst Case | Space  |
| :-------- | :----------- | :--------- | :----- |
| `O(n)`    | `O(n^2)`     | `O(n^2)`   | `O(1)` |

## Execution

The execution relies on iterating through the list and continuously pushing elements backward into their correct spot within the growing sorted section.

1. **Outer Iteration**: The algorithm begins its pass starting from the second element in the array. Everything to the left of the current index is considered the "sorted" portion, while the current element and everything to its right are the "unsorted" portion.
2. **Compare**: The currently selected element is compared with its immediate predecessor to the left.
3. **Swap**: Decide the action based on the comparison:
    - If the selected element is strictly smaller than its predecessor, the two values are swapped.
    - The focus then shifts one position to the left, and the comparison repeats. This backward bubbling continues until the element encounters a predecessor that is smaller or equal, or until it hits the very beginning of the array. At this point, the element has found its correct sorted position, and the outer iteration moves forward to the next unsorted element.

## Notes

Insertion Sort is highly efficient for very small datasets or arrays that are already substantially sorted. In practice, advanced, production-grade sorting algorithms like TimSort (used in Python and Java) or Introsort actually switch to a localized Insertion Sort when their unsorted partitions become small enough.

**When NOT to use this:** Insertion Sort should be avoided for large, completely random datasets, as its quadratic time complexity makes it far too slow compared to divide-and-conquer algorithms.

### Optimizations

The standard implementation continuously swaps elements to move a value backward. A standard array swap requires three operations (using a temporary holding variable).

A common optimization is to use a "shift" technique instead of a strict "swap." The algorithm copies the target element into a temporary variable, shifts all strictly greater elements one position to the right to make room, and then drops the target element directly into the final opened slot. This accomplishes the exact same sorting logic but significantly reduces the total number of memory write operations.
