<script lang="ts">
  import TreeView from "svelte-tree-view";
  import { BinaryTree } from "$lib/structures/binaryTree";

  const tree = new BinaryTree<number>();
  let data = {};
</script>

<h1 class="text-2xl font-bold mb-4">Binary Tree (Svelte Tree View)</h1>

<TreeView {data} />

<!-- insert button -->
<button on:click={() => {
  const d = tree.insert(Math.floor(Math.random() * 100));
  console.log(d);
  data = d.endSnapshot;
}}>
  Insert Random Node
</button>