<script lang="ts">
	import { getLocale, translate } from '$lib/i18n';

	const locale = getLocale();
	const t = (key: string) => translate(locale, key);
</script>

<h1 class="page-title">{t('nav.dataStructures')} & {t('nav.sortingAlgorithms')}</h1>

<div class="grid gap-6 md:grid-cols-2">
	<div class="treeline-card">
		<h2 class="mb-4 text-xl font-semibold">{t('nav.dataStructures')}</h2>
		<ul class="space-y-2">
			<li>
				<a
					href="/{locale}/data-structures/binary-search-tree"
					class="text-primary hover:underline">{t('dataStructures.binarySearchTree')}</a>
			</li>
			<li>
				<a
					href="/{locale}/data-structures/avl-tree"
					class="text-primary hover:underline">{t('dataStructures.avlTree')}</a>
			</li>
			<li>
				<a
					href="/{locale}/data-structures/red-black-tree"
					class="text-primary hover:underline">{t('dataStructures.redBlackTree')}</a>
			</li>
			<li>
				<a
					href="/{locale}/data-structures/b-tree"
					class="text-primary hover:underline">{t('dataStructures.bTree')}</a>
			</li>
			<li>
				<a
					href="/{locale}/data-structures/heap"
					class="text-primary hover:underline">{t('dataStructures.heap')}</a>
			</li>
			<li>
				<a
					href="/{locale}/data-structures/linked-list"
					class="text-primary hover:underline">{t('dataStructures.linkedList')}</a>
			</li>
			<li>
				<a
					href="/{locale}/data-structures/stack"
					class="text-primary hover:underline">{t('dataStructures.stack')}</a>
			</li>
			<li>
				<a
					href="/{locale}/data-structures/queue"
					class="text-primary hover:underline">{t('dataStructures.queue')}</a>
			</li>
		</ul>
	</div>

	<div class="treeline-card">
		<h2 class="mb-4 text-xl font-semibold">{t('nav.sortingAlgorithms')}</h2>
		<ul class="space-y-2">
			<li>
				<a
					href="/{locale}/sorting-algorithms/bubble"
					class="text-primary hover:underline">{t('sortingAlgorithms.bubbleSort')}</a>
			</li>
			<li>
				<a
					href="/{locale}/sorting-algorithms/selection"
					class="text-primary hover:underline">{t('sortingAlgorithms.selectionSort')}</a>
			</li>
			<li>
				<a
					href="/{locale}/sorting-algorithms/insertion"
					class="text-primary hover:underline">{t('sortingAlgorithms.insertionSort')}</a>
			</li>
			<li>
				<a
					href="/{locale}/sorting-algorithms/merge"
					class="text-primary hover:underline">{t('sortingAlgorithms.mergeSort')}</a>
			</li>
			<li>
				<a
					href="/{locale}/sorting-algorithms/quick"
					class="text-primary hover:underline">{t('sortingAlgorithms.quickSort')}</a>
			</li>
			<li>
				<a
					href="/{locale}/sorting-algorithms/heap"
					class="text-primary hover:underline">{t('sortingAlgorithms.heapSort')}</a>
			</li>
		</ul>
	</div>
</div>
