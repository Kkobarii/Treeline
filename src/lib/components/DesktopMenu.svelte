<script lang="ts">
	import { t } from '$lib/i18n';
</script>

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
