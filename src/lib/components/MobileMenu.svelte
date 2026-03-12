<script lang="ts">
	import { t } from '$lib/i18n';
</script>

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
