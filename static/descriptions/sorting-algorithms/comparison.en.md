# Algorithm Comparison

The comparison view provides a high-level performance matrix, allowing for the observation of how different sorting strategies respond to specific data patterns on an array with a size of 32. While Big O notation gives a theoretical upper bound, the actual number of comparisons and swaps can vary drastically depending on the initial state of the data.

### Performance Overview

This table summarizes the theoretical time and space complexities for the six algorithms provided in the simulator.

| Algorithm          | Best Case    | Average Case | Worst Case   | Space      |
| :----------------- | :----------- | :----------- | :----------- | :--------- |
| **Bubble Sort**    | `O(n^2)`     | `O(n^2)`     | `O(n^2)`     | `O(1)`     |
| **Insertion Sort** | `O(n)`       | `O(n^2)`     | `O(n^2)`     | `O(1)`     |
| **Selection Sort** | `O(n^2)`     | `O(n^2)`     | `O(n^2)`     | `O(1)`     |
| **Quick Sort**     | `O(n log n)` | `O(n log n)` | `O(n^2)`     | `O(log n)` |
| **Merge Sort**     | `O(n log n)` | `O(n log n)` | `O(n log n)` | `O(n)`     |
| **Heap Sort**      | `O(n log n)` | `O(n log n)` | `O(n log n)` | `O(1)`     |

## Dataset Analysis

Different data distributions highlight the strengths and fatal flaws of various algorithms.

### The Quick Sort Killer

Quick Sort is generally the fastest algorithm in the matrix, but it is highly sensitive to pivot selection. Because this implementation picks the last element as the pivot, the **Reverse** dataset represents its absolute worst case. Instead of dividing the array into two equal halves, the pivot only "peels off" one element at a time, causing the recursion depth to explode to `n` and the time complexity to degrade to `O(n^2)`. Ironically, the **Almost Sorted** dataset also triggers this worst-case behavior, as the last element is the largest and leads to the same unbalanced partitions.

### The Blindness of Selection Sort

Regardless of whether the data is **Shuffled**, **Almost Sorted**, or contains many **Duplicates**, Selection Sort always performs the same number of comparisons. Because it lacks a mechanism to "break" or "skip" early, it will naively scan the entire unsorted portion looking for a minimum that might already be in the correct place. This makes it consistently slow, but its performance is very predictable.

### Practical Insertion Sort

On **Almost Sorted** data (where many elements are close to their final home), Insertion Sort is remarkably fast. It quickly "bubbles" elements a few positions back and stops. However, it is important to note that while the data may look sorted to an observer quickly, the algorithm still performs the necessary comparisons to verify this.

### Merge Sort vs. Memory

In the comparison view, Merge Sort stays perfectly consistent across **Sawtooth**, **Shuffled**, and **Reverse** data. While it is incredibly reliable, the issue may be the significant auxiliary space usage. Unlike the other algorithms, Merge Sort is "out-of-place," meaning it is the only one in the matrix that requires significant extra memory to hold sub-arrays during the merge phase, even though this is not explicitly shown in the visualization.

## Notes

When comparing these algorithms, pay close attention to the **Comparison vs. Swap** ratio:

- **Selection Sort** has the fewest swaps (at most `n`), making it useful if writing to memory is very "expensive."
- **Bubble Sort** has a high swap count, as it moves elements incrementally.
- **Heap Sort** and **Quick Sort** offer the best balance for general-purpose large-scale sorting, when in-place sorting is desired and stability is not a concern.
- **Merge Sort** is the go-to choice for most other scenarios, as it usually outperforms the others on larger datasets.

Understanding these matchups is essential for real-world engineering. Most modern programming languages use "Hybrid Sorts" (like Timsort or Introsort). These engines monitor the data and automatically switch between these algorithms, for example using Quick Sort for large partitions but switching to Insertion Sort when the dataset becomes small or nearly sorted.
