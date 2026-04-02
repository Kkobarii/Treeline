<script lang="ts">
	import { page } from '$app/state';

	import { dataStructures } from '$lib/data-structures/registry';
	import { getLocale, translate } from '$lib/i18n';
	import { sortingAlgorithms } from '$lib/sorting-algorithms/misc/registry';

	const locale = getLocale();
	const t = (key: string) => translate(locale, key);
	const sortingDetailSuffix = $derived(
		page.url.pathname.startsWith(`/${locale}/sorting-algorithms/`) && page.url.pathname.endsWith('/detail') ? '/detail' : '',
	);
</script>

<label
	for="mobile-nav-toggle"
	class="mobile-menu-overlay md:hidden"
	aria-label="Close menu"></label>

<div class="mobile-menu md:hidden">
	<details class="mobile-menu-section">
		<summary class="mobile-menu-button">
			<span>{t('nav.dataStructures')}</span>
			<span class="mobile-menu-chevron transition-transform duration-200">▼</span>
		</summary>
		<div class="mobile-submenu">
			{#each dataStructures as ds}
				<a
					href="/{locale}/data-structures/{ds.id}"
					data-sveltekit-reload
					class="mobile-submenu-link nav-submenu-link">
					{t(ds.nameKey)}
				</a>
			{/each}
		</div>
	</details>

	<details class="mobile-menu-section">
		<summary class="mobile-menu-button">
			<span>{t('nav.sortingAlgorithms')}</span>
			<span class="mobile-menu-chevron transition-transform duration-200">▼</span>
		</summary>
		<div class="mobile-submenu">
			{#each sortingAlgorithms as algorithm}
				<a
					href="/{locale}/sorting-algorithms/{algorithm.id}{sortingDetailSuffix}"
					data-sveltekit-reload
					class="mobile-submenu-link nav-submenu-link">
					{t(algorithm.nameKey)}
				</a>
			{/each}
			<div class="mobile-submenu-separator nav-separator"></div>
			<a
				href="/{locale}/sorting-algorithms/comparison"
				data-sveltekit-reload
				class="mobile-submenu-link nav-submenu-link">
				{t('sorting.comparison.title')}
			</a>
		</div>
	</details>
</div>

<style>
	.mobile-menu {
		position: fixed;
		right: 1.5rem;
		width: min(280px, calc(100vw - 3rem));
		background-color: oklch(from var(--color-panel) l c h / 0.95);
		border: 1px solid var(--color-panel);
		border-radius: 1rem;
		backdrop-filter: blur(8px);
		z-index: 100;
		display: flex;
		flex-direction: column;
		box-shadow: 0 8px 18px rgba(0, 0, 0, 0.18);
		opacity: 0;
		transform: translateY(-8px);
		visibility: hidden;
		pointer-events: none;
		transition:
			opacity 0.2s ease,
			transform 0.2s ease,
			visibility 0.2s ease;
	}

	:global(.mobile-menu-toggle:checked) ~ .mobile-menu {
		opacity: 1;
		transform: translateY(0);
		visibility: visible;
		pointer-events: auto;
	}

	.mobile-menu-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 99;
		opacity: 0;
		visibility: hidden;
		pointer-events: none;
	}

	:global(.mobile-menu-toggle:checked) ~ .mobile-menu-overlay {
		opacity: 1;
		visibility: visible;
		pointer-events: auto;
	}

	.mobile-menu-section {
		display: flex;
		flex-direction: column;
	}

	.mobile-menu-button {
		color: white;
		background: none;
		border: none;
		padding: 1rem 1.5rem;
		font-size: 0.95rem;
		font-weight: 500;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		transition: background-color 0.2s ease;
		opacity: 0.9;
	}

	.mobile-menu-button::-webkit-details-marker {
		display: none;
	}

	.mobile-menu-button::marker {
		content: '';
	}

	.mobile-menu-button:hover {
		/* background-color: color-mix(in srgb, var(--color-white) 10%, transparent); */
		opacity: 1;
	}

	.mobile-menu-section[open] .mobile-menu-chevron {
		transform: rotate(180deg);
	}

	.mobile-submenu {
		display: flex;
		flex-direction: column;
		background-color: color-mix(in srgb, var(--color-secondary-light) 10%, transparent);
		animation: slideDown 0.2s ease;
	}

	.mobile-submenu-link {
		color: white;
		padding: 0.75rem 2rem;
		font-size: 0.9rem;
		opacity: 0.85;
	}

	.mobile-submenu-separator {
		padding: 0.25rem 2rem;
	}

	.mobile-submenu-separator::after {
		left: 2rem;
		right: 2rem;
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
