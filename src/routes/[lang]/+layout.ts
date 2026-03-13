import { defaultLocale, isLocale, type Locale } from '$lib/i18n';

export const prerender = true;

export function load({ params }) {
	const lang = params.lang as Locale;

	if (!isLocale(lang)) {
		return { lang: defaultLocale };
	}

	return { lang };
}
