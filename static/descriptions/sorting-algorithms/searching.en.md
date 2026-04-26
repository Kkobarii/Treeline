# Searching Algorithms

Searching algorithms are fundamental processes used to retrieve a specific piece of information from a dataset. While sorting algorithms reorganize data, searching algorithms merely scan it. The efficiency of a search is primarily dictated by whether the underlying data is already sorted or completely random.

## Linear Search

Linear Search is the most basic searching algorithm. It operates by sequentially checking every single element in the dataset from start to finish until the target value is found or the end of the list is reached.

### Properties

- **Space:** `O(1)`
- **Precondition:** None. The algorithm works on unsorted data.
- **Paradigm:** Brute Force.

### Execution

1. **Scan:** Start at the beginning of the array and iterate through the indices one by one.
2. **Compare:** Check if the value at the current index equals the target value.
3. **Result:** If a match is found, the search is successful. If the loop finishes without a match, the target is missing.

## Binary Search

Binary Search is an optimized algorithm that dramatically reduces search times by systematically halving the searchable area. It utilizes the exact same mathematical logic that powers a standard Binary Search Tree, but instead of navigating a node-based hierarchy, it navigates a flat array using index math.

### Properties

- **Space:** `O(1)`
- **Precondition:** The array must be strictly sorted beforehand.
- **Paradigm:** Divide and Conquer.

### Execution

1. **Initialize Boundaries:** Set a left boundary at the start and a right boundary at the end of the array.
2. **Compare Midpoint:** Find the middle index of the current window and compare its value against the target.
3. **Adjust Boundaries:** If the target is larger than the middle value, discard the left half by moving the left boundary past the midpoint. If smaller, discard the right half by moving the right boundary.
4. **Result:** Repeat until the target is found or the left boundary crosses the right boundary, meaning the value does not exist.

## Complexity Analysis

Linear search scales directly with the number of elements, making it slow for massive datasets. Binary search divides the search space by two with every step, operating in logarithmic time. For an array of one billion elements, Binary Search finds the target in roughly 30 comparisons, while a worst-case Linear Search would require all one billion.

| Algorithm         | Best Case | Average Case | Worst Case | Space  |
| :---------------- | :-------- | :----------- | :--------- | :----- |
| **Linear Search** | `O(1)`    | `O(n)`       | `O(n)`     | `O(1)` |
| **Binary Search** | `O(1)`    | `O(log n)`   | `O(log n)` | `O(1)` |

## Other Algorithms

While Linear and Binary searches are foundational, several other techniques exist for specific situations:

- **Jump Search:** A middle ground that works on sorted arrays by jumping ahead by fixed steps to find the correct general block, followed by a short linear search within that block.
- **Interpolation Search:** Estimates the target's position based on its value (similar to opening a dictionary), which is highly effective for uniformly distributed data.
- **Exponential Search:** Finds a valid range by doubling the upper bound index, then performs a standard binary search within that finalized range.
- **Hashing:** Uses a mathematical formula to map keys directly to indices. Hash Tables achieve `O(1)` constant search times by completely bypassing comparisons.

## Notes

A common pitfall is assuming an array should always be sorted just to use Binary Search. Sorting an array takes `O(n log n)` time. If a dataset will only be searched exactly once, doing a simple `O(n)` Linear Search is mathematically faster. Binary Search only provides a net performance gain if the array will be searched multiple times after being sorted.

Furthermore, Binary Search cannot be used on standard Linked Lists. Jumping to the middle index of a linked list requires an `O(n)` traversal, defeating the entire purpose of the logarithmic math.
