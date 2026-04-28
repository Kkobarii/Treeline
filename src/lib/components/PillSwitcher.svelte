<script lang="ts">
	export let leftLabel: string;
	export let rightLabel: string;
	export let selected: 0 | 1 = 0;

	export let leftIcon: string | undefined = undefined;
	export let rightIcon: string | undefined = undefined;

	export let leftHref: string | undefined = undefined;
	export let rightHref: string | undefined = undefined;

	export let onLeftClick: (() => void) | undefined = undefined;
	export let onRightClick: (() => void) | undefined = undefined;

	export let disabled: boolean = false;
	export let className: string = '';
	export let size: 'md' | 'sm' = 'md';

	export let hasIcons: boolean = !!leftIcon || !!rightIcon;

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
	class:has-icons={hasIcons}
	style={`--pill-x: ${selected};`}>
	<div
		class="switcher-pill"
		aria-hidden="true">
	</div>

	{#if selected === 0}
		<span class="switcher-option switcher-active">
			{#if leftIcon}<img
					src={leftIcon}
					alt=""
					class="switcher-icon" />{/if}<span class="switcher-label">{leftLabel}</span>
		</span>
	{:else if leftHref}
		<a
			href={leftHref}
			class="switcher-option switcher-inactive">
			{#if leftIcon}<img
					src={leftIcon}
					alt=""
					class="switcher-icon" />{/if}<span class="switcher-label">{leftLabel}</span>
		</a>
	{:else}
		<button
			type="button"
			class="switcher-option switcher-inactive"
			on:click={handleLeftClick}
			{disabled}>
			{#if leftIcon}<img
					src={leftIcon}
					alt=""
					class="switcher-icon" />{/if}<span class="switcher-label">{leftLabel}</span>
		</button>
	{/if}

	{#if selected === 1}
		<span class="switcher-option switcher-active">
			{#if rightIcon}<img
					src={rightIcon}
					alt=""
					class="switcher-icon" />{/if}<span class="switcher-label">{rightLabel}</span>
		</span>
	{:else if rightHref}
		<a
			href={rightHref}
			class="switcher-option switcher-inactive">
			{#if rightIcon}<img
					src={rightIcon}
					alt=""
					class="switcher-icon" />{/if}<span class="switcher-label">{rightLabel}</span>
		</a>
	{:else}
		<button
			type="button"
			class="switcher-option switcher-inactive"
			on:click={handleRightClick}
			{disabled}>
			{#if rightIcon}<img
					src={rightIcon}
					alt=""
					class="switcher-icon" />{/if}<span class="switcher-label">{rightLabel}</span>
		</button>
	{/if}
</div>

<style lang="postcss">
	@reference "../../app.css";

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
		background-color: oklch(from var(--color-secondary-light) l c h / 0.8);
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
		box-shadow: 0 0 0 2px var(--color-secondary);
	}

	.switcher-option:disabled {
		opacity: 0.5;
		cursor: auto;
	}

	.switcher-inactive:hover:not(:disabled) {
		background-color: oklch(from var(--color-gray-200) l c h / 0.8);
	}

	.switcher-icon {
		@apply dark:invert;
		display: none;
		width: 1.2em;
		height: 1.2em;
		object-fit: contain;
	}

	.switcher-label {
		display: inline;
		line-height: 1;
	}

	@media (max-width: 768px) {
		.pill-switcher.has-icons {
			--switcher-padding: 0.2rem;
			--switcher-gap: 0.1rem;
			--switcher-radius: 0.5rem;
			--option-radius: 0.35rem;
			--option-y-padding: 0.2rem;
			--option-x-padding: 0.4rem;
		}

		.pill-switcher.has-icons .switcher-option {
			padding: var(--option-y-padding) var(--option-x-padding);
		}

		.pill-switcher.has-icons .switcher-icon {
			display: block;
			width: 1.4em;
			height: 1.4em;
		}

		.pill-switcher.has-icons .switcher-label {
			display: none;
		}
	}
</style>
