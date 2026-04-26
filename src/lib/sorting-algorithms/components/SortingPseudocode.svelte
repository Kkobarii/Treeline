<script lang="ts">
	import Dropdown from '$lib/components/Dropdown.svelte';
	import { translate } from '$lib/i18n';
	import type { CodeLanguage } from '$lib/sorting-algorithms/registry';
	import { getLocale } from '$lib/i18n';
	import type { SortingPseudocodeProps } from './SortingPseudocode.types';

	let { language, languageOptions, highlightedCodeLines, currentCodePartId, onLanguageChange }: SortingPseudocodeProps = $props();

	const locale = getLocale();
	const t = (key: string, params?: Record<string, string | number>) => translate(locale, key, params);
</script>

<link
	rel="stylesheet"
	href="//unpkg.com/@catppuccin/highlightjs@1.0.1/css/catppuccin-latte.css" />

<div class="treeline-card flex flex-col gap-[0.85rem]">
	<div class="flex items-center justify-between border-b border-gray-200 pb-3">
		<h2 class="text-secondary text-lg font-bold">{t('sorting.code.title')}</h2>
		<Dropdown
			options={languageOptions}
			value={language}
			onchange={lang => onLanguageChange(lang as CodeLanguage)}
			ariaLabel={t('sorting.code.title')} />
	</div>

	<div class="flex flex-col">
		{#each highlightedCodeLines as line, index (`${language}-${index}`)}
			<div
				class="code-line pt-0.5"
				class:code-line-active={line.codePartId === currentCodePartId}>
				<code
					class={`language-${language}`}
					style={`padding-left: ${line.indent * 12}px`}
					class:line-break={line.text === ''}>{@html line.highlightedText}&nbsp;</code>
			</div>
		{/each}
	</div>
</div>

<style lang="postcss">
	@reference '../../../app.css';

	.code-line {
		@apply flex items-center px-1 text-sm;
		font-size: small;
	}

	.code-line code {
		@apply block w-full whitespace-pre-wrap;
	}

	.code-line-active {
		background: oklch(from var(--color-secondary-light) l c h / 0.5);
	}

	.line-break {
		max-height: 0.7em;
	}
</style>