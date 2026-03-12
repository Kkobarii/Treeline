import { derived, get, writable } from 'svelte/store';

import cs from './translations/cs';
import en, { type Translation } from './translations/en';

export type Locale = 'en' | 'cs';

export const locales: { code: Locale; name: string; flag: string }[] = [
	{ code: 'en', name: 'English', flag: '🇬🇧' },
	{ code: 'cs', name: 'Čeština', flag: '🇨🇿' },
];

const translations: Record<Locale, Translation> = {
	en,
	cs,
};

const LOCALE_STORAGE_KEY = 'treeline-locale';

function getInitialLocale(): Locale {
	if (typeof window === 'undefined') return 'en';

	const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
	if (stored && (stored === 'en' || stored === 'cs')) {
		return stored;
	}

	const browserLang = navigator.language.split('-')[0];
	if (browserLang === 'cs') return 'cs';

	return 'en';
}

function createLocaleStore() {
	const { subscribe, set, update } = writable<Locale>('en');

	return {
		subscribe,
		set: (locale: Locale) => {
			if (typeof window !== 'undefined') {
				localStorage.setItem(LOCALE_STORAGE_KEY, locale);
			}
			set(locale);
		},
		initialize: () => {
			set(getInitialLocale());
		},
	};
}

export const locale = createLocaleStore();

function getNestedValue(obj: Record<string, unknown>, path: string): string | undefined {
	const keys = path.split('.');
	let current: unknown = obj;

	for (const key of keys) {
		if (current === null || current === undefined || typeof current !== 'object') {
			return undefined;
		}
		current = (current as Record<string, unknown>)[key];
	}

	return typeof current === 'string' ? current : undefined;
}

export const t = derived(locale, $locale => {
	return (key: string, params?: Record<string, string | number>): string => {
		const translation = getNestedValue(translations[$locale], key);

		if (!translation) {
			console.warn(`Missing translation for key: ${key} in locale: ${$locale}`);
			return key;
		}

		if (!params) return translation;

		return Object.entries(params).reduce((str, [paramKey, paramValue]) => {
			return str.replace(new RegExp(`{${paramKey}}`, 'g'), String(paramValue));
		}, translation);
	};
});
