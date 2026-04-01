<script
	lang="ts"
	generics="T">
	type Props = {
		options: { value: T; label: string }[];
		value: T;
		onchange: (value: T) => void;
		ariaLabel?: string;
	};

	let { options, value, onchange, ariaLabel }: Props = $props();

	let isOpen = $state(false);
	let instanceId = `dropdown-${Math.random().toString(36).slice(2, 9)}`;

	function select(option: T) {
		onchange(option);
		isOpen = false;
	}

	function toggle() {
		isOpen = !isOpen;
	}

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest(`#${instanceId}`)) {
			isOpen = false;
		}
	}

	function handleTriggerClick(event: MouseEvent) {
		if (isOpen) {
			event.stopPropagation();
		}
		toggle();
	}

	$effect(() => {
		if (typeof window !== 'undefined') {
			document.addEventListener('click', handleClickOutside);
			return () => document.removeEventListener('click', handleClickOutside);
		}
	});

	let currentLabel = $derived(options.find(o => o.value === value)?.label ?? '');
	let widthSizer = $derived(
		options.reduce((widest, option) => (option.label.length > widest.length ? option.label : widest), options[0]?.label ?? ''),
	);
</script>

<div
	id={instanceId}
	class="dropdown-wrapper relative">
	<button
		type="button"
		class="dropdown-trigger"
		onclick={handleTriggerClick}
		aria-label={ariaLabel}
		aria-expanded={isOpen}>
		<span class="dropdown-label">{currentLabel}</span>
		<span
			class="dropdown-chevron"
			class:dropdown-chevron-open={isOpen}>▼</span>
		<span
			class="dropdown-sizer"
			aria-hidden="true">{widthSizer}</span>
	</button>

	{#if isOpen}
		<div class="dropdown-panel">
			{#each options as option}
				<button
					type="button"
					class="dropdown-option"
					class:dropdown-option-active={option.value === value}
					onclick={() => select(option.value)}>
					<span class="dropdown-option-label">{option.label}</span>
				</button>
			{/each}
		</div>
	{/if}
</div>

<style lang="postcss">
	@reference "../../app.css";

	.dropdown-wrapper {
		@apply relative z-50;
	}

	.dropdown-trigger {
		@apply relative grid cursor-pointer items-center rounded-lg text-[0.8rem] font-medium;
		grid-template-columns: 1fr auto;
		justify-items: start;
		gap: 0.5rem;
		padding: 0.6rem 0.75rem;
		background: var(--color-primary-ultra-light);
		border: 1px solid var(--color-primary-light);
		color: var(--color-text);
		transition:
			background-color 140ms ease,
			border-color 140ms ease;
	}

	.dropdown-trigger:hover {
		background-color: oklch(from var(--color-primary-ultra-light) calc(l - 0.06) c h);
		border-color: oklch(from var(--color-primary) calc(l - 0.08) c h);
	}

	.dropdown-trigger:focus {
		@apply outline-none;
		box-shadow: 0 0 0 2px oklch(from var(--color-secondary) l c h / 0.35);
	}

	.dropdown-label {
		@apply min-w-0 text-left font-medium;
		grid-column: 1;
		grid-row: 1;
		justify-self: start;
	}

	.dropdown-sizer {
		@apply pointer-events-none invisible font-medium;
		grid-column: 1;
		grid-row: 1;
		justify-self: start;
	}

	.dropdown-chevron {
		@apply text-[0.6rem] opacity-65;
		grid-column: 2;
		grid-row: 1;
		justify-self: end;
		transition: transform 0.2s ease;
	}

	.dropdown-chevron-open {
		@apply rotate-180;
	}

	.dropdown-panel {
		@apply absolute right-0 min-w-full overflow-hidden rounded-lg;
		top: calc(100% + 0.35rem);
		background: var(--color-gray-50);
		border: 1px solid var(--color-gray-100);
		box-shadow:
			0 4px 6px -1px oklch(from var(--color-gray-900) l c h / 0.1),
			0 2px 4px -2px oklch(from var(--color-gray-900) l c h / 0.1);
	}

	.dropdown-option {
		@apply flex w-full cursor-pointer items-center justify-between text-left text-[0.8rem] font-medium;
		padding: 0.65rem 0.85rem;
		background: transparent;
		border: none;
		border-radius: 0;
		color: var(--color-text);
		transition: background-color 140ms ease;
	}

	.dropdown-option:hover {
		background-color: oklch(from var(--color-gray-50) calc(l - 0.06) c h);
	}

	.dropdown-option:focus {
		@apply border-none;
	}

	.dropdown-option-active {
		color: var(--color-secondary-dark);
		background-color: oklch(from var(--color-secondary) l c h / 0.15);
	}

	.dropdown-option-active::after {
		@apply text-[0.85rem] font-bold;
		content: '\2713';
	}

	.dropdown-option-label {
		@apply flex-1;
	}
</style>
