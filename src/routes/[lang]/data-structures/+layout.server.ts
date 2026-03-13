import { defaultLocale, isLocale } from '$lib/i18n';
import { loadDescription } from '$lib/server/descriptions';

import type { LayoutServerLoad } from './$types';

const descriptions: Record<string, string> = {
	'avl-tree': 'data-structures/avl_tree',
	'b-tree': 'data-structures/b_tree',
	'binary-search-tree': 'data-structures/bs_tree',
	heap: 'data-structures/heap',
	'linked-list': 'data-structures/linked_list',
	queue: 'data-structures/queue',
	'red-black-tree': 'data-structures/rb_tree',
	stack: 'data-structures/stack',
};

export const load: LayoutServerLoad = async ({ params, url }) => {
	const slug = url.pathname.split('/').filter(Boolean).at(-1) ?? '';
	const description = descriptions[slug];
	const locale = isLocale(params.lang) ? params.lang : defaultLocale;

	return loadDescription(description, locale);
};
