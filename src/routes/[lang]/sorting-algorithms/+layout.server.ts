import { defaultLocale, isLocale, translate } from '$lib/i18n';
import { loadDescription } from '$lib/server/descriptions';
import { createShuffledArray } from '$lib/sorting-algorithms/misc/utils';

import type { LayoutServerLoad } from './$types';

const descriptions: Record<string, string> = {
	bubble: 'sorting-algorithms/bubble_sort',
	heap: 'sorting-algorithms/heap_sort',
	insertion: 'sorting-algorithms/insertion_sort',
	merge: 'sorting-algorithms/merge_sort',
	quick: 'sorting-algorithms/quick_sort',
	selection: 'sorting-algorithms/selection_sort',
};

const titles: Record<string, string> = {
	bubble: 'sortingAlgorithms.bubbleSort',
	heap: 'sortingAlgorithms.heapSort',
	insertion: 'sortingAlgorithms.insertionSort',
	merge: 'sortingAlgorithms.mergeSort',
	quick: 'sortingAlgorithms.quickSort',
	selection: 'sortingAlgorithms.selectionSort',
};

export const load: LayoutServerLoad = async ({ params, url }) => {
	const segments = url.pathname.split('/').filter(Boolean);
	const slug = segments.at(-1) === 'detail' ? (segments.at(-2) ?? '') : (segments.at(-1) ?? '');
	const description = descriptions[slug];
	const locale = isLocale(params.lang) ? params.lang : defaultLocale;
	const titleKey = titles[slug] ?? 'nav.sortingAlgorithms';
	const descriptionData = await loadDescription(description, locale);

	return {
		...descriptionData,
		pageTitle: translate(locale, titleKey),
		initialDetailedArray: createShuffledArray(16),
	};
};
