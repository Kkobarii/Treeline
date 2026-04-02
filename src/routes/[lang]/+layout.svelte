<script lang="ts">
	import { page } from '$app/state';

	import Footer from '$lib/components/Footer.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import { setLocaleContext } from '$lib/i18n';

	let { data, children } = $props();

	setLocaleContext(data.lang);
</script>

<svelte:head>
	<title>{page.data.pageTitle ? `${page.data.pageTitle} - Treeline` : 'Treeline'}</title>
</svelte:head>

<div class="flex min-h-screen flex-col">
	<Nav />
	<div class="header-spacer"></div>

	<main class="container mx-auto flex flex-1 flex-col gap-6 px-6 py-2">
		{@render children?.()}
	</main>

	<Footer />
</div>

<style>
	.header-spacer {
		height: 120px;
	}
</style>
