<script lang="ts">
	import { toggleMode } from 'mode-watcher';
</script>

<button
	aria-label="Toggle dark mode"
	class="header-theme-button"
	onclick={toggleMode}>
	<span
		role="img"
		aria-label="Theme Icon"
		class="block h-5 w-5"
		style="
			background: white;
			-webkit-mask: url('/dark-theme.svg') no-repeat center / contain;
			mask: url('/dark-theme.svg') no-repeat center / contain;
		"></span>
</button>

<style>
	.header-theme-button {
		background-color: color-mix(in srgb, var(--color-gray-100) 30%, transparent);
		border: 1px solid color-mix(in srgb, var(--color-gray-50) 50%, transparent);
		border-radius: 0.5rem;
		padding: 0.5rem;
		transition: all 0.2s ease;
		cursor: pointer;
	}

	.header-theme-button:hover {
		background-color: color-mix(in srgb, var(--color-gray-100) 50%, transparent);
		border-color: color-mix(in srgb, var(--color-gray-50) 80%, transparent);
	}
</style>
