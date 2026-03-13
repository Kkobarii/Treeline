import { getContext, setContext } from 'svelte';

import cs from './translations/cs';
import en, { type Translation } from './translations/en';

const translations = {
	en,
	cs,
} satisfies Record<string, Translation>;

export type Locale = keyof typeof translations;

export const defaultLocale: Locale = 'en';

export const locales: { code: Locale; name: string; flag: string }[] = Object.entries(translations).map(([code, translation]) => ({
	code: code as Locale,
	name: translation.meta.name,
	flag: translation.meta.flag,
}));

export function isLocale(lang: string): lang is Locale {
	return lang in translations;
}

const LOCALE_KEY = Symbol('locale');

export function setLocaleContext(lang: Locale) {
	setContext(LOCALE_KEY, lang);
}

export function getLocale(): Locale {
	return getContext<Locale>(LOCALE_KEY) ?? defaultLocale;
}

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

export function translate(lang: Locale, key: string, params?: Record<string, string | number>): string {
	const translation = getNestedValue(translations[lang], key);

	if (!translation) {
		console.warn(`Missing translation for key: ${key} in locale: ${lang}`);
		return key;
	}

	if (!params) return translation;

	return Object.entries(params).reduce((str, [paramKey, paramValue]) => {
		return str.replace(new RegExp(`{${paramKey}}`, 'g'), String(paramValue));
	}, translation);
}
