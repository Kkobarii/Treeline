<script lang="ts">
// @ts-nocheck

  import { onMount } from "svelte";
  import { Network } from "vis-network/standalone";
  import { BinaryTree } from "$lib/structures/binaryTree";

  let container;
  let tree = new BinaryTree<number>();

  // Helper to flatten treeData into Vis.js nodes + edges
  function flattenTree(root: BinaryTreeNode<number> | null, nodes = [], edges = [], parent = null) {
    if (!root) return { nodes, edges };

    const nodeId = root.id;
    nodes.push({ id: nodeId, label: root.value.toString() });

    if (parent !== null) {
      edges.push({ from: parent, to: nodeId });
    }

    if (root.left) {
      const result = flattenTree(root.left, nodes, edges, nodeId);
      nodes = result.nodes;
      edges = result.edges;
    } else {
      // If there's no left child, add a dummy node for spacing
      const dummyId = `dummy-${nodeId}-L`;
      nodes.push({ id: dummyId, label: "", shape: "point", size: 0.1, color: "transparent" });
      edges.push({ from: nodeId, to: dummyId, dashes: true });
    }

    if (root.right) {
      const result = flattenTree(root.right, nodes, edges, nodeId);
      nodes = result.nodes;
      edges = result.edges;
    } else {
      // If there's no right child, add a dummy node for spacing
      const dummyId = `dummy-${nodeId}-R`;
      nodes.push({ id: dummyId, label: "", shape: "point", size: 0.1, color: "transparent" });
      edges.push({ from: nodeId, to: dummyId, dashes: true });
    }

    return { nodes, edges };
  }

  onMount(() => {
    const { nodes, edges } = flattenTree(tree.root);

    const network = new Network(container, { nodes, edges }, {
      layout: {
        hierarchical: {
          direction: "UD",  // top to bottom
          sortMethod: "directed",
          shakeTowards: "roots"
        }
      },
      physics: true,
      nodes: {
        shape: "box",
        color: "#9fd4ff",
        font: { color: "black" },
      },

      edges: {
        endPointOffset: {
          to: -100,
          from: 100
        }
      }
    });
  });
</script>

<h1 class="text-2xl font-bold mb-4">Binary Tree (Vis.js)</h1>
<div bind:this={container} style="width: 800px; height: 600px; border: 1px solid lightgray;"></div>

<!-- insert button -->
<button class="px-4 py-2 rounded bg-green-500 text-white" on:click={() => {
  const d = tree.insert(Math.floor(Math.random() * 100));
  console.log(d);
  const { nodes, edges } = flattenTree(tree.root);
  const network = new Network(container, { nodes, edges }, {
    layout: {
      hierarchical: {
        direction: "UD",  // top to bottom
        sortMethod: "directed",
        shakeTowards: "roots",
        levelSeparation: 100
      }
    },
    physics: true,
    nodes: {
      shape: "box",
      color: "#9fd4ff",
      font: { color: "black", size: 30 },
    },

    edges: {
      endPointOffset: {
        to: -100,
        from: 100
      }
    }
  });
}}>
  Insert Random Node
</button>