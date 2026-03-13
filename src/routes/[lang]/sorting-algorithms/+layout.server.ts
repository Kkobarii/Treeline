import { defaultLocale, isLocale } from '$lib/i18n';
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

export const load: LayoutServerLoad = async ({ params, url }) => {
	const segments = url.pathname.split('/').filter(Boolean);
	const slug = segments.at(-1) === 'detail' ? (segments.at(-2) ?? '') : (segments.at(-1) ?? '');
	const description = descriptions[slug];
	const locale = isLocale(params.lang) ? params.lang : defaultLocale;
	const descriptionData = await loadDescription(description, locale);

	return {
		...descriptionData,
		initialDetailedArray: createShuffledArray(16),
	};
};
