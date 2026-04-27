<script lang="ts">
	import { onMount } from 'svelte';

	import { getLocale, translate } from '$lib/i18n';
	import { getDevSessionDebugEnabled, startKonamiDebugListener, subscribeToDevSessionDebugEnabled } from '$lib/utils/devSessionDebugGate';

	const locale = getLocale();

	let visible = false;
	let hideTimer: ReturnType<typeof setTimeout> | null = null;
	let unsubscribeDevSessionDebug: (() => void) | null = null;
	let stopKonamiListener: (() => void) | null = null;

	function clearHideTimer() {
		if (!hideTimer) return;
		clearTimeout(hideTimer);
		hideTimer = null;
	}

	function playHackOverlayAnimation() {
		clearHideTimer();
		visible = true;

		hideTimer = setTimeout(() => {
			visible = false;
			hideTimer = null;
		}, 2400);
	}

	onMount(() => {
		stopKonamiListener = startKonamiDebugListener();

		let knownState = getDevSessionDebugEnabled();

		unsubscribeDevSessionDebug = subscribeToDevSessionDebugEnabled(enabled => {
			if (enabled && !knownState) {
				playHackOverlayAnimation();
			}

			knownState = enabled;
		});

		return () => {
			clearHideTimer();

			if (unsubscribeDevSessionDebug) {
				unsubscribeDevSessionDebug();
				unsubscribeDevSessionDebug = null;
			}

			if (stopKonamiListener) {
				stopKonamiListener();
				stopKonamiListener = null;
			}
		};
	});
</script>

{#if visible}
	<div
		class="hack-overlay"
		aria-hidden="true">
		<div class="scanlines"></div>
		<div class="noise"></div>
		<div class="terminal-box">
			<p class="title">{translate(locale, 'devModeHackOverlay.title')}</p>
			<p class="line">{translate(locale, 'devModeHackOverlay.line1')}</p>
			<p class="line">{translate(locale, 'devModeHackOverlay.line2')}</p>
			<p class="line">{translate(locale, 'devModeHackOverlay.line3')}</p>
			<p class="line">{translate(locale, 'devModeHackOverlay.line4')}</p>
			<div class="progress-track">
				<div class="progress-fill"></div>
			</div>
		</div>
	</div>
{/if}

<style>
	.hack-overlay {
		position: fixed;
		inset: 0;
		z-index: 9999;
		pointer-events: none;
		display: flex;
		align-items: center;
		justify-content: center;
		background:
			radial-gradient(circle at 20% 20%, oklch(from var(--color-secondary-light) l c h / 0.2), transparent 45%),
			radial-gradient(circle at 80% 70%, oklch(from var(--color-secondary) l c h / 0.15), transparent 40%),
			oklch(from var(--color-primary-dark) l c h / 0.72);
		animation: overlay-fade 2.4s ease both;
	}

	.scanlines,
	.noise {
		position: absolute;
		inset: 0;
	}

	.scanlines {
		background: repeating-linear-gradient(
			to bottom,
			oklch(from var(--color-secondary-light) l c h / 0.12) 0px,
			oklch(from var(--color-secondary-light) l c h / 0.12) 1px,
			transparent 2px,
			transparent 4px
		);
		mix-blend-mode: screen;
		animation: scan-move 0.7s linear infinite;
	}

	.noise {
		opacity: 0.18;
		background-image: radial-gradient(oklch(from var(--color-secondary-light) l c h / 0.2) 1px, transparent 1px);
		background-size: 3px 3px;
		animation: noise-jitter 0.18s steps(2, end) infinite;
	}

	.terminal-box {
		position: relative;
		width: min(640px, calc(100vw - 2rem));
		padding: 1rem 1.2rem;
		border: 1px solid oklch(from var(--color-secondary-light) l c h / 0.5);
		background: oklch(from oklch(0.205 0.033 127.37) l c h / 0.7);
		box-shadow: 0 0 40px oklch(from var(--color-secondary) l c h / 0.35);
		font-family: 'Courier New', Courier, monospace;
		color: oklch(0.895 0.019 100.1);
		animation: terminal-pop 2.4s ease both;
	}

	.title {
		margin: 0;
		font-size: 0.9rem;
		letter-spacing: 0.11em;
		text-transform: uppercase;
		font-weight: 700;
		color: oklch(0.895 0.019 100.1);
	}

	.line {
		margin: 0.55rem 0 0;
		white-space: nowrap;
		overflow: hidden;
		border-right: 2px solid oklch(from oklch(0.895 0.019 100.1) l c h / 0.7);
		animation: type-line 1.3s steps(40, end) forwards;
	}

	.line:nth-of-type(2) {
		animation-delay: 0.15s;
	}

	.line:nth-of-type(3) {
		animation-delay: 0.3s;
	}

	.line:nth-of-type(4) {
		animation-delay: 0.45s;
	}

	.line:nth-of-type(5) {
		animation-delay: 0.6s;
	}

	.progress-track {
		margin-top: 0.8rem;
		height: 7px;
		background: oklch(from var(--color-secondary-dark) l c h / 0.45);
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, var(--color-secondary), var(--color-secondary-light));
		animation: progress-run 1.3s ease-out 0.2s forwards;
		transform-origin: left;
		transform: scaleX(0);
	}

	@keyframes overlay-fade {
		0% {
			opacity: 0;
		}
		10% {
			opacity: 1;
		}
		85% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}

	@keyframes scan-move {
		0% {
			transform: translateY(0);
		}
		100% {
			transform: translateY(4px);
		}
	}

	@keyframes noise-jitter {
		0% {
			transform: translate(0, 0);
		}
		100% {
			transform: translate(1px, -1px);
		}
	}

	@keyframes terminal-pop {
		0% {
			opacity: 0;
			transform: scale(0.96);
		}
		15% {
			opacity: 1;
			transform: scale(1);
		}
		85% {
			opacity: 1;
			transform: scale(1);
		}
		100% {
			opacity: 0;
			transform: scale(1.01);
		}
	}

	@keyframes type-line {
		from {
			width: 0;
		}
		to {
			width: 100%;
		}
	}

	@keyframes progress-run {
		to {
			transform: scaleX(1);
		}
	}

	@media (max-width: 640px) {
		.terminal-box {
			padding: 0.8rem 0.9rem;
			font-size: 0.84rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.hack-overlay,
		.scanlines,
		.noise,
		.terminal-box,
		.line,
		.progress-fill {
			animation-duration: 0.01ms !important;
			animation-iteration-count: 1 !important;
		}
	}
</style>
