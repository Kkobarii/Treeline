<script lang="ts">
	import { onMount } from 'svelte';

	import { goto } from '$app/navigation';

	import type { Locale } from '$lib/i18n';

	onMount(() => {
		let locale: Locale = 'en';

		const stored = localStorage.getItem('treeline-locale');
		if (stored === 'en' || stored === 'cs') {
			locale = stored;
		} else {
			const browserLang = navigator.language.split('-')[0];
			if (browserLang === 'cs') {
				locale = 'cs';
			}
		}

		goto(`/${locale}`, { replaceState: true });
	});
</script>

<div class="flex h-64 items-center justify-center">
	<p class="text-gray-500">Redirecting...</p>
</div>
