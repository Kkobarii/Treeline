# Queue (FIFO)

A **Queue** is a linear data structure that operates on the **First-In, First-Out (FIFO)** principle. This means that the first element added to the queue will be the first one to be removed. It functions exactly like a real-life waiting line: the person at the front of the line is served first, and new people join the line at the back.

Queues are essential in computing for managing resources shared by multiple processes, such as printer tasks, CPU scheduling, or handling requests in a web server.

## Complexity Analysis

Similar to a Stack, a Queue is highly optimized for its specific entry and exit points. By restricting access to only the "Front" and the "Rear," we achieve constant time performance.

| Operation        | Time Complexity | Purpose                                          |
| ---------------- | --------------- | ------------------------------------------------ |
| **Enqueue**      | O(1)            | Add a new element to the back of the line.       |
| **Dequeue**      | O(1)            | Remove the element from the front of the line.   |
| **Peek (Front)** | O(1)            | View the front element without removing it.      |
| **Space**        | O(n)            | Linear space relative to the number of elements. |

## Enqueue (Insert)

The enqueue operation adds an element to the "Rear" of the queue.

1. **Create**: A new node or entry is created for the value.
2. **Link to Rear**: The current "Rear" element's next pointer is updated to point to the new node.
3. **Update Rear**: The queue's internal reference for the **Rear** is moved to this new node. If the queue was previously empty, this node also becomes the **Front**.

## Dequeue (Extract)

The dequeue operation removes the element currently at the "Front" of the queue.

1. **Check for Empty**: If the queue is empty, the operation is dropped.
2. **Identify Front**: The current **Front** element is targeted for removal.
3. **Shift Front**: The queue's internal reference for the **Front** is moved to the next element in line.
4. **Finalize**: The old front node is disconnected. If the queue becomes empty after this, the **Rear** is also set to null.

## Peek (Front)

This operation allows you to see who is next in line without actually removing them.

1. **Access Front**: The algorithm looks at the value held by the **Front** reference.
2. **Return**: The value is returned for use, but the queue remains completely unchanged.
