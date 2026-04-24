# Merge Sort

Merge Sort is an efficient, stable, comparison-based sorting algorithm that utilizes a divide-and-conquer strategy. It works by conceptually breaking an array down into several sub-arrays until each sub-array consists of a single element, and then merging those sub-arrays in a manner that results in a new sorted sub-array. This process continues recursively until the entire array is reconstructed in sorted order.

### Properties

- **Space:** Out-of-place. Unlike Quick Sort, standard Merge Sort requires `O(n)` additional space to store the temporary sub-arrays during the merging process.
- **Stability:** Stable. It preserves the relative order of equal elements because, during the merge phase, when two elements are equal, the algorithm always picks the one from the "left" sub-array first.
- **Paradigm:** Divide and Conquer.

### Complexity Analysis

Merge Sort is highly predictable. Because it always divides the array into two equal halves and processes every element during the merge phase, its performance does not fluctuate based on the initial order of the data. Whether the array is already sorted, reverse-sorted, or completely random, it always performs the same number of operations.

| Best Case    | Average Case | Worst Case   | Space  |
| :----------- | :----------- | :----------- | :----- |
| `O(n log n)` | `O(n log n)` | `O(n log n)` | `O(n)` |

## Execution

The execution is divided into the recursive division of the array and the subsequent merging of the fragments.

### Divide Phase

1. **Divide**: The algorithm finds the middle point of the current array segment.
2. **Call Left**: The function is called recursively for the left half (from the start to the middle).
3. **Call Right**: The function is called recursively for the right half (from the middle plus one to the end).
4. **Base Case**: The division stops when a segment contains only one element, as a single element is already sorted by definition.

### Merge Phase

Once the sub-arrays are divided, they are merged back together in sorted order.

1. **Compare**: The algorithm looks at the first available element in the left sub-array and the first available element in the right sub-array.
2. **Take Smaller**: The smaller of the two values is selected and moved into the resulting merged array.
    - If the values are equal, the element from the left sub-array is taken to maintain stability.
3. **Shift and Repeat**: The pointer for the sub-array that provided the value is moved one position to the right. The comparison repeats until one of the sub-arrays is exhausted.
4. **Append Remaining**: Any elements remaining in the non-exhausted sub-array (either left or right) are appended to the end of the merged array in their existing order.

## Notes

Merge Sort is the algorithm of choice when stability is a requirement or when dealing with linked lists, where it can be implemented more efficiently than Quick Sort. It is the basis for **Timsort**, the default sorting algorithm in Python, Java, and Android.

**When NOT to use this:** Merge Sort should be avoided in memory-constrained environments, such as embedded systems, because the `O(n)` space requirement can be quite expensive compared to in-place algorithms like Quick Sort or Heap Sort.

### Optimizations

- **Insertion Sort Hybrid**: For very small sub-arrays (typically around 7 to 15 elements), the overhead of recursive calls becomes inefficient. Many implementations switch to Insertion Sort for these small segments to speed up the process.
- **Checking for Sortedness**: Before entering the merge phase, the algorithm can check if the last element of the left sub-array is smaller than or equal to the first element of the right sub-array. If it is, the two halves are already sorted relative to each other, and the merge step can be skipped entirely.
- **In-place Merge Sort**: There are variations of Merge Sort that attempt to sort in `O(1)` space, but they are significantly more complex to implement and often come with a higher constant time overhead, making them slower in practice than the standard version.
