<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import { setLocaleContext } from '$lib/i18n';

	let { data, children } = $props();

	setLocaleContext(data.lang);
</script>

<Nav />

<div class="header-spacer"></div>

<main class="container mx-auto flex flex-col gap-8 px-6 py-8">
	{@render children?.()}
</main>

<Footer />
