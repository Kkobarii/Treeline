<script lang="ts">
	import '../app.css';

	import { ModeWatcher, toggleMode } from 'mode-watcher';

	let { children } = $props();
</script>

<ModeWatcher />

<nav class="header-nav">
	<div class="container mx-auto flex items-center gap-8 px-6 py-4">
		<a
			href="/"
			class="flex items-center gap-3 no-underline"
			aria-label="Treeline home">
			<img
				src="/branch.svg"
				alt="Treeline logo"
				class="h-8 w-8" />
			<span class="header-title">Treeline</span>
		</a>

		<!-- links -->
		<div class="ml-4 hidden items-center gap-6 md:flex">
			<a
				href="/data-structures/binary-search-tree"
				class="header-link">Binary Search Tree</a>
			<a
				href="/data-structures/avl-tree"
				class="header-link">AVL Tree</a>
			<a
				href="/data-structures/red-black-tree"
				class="header-link">Red-Black Tree</a>
			<a
				href="/data-structures/b-tree"
				class="header-link">B-Tree</a>
			<a
				href="/data-structures/heap"
				class="header-link">Heap</a>
			<a
				href="/data-structures/linked-list"
				class="header-link">Linked List</a>
		</div>

		<!-- right actions -->
		<div class="ml-auto flex items-center gap-3">
			<button
				aria-label="Toggle dark mode"
				class="header-theme-button"
				onclick={toggleMode}>
				<span
					role="img"
					aria-label="Theme Icon"
					class="block h-5 w-5"
					style="
						background: white;
						-webkit-mask: url('/dark-theme.svg') no-repeat center / contain;
						mask: url('/dark-theme.svg') no-repeat center / contain;
					"></span>
			</button>
		</div>
	</div>
</nav>

<div class="header-spacer"></div>

<main class="container mx-auto flex flex-col gap-8 px-6 py-8">
	{@render children?.()}
</main>

<footer class="footer-nav">
	<div class="container mx-auto flex flex-col items-center justify-between gap-4 px-6 py-4 md:flex-row">
		<div class="flex flex-col items-center gap-3 md:flex-row">
			<img
				src="/branch.svg"
				alt="Treeline logo"
				class="h-6 w-6" />
			<span class="footer-text">© 2026 Treeline. Visual tool for learning data structures and (soon) sorting algorithms.</span>
		</div>
		<div class="flex items-center gap-4">
			<a
				href="https://github.com/Kkobarii/Treeline"
				class="footer-link"
				target="_blank"
				rel="noopener noreferrer">GitHub</a>
			<a
				href="/about"
				class="footer-link">About</a>
		</div>
	</div>
</footer>
