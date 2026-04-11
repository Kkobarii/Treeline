<script lang="ts">
	import { mode, toggleMode } from 'mode-watcher';

	import { getLocale, translate } from '$lib/i18n';

	const locale = getLocale();
	const t = (key: string, params?: Record<string, string | number>) => translate(locale, key, params);
</script>

<button
	aria-label={t('nav.themeSwitcher')}
	title={t('nav.themeSwitcher')}
	class="nav-icon-button"
	onclick={toggleMode}>
	{#if mode.current === 'dark'}
		<img
			src="/sun.svg"
			alt="Switch to light mode"
			class="h-5 w-5 invert" />
	{:else}
		<img
			src="/moon.svg"
			alt="Switch to dark mode"
			class="h-5 w-5 invert" />
	{/if}
</button>
