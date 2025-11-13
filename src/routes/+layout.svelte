<script lang="ts">
	import '../app.css';

	import { ModeWatcher, toggleMode } from 'mode-watcher';

	let { children } = $props();
</script>

<ModeWatcher />

<nav class="flex gap-4 bg-gray-800 p-4 text-white">
	<a
		href="/"
		class="hover:underline">Home</a>
	<a
		href="/binary-search-tree"
		class="hover:underline">Binary Search Tree</a>
	<a
		href="/sorting"
		class="hover:underline">Sorting</a>
	<button
		class="ml-auto rounded bg-gray-600 px-4 py-2 hover:bg-gray-500"
		onclick={toggleMode}>
		Toggle Mode
	</button>
</nav>

<main class="p-8">
	{@render children?.()}
</main>
