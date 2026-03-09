<script lang="ts">
	import '../app.css';

	import { ModeWatcher, toggleMode } from 'mode-watcher';

	let { children } = $props();
</script>

<ModeWatcher />

<nav class="header-nav">
	<input
		id="mobile-nav-toggle"
		type="checkbox"
		class="mobile-menu-toggle" />

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

		<div class="ml-4 hidden items-center gap-6 md:flex">
			<div
				class="nav-dropdown relative"
				role="menuitem"
				tabindex="0">
				<button
					class="header-link flex items-center gap-2"
					aria-haspopup="true">
					Data Structures
					<span class="nav-dropdown-chevron transition-transform duration-200"> ▼ </span>
				</button>

				<div class="dropdown-menu">
					<a
						href="/data-structures/binary-search-tree"
						class="dropdown-link">
						Binary Search Tree
					</a>
					<a
						href="/data-structures/avl-tree"
						class="dropdown-link">
						AVL Tree
					</a>
					<a
						href="/data-structures/red-black-tree"
						class="dropdown-link">
						Red-Black Tree
					</a>
					<a
						href="/data-structures/b-tree"
						class="dropdown-link">
						B-Tree
					</a>
					<a
						href="/data-structures/heap"
						class="dropdown-link">
						Heap
					</a>
					<a
						href="/data-structures/linked-list"
						class="dropdown-link">
						Linked List
					</a>
					<a
						href="/data-structures/stack"
						class="dropdown-link">
						Stack
					</a>
					<a
						href="/data-structures/queue"
						class="dropdown-link">
						Queue
					</a>
				</div>
			</div>

			<div
				class="nav-dropdown relative"
				role="menuitem"
				tabindex="0">
				<button
					class="header-link flex items-center gap-2"
					aria-haspopup="true">
					Sorting Algorithms
					<span class="nav-dropdown-chevron transition-transform duration-200"> ▼ </span>
				</button>

				<div class="dropdown-menu">
					<a
						href="/sorting-algorithms/bubble"
						class="dropdown-link">
						Bubble Sort
					</a>
					<a
						href="/sorting-algorithms/selection"
						class="dropdown-link">
						Selection Sort
					</a>
					<a
						href="/sorting-algorithms/insertion"
						class="dropdown-link">
						Insertion Sort
					</a>
					<a
						href="/sorting-algorithms/merge"
						class="dropdown-link">
						Merge Sort
					</a>
					<a
						href="/sorting-algorithms/quick"
						class="dropdown-link">
						Quick Sort
					</a>
					<a
						href="/sorting-algorithms/heap"
						class="dropdown-link">
						Heap Sort
					</a>
				</div>
			</div>
		</div>

		<div class="ml-auto flex items-center gap-3">
			<label
				for="mobile-nav-toggle"
				aria-label="Toggle menu"
				class="header-burger-button md:hidden">
				<span class="burger-line"></span>
				<span class="burger-line"></span>
				<span class="burger-line"></span>
			</label>

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

	<label
		for="mobile-nav-toggle"
		class="mobile-menu-overlay md:hidden"
		aria-label="Close menu"></label>

	<div class="mobile-menu md:hidden">
		<details class="mobile-menu-section">
			<summary class="mobile-menu-button">
				<span>Data Structures</span>
				<span class="mobile-menu-chevron transition-transform duration-200">▼</span>
			</summary>
			<div class="mobile-submenu">
				<a
					href="/data-structures/binary-search-tree"
					data-sveltekit-reload
					class="mobile-submenu-link">
					Binary Search Tree
				</a>
				<a
					href="/data-structures/avl-tree"
					data-sveltekit-reload
					class="mobile-submenu-link">
					AVL Tree
				</a>
				<a
					href="/data-structures/red-black-tree"
					data-sveltekit-reload
					class="mobile-submenu-link">
					Red-Black Tree
				</a>
				<a
					href="/data-structures/b-tree"
					data-sveltekit-reload
					class="mobile-submenu-link">
					B-Tree
				</a>
				<a
					href="/data-structures/heap"
					data-sveltekit-reload
					class="mobile-submenu-link">
					Heap
				</a>
				<a
					href="/data-structures/linked-list"
					data-sveltekit-reload
					class="mobile-submenu-link">
					Linked List
				</a>
				<a
					href="/data-structures/stack"
					data-sveltekit-reload
					class="mobile-submenu-link">
					Stack
				</a>
				<a
					href="/data-structures/queue"
					data-sveltekit-reload
					class="mobile-submenu-link">
					Queue
				</a>
			</div>
		</details>

		<details class="mobile-menu-section">
			<summary class="mobile-menu-button">
				<span>Sorting Algorithms</span>
				<span class="mobile-menu-chevron transition-transform duration-200">▼</span>
			</summary>
			<div class="mobile-submenu">
				<a
					href="/sorting-algorithms/bubble"
					data-sveltekit-reload
					class="mobile-submenu-link">
					Bubble Sort
				</a>
				<a
					href="/sorting-algorithms/selection"
					data-sveltekit-reload
					class="mobile-submenu-link">
					Selection Sort
				</a>
				<a
					href="/sorting-algorithms/insertion"
					data-sveltekit-reload
					class="mobile-submenu-link">
					Insertion Sort
				</a>
				<a
					href="/sorting-algorithms/merge"
					data-sveltekit-reload
					class="mobile-submenu-link">
					Merge Sort
				</a>
				<a
					href="/sorting-algorithms/quick"
					data-sveltekit-reload
					class="mobile-submenu-link">
					Quick Sort
				</a>
				<a
					href="/sorting-algorithms/heap"
					data-sveltekit-reload
					class="mobile-submenu-link">
					Heap Sort
				</a>
			</div>
		</details>
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
			<span class="footer-text">© 2026 Treeline. Visual tool for learning data structures and sorting algorithms.</span>
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
