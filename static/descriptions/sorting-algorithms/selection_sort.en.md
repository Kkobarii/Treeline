# Selection Sort

Selection Sort divides the input into a sorted region and an unsorted region. It repeatedly finds the smallest (or largest) element from the unsorted region and moves it to the end of the sorted region. It's called "selection" because it selects elements one at a time.

## How It Works

1. Find the minimum element in the unsorted region
2. Swap it with the first element of the unsorted region
3. Move the boundary between sorted and unsorted regions one position right
4. Repeat until the entire array is sorted

## Advantages

- **Simple to understand**: Straightforward algorithm
- **In-place**: Sorts with O(1) extra space
- **Minimal writes**: Makes only n-1 swaps (fewest among O(n²) sorts)
- **Predictable**: Same number of comparisons regardless of input order
- **Good for slow-write systems**: Few memory writes minimize wear

## Disadvantages

- **Always O(n²) comparisons**: No best-case optimization possible
- **Unstable**: Equal elements don't maintain their original order
- **Slow on large datasets**: Impractical for real-world use
- **Poor cache performance**: Random access patterns cause cache misses
- **No adaptive properties**: Same speed on sorted vs random data

## Complexity Analysis

| Metric | Complexity |
|--------|------------|
| **Best Case Time** | O(n²) - comparison count never changes |
| **Average Case Time** | O(n²) - random data |
| **Worst Case Time** | O(n²) - reverse sorted data |
| **Space Complexity** | O(1) - constant extra space |
| **Stable** | No - relative order of equal elements not preserved |

## When to Use

- Educational purposes
- Environments with slow write operations
- When minimizing swaps is critical
- Very small datasets

## Characteristics

- **Comparison-based**: Uses comparison operations
- **Not recursive**: Iterative implementation
- **Not stable**: May reorder equal elements
- **Online capable**: Can select minimum while reading input
