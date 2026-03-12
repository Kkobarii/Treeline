<script lang="ts">
	import { getLocale, translate } from '$lib/i18n';

	const locale = getLocale();
	const t = (key: string) => translate(locale, key);
</script>

<label
	for="mobile-nav-toggle"
	class="mobile-menu-overlay md:hidden"
	aria-label="Close menu"></label>

<div class="mobile-menu md:hidden">
	<details class="mobile-menu-section">
		<summary class="mobile-menu-button">
			<span>{t('nav.dataStructures')}</span>
			<span class="mobile-menu-chevron transition-transform duration-200">▼</span>
		</summary>
		<div class="mobile-submenu">
			<a
				href="/{locale}/data-structures/binary-search-tree"
				data-sveltekit-reload
				class="mobile-submenu-link">
				{t('dataStructures.binarySearchTree')}
			</a>
			<a
				href="/{locale}/data-structures/avl-tree"
				data-sveltekit-reload
				class="mobile-submenu-link">
				{t('dataStructures.avlTree')}
			</a>
			<a
				href="/{locale}/data-structures/red-black-tree"
				data-sveltekit-reload
				class="mobile-submenu-link">
				{t('dataStructures.redBlackTree')}
			</a>
			<a
				href="/{locale}/data-structures/b-tree"
				data-sveltekit-reload
				class="mobile-submenu-link">
				{t('dataStructures.bTree')}
			</a>
			<a
				href="/{locale}/data-structures/heap"
				data-sveltekit-reload
				class="mobile-submenu-link">
				{t('dataStructures.heap')}
			</a>
			<a
				href="/{locale}/data-structures/linked-list"
				data-sveltekit-reload
				class="mobile-submenu-link">
				{t('dataStructures.linkedList')}
			</a>
			<a
				href="/{locale}/data-structures/stack"
				data-sveltekit-reload
				class="mobile-submenu-link">
				{t('dataStructures.stack')}
			</a>
			<a
				href="/{locale}/data-structures/queue"
				data-sveltekit-reload
				class="mobile-submenu-link">
				{t('dataStructures.queue')}
			</a>
		</div>
	</details>

	<details class="mobile-menu-section">
		<summary class="mobile-menu-button">
			<span>{t('nav.sortingAlgorithms')}</span>
			<span class="mobile-menu-chevron transition-transform duration-200">▼</span>
		</summary>
		<div class="mobile-submenu">
			<a
				href="/{locale}/sorting-algorithms/bubble"
				data-sveltekit-reload
				class="mobile-submenu-link">
				{t('sortingAlgorithms.bubbleSort')}
			</a>
			<a
				href="/{locale}/sorting-algorithms/selection"
				data-sveltekit-reload
				class="mobile-submenu-link">
				{t('sortingAlgorithms.selectionSort')}
			</a>
			<a
				href="/{locale}/sorting-algorithms/insertion"
				data-sveltekit-reload
				class="mobile-submenu-link">
				{t('sortingAlgorithms.insertionSort')}
			</a>
			<a
				href="/{locale}/sorting-algorithms/merge"
				data-sveltekit-reload
				class="mobile-submenu-link">
				{t('sortingAlgorithms.mergeSort')}
			</a>
			<a
				href="/{locale}/sorting-algorithms/quick"
				data-sveltekit-reload
				class="mobile-submenu-link">
				{t('sortingAlgorithms.quickSort')}
			</a>
			<a
				href="/{locale}/sorting-algorithms/heap"
				data-sveltekit-reload
				class="mobile-submenu-link">
				{t('sortingAlgorithms.heapSort')}
			</a>
		</div>
	</details>
</div>
