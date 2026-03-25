<script lang="ts">
	export let leftLabel: string;
	export let rightLabel: string;
	export let selected: 0 | 1 = 0;

	export let leftHref: string | undefined = undefined;
	export let rightHref: string | undefined = undefined;

	export let onLeftClick: (() => void) | undefined = undefined;
	export let onRightClick: (() => void) | undefined = undefined;

	export let disabled: boolean = false;
	export let className: string = '';
	export let size: 'md' | 'sm' = 'md';

	function handleLeftClick() {
		if (disabled) return;
		onLeftClick?.();
	}

	function handleRightClick() {
		if (disabled) return;
		onRightClick?.();
	}
</script>

<div
	class={`pill-switcher pill-switcher-${size} ${className}`.trim()}
	style={`--pill-x: ${selected};`}>
	<div
		class="switcher-pill"
		aria-hidden="true">
	</div>

	{#if selected === 0}
		<span class="switcher-option switcher-active">{leftLabel}</span>
	{:else if leftHref}
		<a
			href={leftHref}
			class="switcher-option switcher-inactive">
			{leftLabel}
		</a>
	{:else}
		<button
			type="button"
			class="switcher-option switcher-inactive"
			on:click={handleLeftClick}
			{disabled}>
			{leftLabel}
		</button>
	{/if}

	{#if selected === 1}
		<span class="switcher-option switcher-active">{rightLabel}</span>
	{:else if rightHref}
		<a
			href={rightHref}
			class="switcher-option switcher-inactive">
			{rightLabel}
		</a>
	{:else}
		<button
			type="button"
			class="switcher-option switcher-inactive"
			on:click={handleRightClick}
			{disabled}>
			{rightLabel}
		</button>
	{/if}
</div>

<style>
	.pill-switcher {
		--switcher-padding: 0.4rem;
		--switcher-gap: 0.25rem;
		--switcher-radius: 1rem;
		--option-radius: 0.7rem;
		--option-y-padding: 0.5rem;
		--option-x-padding: 1.2rem;
		--option-font-size: 0.9rem;
		position: relative;
		display: grid;
		grid-template-columns: 1fr 1fr;
		align-items: center;
		background-color: oklch(from var(--color-gray-100) l c h / 0.8);
		border: 1px solid oklch(from var(--color-gray-400) l c h / 0.6);
		border-radius: var(--switcher-radius);
		padding: var(--switcher-padding);
		backdrop-filter: blur(8px);
		gap: var(--switcher-gap);
	}

	.pill-switcher-sm {
		--switcher-padding: 0.22rem;
		--switcher-gap: 0.16rem;
		--switcher-radius: 0.75rem;
		--option-radius: 0.5rem;
		--option-y-padding: 0.3rem;
		--option-x-padding: 0.5rem;
		--option-font-size: 0.8rem;
	}

	.switcher-pill {
		position: absolute;
		top: var(--switcher-padding);
		left: var(--switcher-padding);
		height: calc(100% - (var(--switcher-padding) * 2));
		width: calc((100% - var(--switcher-gap) - (var(--switcher-padding) * 2)) / 2);
		box-sizing: border-box;
		border-radius: var(--option-radius);
		background-color: oklch(from var(--color-primary-light) l c h / 0.8);
		transform: translateX(calc(var(--pill-x) * (100% + var(--switcher-gap))));
		transition: transform 220ms ease;
		z-index: 0;
		pointer-events: none;
	}

	.switcher-option {
		padding: var(--option-y-padding) var(--option-x-padding);
		text-decoration: none;
		font-size: var(--option-font-size);
		font-weight: 500;
		border-radius: var(--option-radius);
		transition: all 200ms ease;
		cursor: pointer;
		color: var(--color-text);
		border: none;
		background: none;
		font-family: inherit;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		text-align: center;
		align-items: center;
		position: relative;
		z-index: 1;
		outline: none;
	}

	.switcher-option:focus-visible {
		box-shadow: 0 0 0 2px var(--color-primary);
	}

	.switcher-option:disabled {
		opacity: 0.5;
		cursor: auto;
	}

	.switcher-inactive:hover:not(:disabled) {
		background-color: oklch(from var(--color-gray-200) l c h / 0.8);
	}
</style>
