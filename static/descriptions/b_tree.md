# B-Tree

A **B-Tree** is a self-balancing tree data structure that maintains sorted data and allows searches, sequential access, insertions, and deletions in logarithmic time. Unlike binary trees where each node has at most two children, B-Trees can have many more children per node, making them particularly efficient for systems that read and write large blocks of data, such as databases and file systems.

### Key Properties

Every B-Tree is defined by an **order** value, which determines the maximum number of children a node can have:

- Each node can contain at most **order - 1** keys
- Each node (except root) must contain at least **⌈order/2⌉ - 1** keys
- Each internal node (except root) has at least **⌈order/2⌉** children
- All leaf nodes appear at the same level

This structure ensures the tree remains balanced, with all paths from root to leaf having the same length.

### Node Structure

Unlike binary trees, B-Tree nodes contain:

- **Multiple values**: An array of sorted keys (up to order - 1)
- **Multiple children**: An array of child pointers (up to order)
- **Leaf flag**: Indicates whether the node is a leaf or internal node

Internal nodes have one more child than they have keys, with keys acting as separators between child subtrees.

## Complexity Analysis

B-Trees maintain excellent performance by keeping the tree height minimal through multi-way branching:

| Operation | Worst Case |
| --------- | ---------- |
| Find      | O(log n)   |
| Insert    | O(log n)   |
| Delete    | O(log n)   |

The logarithm base is determined by the order value, making B-Trees with larger order values shorter and wider.

## Search (Find)

Searching in a B-Tree is similar to binary search but extended to multiple keys per node:

1. **Search within node**: Compare the target with keys in the current node
2. **Match found**: If a key matches, return success
3. **Navigate to child**: If no match and not a leaf, determine which child subtree should contain the target based on key comparisons
4. **Repeat**: Continue recursively until found or reaching a leaf

If we reach a leaf without finding the target, it doesn't exist in the tree.

## Insertion

Insertion maintains the B-Tree properties by splitting full nodes proactively:

### Phase 1: Navigate to insertion point

- Traverse from root to the appropriate leaf node
- If a full node (order - 1 keys) is encountered, **split it** before descending

### Phase 2: Node splitting

When a node is full:

1. **Find median**: Identify the middle key (at index ⌈order/2⌉ - 1)
2. **Create sibling**: Create a new node for the upper half of keys
3. **Promote median**: Move the median key up to the parent
4. **Distribute keys**: Left node keeps lower half, right node gets upper half
5. **Distribute children**: If not a leaf, split children accordingly

### Phase 3: Insert into non-full node

Once at a non-full leaf:

- Insert the new key in sorted order
- The tree remains balanced as all modifications happen at the same level

## Deletion (Remove)

Deletion is the most complex operation, maintaining balance through borrowing and merging:

### Case 1: Key in leaf node

Simply remove the key. If this makes the node too small (< ⌈order/2⌉ - 1 keys), proceed to fix-up.

### Case 2: Key in internal node

Replace with either:

- **Predecessor**: The largest key in the left subtree, or
- **Successor**: The smallest key in the right subtree

Then recursively delete the predecessor/successor from its original location.

### Case 3: Child has minimum keys (⌈order/2⌉ - 1)

Before descending to a child with only ⌈order/2⌉ - 1 keys, ensure it has at least ⌈order/2⌉ keys:

**Borrow from sibling** if a neighboring sibling has ≥ ⌈order/2⌉ keys:

- Move a key from parent down to the child
- Move a key from the sibling up to the parent
- Move a child pointer if necessary

**Merge with sibling** if both siblings have exactly ⌈order/2⌉ - 1 keys:

- Bring a key down from the parent
- Combine the child, parent key, and sibling into one node
- Remove the parent key and sibling pointer from parent

### Root special case

If deletion causes the root to become empty:

- Make the root's only child the new root
- This is the only way a B-Tree decreases in height

## Why B-Trees?

B-Trees excel in scenarios where data is stored on disk:

- **Minimize disk I/O**: Each node can be sized to match a disk block
- **Shallow height**: More keys per node means fewer levels to traverse
- **Predictable performance**: All operations guaranteed O(log n)
- **Range queries**: Sequential access is efficient since keys are sorted

This makes B-Trees the foundation of most modern database systems and file systems.
