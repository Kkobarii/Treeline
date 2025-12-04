<script lang="ts">
	import '../app.css';

	import { ModeWatcher, toggleMode } from 'mode-watcher';

	let { children } = $props();
</script>

<ModeWatcher />

<nav class="bg-primary-light w-full">
	<div class="container mx-auto flex items-center gap-6 py-4 backdrop-blur-sm">
		<a
			href="/"
			class="flex items-center gap-3 no-underline"
			aria-label="Treeline home">
			<div class="bg-primary text-pink flex h-9 w-9 items-center justify-center rounded-md">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					class="h-5 w-5"
					aria-hidden="true">
					<path d="M12 2L3 7v6c0 5 4 9 9 9s9-4 9-9V7l-9-5z" />
				</svg>
			</div>
			<span class="text-foreground ml-1 text-3xl font-semibold">Treeline</span>
		</a>

		<!-- Links -->
		<div class="ml-6 hidden items-center gap-4 md:flex">
			<a
				href="/data-structures/binary-search-tree"
				class="text-foreground text-xl hover:underline">Binary Search Tree</a>
			<a
				href="/data-structures/avl-tree"
				class="text-foreground text-xl hover:underline">AVL Tree</a>
			<a
				href="/sorting-algorithms/mock"
				class="text-foreground text-xl hover:underline">Sorting</a>
		</div>

		<!-- right actions -->
		<div class="ml-auto flex items-center gap-3">
			<button
				class=""
				onclick={toggleMode}>
				<img
					src="/dark-theme.svg"
					alt="Theme Icon"
					class="h-5 w-5" />
			</button>
		</div>
	</div>
</nav>

<div class="bg-grey-50">
	<main class="container mx-auto mt-6">
		{@render children?.()}
	</main>
</div>
