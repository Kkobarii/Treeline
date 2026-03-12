<script lang="ts">
	import '../app.css';

	import { ModeWatcher, toggleMode } from 'mode-watcher';
	import { onMount } from 'svelte';

	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
	import { locale, t } from '$lib/i18n';

	let { children } = $props();

	onMount(() => {
		locale.initialize();
	});
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
					{$t('nav.dataStructures')}
					<span class="nav-dropdown-chevron transition-transform duration-200"> ▼ </span>
				</button>

				<div class="dropdown-menu">
					<a
						href="/data-structures/binary-search-tree"
						class="dropdown-link">
						{$t('dataStructures.binarySearchTree')}
					</a>
					<a
						href="/data-structures/avl-tree"
						class="dropdown-link">
						{$t('dataStructures.avlTree')}
					</a>
					<a
						href="/data-structures/red-black-tree"
						class="dropdown-link">
						{$t('dataStructures.redBlackTree')}
					</a>
					<a
						href="/data-structures/b-tree"
						class="dropdown-link">
						{$t('dataStructures.bTree')}
					</a>
					<a
						href="/data-structures/heap"
						class="dropdown-link">
						{$t('dataStructures.heap')}
					</a>
					<a
						href="/data-structures/linked-list"
						class="dropdown-link">
						{$t('dataStructures.linkedList')}
					</a>
					<a
						href="/data-structures/stack"
						class="dropdown-link">
						{$t('dataStructures.stack')}
					</a>
					<a
						href="/data-structures/queue"
						class="dropdown-link">
						{$t('dataStructures.queue')}
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
					{$t('nav.sortingAlgorithms')}
					<span class="nav-dropdown-chevron transition-transform duration-200"> ▼ </span>
				</button>

				<div class="dropdown-menu">
					<a
						href="/sorting-algorithms/bubble"
						class="dropdown-link">
						{$t('sortingAlgorithms.bubbleSort')}
					</a>
					<a
						href="/sorting-algorithms/selection"
						class="dropdown-link">
						{$t('sortingAlgorithms.selectionSort')}
					</a>
					<a
						href="/sorting-algorithms/insertion"
						class="dropdown-link">
						{$t('sortingAlgorithms.insertionSort')}
					</a>
					<a
						href="/sorting-algorithms/merge"
						class="dropdown-link">
						{$t('sortingAlgorithms.mergeSort')}
					</a>
					<a
						href="/sorting-algorithms/quick"
						class="dropdown-link">
						{$t('sortingAlgorithms.quickSort')}
					</a>
					<a
						href="/sorting-algorithms/heap"
						class="dropdown-link">
						{$t('sortingAlgorithms.heapSort')}
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

			<LanguageSwitcher />

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
				<span>{$t('nav.dataStructures')}</span>
				<span class="mobile-menu-chevron transition-transform duration-200">▼</span>
			</summary>
			<div class="mobile-submenu">
				<a
					href="/data-structures/binary-search-tree"
					data-sveltekit-reload
					class="mobile-submenu-link">
					{$t('dataStructures.binarySearchTree')}
				</a>
				<a
					href="/data-structures/avl-tree"
					data-sveltekit-reload
					class="mobile-submenu-link">
					{$t('dataStructures.avlTree')}
				</a>
				<a
					href="/data-structures/red-black-tree"
					data-sveltekit-reload
					class="mobile-submenu-link">
					{$t('dataStructures.redBlackTree')}
				</a>
				<a
					href="/data-structures/b-tree"
					data-sveltekit-reload
					class="mobile-submenu-link">
					{$t('dataStructures.bTree')}
				</a>
				<a
					href="/data-structures/heap"
					data-sveltekit-reload
					class="mobile-submenu-link">
					{$t('dataStructures.heap')}
				</a>
				<a
					href="/data-structures/linked-list"
					data-sveltekit-reload
					class="mobile-submenu-link">
					{$t('dataStructures.linkedList')}
				</a>
				<a
					href="/data-structures/stack"
					data-sveltekit-reload
					class="mobile-submenu-link">
					{$t('dataStructures.stack')}
				</a>
				<a
					href="/data-structures/queue"
					data-sveltekit-reload
					class="mobile-submenu-link">
					{$t('dataStructures.queue')}
				</a>
			</div>
		</details>

		<details class="mobile-menu-section">
			<summary class="mobile-menu-button">
				<span>{$t('nav.sortingAlgorithms')}</span>
				<span class="mobile-menu-chevron transition-transform duration-200">▼</span>
			</summary>
			<div class="mobile-submenu">
				<a
					href="/sorting-algorithms/bubble"
					data-sveltekit-reload
					class="mobile-submenu-link">
					{$t('sortingAlgorithms.bubbleSort')}
				</a>
				<a
					href="/sorting-algorithms/selection"
					data-sveltekit-reload
					class="mobile-submenu-link">
					{$t('sortingAlgorithms.selectionSort')}
				</a>
				<a
					href="/sorting-algorithms/insertion"
					data-sveltekit-reload
					class="mobile-submenu-link">
					{$t('sortingAlgorithms.insertionSort')}
				</a>
				<a
					href="/sorting-algorithms/merge"
					data-sveltekit-reload
					class="mobile-submenu-link">
					{$t('sortingAlgorithms.mergeSort')}
				</a>
				<a
					href="/sorting-algorithms/quick"
					data-sveltekit-reload
					class="mobile-submenu-link">
					{$t('sortingAlgorithms.quickSort')}
				</a>
				<a
					href="/sorting-algorithms/heap"
					data-sveltekit-reload
					class="mobile-submenu-link">
					{$t('sortingAlgorithms.heapSort')}
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
			<span class="footer-text">{$t('footer.copyright')}</span>
		</div>
		<div class="flex items-center gap-4">
			<a
				href="https://github.com/Kkobarii/Treeline"
				class="footer-link"
				target="_blank"
				rel="noopener noreferrer">GitHub</a>
			<a
				href="/about"
				class="footer-link">{$t('nav.about')}</a>
		</div>
	</div>
</footer>
