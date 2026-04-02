<script lang="ts">
	import { page } from '$app/stores';

	import { getLocale, locales, translate, type Locale } from '$lib/i18n';

	const locale = getLocale();
	const t = (key: string, params?: Record<string, string | number>) => translate(locale, key, params);

	let isOpen = $state(false);

	function selectLocale(code: Locale) {
		if (code === locale) {
			isOpen = false;
			return;
		}

		// Replace current language segment in URL with new one
		const currentPath = $page.url.pathname;
		const newPath = currentPath.replace(/^\/(en|cs)/, `/${code}`);

		// Store preference for future visits
		if (typeof window !== 'undefined') {
			localStorage.setItem('treeline-locale', code);
		}

		isOpen = false;
		// Full page load required because context is set at layout initialization
		window.location.href = newPath;
	}

	function toggleDropdown() {
		isOpen = !isOpen;
	}

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.language-switcher')) {
			isOpen = false;
		}
	}

	$effect(() => {
		if (typeof window !== 'undefined') {
			document.addEventListener('click', handleClickOutside);
			return () => document.removeEventListener('click', handleClickOutside);
		}
	});

	const currentLocale = locales.find(l => l.code === locale);
</script>

<div class="language-switcher relative">
	<button
		type="button"
		class="nav-icon-button"
		onclick={toggleDropdown}
		aria-label={t('nav.languageSwitcher')}
		title={t('nav.languageSwitcher')}
		aria-expanded={isOpen}>
		<img
			class="flag"
			src={currentLocale?.flag}
			alt={currentLocale?.name}
			aria-hidden="true" />
		<span
			class="chevron"
			class:chevron-open={isOpen}>▼</span>
	</button>

	{#if isOpen}
		<div class="language-dropdown">
			{#each locales as loc}
				<button
					type="button"
					class="language-option"
					class:language-option-active={loc.code === locale}
					onclick={() => selectLocale(loc.code)}>
					<img
						class="flag"
						src={loc.flag}
						alt={loc.name}
						aria-hidden="true" />
					<span class="language-name">{loc.name}</span>
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.language-switcher {
		position: relative;
		z-index: 100;
	}

	.flag {
		width: 1.25rem;
		height: auto;
		border-radius: 0.15rem;
	}

	.chevron {
		font-size: 0.6rem;
		transition: transform 0.2s ease;
		opacity: 0.7;
	}

	.chevron-open {
		transform: rotate(180deg);
	}

	.language-dropdown {
		position: absolute;
		top: calc(100% + 0.35rem);
		right: 0;
		min-width: 140px;
		background: var(--color-gray-100);
		border: 1px solid oklch(from var(--color-gray-400) l c h / 0.5);
		border-radius: 0.5rem;
		box-shadow:
			0 4px 6px -1px oklch(from var(--color-gray-900) l c h / 0.1),
			0 2px 4px -2px oklch(from var(--color-gray-900) l c h / 0.1);
		overflow: hidden;
	}

	.language-option {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		width: 100%;
		padding: 0.6rem 0.8rem;
		background: transparent;
		border: none;
		cursor: pointer;
		font-size: 0.9rem;
		color: var(--color-black);
		text-align: left;
		transition: background 0.15s ease;
	}

	.language-option:hover {
		background: oklch(from var(--color-gray-200) l c h / 0.6);
	}

	.language-option-active {
		background: oklch(from var(--color-secondary-light) l c h / 0.3);
	}

	.language-option-active:hover {
		background: oklch(from var(--color-secondary-light) l c h / 0.4);
	}

	.language-name {
		flex: 1;
	}
</style>
