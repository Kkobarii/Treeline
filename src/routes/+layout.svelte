<script lang="ts">
	import "../app.css";

	let { children } = $props();
</script>

<nav class="p-4 bg-gray-800 text-white flex gap-4">
  <a href="/" class="hover:underline">Home</a>
  <a href="/binary-search-tree" class="hover:underline">Binary Search Tree</a>
  <a href="/sorting" class="hover:underline">Sorting</a>
</nav>

<main class="p-8">
  {@render children?.()}
</main>