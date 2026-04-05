import type { ArrayType } from '$lib/sorting-algorithms/misc/utils';

export interface PlaybackState {
	stepDescription: string;
	currentStep: number;
	totalSteps: number;
	isPlaying: boolean;
	canStepBackward: boolean;
	canStepForward: boolean;
}

export interface DelayConfig {
	delayMs: number;
	minDelayMs: number;
	maxDelayMs: number;
	onDelayChange?: (delay: number) => void;
}

export interface ArrayConfig {
	arrayType: ArrayType;
	onArrayTypeChange: (type: ArrayType) => void;
	onShuffle: () => void;
}

export interface NavigationCallbacks {
	onTogglePlay: () => void;
	onStepBackward: () => void;
	onStepForward: () => void;
}

export type GroupedProps = {
	playbackState: PlaybackState;
	delayConfig: DelayConfig;
	arrayConfig: ArrayConfig;
	navigation: NavigationCallbacks;
};
