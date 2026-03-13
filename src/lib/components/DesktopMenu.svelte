<script lang="ts">
	import { page } from '$app/state';

	import { getLocale, translate } from '$lib/i18n';

	const locale = getLocale();
	const t = (key: string) => translate(locale, key);
	const sortingDetailSuffix = $derived(
		page.url.pathname.startsWith(`/${locale}/sorting-algorithms/`) && page.url.pathname.endsWith('/detail') ? '/detail' : '',
	);
</script>

<div class="ml-4 hidden items-center gap-6 md:flex">
	<div
		class="nav-dropdown relative"
		role="menuitem"
		tabindex="0">
		<button
			class="header-link flex items-center gap-2"
			aria-haspopup="true">
			{t('nav.dataStructures')}
			<span class="nav-dropdown-chevron transition-transform duration-200"> ▼ </span>
		</button>

		<div class="dropdown-menu">
			<a
				href="/{locale}/data-structures/binary-search-tree"
				class="dropdown-link">
				{t('dataStructures.binarySearchTree')}
			</a>
			<a
				href="/{locale}/data-structures/avl-tree"
				class="dropdown-link">
				{t('dataStructures.avlTree')}
			</a>
			<a
				href="/{locale}/data-structures/red-black-tree"
				class="dropdown-link">
				{t('dataStructures.redBlackTree')}
			</a>
			<a
				href="/{locale}/data-structures/b-tree"
				class="dropdown-link">
				{t('dataStructures.bTree')}
			</a>
			<a
				href="/{locale}/data-structures/heap"
				class="dropdown-link">
				{t('dataStructures.heap')}
			</a>
			<a
				href="/{locale}/data-structures/linked-list"
				class="dropdown-link">
				{t('dataStructures.linkedList')}
			</a>
			<a
				href="/{locale}/data-structures/stack"
				class="dropdown-link">
				{t('dataStructures.stack')}
			</a>
			<a
				href="/{locale}/data-structures/queue"
				class="dropdown-link">
				{t('dataStructures.queue')}
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
			{t('nav.sortingAlgorithms')}
			<span class="nav-dropdown-chevron transition-transform duration-200"> ▼ </span>
		</button>

		<div class="dropdown-menu">
			<a
				href="/{locale}/sorting-algorithms/bubble{sortingDetailSuffix}"
				class="dropdown-link">
				{t('sortingAlgorithms.bubbleSort')}
			</a>
			<a
				href="/{locale}/sorting-algorithms/selection{sortingDetailSuffix}"
				class="dropdown-link">
				{t('sortingAlgorithms.selectionSort')}
			</a>
			<a
				href="/{locale}/sorting-algorithms/insertion{sortingDetailSuffix}"
				class="dropdown-link">
				{t('sortingAlgorithms.insertionSort')}
			</a>
			<a
				href="/{locale}/sorting-algorithms/merge{sortingDetailSuffix}"
				class="dropdown-link">
				{t('sortingAlgorithms.mergeSort')}
			</a>
			<a
				href="/{locale}/sorting-algorithms/quick{sortingDetailSuffix}"
				class="dropdown-link">
				{t('sortingAlgorithms.quickSort')}
			</a>
			<a
				href="/{locale}/sorting-algorithms/heap{sortingDetailSuffix}"
				class="dropdown-link">
				{t('sortingAlgorithms.heapSort')}
			</a>
		</div>
	</div>
</div>
