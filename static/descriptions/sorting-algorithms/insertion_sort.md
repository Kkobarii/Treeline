# Insertion Sort

Insertion Sort builds the sorted array one item at a time. It iterates through an input array, and for each element, finds the correct position in the sorted portion and inserts it there. Think of how you might sort playing cards in your hand—you pick up cards one at a time and insert them into the correct position.

## How It Works

1. Start with the second element (first element is considered sorted)
2. Compare it with elements before it
3. Shift larger elements one position to the right
4. Insert the current element in its correct position
5. Move to the next element and repeat

## Advantages

- **Simple and intuitive**: Easy to understand and implement
- **Efficient for small datasets**: Very fast for lists under 50 elements
- **Online algorithm**: Can sort data as it receives it
- **Stable sort**: Maintains relative order of equal elements
- **In-place**: Requires only O(1) extra space
- **Adaptive**: Very efficient on nearly sorted data (near O(n))
- **Good cache locality**: Sequential memory access patterns

## Disadvantages

- **O(n²) in general case**: Too slow for large datasets
- **Shifting overhead**: Moving elements is more expensive than swapping
- **Not suitable for external sorting**: Requires contiguous array access

## Complexity Analysis

| Metric | Complexity |
|--------|------------|
| **Best Case Time** | O(n) - already sorted data |
| **Average Case Time** | O(n²) - random data |
| **Worst Case Time** | O(n²) - reverse sorted data |
| **Space Complexity** | O(1) - constant extra space |
| **Stable** | Yes |

## When to Use

- Sorting small datasets or subarrays
- Nearly sorted data where performance matters
- Online sorting scenarios
- Hybrid sorting as part of algorithms like Timsort or Introsort
- When simplicity and memory efficiency are priorities

## Real-World Usage

Insertion Sort is frequently used in practice as a base case for divide-and-conquer algorithms. Many efficient algorithms like Timsort and Introsort switch to Insertion Sort for small subarrays because it's faster than more complex algorithms on tiny datasets.
