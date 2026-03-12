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
