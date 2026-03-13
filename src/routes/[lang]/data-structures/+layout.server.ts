import { defaultLocale, isLocale, translate } from '$lib/i18n';
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

const titles: Record<string, string> = {
	'avl-tree': 'dataStructures.avlTree',
	'b-tree': 'dataStructures.bTree',
	'binary-search-tree': 'dataStructures.binarySearchTree',
	heap: 'dataStructures.heap',
	'linked-list': 'dataStructures.linkedList',
	queue: 'dataStructures.queue',
	'red-black-tree': 'dataStructures.redBlackTree',
	stack: 'dataStructures.stack',
};

export const load: LayoutServerLoad = async ({ params, url }) => {
	const slug = url.pathname.split('/').filter(Boolean).at(-1) ?? '';
	const description = descriptions[slug];
	const locale = isLocale(params.lang) ? params.lang : defaultLocale;
	const titleKey = titles[slug] ?? 'nav.dataStructures';

	const descriptionData = await loadDescription(description, locale);

	return {
		...descriptionData,
		pageTitle: translate(locale, titleKey),
	};
};
