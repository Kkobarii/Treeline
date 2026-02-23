# Heap Sort

Heap Sort uses a heap data structure to sort elements. It builds a max-heap, then repeatedly extracts the maximum element (root of the heap) and places it at the end of the sorted portion. The algorithm guarantees O(n log n) worst-case performance while sorting in-place.

## How It Works

1. **Build Heap**: Construct a max-heap from the input array
2. **Extract**: Repeatedly extract the root (maximum element)
3. **Place**: Move extracted maximum to the end of the sorted portion
4. **Restore**: Rebuild the heap with remaining unsorted elements
5. **Repeat**: Continue until heap contains only one element

## Advantages

- **Guaranteed O(n log n)**: No worst-case degradation like Quick Sort
- **In-place sorting**: Only O(1) extra space needed
- **No exceptional cases**: Always performs well regardless of input
- **Predictable**: Worst case equals average case
- **Memory efficient**: Doesn't require auxiliary arrays
- **Good for large datasets**: Reliable performance under all conditions

## Disadvantages

- **Slower in practice**: Larger constant factors than Quick Sort
- **Poor cache performance**: Non-sequential memory access patterns
- **Not stable**: Equal elements may be reordered
- **Complex to implement**: Heap operations are less intuitive
- **Higher overhead**: Heap maintenance requires more operations
- **Not adaptive**: No improvement on partially sorted data
- **Cache unfriendly**: Random memory access hurts modern CPUs

## Complexity Analysis

| Metric | Complexity |
|--------|------------|
| **Best Case Time** | O(n log n) - all cases are the same |
| **Average Case Time** | O(n log n) - consistent performance |
| **Worst Case Time** | O(n log n) - guaranteed |
| **Space Complexity** | O(1) - constant extra space |
| **Stable** | No - relative order of equal elements not preserved |

## When to Use

- When worst-case O(n log n) is mandatory
- Real-time systems requiring predictable performance
- Memory-constrained environments
- When stability isn't required
- Guaranteed performance needed over average-case optimization

## Heap Operations

- **Heapify**: O(log n) - restore heap property
- **Build heap**: O(n) - create heap from array
- **Extract max**: O(log n) - remove and reorganize

## Characteristics

- **Comparison-based**: Uses comparisons for ordering
- **In-place**: Sorts without extra array space
- **Iterative**: Can be implemented without recursion
- **Complete binary tree**: Efficient array representation

## Real-World Use Cases

- Priority queue implementations
- Embedded systems requiring predictable timing
- Real-time applications with strict deadlines
- Part of Introsort (C++ fallback when Quick Sort unstable)
- Selection problems (find k-th smallest/largest)

## Optimization Techniques

- **Bottom-up heapify**: Slightly faster heapification
- **Reduced comparisons**: Exact variant minimizes comparisons
- **Cache optimization**: Specific heap layouts for better cache usage
