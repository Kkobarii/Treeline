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

<style>
	.header-link {
		color: white;
		text-decoration: none;
		font-size: 0.95rem;
		font-weight: 500;
		transition: color 0.2s ease;
		position: relative;
		opacity: 0.9;
	}

	.header-link:hover {
		opacity: 1;
	}

	.header-link::after {
		content: '';
		position: absolute;
		bottom: -4px;
		left: 0;
		right: 0;
		height: 2px;
		background-color: white;
		transform: scaleX(0);
		transition: transform 0.2s ease;
	}

	.header-link:hover::after {
		transform: scaleX(1);
	}

	.dropdown-menu {
		position: absolute;
		top: 100%;
		left: 0;
		min-width: 200px;
		background-color: oklch(from var(--color-primary) l c h / 0.95);
		border: 1px solid var(--color-primary-dark);
		border-radius: 0.5rem;
		backdrop-filter: blur(8px);
		margin-top: 0.5rem;
		display: flex;
		flex-direction: column;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		z-index: 101;
		opacity: 0;
		transform: translateY(-8px);
		visibility: hidden;
		pointer-events: none;
		transition:
			opacity 0.2s ease,
			transform 0.2s ease,
			visibility 0.2s ease;
	}

	.nav-dropdown:hover .dropdown-menu,
	.nav-dropdown:focus-within .dropdown-menu {
		opacity: 1;
		transform: translateY(0);
		visibility: visible;
		pointer-events: auto;
	}

	.nav-dropdown:hover .nav-dropdown-chevron,
	.nav-dropdown:focus-within .nav-dropdown-chevron {
		transform: rotate(180deg);
	}

	.dropdown-menu::before {
		content: '';
		position: absolute;
		bottom: 100%;
		left: 0;
		right: 0;
		height: 0.5rem;
		pointer-events: all;
	}

	.dropdown-link {
		color: white;
		text-decoration: none;
		padding: 0.75rem 1rem;
		font-size: 0.95rem;
		font-weight: 500;
		transition: background-color 0.2s ease;
		opacity: 0.9;
	}

	.dropdown-link:hover {
		background-color: color-mix(in srgb, var(--color-primary-light) 30%, transparent);
		opacity: 1;
	}

	.dropdown-link:first-child {
		border-radius: 0.5rem 0.5rem 0 0;
	}

	.dropdown-link:last-child {
		border-radius: 0 0 0.5rem 0.5rem;
	}
</style>
