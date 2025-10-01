<script lang="ts">
	import "../app.css";

	let { children } = $props();
</script>

<nav class="p-4 bg-gray-800 text-white flex gap-4">
  <a href="/" class="hover:underline">Home</a>
  <a href="/d3-tree" class="hover:underline">D3 Tree</a>
  <a href="/svelte-tree" class="hover:underline">Svelte Tree</a>
  <a href="/vis-tree" class="hover:underline">Vis Tree</a>
  <a href="/sorting" class="hover:underline">Sorting</a>
</nav>

<main class="p-8">
  {@render children?.()}
</main>