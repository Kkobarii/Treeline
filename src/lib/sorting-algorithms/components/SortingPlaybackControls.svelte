<script lang="ts">
	import { getLocale, translate } from '$lib/i18n';

	import type { ArrayType } from '../misc/utils';

	type SortingPlaybackControlProps = {
		stepDescription: string;
		currentStep: number;
		totalSteps: number;
		delayMs: number;
		minDelay: number;
		maxDelay: number;
		isPlaying: boolean;
		canStepBackward: boolean;
		canStepForward: boolean;
		arrayType: ArrayType;
		onShuffle: () => void;
		onArrayTypeChange: (type: ArrayType) => void;
		onTogglePlay: () => void;
		onStepBackward: () => void;
		onStepForward: () => void;
	};

	const locale = getLocale();
	const t = (key: string, params?: Record<string, string | number>) => translate(locale, key, params);

	let {
		stepDescription,
		currentStep,
		totalSteps,
		minDelay,
		maxDelay,
		delayMs = $bindable(),
		isPlaying,
		canStepBackward,
		canStepForward,
		arrayType,
		onShuffle,
		onArrayTypeChange,
		onTogglePlay,
		onStepBackward,
		onStepForward,
	}: SortingPlaybackControlProps = $props();

	const speedSliderId = 'sorting-playback-speed';
	let stepProgressPct = $derived(totalSteps > 0 ? Math.max(0, Math.min(100, (currentStep / totalSteps) * 100)) : 0);
	let sliderStep = $derived(Math.max(1, Math.round((maxDelay - minDelay) / 20)));

	const arrayTypes: { type: ArrayType; labelKey: string }[] = [
		{ type: 'shuffled', labelKey: 'sorting.arrayTypes.shuffled' },
		{ type: 'almost-sorted', labelKey: 'sorting.arrayTypes.almostSorted' },
		{ type: 'reverse', labelKey: 'sorting.arrayTypes.reverse' },
		{ type: 'duplicates', labelKey: 'sorting.arrayTypes.duplicates' },
	];

	let dropdownOpen = $state(false);

	function selectArrayType(type: ArrayType) {
		onArrayTypeChange(type);
		dropdownOpen = false;
	}

	function toggleDropdown() {
		dropdownOpen = !dropdownOpen;
	}

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.array-controls')) {
			dropdownOpen = false;
		}
	}

	$effect(() => {
		if (typeof window !== 'undefined') {
			document.addEventListener('click', handleClickOutside);
			return () => document.removeEventListener('click', handleClickOutside);
		}
	});

	let arrayTypeLabel = $derived(t(arrayTypes.find(a => a.type === arrayType)?.labelKey ?? arrayTypes[0].labelKey));
</script>

<div class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between lg:gap-4">
	<div class="flex min-w-0 flex-col gap-3">
		<div class="flex flex-wrap items-center gap-2">
			<div class="array-controls">
				<div class="array-controls-group">
					<button
						type="button"
						class="array-type-button"
						onclick={toggleDropdown}
						aria-label={t('sorting.arrayTypes.label')}
						aria-expanded={dropdownOpen}>
						<span class="array-type-label">{arrayTypeLabel}</span>
						<span
							class="chevron"
							class:chevron-open={dropdownOpen}>▼</span>
					</button>

					<button
						type="button"
						class="shuffle-button"
						onclick={onShuffle}
						aria-label={t('sorting.controls.shuffle')}
						title={t('sorting.controls.shuffle')}>
						<img
							class="shuffle-icon dark:invert"
							src="/controls/shuffle.svg"
							alt=""
							aria-hidden="true" />
					</button>
				</div>

				{#if dropdownOpen}
					<div class="array-type-dropdown">
						{#each arrayTypes as at}
							<button
								type="button"
								class="type-option"
								class:type-option-active={at.type === arrayType}
								onclick={() => selectArrayType(at.type)}>
								<span>{t(at.labelKey)}</span>
							</button>
						{/each}
					</div>
				{/if}
			</div>

			<div class="ml-4 flex items-center gap-2 max-sm:ml-0">
				<button
					type="button"
					class="inline-flex h-[2.35rem] w-[2.65rem] items-center justify-center !p-0"
					onclick={onStepBackward}
					disabled={isPlaying || !canStepBackward}
					aria-label={t('common.back')}
					title={t('common.back')}>
					<img
						class="h-4 w-4 dark:invert"
						src="/controls/previous.svg"
						alt=""
						aria-hidden="true" />
				</button>

				<button
					type="button"
					class="inline-flex h-[2.35rem] w-[3.25rem] items-center justify-center !p-0"
					onclick={onTogglePlay}
					aria-label={isPlaying ? t('common.pause') : t('common.run')}
					title={isPlaying ? t('common.pause') : t('common.run')}>
					<img
						class="h-4 w-4 dark:invert"
						src={isPlaying ? '/controls/pause.svg' : '/controls/play.svg'}
						alt=""
						aria-hidden="true" />
				</button>

				<button
					type="button"
					class="inline-flex h-[2.35rem] w-[2.65rem] items-center justify-center !p-0"
					onclick={onStepForward}
					disabled={isPlaying || !canStepForward}
					aria-label={t('common.next')}
					title={t('common.next')}>
					<img
						class="h-4 w-4 dark:invert"
						src="/controls/next.svg"
						alt=""
						aria-hidden="true" />
				</button>
			</div>
		</div>

		<div class="flex w-fit max-w-full flex-wrap items-center gap-3">
			<label for={speedSliderId}>{t('common.speed')}</label>
			<div class="flex min-w-0 items-center gap-2">
				<img
					class="h-[0.95rem] w-[0.95rem] dark:invert"
					src="/controls/slow.svg"
					alt=""
					aria-hidden="true" />
				<input
					id={speedSliderId}
					class="speed-slider w-52 min-w-0 p-0"
					type="range"
					min={minDelay}
					max={maxDelay}
					step={sliderStep}
					bind:value={delayMs} />
				<img
					class="h-[0.95rem] w-[0.95rem] dark:invert"
					src="/controls/fast.svg"
					alt=""
					aria-hidden="true" />
			</div>
		</div>
	</div>

	<div class="step-status flex min-h-[5.5rem] min-w-0 flex-col gap-[0.2rem] rounded-xl border px-3 py-2 lg:w-[17rem]">
		<div class="step-number text-[0.66rem] font-semibold tracking-[0.05em] uppercase">
			{t('common.step')}
			{currentStep}/{totalSteps}
		</div>
		<div
			class="h-1 w-full overflow-hidden rounded-full"
			role="progressbar"
			aria-label={t('common.step')}
			aria-valuemin={0}
			aria-valuemax={totalSteps}
			aria-valuenow={Math.min(currentStep, totalSteps)}>
			<div
				class="h-full rounded-full"
				style={`width: ${stepProgressPct}%;`}>
			</div>
		</div>
		<div class="step-description flex-1 text-[0.9rem] leading-snug font-medium">{stepDescription}</div>
	</div>
</div>

<style lang="postcss">
	@reference "../../../app.css";

	.array-controls {
		position: relative;
		z-index: 50;
	}

	.array-controls-group {
		display: inline-flex;
		align-items: stretch;
		border-radius: 0.5rem;
		border: 1px solid var(--color-primary-light);
		overflow: hidden;
		transition: border-color 140ms ease;
	}

	.array-controls-group:hover {
		border-color: oklch(from var(--color-primary) calc(l - 0.08) c h);
	}

	.array-type-button {
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: center;
		gap: 0.4rem;
		padding: 0.55rem 0.7rem;
		background: var(--color-primary-ultra-light);
		border: none;
		border-right: 1px solid var(--color-primary-light);
		cursor: pointer;
		font-size: 0.8rem;
		font-weight: 500;
		color: var(--color-text);
		transition: background-color 140ms ease;
	}

	.array-type-button:hover {
		background-color: oklch(from var(--color-primary-ultra-light) calc(l - 0.06) c h);
	}

	.array-type-button:focus,
	.shuffle-button:focus {
		outline: none;
		box-shadow: inset 0 0 0 2px oklch(from var(--color-secondary) l c h / 0.35);
	}

	.array-type-label {
		white-space: nowrap;
	}

	.chevron {
		font-size: 0.55rem;
		transition: transform 0.2s ease;
		opacity: 0.6;
	}

	.chevron-open {
		transform: rotate(180deg);
	}

	.shuffle-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.55rem 0.6rem;
		background: var(--color-primary-ultra-light);
		border: none;
		cursor: pointer;
		transition: background-color 140ms ease;
	}

	.shuffle-button:hover {
		background-color: oklch(from var(--color-primary-ultra-light) calc(l - 0.06) c h);
	}

	.shuffle-icon {
		height: 0.9rem;
		width: 0.9rem;
	}

	.array-type-dropdown {
		position: absolute;
		top: calc(100% + 0.35rem);
		left: 0;
		min-width: 100%;
		background: var(--color-gray-50);
		border: 1px solid var(--color-gray-100);
		border-radius: 0.5rem;
		box-shadow:
			0 4px 6px -1px oklch(from var(--color-gray-900) l c h / 0.1),
			0 2px 4px -2px oklch(from var(--color-gray-900) l c h / 0.1);
		overflow: hidden;
	}

	.type-option {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: 0.6rem 0.85rem;
		background: transparent;
		border: none;
		cursor: pointer;
		font-size: 0.8rem;
		font-weight: 500;
		color: var(--color-text);
		text-align: left;
		transition: background-color 140ms ease;
	}

	.type-option:hover {
		background-color: oklch(from var(--color-gray-50) calc(l - 0.06) c h);
	}

	.type-option-active {
		background-color: oklch(from var(--color-secondary) l c h / 0.15);
		color: var(--color-secondary-dark);
	}

	.type-option-active::after {
		content: '\2713';
		font-weight: bold;
		font-size: 0.85rem;
	}

	.speed-slider {
		-webkit-appearance: none;
		appearance: none;
		height: 0.48rem;
		border-radius: 999px;
		background: oklch(from var(--color-secondary) l c h / 0.25);
		direction: rtl;
	}

	.speed-slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 0.95rem;
		height: 0.95rem;
		border-radius: 999px;
		border: 2px solid var(--color-secondary-dark);
		background: var(--color-white);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
	}

	.speed-slider::-moz-range-thumb {
		width: 0.95rem;
		height: 0.95rem;
		border-radius: 999px;
		border: 2px solid var(--color-secondary-dark);
		background: var(--color-white);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
	}

	.speed-slider::-moz-range-track {
		height: 0.48rem;
		border-radius: 999px;
		background: oklch(from var(--color-secondary) l c h / 0.25);
	}

	.step-status {
		border-color: oklch(from var(--color-secondary) l c h / 0.35);
		background: oklch(from var(--color-secondary) l c h / 0.2);
	}

	.step-number {
		color: var(--color-secondary-dark);
	}

	.step-description {
		color: var(--color-text);
	}

	[role='progressbar'] {
		background: oklch(from var(--color-secondary) l c h / 0.18);
	}

	[role='progressbar'] > div {
		background: var(--color-secondary);
	}
</style>
