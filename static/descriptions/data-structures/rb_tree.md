# Red-Black Tree

A **Red-Black Tree** is a sophisticated type of self-balancing Binary Search Tree. It ensures that the tree remains approximately balanced, preventing it from becoming a "flat" list and maintaining efficient performance for all operations.

Unlike a standard tree, every node in a Red-Black Tree carries an extra bit of information: its **color** (either **Red** or **Black**). These colors are used to enforce a specific set of rules during insertions and deletions to guarantee the tree's balance.

### The Five Properties

To be considered a valid Red-Black Tree, the structure must always satisfy these five conditions:

1. **Color**: Every node is either red or black.
2. **Root**: The root of the tree is always black.
3. **Leaf**: Every leaf (null) is considered black.
4. **Red Rule**: If a node is red, both its children must be black (no two red nodes can be adjacent).
5. **Path Rule**: For each node, all simple paths from that node to descendant leaves must contain the same number of black nodes.

### Rebalancing Tools

To maintain these properties during insertions and deletions, Red-Black Trees use two primary operations:

- **Recoloring**: Changing nodes between Red and Black to satisfy the Path and Red rules.
- **Left/Right Rotations**: Moving nodes vertically to change the structure of the tree without breaking the Binary Search order.

## Complexity Analysis

The Red-Black Tree provides excellent performance guarantees. By ensuring the longest path from the root to a leaf is no more than twice as long as the shortest path, it keeps operations logarithmic.

| Operation | Worst Case |
| --------- | ---------- |
| Find      | O(log n)   |
| Insert    | O(log n)   |
| Delete    | O(log n)   |

## Search (Find)

The search process is identical to a standard Binary Search Tree.

1. **Compare**: The algorithm starts at the root and compares the target value to the current node's value.
2. **Traverse**:
    - If the target is **smaller**, it moves to the **left child**.
    - If the target is **larger**, it moves to the **right child**.

3. **Outcome**: If a match is found, the node is returned. If the search reaches a null leaf, the value is not in the tree.

## Insertion

Inserting into a Red-Black Tree involves placing the new data and then performing a "fix-up" to restore any violated properties.

### Phase 1: Placement

- The tree is navigated as a standard BST to find the correct empty spot.
- A **New Red Node** is created at that spot.
- If the tree was empty, this node becomes the root and is colored **Black** to satisfy the Root Property.

### Phase 2: Restoring Properties (Fix-up)

If the new node's parent is also red, the "Red Rule" is violated. The algorithm looks at the **Uncle** (the parent's sibling) to decide how to fix it:

- **Case 1: Red Uncle**: If the uncle is red, the algorithm **recolors** the parent and uncle to black and the grandparent to red. The check then moves up to the grandparent.
- **Case 2: Black Uncle (Triangle)**: If the uncle is black and the new node forms a "triangle" shape with its parent and grandparent, a **rotation** is performed on the parent to turn it into a "line".
- **Case 3: Black Uncle (Line)**: If the uncle is black and the nodes form a straight line, the algorithm **recolors** the parent to black and the grandparent to red, then performs a **rotation** on the grandparent to balance the tree.

## Deletion (Remove)

Deletion is the most complex operation because removing a black node can disrupt the "Path Rule" (the black height of the tree).

### Phase 1: Search and Standard Removal

1. **Locate**: The target node is found using the search logic.
2. **Mark**: The node is marked for deletion.
3. **Physical Removal**:
    - **Leaf or One Child**: The node is removed, and its child (if any) is "transplanted" into its position.
    - **Two Children**: The **Inorder Successor** (smallest node in the right subtree) is found. Its value is copied to the target node, and the original successor node is removed instead.

### Phase 2: Restoring Properties (Fix-up)

If the node removed was **Black**, it creates a "Double Black" violation, meaning one path now has fewer black nodes than others. The algorithm fixes this by examining the **Sibling** of the current node:

- **Case 0: Null Leaf**: If the violation occurs at a conceptual empty leaf, the algorithm prepares to fix the balance starting from the parent.
- **Case 1: Red Sibling**: The sibling is recolored black and the parent red, followed by a **rotation** at the parent to bring a black node into the path.
- **Case 2: Black Sibling with Two Black Children**: The sibling is recolored **Red**, and the "Double Black" status moves up to the parent to be solved there.
- **Case 3: Black Sibling with Near Red Child**: The sibling and its red child are **recolored and rotated** to transform this into Case 4.
- **Case 4: Black Sibling with Far Red Child**: The sibling takes the parent's color, the parent and the far child are colored **Black**, and a **rotation** is performed at the parent to perfectly restore the black height.
