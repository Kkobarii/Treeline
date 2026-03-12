import type { Locale } from '$lib/i18n';

export const prerender = true;

export function load({ params }) {
	const lang = params.lang as Locale;

	if (lang !== 'en' && lang !== 'cs') {
		return { lang: 'en' as Locale };
	}

	return { lang };
}
