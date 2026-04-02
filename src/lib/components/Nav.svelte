<script lang="ts">
	import DesktopMenu from '$lib/components/DesktopMenu.svelte';
	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
	import MobileMenu from '$lib/components/MobileMenu.svelte';
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
	import { getLocale } from '$lib/i18n';

	const locale = getLocale();
</script>

<nav class="header-nav">
	<input
		id="mobile-nav-toggle"
		type="checkbox"
		class="mobile-menu-toggle" />

	<div class="primary-chrome-panel container mx-auto flex items-center gap-8 px-6 py-4">
		<a
			href="/{locale}"
			class="flex items-center gap-3 no-underline"
			aria-label="Treeline home">
			<img
				src="/branch.svg"
				alt="Treeline logo"
				class="h-8 w-8" />
			<span class="header-title hidden md:inline">Treeline</span>
		</a>

		<DesktopMenu />

		<div class="ml-auto flex items-center gap-3">
			<LanguageSwitcher />
			<ThemeSwitcher />

			<label
				for="mobile-nav-toggle"
				aria-label="Toggle menu"
				class="nav-icon-button header-burger flex-col gap-[0.35rem]">
				<span class="burger-line"></span>
				<span class="burger-line"></span>
				<span class="burger-line"></span>
			</label>
		</div>
	</div>

	<MobileMenu />
</nav>

<style>
	.header-nav {
		position: fixed;
		left: 0;
		right: 0;
		z-index: 100;
		margin: 2rem 1rem;
	}

	.header-title {
		font-size: 1.75rem;
		font-weight: 700;
		letter-spacing: -0.02em;
	}

	.mobile-menu-toggle {
		position: fixed;
		width: 0px !important;
		height: 0px !important;
		margin: 0;
		padding: 0;
		border: 0;
		overflow: hidden;
		clip: rect(0 0 0 0);
		clip-path: inset(50%);
		white-space: nowrap;
		-webkit-appearance: none;
		appearance: none;
		opacity: 0;
		pointer-events: none;
	}

	.burger-line {
		display: block;
		width: 20px;
		height: 2px;
		background-color: #ffffff;
		border-radius: 1px;
	}

	@media (min-width: 768px) {
		.header-burger {
			display: none;
		}
	}
</style>
