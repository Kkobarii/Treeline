# B-Tree

A B-Tree is a complex, self-balancing search tree designed to handle massive amounts of data efficiently. Unlike typical binary search trees where each node holds a single value and two pointers, a B-Tree node is designed to hold multiple values and point to many children. This wide, shallow structure makes it uniquely suited for systems that read and write large blocks of data, such as databases and file systems.

### Key Concepts

- **Order:** The order of a B-Tree defines its overall capacity. In this implementation, the order `m` represents the maximum number of children a single node can have. It is worth noting that some texts define order as the minimum number of children instead, but the maximum child definition is used here.
- **Node Structure:** Each node contains an array of sorted values and an array of child pointers. A node with `k` children will always contain `k - 1` values. The values act as dividers that separate the child pointers into specific ranges.
- **Internal vs. Leaf Nodes:** Internal nodes contain both values and pointers to children, serving as routing points. Leaf nodes contain only values and reside at the very bottom of the tree, possessing no child pointers.

### Rules

- **Capacity Limits:** A node can have at most `m` children and `m - 1` values.
- **Minimum Limits:** Every internal node (except the root) must have at least `Math.ceil(m / 2)` children, ensuring the tree remains dense.
- **Sorted Values:** The values within a single node are stored in strictly increasing order.
- **Search Tree Property:** For any value `V` in a node, all values in the child subtree to its left are strictly less than `V`, and all values in the child subtree to its right are strictly greater than `V`.
- **Uniform Depth:** All leaf nodes must exist at the exact same depth, guaranteeing perfect balance across the entire structure.

This specific implementation shows a B-Tree of **order 5**, meaning each node can have up to **5 children** and **4 values**. The minimum number of children for internal nodes (except the root) is **3**, which ensures that the tree remains balanced and efficient even as it grows.

### Complexity Analysis

Because a B-Tree is perfectly balanced and each node stores multiple values, the height of the tree is significantly reduced compared to standard binary trees. The height remains at `O(log n)`, and because the base of the logarithm is large (based on the order `m`), the tree stays incredibly shallow even with millions of records.

| Operation  | Worst Case |
| :--------- | :--------- |
| **Insert** | `O(log n)` |
| **Find**   | `O(log n)` |
| **Delete** | `O(log n)` |

## Insert

Insertion always happens at the leaf level. Instead of growing downwards like a standard binary tree, a B-Tree grows upwards when nodes run out of space.

### Phase 1: Search and Insert

1. **Compare:** Start at the root and navigate down the tree to find the appropriate leaf node by scanning the sorted values.
2. **Traverse:** Decide the path based on the comparison:
    - If the new value is smaller than a given value, follow the child pointer to the left of that value.
    - If the new value is larger than all values in the node, follow the rightmost child pointer.
3. **Insert Value:** Once the correct leaf is found, insert the new value into the node's array of values, ensuring the array remains perfectly sorted.

### Phase 2: Split and Promote

1. **Mark Overfull:** If the insertion causes the node to exceed its maximum allowed values, the node is marked as overfull and must be divided.
2. **Split:** The overfull node is split down the middle into two separate, smaller nodes:
    - A left node to hold the smaller half of the values.
    - A right node to hold the larger half of the values.
3. **Promote Middle:** The median value of the original overfull node is pushed up (promoted) into the parent node.
    - This promoted value acts as a new divider between the two newly split nodes.
    - If no parent exists (meaning the split occurred at the root), a new root is created, which increases the overall height of the tree.
4. **Propagate:** If promoting the middle value causes the parent node to become overfull, the split and promote process is repeated on the parent.
    - This operation can cascade upwards, potentially reaching all the way to the root.

## Find

Searching a B-Tree relies on a generalized search logic, checking multiple values per node.

1. **Compare:** Start at the root and scan through the sorted values in the current node.
2. **Found:** If the target matches a value, the node is successfully found.
3. **Traverse:** Decide the path based on the comparison:
    - If the target is smaller than a given value, follow the child pointer to the left of that value.
    - If the target is larger than all values in the node, follow the rightmost child pointer.
4. **Not Found:** If a leaf node is reached and the value is not present, the search ends, meaning the value does not exist in the tree.

## Delete

Deletion is highly complex because it must maintain the minimum value requirements and the uniform depth of the tree without breaking the sorting rules.

### Phase 1: Location and Removal

The first step is finding the value and safely removing it, which differs based on where the value is located.

1. **Case 1: Value in Leaf Node:** If the target value is located in a leaf node, it is simply removed from the node's value array.
2. **Case 2: Value in Internal Node:** If the value resides in an internal node, it cannot be simply removed without breaking the routing structure.
    - The tree finds either its inorder predecessor (the largest value in the left child subtree) or its inorder successor (the smallest value in the right child subtree).
    - The target value is overwritten with this predecessor or successor.
    - The original predecessor or successor is then targeted for deletion from its respective leaf node.

### Phase 2: Rebalancing (Underflow)

If removing a value causes a node to drop below its minimum required number of values, an underflow occurs. The tree must pull data from surrounding nodes to restore balance.

1. **Case 1: Borrow from Left Sibling:** If the immediate left sibling has more than the minimum number of values, borrow a value to fill the gap.
    - The largest value from the left sibling moves up into the parent.
    - The parent's dividing value moves down into the underflowing node.
    - If the nodes are not leaves, the rightmost child pointer of the left sibling is transferred to become the leftmost child pointer of the underflowing node.
2. **Case 2: Borrow from Right Sibling:** If the immediate right sibling has spare values, borrow a value from it instead.
    - The smallest value from the right sibling moves up into the parent.
    - The parent's dividing value moves down into the underflowing node.
    - If the nodes are not leaves, the leftmost child pointer of the right sibling is transferred to become the rightmost child pointer of the underflowing node.
3. **Case 3: Merge Children:** If neither sibling has spare values to lend, the underflowing node must be merged with one of its siblings.
    - The parent's dividing value is pulled down.
    - This dividing value is combined with the values of both siblings to form a single, full node.
    - All child pointers from both siblings are transferred and merged into this new node in their correct order.
    - Because the parent loses a value, the parent itself might now underflow, causing the rebalancing process to cascade upward.

## Notes

B-Trees are universally used in database management systems and file systems (like NTFS, ext4, or APFS).

Because accessing secondary storage (like a hard drive or solid-state drive) is notoriously slow compared to accessing RAM, the B-Tree is explicitly designed to pack as much data as possible into a single large node. This minimizes the number of disk accesses required to find a piece of information, making it vastly superior to standard binary trees for massive, real-world datasets.
