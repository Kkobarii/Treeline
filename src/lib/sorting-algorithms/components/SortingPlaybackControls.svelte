<script lang="ts">
	import { getLocale, translate } from '$lib/i18n';

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
		onShuffle: () => void;
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
		onShuffle,
		onTogglePlay,
		onStepBackward,
		onStepForward,
	}: SortingPlaybackControlProps = $props();

	const speedSliderId = 'sorting-playback-speed';
	let stepProgressPct = $derived(totalSteps > 0 ? Math.max(0, Math.min(100, (currentStep / totalSteps) * 100)) : 0);
	let sliderStep = $derived(Math.max(1, Math.round((maxDelay - minDelay) / 20)));
</script>

<div class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between lg:gap-4">
	<div class="flex min-w-0 flex-col gap-3">
		<div class="flex flex-wrap items-center gap-2">
			<button
				type="button"
				class="inline-flex min-w-[8.75rem] items-center gap-2 px-3 py-[0.58rem] text-[0.8rem] font-semibold max-sm:min-w-0"
				onclick={onShuffle}>
				<img
					class="h-4 w-4 dark:invert"
					src="/controls/shuffle.svg"
					alt=""
					aria-hidden="true" />
				<span>{t('sorting.controls.shuffle')}</span>
			</button>

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

	.speed-slider {
		-webkit-appearance: none;
		appearance: none;
		height: 0.48rem;
		border-radius: 999px;
		background: oklch(from var(--color-primary) l c h / 0.25);
		direction: rtl;
	}

	.speed-slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 0.95rem;
		height: 0.95rem;
		border-radius: 999px;
		border: 2px solid var(--color-primary-dark);
		background: var(--color-white);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
	}

	.speed-slider::-moz-range-thumb {
		width: 0.95rem;
		height: 0.95rem;
		border-radius: 999px;
		border: 2px solid var(--color-primary-dark);
		background: var(--color-white);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
	}

	.speed-slider::-moz-range-track {
		height: 0.48rem;
		border-radius: 999px;
		background: oklch(from var(--color-primary) l c h / 0.25);
	}

	.step-status {
		border-color: oklch(from var(--color-primary) l c h / 0.35);
		background: oklch(from var(--color-primary) l c h / 0.2);
	}

	.step-number {
		color: var(--color-primary-dark);
	}

	.step-description {
		color: var(--color-text);
	}

	[role='progressbar'] {
		background: oklch(from var(--color-primary) l c h / 0.18);
	}

	[role='progressbar'] > div {
		background: var(--color-primary);
	}
</style>
