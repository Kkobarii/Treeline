# Stack (LIFO)

A **Stack** is a linear data structure that follows the **Last-In, First-Out (LIFO)** principle. This means that the last element added to the stack is the first one to be removed. Think of it like a physical stack of plates: you add a new plate to the top, and when you need one, you take it from the top.

Stacks are used in many areas of computer science, including expression evaluation, syntax parsing, and managing function calls in a program's memory.

## Complexity Analysis

Because a stack only allows access to the very top element, all primary operations are extremely efficient.

| Operation | Time Complexity | Purpose                                          |
| --------- | --------------- | ------------------------------------------------ |
| **Push**  | O(1)            | Add a new element to the top.                    |
| **Pop**   | O(1)            | Remove the top element.                          |
| **Peek**  | O(1)            | View the top element without removing it.        |
| **Space** | O(n)            | Linear space relative to the number of elements. |

## Push

The push operation adds a new element to the collection. In a stack, this new element always becomes the new "Top."

1. **Create**: A new node or entry is created for the value.
2. **Link**: The new element is placed "above" the current top element.
3. **Update Top**: The stack's internal reference is updated to point to this new element as the current **Top**.

## Pop

The pop operation removes the element that is currently at the top of the stack.

1. **Check for Empty**: If the stack has no elements, the operation is dropped as there is nothing to remove.
2. **Identify Top**: The current **Top** element is targeted for removal.
3. **Update Top**: The stack's internal reference is moved "down" to the element immediately below the current top.
4. **Result**: The removed element is returned, and the stack is now one element smaller.

## Peek (Top)

This operation is used to observe the current state of the stack without modifying it.

1. **Access Top**: The algorithm looks at the value currently held at the **Top** reference.
2. **Return**: The value is shown to the user, but the stack structure remains exactly the same.
