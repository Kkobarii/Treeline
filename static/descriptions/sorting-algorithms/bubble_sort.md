# Bubble Sort

Bubble Sort is one of the simplest sorting algorithms. It repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. This process continues until the list is sorted. The algorithm gets its name because smaller elements "bubble" to the top (beginning) of the list with each pass.

## How It Works

1. Compare the first two elements
2. If the first is greater than the second, swap them
3. Move to the next pair and repeat
4. After each complete pass, the largest unsorted element is in its final position
5. Repeat until no more swaps are needed

## Advantages

- **Simple to understand and implement**: Perfect for learning sorting concepts
- **No extra space required**: Sorts in-place with O(1) additional space
- **Stable sort**: Maintains the relative order of equal elements
- **Adaptive**: Can be optimized to detect already-sorted data
- **Comparison-based**: Works with any comparable data

## Disadvantages

- **Very slow on large datasets**: O(n²) time complexity makes it impractical for real-world use
- **Many unnecessary comparisons**: Even after the list is mostly sorted, it continues comparing
- **Poor cache performance**: Random memory access patterns hurt modern CPU performance
- **Not used in practice**: Better algorithms exist for nearly all scenarios

## Complexity Analysis

| Metric | Complexity |
|--------|------------|
| **Best Case Time** | O(n) - already sorted with optimization |
| **Average Case Time** | O(n²) - typical random data |
| **Worst Case Time** | O(n²) - reverse sorted data |
| **Space Complexity** | O(1) - constant extra space |
| **Stable** | Yes |

## When to Use

- Educational purposes and learning sorting concepts
- Extremely small datasets (< 10 elements)
- Nearly sorted data with optimizations

## Optimizations

- **Early termination**: Stop if no swaps occur in a pass
- **Reduced range**: Track the last swap position to avoid redundant comparisons
