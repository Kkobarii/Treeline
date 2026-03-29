<script lang="ts">
	import type { CodeLanguage } from '../steps/stepTypes';

	type Props = {
		value: CodeLanguage;
		onchange: (language: CodeLanguage) => void;
	};

	let { value, onchange }: Props = $props();

	let isOpen = $state(false);

	const languages: { code: CodeLanguage; label: string }[] = [
		{ code: 'python', label: 'Python' },
		{ code: 'javascript', label: 'JavaScript' },
		{ code: 'c', label: 'C' },
	];
	const widestLanguageLabel = languages.reduce(
		(widest, language) => (language.label.length > widest.length ? language.label : widest),
		languages[0].label,
	);

	function selectLanguage(lang: CodeLanguage) {
		onchange(lang);
		isOpen = false;
	}

	function toggleDropdown() {
		isOpen = !isOpen;
	}

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.code-language-select-wrapper')) {
			isOpen = false;
		}
	}

	$effect(() => {
		if (typeof window !== 'undefined') {
			document.addEventListener('click', handleClickOutside);
			return () => document.removeEventListener('click', handleClickOutside);
		}
	});

	let currentLanguage = $derived(languages.find(l => l.code === value));
</script>

<div class="code-language-select-wrapper relative">
	<button
		type="button"
		class="code-language-button"
		onclick={toggleDropdown}
		aria-label="Select code language"
		aria-expanded={isOpen}>
		<span class="language-name">{currentLanguage?.label}</span>
		<span
			class="chevron"
			class:chevron-open={isOpen}>▼</span>
		<span
			class="language-name-sizer"
			aria-hidden="true">{widestLanguageLabel}</span>
	</button>

	{#if isOpen}
		<div class="code-language-dropdown">
			{#each languages as lang}
				<button
					type="button"
					class="language-option"
					class:language-option-active={lang.code === value}
					onclick={() => selectLanguage(lang.code)}>
					<span class="language-label">{lang.label}</span>
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.code-language-select-wrapper {
		position: relative;
		z-index: 50;
	}

	.code-language-button {
		display: grid;
		grid-template-columns: 1fr auto;
		position: relative;
		align-items: center;
		justify-items: start;
		gap: 0.5rem;
		padding: 0.6rem 0.75rem;
		border-radius: 0.5rem;
		background: var(--color-primary-ultra-light);
		border: 1px solid var(--color-primary-light);
		cursor: pointer;
		font-size: 0.8rem;
		font-weight: 500;
		color: var(--color-text);
		transition:
			background-color 140ms ease,
			border-color 140ms ease;
	}

	.code-language-button:hover {
		background-color: oklch(from var(--color-primary-ultra-light) calc(l - 0.06) c h);
		border-color: oklch(from var(--color-primary) calc(l - 0.08) c h);
	}

	.code-language-button:focus {
		outline: none;
		box-shadow: 0 0 0 2px oklch(from var(--color-secondary) l c h / 0.35);
	}

	.language-name {
		grid-column: 1;
		grid-row: 1;
		min-width: 0;
		justify-self: start;
		text-align: left;
		font-weight: 500;
	}

	.language-name-sizer {
		grid-column: 1;
		grid-row: 1;
		visibility: hidden;
		pointer-events: none;
		justify-self: start;
		font-weight: 500;
	}

	.chevron {
		grid-column: 2;
		grid-row: 1;
		justify-self: end;
		font-size: 0.6rem;
		transition: transform 0.2s ease;
		opacity: 0.65;
	}

	.chevron-open {
		transform: rotate(180deg);
	}

	.code-language-dropdown {
		position: absolute;
		top: calc(100% + 0.35rem);
		right: 0;
		min-width: 100%;
		background: var(--color-gray-50);
		border: 1px solid var(--color-gray-100);
		border-radius: 0.5rem;
		box-shadow:
			0 4px 6px -1px oklch(from var(--color-gray-900) l c h / 0.1),
			0 2px 4px -2px oklch(from var(--color-gray-900) l c h / 0.1);
		overflow: hidden;
	}

	.language-option {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: 0.65rem 0.85rem;
		background: transparent;
		border: none;
		cursor: pointer;
		font-size: 0.8rem;
		font-weight: 500;
		color: var(--color-text);
		text-align: left;
		transition: background-color 140ms ease;
		border-radius: 0;
	}

	.language-option:hover {
		background-color: oklch(from var(--color-gray-50) calc(l - 0.06) c h);
	}

	.language-option:focus {
		border: none;
	}

	.language-option-active {
		background-color: oklch(from var(--color-secondary) l c h / 0.15);
		color: var(--color-secondary-dark);
	}

	.language-option-active::after {
		content: '✓';
		font-weight: bold;
		font-size: 0.85rem;
	}

	.language-label {
		flex: 1;
	}
</style>
