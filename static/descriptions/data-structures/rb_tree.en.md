# Red-Black Tree

A Red-Black Tree is a self-balancing Binary Search Tree. While AVL Trees maintain strict balance by checking the height of subtrees, Red-Black Trees maintain a looser balance by assigning a color (red or black) to each node and enforcing a specific set of rules regarding how those colors can be arranged. This approach guarantees that no path from the root to a leaf is more than twice as long as any other path, ensuring the tree remains approximately balanced.

### Key Concepts

- **Colors:** The red and black designations are the primary mechanism for tracking balance. The strict rules governing their placement prevent the tree from becoming too lopsided.
- **Rotations:** Just like AVL Trees, Red-Black Trees use Left Rotations and Right Rotations to fix structural imbalances. A rotation changes the physical arrangement of the nodes.
- **Recoloring:** Before resorting to rotations, the tree will often attempt to fix a rule violation simply by changing the colors of the nodes involved, such as flipping a red node to black or vice versa.

### Rules

To maintain its balanced structure, a Red-Black Tree strictly enforces five core properties:

- **Color Property:** Every node is colored either red or black.
- **Root Property:** The root of the tree is always black.
- **Leaf Property:** All leaves (which are considered conceptual null nodes at the end of branches) are black.
- **Red Rule:** If a node is red, both of its children must be black. This means there cannot be two consecutive red nodes on any path.
- **Black Rule:** Every simple path from a given node to any of its descendant leaves must contain the exact same number of black nodes.

### Complexity Analysis

Because a Red-Black Tree guarantees that the longest path is never more than twice the length of the shortest path, its height is guaranteed to remain at `O(log n)`. While it might be slightly taller than a strictly balanced AVL Tree, its operations remain logarithmically fast.

| Operation  | Worst Case |
| :--------- | :--------- |
| **Insert** | `O(log n)` |
| **Find**   | `O(log n)` |
| **Delete** | `O(log n)` |

## Insert

Insertion is divided into two phases: placing the node, and then fixing any rules that the new node might have broken.

### Phase 1: BST Insertion

1.  **Insert:** The new node is inserted into the tree using the standard Binary Search Tree traversal logic.
2.  **Color Red:** Every newly inserted node is initially colored red. This is done because adding a red node does not change the black-height (The Black Rule), which is the hardest rule to fix. However, adding a red node might violate the Red Rule if the new node's parent is also red.

### Phase 2: Fixup

If the new red node's parent is also red, a double-red violation has occurred. The tree looks at the new node's uncle (the sibling of its parent) to determine how to fix the violation.

1.  **Case 1 (Uncle is Red):** If the uncle is red, the tree performs a simple recoloring. The parent and uncle are painted black, and the grandparent is painted red. The focus then shifts up to the grandparent to ensure painting it red did not cause a new violation higher up.
2.  **Case 2 (Uncle is Black, Triangle Shape):** If the new node, its parent, and its grandparent form a triangle (for example, the parent is a left child, and the new node is a right child), a rotation is performed on the parent to align them into a straight line. This transitions the tree into Case 3.
3.  **Case 3 (Uncle is Black, Line Shape):** If the nodes form a straight line, the tree paints the parent black, the grandparent red, and performs a rotation on the grandparent. This fixes the violation.
4.  **Enforce Root Rule:** After all fixups are complete, the root is always forced back to black, just in case it was painted red during the process.

## Find

Searching the tree uses the exact same traversal logic as a standard Binary Search Tree. The colors are completely ignored during a search.

## Delete

Deletion is the most complex operation, as removing a node can disrupt the strict color properties, particularly the black-height.

### Phase 1: BST Deletion

1.  **Delete:** Find the target node and remove it or replace it using standard BST rules (handling the leaf, single child, or two children cases).
2.  **Track the Color:** If the deleted (or moved) node was red, no rules were broken, as red nodes do not affect the black-height, and removing one cannot create a double-red. However, if the removed node was black, the Black Rule has been violated, as one path now has fewer black nodes than the others.

### Phase 2: Fixup

If a black node was removed, the tree must undergo a fixup process to restore the black-height. The tree looks at the sibling of the node that replaced the deleted node.

1.  **Case 1 (Sibling is Red):** The sibling is painted black, the parent is painted red, and a rotation is performed on the parent. This does not fix the black-height, but it changes the structure so that the new sibling is guaranteed to be black, allowing the tree to move to one of the next cases.
2.  **Case 2 (Sibling is Black, Both Children Black):** The sibling is painted red, and the focus shifts up to the parent.
3.  **Case 3 (Sibling is Black, Near Child is Red):** The tree paints the near child black, paints the sibling red, and rotates the sibling. This transitions the tree into Case 4.
4.  **Case 4 (Sibling is Black, Far Child is Red):** The sibling takes the parent's color, the parent is painted black, the far child is painted black, and a rotation is performed on the parent. This successfully restores the black-height.
5.  **Double Black Violation:** In specific scenarios, a conceptual null node must temporarily hold an extra black weight to maintain balance, triggering a specific fixup to resolve this double-black violation.

## Notes

Red-Black Trees are highly practical and are incredibly common in real-world systems, often used to implement associative arrays and sets in standard programming libraries.

**Fun fact:** A Red-Black Tree is actually a clever binary representation of a 2-3-4 tree, which itself is a specific type of B-tree where nodes can hold up to three values and have up to four children, using red links to conceptually bind standard binary nodes together to simulate those larger multi-value nodes.

**When NOT to use this:** While Red-Black trees are excellent general-purpose structures, if an application is extremely read-heavy and requires the absolute fastest possible lookups, the stricter balancing of an AVL tree might provide slightly better search performance.
