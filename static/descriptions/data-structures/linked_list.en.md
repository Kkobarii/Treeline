# Linked List

A Linked List is a linear data structure where elements are not stored in contiguous memory locations. Instead, each element is an independent object that points to the next one in the sequence. This structure allows for dynamic memory allocation, meaning the list can grow and shrink in size easily without needing to copy elements into a new block of memory, which is a common limitation of standard arrays.

### Rules

- **Node Structure:** Each individual element in the list is called a node. A node contains two pieces of information: the actual stored value, and a reference pointer to the next node in the sequence.
- **List Structure:** The list itself is defined by a single starting pointer called the `head`, which points to the very first node. The final node in the sequence has a pointer that points to a null value, indicating the end of the list.
- **Tail Pointer:** While a basic linked list only requires a head pointer, this implementation also maintains a `tail` pointer that directly references the very last node. This addition allows for immediate access to the end of the list.

### Complexity Analysis

The efficiency of a linked list is highly dependent on where the operation occurs. Accessing elements at the beginning or the end is incredibly fast. However, because there is no way to jump directly to a specific index, finding or modifying an element in the middle requires a step-by-step walk from the start, resulting in linear time complexity.

| Operation          | Worst Case |
| :----------------- | :--------- |
| **Insert at Head** | `O(1)`     |
| **Insert at Tail** | `O(1)`\*   |
| **Find**         | `O(n)`     |
| **Remove**         | `O(n)`     |

_\*This constant time complexity only holds when a tail pointer is maintained. If no tail pointer is kept, the operation requires traversing the entire list, resulting in `O(n)` complexity._

## Insert at Head

Inserting a new value at the beginning of the list requires only a few pointer updates and does not require shifting any other elements.

1. **Create Node:** A new node is generated containing the provided value.
2. **Link Next:** The new node's pointer is set to reference the current head of the list.
3. **Update Head:** The list's primary head pointer is updated to point to the newly created node. If the list was previously empty, the tail pointer is also updated to point to this single node.

## Insert at Tail

Appending a new value to the end of the list is optimized to constant time `O(1)` because the structure maintains a direct tail pointer.

1. **Create Node:** A new node is generated containing the provided value.
    - If a tail pointer is not maintained, the list must first be traversed from the head to find the current final node before insertion can occur.
2. **Link Next:** If the list is empty, both the head and tail pointers are set to this new node. Otherwise, the current tail node's pointer is updated to reference the new node.
3. **Update Tail:** The list's primary tail pointer is updated to point to the newly created node.

## Find

Searching for a specific value involves a linear scan starting from the head node, stepping through each consecutive pointer and comparing the target value with the value inside each node along the path until a match is found or the null terminator at the end of the list is reached.

## Remove

Removing a node requires locating the target and relinking the surrounding nodes to bypass the deleted element without breaking the chain.

1. **Empty Check:** If the list is empty, the operation halts.
2. **Remove Head:** If the target value is located at the head node, the head pointer is updated to reference the second node in the sequence, and the original head is discarded. If this removal leaves the list completely empty, the tail pointer is also cleared.
3. **Traverse and Remove:** If the target is not the head, the list iterates through the nodes while keeping track of both the current node and the previous node:
    - If the target matches the current node, the previous node's pointer is updated to bypass the current node and point directly to the next node. If the removed node happened to be the tail, the list's tail pointer is updated to reference the previous node.
    - If the target does not match, both the previous and current pointers move one step forward down the sequence.
4. **Not Found:** If the end of the list is reached without finding a matching value, the operation concludes without making any structural changes.

## Notes

The standard linked list described here is singly linked, meaning navigation can only flow in one direction from head to tail.

There are two highly common variations of this structure. A Doubly Linked List adds a second pointer to every node that points backwards to the previous node, allowing for traversal in both directions at the cost of slightly higher memory usage. A Circular Linked List connects the final tail node back to the head node instead of a null value, creating a closed loop that is particularly useful for continuous cycling tasks like operating system round-robin scheduling.
