<script lang="ts">
	import Dropdown from '$lib/components/Dropdown.svelte';
	import { getLocale, translate } from '$lib/i18n';

	import { dataSets } from '../misc/registry';
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
		onDelayChange?: (delay: number) => void;
	};

	const locale = getLocale();
	const t = (key: string, params?: Record<string, string | number>) => translate(locale, key, params);

	let {
		stepDescription,
		currentStep,
		totalSteps,
		minDelay,
		maxDelay,
		delayMs,
		isPlaying,
		canStepBackward,
		canStepForward,
		arrayType,
		onShuffle,
		onArrayTypeChange,
		onTogglePlay,
		onStepBackward,
		onStepForward,
		onDelayChange,
	}: SortingPlaybackControlProps = $props();

	const speedSliderId = 'sorting-playback-speed';
	let stepProgressPct = $derived(totalSteps > 0 ? Math.max(0, Math.min(100, (currentStep / totalSteps) * 100)) : 0);
	let sliderStep = $derived(Math.max(1, Math.round((maxDelay - minDelay) / 20)));

	const arrayTypeOptions: { value: ArrayType; label: string }[] = dataSets.map(ds => ({
		value: ds.type,
		label: t(ds.labelKey),
	}));
</script>

<div class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between lg:gap-4">
	<div class="flex min-w-0 flex-col gap-3">
		<div class="flex flex-col items-center gap-2 sm:flex-row sm:flex-wrap">
			<div class="array-controls-group w-full sm:w-auto">
				<Dropdown
					options={arrayTypeOptions}
					value={arrayType}
					onchange={onArrayTypeChange}
					ariaLabel={t('sorting.arrayTypes.label')} />
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

			<div class="flex items-center gap-2 sm:ml-4">
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

		<div class="flex w-full flex-wrap items-center gap-3">
			<div class="flex min-w-0 flex-1 items-center gap-2">
				<img
					class="h-[0.95rem] w-[0.95rem] dark:invert"
					src="/controls/slow.svg"
					alt=""
					aria-hidden="true" />
				<input
					id={speedSliderId}
					class="speed-slider min-w-0 flex-1 p-0"
					type="range"
					min={minDelay}
					max={maxDelay}
					step={sliderStep}
					value={delayMs}
					oninput={e => onDelayChange?.(Number(e.currentTarget.value))}
					aria-label={t('common.speed')}
					title={t('common.speed')} />
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

	.array-controls-group {
		@apply inline-flex items-stretch rounded-lg;
		border: 1px solid var(--color-primary-light);
		transition: border-color 140ms ease;
	}

	.array-controls-group:hover {
		border-color: oklch(from var(--color-primary) calc(l - 0.08) c h);
	}

	.array-controls-group > :global(.dropdown-wrapper) {
		@apply relative z-50 flex-1;
	}

	.array-controls-group > :global(.dropdown-wrapper .dropdown-trigger) {
		@apply w-full;
		border: none;
		border-right: 1px solid var(--color-primary-light);
		border-radius: 0.5rem 0 0 0.5rem;
	}

	.array-controls-group > :global(.dropdown-wrapper .dropdown-trigger:focus) {
		box-shadow: inset 0 0 0 2px oklch(from var(--color-secondary) l c h / 0.35);
	}

	.array-controls-group > :global(.dropdown-wrapper .dropdown-panel) {
		@apply rounded-lg;
	}

	.shuffle-button {
		@apply inline-flex cursor-pointer items-center justify-center rounded-r-lg;
		padding: 0.55rem 0.6rem;
		background: var(--color-primary-ultra-light);
		border: none;
		transition: background-color 140ms ease;
		border-radius: 0 0.5rem 0.5rem 0;
	}

	.shuffle-button:hover {
		background-color: oklch(from var(--color-primary-ultra-light) calc(l - 0.06) c h);
	}

	.shuffle-button:focus {
		@apply outline-none;
		box-shadow: inset 0 0 0 2px oklch(from var(--color-secondary) l c h / 0.35);
	}

	.shuffle-icon {
		@apply h-[0.9rem] w-[0.9rem];
	}

	.speed-slider {
		@apply h-[0.48rem] rounded-full;
		-webkit-appearance: none;
		appearance: none;
		background: oklch(from var(--color-secondary) l c h / 0.25);
		direction: rtl;
	}

	.speed-slider::-webkit-slider-thumb {
		@apply h-[0.95rem] w-[0.95rem] rounded-full bg-white;
		-webkit-appearance: none;
		appearance: none;
		border: 2px solid var(--color-secondary-dark);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
	}

	.speed-slider::-moz-range-thumb {
		@apply h-[0.95rem] w-[0.95rem] rounded-full bg-white;
		border: 2px solid var(--color-secondary-dark);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
	}

	.speed-slider::-moz-range-track {
		@apply h-[0.48rem] rounded-full;
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
