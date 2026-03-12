<script lang="ts">
	import DesktopMenu from '$lib/components/DesktopMenu.svelte';
	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
	import MobileMenu from '$lib/components/MobileMenu.svelte';
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
</script>

<nav class="header-nav">
	<input
		id="mobile-nav-toggle"
		type="checkbox"
		class="mobile-menu-toggle" />

	<div class="container mx-auto flex items-center gap-8 px-6 py-4">
		<a
			href="/"
			class="flex items-center gap-3 no-underline"
			aria-label="Treeline home">
			<img
				src="/branch.svg"
				alt="Treeline logo"
				class="h-8 w-8" />
			<span class="header-title">Treeline</span>
		</a>

		<DesktopMenu />

		<div class="ml-auto flex items-center gap-3">
			<label
				for="mobile-nav-toggle"
				aria-label="Toggle menu"
				class="header-burger-button md:hidden">
				<span class="burger-line"></span>
				<span class="burger-line"></span>
				<span class="burger-line"></span>
			</label>

			<LanguageSwitcher />
			<ThemeSwitcher />
		</div>
	</div>

	<MobileMenu />
</nav>
