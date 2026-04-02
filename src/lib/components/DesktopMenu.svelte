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

<div class="ml-4 hidden items-center gap-6 md:flex">
	<div
		class="nav-dropdown relative"
		role="menuitem"
		tabindex="0">
		<button
			class="header-link flex items-center gap-2"
			aria-haspopup="true">
			{t('nav.dataStructures')}
			<span class="nav-dropdown-chevron transition-transform duration-200"> ▼ </span>
		</button>

		<div class="dropdown-menu">
			{#each dataStructures as ds}
				<a
					href="/{locale}/data-structures/{ds.id}"
					class="dropdown-link nav-submenu-link">
					{t(ds.nameKey)}
				</a>
			{/each}
		</div>
	</div>

	<div
		class="nav-dropdown relative"
		role="menuitem"
		tabindex="0">
		<button
			class="header-link flex items-center gap-2"
			aria-haspopup="true">
			{t('nav.sortingAlgorithms')}
			<span class="nav-dropdown-chevron transition-transform duration-200"> ▼ </span>
		</button>

		<div class="dropdown-menu">
			{#each sortingAlgorithms as algorithm}
				<a
					href="/{locale}/sorting-algorithms/{algorithm.id}{sortingDetailSuffix}"
					class="dropdown-link nav-submenu-link">
					{t(algorithm.nameKey)}
				</a>
			{/each}
			<div class="dropdown-separator nav-separator"></div>
			<a
				href="/{locale}/sorting-algorithms/comparison"
				class="dropdown-link nav-submenu-link">
				{t('sorting.comparison.title')}
			</a>
		</div>
	</div>
</div>

<style>
	.header-link {
		text-decoration: none;
		font-size: 0.95rem;
		font-weight: 500;
		transition: color 0.2s ease;
		position: relative;
		opacity: 0.9;
	}

	.header-link:hover {
		opacity: 1;
	}

	.header-link::after {
		content: '';
		position: absolute;
		bottom: -4px;
		left: 0;
		right: 0;
		height: 2px;
		transform: scaleX(0);
		transition: transform 0.2s ease;
	}

	.header-link:hover::after {
		transform: scaleX(1);
	}

	.dropdown-menu {
		position: absolute;
		top: 100%;
		left: 0;
		min-width: 200px;
		background-color: oklch(from var(--color-panel) l c h / 0.75);
		border: 1px solid var(--color-panel);
		border-radius: 0.5rem;
		margin-top: 0.5rem;
		display: flex;
		flex-direction: column;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		z-index: 101;
		transform: translateY(-8px);
		visibility: hidden;
		pointer-events: none;
		transition:
			opacity 0.2s ease,
			transform 0.2s ease,
			visibility 0.2s ease;
	}

	.nav-dropdown:hover .dropdown-menu,
	.nav-dropdown:focus-within .dropdown-menu {
		transform: translateY(0);
		visibility: visible;
		pointer-events: auto;
	}

	.nav-dropdown:hover .nav-dropdown-chevron,
	.nav-dropdown:focus-within .nav-dropdown-chevron {
		transform: rotate(180deg);
	}

	.dropdown-menu::before {
		content: '';
		position: absolute;
		bottom: 100%;
		left: 0;
		right: 0;
		height: 0.5rem;
		pointer-events: all;
	}

	.dropdown-link {
		padding: 0.75rem 1rem;
		font-size: 0.95rem;
		backdrop-filter: blur(8px);
	}

	.dropdown-link:hover {
		background-color: color-mix(in srgb, var(--color-white) 10%, transparent);
	}

	.dropdown-link:first-child {
		border-radius: 0.5rem 0.5rem 0 0;
	}

	.dropdown-link:last-child {
		border-radius: 0 0 0.5rem 0.5rem;
	}

	.dropdown-separator {
		padding: 0.25rem 1rem;
		backdrop-filter: blur(8px);
	}

	.dropdown-separator::after {
		left: 1rem;
		right: 1rem;
	}
</style>
