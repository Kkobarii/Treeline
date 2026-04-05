export type TimerCallback = () => void;

export interface Timer {
	start: (delayMs: number, callback: TimerCallback) => void;
	stop: () => void;
	updateDelay: (delayMs: number) => void;
	isRunning: () => boolean;
}

export function createTimer(type: 'interval' | 'animation'): Timer {
	let intervalId: ReturnType<typeof setInterval> | null = null;
	let rafId: ReturnType<typeof requestAnimationFrame> | null = null;
	let currentCallback: TimerCallback | null = null;
	let delayMs = 0;
	let nextRunAt = 0;

	function stopInterval() {
		if (intervalId !== null) {
			clearInterval(intervalId);
			intervalId = null;
		}
	}

	function stopRaf() {
		if (rafId !== null) {
			cancelAnimationFrame(rafId);
			rafId = null;
		}
	}

	function stop() {
		if (type === 'interval') {
			stopInterval();
		} else {
			stopRaf();
		}
	}

	function start(delay: number, callback: TimerCallback) {
		stop();
		currentCallback = callback;
		delayMs = delay;

		if (type === 'interval') {
			intervalId = setInterval(() => {
				if (currentCallback) {
					currentCallback();
				}
			}, delayMs);
		} else {
			nextRunAt = performance.now() + delayMs;
			const runLoop = (now: number) => {
				if (!currentCallback) return;
				if (now >= nextRunAt) {
					currentCallback();
					nextRunAt = now + delayMs;
				}
				rafId = requestAnimationFrame(runLoop);
			};
			rafId = requestAnimationFrame(runLoop);
		}
	}

	function updateDelay(newDelayMs: number) {
		if (!isRunning()) return;
		delayMs = newDelayMs;

		if (type === 'interval') {
			stopInterval();
			intervalId = setInterval(() => {
				if (currentCallback) {
					currentCallback();
				}
			}, delayMs);
		} else {
			nextRunAt = performance.now() + delayMs;
		}
	}

	function isRunning() {
		return type === 'interval' ? intervalId !== null : rafId !== null;
	}

	return {
		start,
		stop,
		updateDelay,
		isRunning,
	};
}
