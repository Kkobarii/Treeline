# Linked List

A **Linked List** is a fundamental linear data structure consisting of a sequence of nodes, where each node contains a value and a reference (or "link") to the next node in the sequence. Unlike arrays, linked lists do not store elements in contiguous memory locations, making them highly dynamic and efficient for certain operations.

The key characteristics of a singly linked list are:

- Each **node** contains a data value and a pointer to the **next node**.
- The first node is called the **head**.
- The last node points to `null`, indicating the end of the list.
- Elements can be efficiently inserted or removed without reorganizing the entire structure.

This structure allows for dynamic memory allocation, making it particularly useful when the size of the data structure is unknown or frequently changes.

## Complexity Analysis

The efficiency of linked list operations depends on the position of the element being accessed or modified:

| Operation      | Average Case | Worst Case |
| -------------- | ------------ | ---------- |
| Access         | O(n)         | O(n)       |
| Search (Find)  | O(n)         | O(n)       |
| Insert at Head | O(1)         | O(1)       |
| Insert at Tail | O(1)\*       | O(1)\*     |
| Delete         | O(n)         | O(n)       |

_\*With tail pointer maintained. Without it, insertion at tail requires O(n) traversal._

## Node Structure

Each node in a singly linked list contains:

- **Value**: The data stored in the node
- **Next**: A reference/pointer to the next node in the sequence

The list itself maintains:

- **Head**: A reference to the first node
- **Tail**: (Optional) A reference to the last node for O(1) tail insertions
- **Size**: (Optional) The number of nodes in the list

## Insertion at Head

Inserting at the head of a linked list is a constant-time operation (O(1)) because it doesn't require traversing the list.

1. **Create New Node**: Allocate a new node with the given value.
2. **Check for Empty List**:
    - If the list is empty (head is `null`), set both head and tail to the new node.
    - If the list is not empty, proceed to step 3.
3. **Link New Node**: Set the new node's `next` pointer to the current head.
4. **Update Head**: Update the head reference to point to the new node.

The new node becomes the first element in the list, and all existing nodes shift one position down.

## Insertion at Tail

Inserting at the tail can be optimized to O(1) when maintaining a tail pointer.

1. **Create New Node**: Allocate a new node with the given value.
2. **Check for Empty List**:
    - If the list is empty (head is `null`), set both head and tail to the new node.
    - If the list is not empty, proceed to step 3.
3. **Link from Current Tail**: Set the current tail's `next` pointer to the new node.
4. **Update Tail**: Update the tail reference to point to the new node.

Without a tail pointer, this operation requires O(n) time to traverse to the end of the list.

## Search (Find)

Searching in a linked list requires sequential access from the head.

1. **Start at Head**: Begin traversal at the head node.
2. **Check Empty List**: If the list is empty, return not found.
3. **Compare Values**: Compare the target value with the current node's value.
4. **Match Found**: If values match, return the node (success).
5. **Traverse Next**: If no match and a next node exists, move to the next node and repeat from step 3.
6. **End of List**: If the end is reached without finding the value, return not found.

Unlike binary search trees, linked lists require linear search because they don't maintain sorted order or allow random access.

## Deletion (Remove)

Removing a node from a linked list requires finding the node and updating pointers.

### Special Case: Removing the Head

1. **Check Head Match**: If the head node contains the target value.
2. **Update Head**: Set head to head's next node.
3. **Update Tail**: If the list becomes empty, also set tail to `null`.

### General Case: Removing from Middle or Tail

1. **Traverse**: Start from head, keeping track of the previous node.
2. **Compare**: Check each node's value against the target.
3. **Found**: When found:
    - Update the previous node's `next` pointer to skip over the current node (point to current.next).
    - If removing the tail, update the tail reference to the previous node.
4. **Not Found**: If traversal completes without finding the value, report not found.

The key to deletion is maintaining the link chain by having the previous node "skip over" the node being removed.

## Advantages

- **Dynamic Size**: Can grow or shrink during execution without pre-allocation.
- **Efficient Insertions/Deletions**: Adding or removing elements at the head is O(1).
- **Memory Efficient**: Only allocates memory as needed for each element.
- **No Wasted Space**: Unlike arrays, doesn't reserve unused capacity.

## Disadvantages

- **No Random Access**: Cannot directly access the nth element; requires O(n) traversal.
- **Extra Memory**: Each node requires additional memory for the next pointer.
- **Sequential Access**: Poor cache locality compared to arrays.
- **Cannot Search Efficiently**: No binary search capability even if sorted.

## Variations

- **Doubly Linked List**: Each node has both `next` and `previous` pointers, allowing bidirectional traversal.
- **Circular Linked List**: The last node points back to the first node instead of `null`.
- **Doubly Circular Linked List**: Combines both variations for bidirectional circular traversal.

## Common Use Cases

- **Dynamic Memory Allocation**: When the number of elements is unknown or varies significantly.
- **Implementation of Stacks and Queues**: Efficient for push/pop operations.
- **Undo Functionality**: In applications where operations need to be reversed.
- **Graph Adjacency Lists**: Representing sparse graphs efficiently.
- **Polynomial Arithmetic**: Representing and manipulating polynomials.
