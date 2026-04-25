# Queue

A Queue is a linear data structure that operates on the First-In-First-Out (FIFO) principle. It is designed so that elements are added to one end and removed from the opposite end, ensuring that the oldest element in the structure is always the next one to be processed.

### Rules

- **FIFO Property:** The first element added to the queue is mathematically guaranteed to be the first one removed.
- **Restricted Access:** Elements can only be added at the back (rear) and removed or examined at the front. Traversing or modifying the middle of the structure is not allowed.
- **Node Structure:** Internally, this structure uses a linked list format where each node contains a value and a reference pointer directed at the next node in line. It maintains two primary pointers: the `front` (where items are removed) and the `rear` (where items are added).

### Complexity Analysis

Because the queue maintains direct pointers to both the front and the rear, adding and removing items does not require traversing the sequence. This results in constant-time operations.

| Operation   | Worst Case |
| :---------- | :--------- |
| **Enqueue** | `O(1)`     |
| **Dequeue** | `O(1)`     |
| **Peek**    | `O(1)`     |

## Enqueue

Adding a new value to the queue involves attaching it to the back of the line and updating the rear pointer.

1. **Create Node:** A new node is generated containing the provided value.
2. **Link and Update:** The linking process depends on the current state of the queue:
    - If the queue is empty, both the front and rear pointers are set to point directly to this new node.
    - If the queue already contains items, the current rear node's pointer is updated to reference the new node, and then the queue's primary rear pointer is shifted to the new node, making it the new back of the line.

## Dequeue

Removing an element requires taking it from the very front of the line and shifting the front pointer further.

1. **Empty Check:** If the queue is completely empty, the operation halts and is dropped.
2. **Retrieve:** The value of the current front node is retrieved to be returned.
3. **Update Front:** The queue's primary front pointer is shifted to reference the next node in the sequence, effectively detaching the original front node. If this removal leaves the queue completely empty, the rear pointer is also cleared.

## Peek

Retrieving the value of the next element in line simply involves inspecting the front node without making any structural changes or removing the element from the queue.

## Notes

Queues are fundamental for scenarios that require managing tasks in the exact order they arrive. They are the standard structure for printer task management, handling concurrent requests on a web server, and executing breadth-first searches in complex graph algorithms.

**When NOT to use this:** A queue should be avoided if the application needs to prioritize certain elements over others based on value (which would require a Priority Queue or Heap), or if it needs immediate access to the most recently added items (which is better suited for a Stack). Furthermore, finding a specific random value requires systematically dequeuing and discarding elements just to reach the desired item, making it highly inefficient for general data retrieval.
