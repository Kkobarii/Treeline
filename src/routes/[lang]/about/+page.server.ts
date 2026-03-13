import { defaultLocale, isLocale, translate } from '$lib/i18n';
import { loadDescription } from '$lib/server/descriptions';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const locale = isLocale(params.lang) ? params.lang : defaultLocale;
	const descriptionData = await loadDescription('about', locale);

	return {
		...descriptionData,
		pageTitle: translate(locale, 'nav.about'),
	};
};
