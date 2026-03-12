# Quick Sort

Quick Sort is a divide-and-conquer algorithm that works by selecting a 'pivot' element and partitioning the array around it. Elements smaller than the pivot go to the left, and larger elements go to the right. The process repeats recursively on each partition. It's widely used in practice due to excellent average-case performance and low memory overhead.

## How It Works

1. **Partition**: Choose a pivot and partition the array
   - Elements less than pivot → left partition
   - Elements greater than pivot → right partition
2. **Recursively sort**: Apply Quick Sort to both partitions
3. **Combine**: Since partitions are sorted in-place, result is sorted array

## Advantages

- **Fast in practice**: O(n log n) average case with good constants
- **In-place sorting**: Only O(log n) auxiliary space for recursion
- **Cache-friendly**: Good locality of reference for modern CPUs
- **Adaptive**: Performs well on partially sorted data with good pivot selection
- **Widespread**: Implemented in most standard libraries
- **Comparison-based**: Works with any comparable data
- **Tail recursion**: Can be optimized to use less stack space

## Disadvantages

- **Worst-case O(n²)**: Poor pivot selection (like sorted data with first element pivot)
- **Not stable**: Equal elements may not maintain original order
- **Unstable performance**: Depends heavily on pivot selection
- **Complex implementation**: Correctly implementing randomization is tricky
- **Stack space**: Recursion uses O(log n) to O(n) stack space
- **Not guaranteed**: Must use good pivot strategy to avoid O(n²)

## Complexity Analysis

| Metric | Complexity |
|--------|------------|
| **Best Case Time** | O(n log n) - balanced partitions |
| **Average Case Time** | O(n log n) - random pivot selection |
| **Worst Case Time** | O(n²) - poor pivot selection |
| **Space Complexity** | O(log n) - recursion stack (best), O(n) (worst) |
| **Stable** | No - relative order of equal elements not preserved |

## When to Use

- General-purpose sorting of large datasets
- When average-case performance is more important than worst-case
- When memory space is constrained
- Embedded systems and performance-critical code
- With randomized pivot selection for guaranteed good performance

## Pivot Selection Strategies

- **First element**: Simple but bad for sorted data
- **Random element**: Good general strategy
- **Median-of-three**: Better pivot at cost of extra comparisons
- **Median-of-medians**: Guarantees O(n log n) but slower in practice

## Improvements

- **Randomization**: Shuffle data or randomly select pivot
- **3-way partitioning**: Better for duplicate elements
- **Introsort**: Switches to Heap Sort if recursion depth too deep
- **Timsort approach**: Use Insertion Sort for small subarrays

## Real-World Usage

Quick Sort is the basis of `qsort()` in C, `sort()` in C++, and is often wrapped in algorithms like Introsort (C++ std::sort) that guarantee O(n log n) worst-case.
