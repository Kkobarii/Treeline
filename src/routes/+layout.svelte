<script lang="ts">
	import '../app.css';

	import { ModeWatcher } from 'mode-watcher';
	import { onMount } from 'svelte';

	import Footer from '$lib/components/Footer.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import { locale } from '$lib/i18n';

	let { children } = $props();

	onMount(() => {
		locale.initialize();
	});
</script>

<ModeWatcher />

<Nav />

<div class="header-spacer"></div>

<main class="container mx-auto flex flex-col gap-8 px-6 py-8">
	{@render children?.()}
</main>

<Footer />
