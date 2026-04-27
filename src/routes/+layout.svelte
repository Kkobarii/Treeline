<script lang="ts">
	import DevModeOverlay from '$lib/components/DevModeOverlay.svelte';

	import '../app.css';

	import { ModeWatcher } from 'mode-watcher';

	let { children } = $props();
</script>

<ModeWatcher />
<DevModeOverlay />

{@render children?.()}
