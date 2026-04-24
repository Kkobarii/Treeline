# Stack

A Stack is a simple, linear data structure that operates on the Last-In-First-Out (LIFO) principle. It is designed so that elements are added and removed from the exact same end, conceptually known as the top. Because of this strict access pattern, it is highly efficient but intentionally limited in its flexibility.

### Rules

- **LIFO Property:** The last element added to the stack is mathematically guaranteed to be the first one removed.
- **Top Access Only:** Elements can only be added, removed, or examined at the very top of the stack. Traversing the middle of the structure is not allowed.
- **Node Structure:** Internally, each node contains a value and a reference pointer directed at the next node immediately below it in the stack.

### Complexity Analysis

Because all modifications and lookups happen strictly at the single top pointer, there is never a need to traverse the underlying structure. This results in incredibly fast, constant-time operations across the board.

| Operation | Worst Case |
| :-------- | :--------- |
| **Push**  | `O(1)`     |
| **Pop**   | `O(1)`     |
| **Peek**  | `O(1)`     |

## Push

Inserting a new value onto the stack is a straightforward process of creating a new top element and linking it downward.

1. **Create Node:** A new node is generated containing the provided value.
2. **Link Next:** The new node's pointer is set to reference the current top node of the stack.
3. **Update Top:** The stack's primary top pointer is updated to point to this newly created node, solidifying its place at the very top.

## Pop

Removing an element simply requires shifting the top pointer downwards, discarding the most recently added item.

1. **Empty Check:** If the stack is empty, the operation halts and is dropped.
2. **Retrieve:** The value of the current top node is retrieved to be returned.
3. **Update Top:** The stack's primary top pointer is shifted down to reference the next node in the sequence, effectively detaching and removing the original top node from the structure.

## Peek

Retrieving the value of the most recently added element simply involves inspecting the top node without making any structural changes or removing the element from the stack.

## Notes

Stacks are a foundational concept in computer science. They are the underlying mechanism for managing function calls in programming languages (the call stack), evaluating complex mathematical expressions, tracking browser history, and implementing undo features in text editors.

**When NOT to use this:** A stack should be avoided if the application requires processing the oldest data first, or if it needs to search for arbitrary values within the collection. Searching a stack requires systematically popping and discarding elements just to reach the desired value, making it highly inefficient for general-purpose data retrieval.
