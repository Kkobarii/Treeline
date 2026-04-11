import type { SortingAlgorithmId } from './types';
import type { ArrayType } from './utils';

const GAP_REM = 0.35;
const EXPAND_PX = 3;

export function computeTargetAreaHighlight(
	variables: Record<string, unknown>,
	gridColumns: number,
	algorithmId: SortingAlgorithmId,
	cellHeight: number,
): { left: string; width: string; top: string; height: string } | null {
	if (gridColumns <= 0) return null;

	const targetAreaLeft = Number(variables.targetAreaLeft);
	const targetAreaRight = Number(variables.targetAreaRight);
	const targetAreaRow = Number(variables.targetAreaRow);

	if (!Number.isFinite(targetAreaLeft) || !Number.isFinite(targetAreaRight) || !Number.isFinite(targetAreaRow)) {
		return null;
	}

	const leftColumn = Math.max(0, Math.min(gridColumns - 1, Math.floor(targetAreaLeft)));
	const rightColumn = Math.max(leftColumn, Math.min(gridColumns - 1, Math.floor(targetAreaRight)));
	const targetRow = Math.max(0, Math.floor(targetAreaRow));
	const spanColumns = rightColumn - leftColumn + 1;

	const totalGapRem = (gridColumns - 1) * GAP_REM;
	const spanGapRem = (spanColumns - 1) * GAP_REM;
	const leftOffsetGapsRem = leftColumn * GAP_REM;
	const trackWidthExpression = `(100% - ${totalGapRem}rem) / ${gridColumns}`;
	const rowStepExpression = algorithmId === 'quick' ? `${cellHeight / 2}px` : `(${cellHeight}px + 0.35rem)`;

	return {
		left: `calc(${leftColumn} * (${trackWidthExpression}) + ${leftOffsetGapsRem}rem - ${EXPAND_PX}px)`,
		width: `calc(${spanColumns} * (${trackWidthExpression}) + ${spanGapRem}rem + ${EXPAND_PX * 2}px)`,
		top: `calc(${targetRow} * ${rowStepExpression} - ${EXPAND_PX}px)`,
		height: `calc(${cellHeight}px + ${EXPAND_PX * 2}px)`,
	};
}

export interface PlaybackSettings {
	minDelayMs: number;
	maxDelayMs: number;
	defaultDelayMs: number;
	storageKey: string;
}

export interface ArraySettings<T extends ArrayType = ArrayType> {
	arrayType: T;
	arraySize: number;
	validTypes: readonly T[];
	storageKey: string;
}

export interface HydrationState {
	hasHydrated: boolean;
}

export function createWaitForPaint() {
	return new Promise<void>(resolve => {
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				resolve();
			});
		});
	});
}

export const DEFAULT_PLAYBACK_INTERVAL: PlaybackSettings = {
	minDelayMs: 5,
	maxDelayMs: 120,
	defaultDelayMs: 40,
	storageKey: 'sortingFirstViewStepDelayMs',
};

export const DEFAULT_PLAYBACK_ANIMATION: PlaybackSettings = {
	minDelayMs: 200,
	maxDelayMs: 1000,
	defaultDelayMs: 450,
	storageKey: 'sortingDetailedViewDelayMs',
};
