import { tick } from 'svelte';

import { getStoredNumber, saveToStorage } from '$lib/utils/storageUtils';
import { createTimer } from '$lib/utils/timer';

export class StepManager<T> {
	steps: T[];
	currentStepIndex: number;
	isPlaying: boolean;
	delayMs: number;

	private timer;
	private delayStorageKey: string | undefined;

	constructor(
		initialSteps: T[] = [],
		options: {
			minDelay?: number;
			maxDelay?: number;
			defaultDelay?: number;
			delayStorageKey?: string;
			timerType?: 'interval' | 'animation';
		} = {},
	) {
		const { minDelay = 5, maxDelay = 120, defaultDelay = 40, delayStorageKey, timerType = 'interval' } = options;

		this.steps = $state(initialSteps);
		this.currentStepIndex = $state(0);
		this.isPlaying = $state(false);
		this.delayMs = $state(getStoredNumber(delayStorageKey, minDelay, maxDelay, defaultDelay));
		this.delayStorageKey = delayStorageKey;
		this.timer = createTimer(timerType);
	}

	setDelay(value: number) {
		this.delayMs = value;
		saveToStorage(this.delayStorageKey, value);
		if (this.timer.isRunning()) {
			this.timer.updateDelay(value);
		}
	}

	setSteps(newSteps: T[]) {
		this.steps = newSteps;
		this.currentStepIndex = 0;
	}

	goToStep(index: number) {
		if (index >= 0 && index < this.steps.length) {
			this.currentStepIndex = index;
		}
	}

	async stepForward(isManual = false) {
		if (!this.steps.length) return;
		if (this.currentStepIndex < this.steps.length - 1) {
			this.currentStepIndex += 1;
			if (isManual) await tick();
		} else {
			this.pause();
		}
	}

	async stepBackward(isManual = false) {
		this.pause();
		if (this.currentStepIndex > 0) {
			this.currentStepIndex -= 1;
			if (isManual) await tick();
		}
	}

	private tickStep() {
		if (this.currentStepIndex < this.steps.length - 1) {
			this.currentStepIndex += 1;
		} else {
			this.pause();
		}
	}

	play() {
		this.isPlaying = true;
		if (this.currentStepIndex >= this.steps.length - 1) {
			this.currentStepIndex = 0;
		}
		this.timer.start(this.delayMs, () => this.tickStep());
	}

	pause() {
		this.timer.stop();
		this.isPlaying = false;
	}

	toggle() {
		if (this.isPlaying) {
			this.pause();
		} else {
			this.play();
		}
	}

	stop() {
		this.pause();
		this.currentStepIndex = 0;
	}

	reset() {
		this.stop();
	}
}
