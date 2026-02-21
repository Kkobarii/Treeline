<script lang="ts">
	import '../app.css';

	import { ModeWatcher, toggleMode } from 'mode-watcher';

	let { children } = $props();
	let structuresDropdownOpen = $state(false);
	let sortingDropdownOpen = $state(false);
	let mobileMenuOpen = $state(false);
	let mobileStructuresOpen = $state(false);
	let mobileSortingOpen = $state(false);

	function closeMobileMenu() {
		mobileMenuOpen = false;
		mobileStructuresOpen = false;
		mobileSortingOpen = false;
	}

	function openMobileMenu() {
		mobileMenuOpen = true;
	}

	function toggleMobileMenu() {
		if (mobileMenuOpen) {
			closeMobileMenu();
		} else {
			openMobileMenu();
		}
	}
</script>

<ModeWatcher />

{#if mobileMenuOpen}
	<div
		class="mobile-menu-overlay"
		role="button"
		tabindex="0"
		aria-label="Close menu"
		onclick={() => closeMobileMenu()}
		onkeydown={e => e.key === 'Escape' && closeMobileMenu()}>
	</div>
{/if}

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

		<div class="ml-4 hidden items-center gap-6 md:flex">
			<div
				class="relative"
				role="menuitem"
				tabindex="0"
				onmouseenter={() => (structuresDropdownOpen = true)}
				onmouseleave={() => (structuresDropdownOpen = false)}>
				<button
					class="header-link flex items-center gap-2"
					aria-expanded={structuresDropdownOpen}
					aria-haspopup="true">
					Data Structures
					<span
						class="transition-transform duration-200"
						style="transform: {structuresDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'}">
						▼
					</span>
				</button>

				{#if structuresDropdownOpen}
					<div class="dropdown-menu">
						<a
							href="/data-structures/binary-search-tree"
							class="dropdown-link"
							onclick={() => (structuresDropdownOpen = false)}>
							Binary Search Tree
						</a>
						<a
							href="/data-structures/avl-tree"
							class="dropdown-link"
							onclick={() => (structuresDropdownOpen = false)}>
							AVL Tree
						</a>
						<a
							href="/data-structures/red-black-tree"
							class="dropdown-link"
							onclick={() => (structuresDropdownOpen = false)}>
							Red-Black Tree
						</a>
						<a
							href="/data-structures/b-tree"
							class="dropdown-link"
							onclick={() => (structuresDropdownOpen = false)}>
							B-Tree
						</a>
						<a
							href="/data-structures/heap"
							class="dropdown-link"
							onclick={() => (structuresDropdownOpen = false)}>
							Heap
						</a>
						<a
							href="/data-structures/linked-list"
							class="dropdown-link"
							onclick={() => (structuresDropdownOpen = false)}>
							Linked List
						</a>
						<a
							href="/data-structures/stack"
							class="dropdown-link"
							onclick={() => (structuresDropdownOpen = false)}>
							Stack
						</a>
						<a
							href="/data-structures/queue"
							class="dropdown-link"
							onclick={() => (structuresDropdownOpen = false)}>
							Queue
						</a>
					</div>
				{/if}
			</div>

			<div
				class="relative"
				role="menuitem"
				tabindex="0"
				onmouseenter={() => (sortingDropdownOpen = true)}
				onmouseleave={() => (sortingDropdownOpen = false)}>
				<button
					class="header-link flex items-center gap-2"
					aria-expanded={sortingDropdownOpen}
					aria-haspopup="true">
					Sorting Algorithms
					<span
						class="transition-transform duration-200"
						style="transform: {sortingDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'}">
						▼
					</span>
				</button>

				{#if sortingDropdownOpen}
					<div class="dropdown-menu">
						<a
							href="/sorting-algorithms/bubble"
							class="dropdown-link"
							onclick={() => (sortingDropdownOpen = false)}>
							Bubble Sort
						</a>
						<a
							href="/sorting-algorithms/selection"
							class="dropdown-link"
							onclick={() => (sortingDropdownOpen = false)}>
							Selection Sort
						</a>
						<a
							href="/sorting-algorithms/insertion"
							class="dropdown-link"
							onclick={() => (sortingDropdownOpen = false)}>
							Insertion Sort
						</a>
						<a
							href="/sorting-algorithms/merge"
							class="dropdown-link"
							onclick={() => (sortingDropdownOpen = false)}>
							Merge Sort
						</a>
						<a
							href="/sorting-algorithms/quick"
							class="dropdown-link"
							onclick={() => (sortingDropdownOpen = false)}>
							Quick Sort
						</a>
						<a
							href="/sorting-algorithms/heap"
							class="dropdown-link"
							onclick={() => (sortingDropdownOpen = false)}>
							Heap Sort
						</a>
					</div>
				{/if}
			</div>
		</div>

		<div class="ml-auto flex items-center gap-3">
			<button
				aria-label="Toggle menu"
				class="header-burger-button"
				onclick={toggleMobileMenu}>
				<span class="burger-line"></span>
				<span class="burger-line"></span>
				<span class="burger-line"></span>
			</button>

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

	{#if mobileMenuOpen}
		<div class="mobile-menu">
			<div class="mobile-menu-section">
				<button
					class="mobile-menu-button"
					onclick={() => (mobileStructuresOpen = !mobileStructuresOpen)}>
					<span>Data Structures</span>
					<span
						class="transition-transform duration-200"
						style="transform: {mobileStructuresOpen ? 'rotate(180deg)' : 'rotate(0deg)'}">
						▼
					</span>
				</button>
				{#if mobileStructuresOpen}
					<div class="mobile-submenu">
						<a
							href="/data-structures/binary-search-tree"
							class="mobile-submenu-link"
							onclick={() => closeMobileMenu()}>
							Binary Search Tree
						</a>
						<a
							href="/data-structures/avl-tree"
							class="mobile-submenu-link"
							onclick={() => closeMobileMenu()}>
							AVL Tree
						</a>
						<a
							href="/data-structures/red-black-tree"
							class="mobile-submenu-link"
							onclick={() => closeMobileMenu()}>
							Red-Black Tree
						</a>
						<a
							href="/data-structures/b-tree"
							class="mobile-submenu-link"
							onclick={() => closeMobileMenu()}>
							B-Tree
						</a>
						<a
							href="/data-structures/heap"
							class="mobile-submenu-link"
							onclick={() => closeMobileMenu()}>
							Heap
						</a>
						<a
							href="/data-structures/linked-list"
							class="mobile-submenu-link"
							onclick={() => closeMobileMenu()}>
							Linked List
						</a>
						<a
							href="/data-structures/stack"
							class="mobile-submenu-link"
							onclick={() => closeMobileMenu()}>
							Stack
						</a>
						<a
							href="/data-structures/queue"
							class="mobile-submenu-link"
							onclick={() => closeMobileMenu()}>
							Queue
						</a>
					</div>
				{/if}
			</div>

			<div class="mobile-menu-section">
				<button
					class="mobile-menu-button"
					onclick={() => (mobileSortingOpen = !mobileSortingOpen)}>
					<span>Sorting Algorithms</span>
					<span
						class="transition-transform duration-200"
						style="transform: {mobileSortingOpen ? 'rotate(180deg)' : 'rotate(0deg)'}">
						▼
					</span>
				</button>
				{#if mobileSortingOpen}
					<div class="mobile-submenu">
						<a
							href="/sorting-algorithms/bubble"
							class="mobile-submenu-link"
							onclick={() => closeMobileMenu()}>
							Bubble Sort
						</a>
						<a
							href="/sorting-algorithms/selection"
							class="mobile-submenu-link"
							onclick={() => closeMobileMenu()}>
							Selection Sort
						</a>
						<a
							href="/sorting-algorithms/insertion"
							class="mobile-submenu-link"
							onclick={() => closeMobileMenu()}>
							Insertion Sort
						</a>
						<a
							href="/sorting-algorithms/merge"
							class="mobile-submenu-link"
							onclick={() => closeMobileMenu()}>
							Merge Sort
						</a>
						<a
							href="/sorting-algorithms/quick"
							class="mobile-submenu-link"
							onclick={() => closeMobileMenu()}>
							Quick Sort
						</a>
						<a
							href="/sorting-algorithms/heap"
							class="mobile-submenu-link"
							onclick={() => closeMobileMenu()}>
							Heap Sort
						</a>
					</div>
				{/if}
			</div>
		</div>
	{/if}
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
