import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { marked } from 'marked';

import type { Locale } from '$lib/i18n';
import { translate } from '$lib/i18n';

type DescriptionResult = {
	descriptionHtml: string;
	descriptionError: string | null;
};

const cache = new Map<string, Promise<DescriptionResult>>();

const normalize = (name: string, locale: Locale) => {
	const trimmed = name.trim().replace(/^\.?(\/)+/, '');
	const base = trimmed.replace(/\.md$/, '');
	return `${base}.${locale}.md`;
};

export function loadDescription(name: string | null | undefined, locale: Locale): Promise<DescriptionResult> {
	if (!name) {
		return Promise.resolve({
			descriptionHtml: '',
			descriptionError: null,
		});
	}

	const target = normalize(name, locale);
	const cached = cache.get(target);
	if (cached) return cached;

	const pending = (async () => {
		try {
			const filePath = path.resolve(process.cwd(), 'static', 'descriptions', target);
			const markdown = await readFile(filePath, 'utf-8');
			const descriptionHtml = await marked.parse(markdown);

			return {
				descriptionHtml,
				descriptionError: null,
			};
		} catch {
			return {
				descriptionHtml: '',
				descriptionError: translate(locale, 'description.notFound', { filename: target }),
			};
		}
	})();

	cache.set(target, pending);
	return pending;
}
