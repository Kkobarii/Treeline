<script lang="ts">
	import DesktopMenu from '$lib/components/DesktopMenu.svelte';
	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
	import MobileMenu from '$lib/components/MobileMenu.svelte';
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
	import { getLocale } from '$lib/i18n';

	const locale = getLocale();

	let lastScrollY = $state(0);
	let isHidden = $state(false);
	let isMobile = $state(false);
	let menuOpen = $state(false);

	function handleScroll() {
		if (!isMobile) return;
		const currentScrollY = window.scrollY;
		if (currentScrollY <= 50) {
			isHidden = false;
		} else if (currentScrollY > lastScrollY && currentScrollY > 100) {
			isHidden = true;
		} else if (lastScrollY - currentScrollY > 20) {
			isHidden = false;
		}
		lastScrollY = currentScrollY;
	}

	$effect(() => {
		if (typeof window !== 'undefined') {
			isMobile = window.innerWidth < 768;
		}
	});

	function toggleMenu() {
		menuOpen = !menuOpen;
	}

	function handleClickOutside(event: MouseEvent) {
		if (!isMobile) return;
		const target = event.target as HTMLElement;
		if (!target.closest('.mobile-menu-btn') && !target.closest('.mobile-menu')) {
			menuOpen = false;
		}
	}

	$effect(() => {
		if (typeof window === 'undefined') return;
		document.addEventListener('click', handleClickOutside);
		return () => document.removeEventListener('click', handleClickOutside);
	});

	function toggleNav(e: MouseEvent) {
		if (!isMobile || window.scrollY <= 50) return;
		const target = e.target as HTMLElement;
		if (target.classList.contains('header-nav-container')) {
			isHidden = !isHidden;
		}
	}

	$effect(() => {
		if (typeof window === 'undefined') return;
		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<nav
	class="header-nav"
	style={isMobile
		? `transform: translateY(${isHidden ? '-100%' : '0'}); transition: transform 0.3s ease-in-out; will-change: transform;`
		: ''}>
	<input
		id="mobile-nav-toggle"
		type="checkbox"
		class="mobile-menu-toggle" />

	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="primary-chrome-panel header-nav-container container mx-auto flex items-center gap-8 px-6 py-4"
		onclick={toggleNav}>
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

			<button
				type="button"
				aria-label="Toggle menu"
				class="nav-icon-button header-burger mobile-menu-btn flex-col gap-[0.35rem]"
				onclick={toggleMenu}>
				<span class="burger-line"></span>
				<span class="burger-line"></span>
				<span class="burger-line"></span>
			</button>
		</div>
	</div>

	<MobileMenu {menuOpen} />
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

	@media (max-width: 768px) {
		.header-nav {
			margin: 1rem;
			will-change: transform;
		}
	}

	:global(.nav-submenu-link) {
		text-decoration: none;
		font-weight: 500;
		transition: background-color 0.2s ease;
	}

	:global(.nav-submenu-link:hover) {
		opacity: 1;
	}

	:global(.nav-separator) {
		position: relative;
	}

	:global(.nav-separator::after) {
		content: '';
		position: absolute;
		top: 50%;
		height: 1px;
		background: color-mix(in srgb, #ffffff 28%, transparent);
	}
</style>
