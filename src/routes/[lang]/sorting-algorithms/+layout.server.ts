import { defaultLocale, isLocale } from '$lib/i18n';
import { loadDescription } from '$lib/server/descriptions';

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
	const slug = url.pathname.split('/').filter(Boolean).at(-1) ?? '';
	const description = descriptions[slug];
	const locale = isLocale(params.lang) ? params.lang : defaultLocale;

	return loadDescription(description, locale);
};
