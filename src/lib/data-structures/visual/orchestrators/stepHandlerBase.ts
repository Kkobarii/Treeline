import type { StepData } from '$lib/data-structures/operation/operationData';
import type { OperationManager } from '$lib/data-structures/operation/operationManager';

import type { DataStructureAnimator } from '../animators/dataStructureAnimator';
import type { DataStructureAnnotator } from '../annotators/dataStructureAnnotator';

export abstract class StepHandlerBase {
	/** Prepare renderer for the incoming step (apply start snapshot when forward, end snapshot when backward). */
	abstract stepSetup(
		currentStep: StepData,
		animator: DataStructureAnimator,
		annotator: DataStructureAnnotator,
		isForward: boolean,
	): Promise<void> | void;

	/** Clean up after a step (apply end or start snapshot as needed). */
	abstract stepCleanup(
		currentStep: StepData,
		animator: DataStructureAnimator,
		annotator: DataStructureAnnotator,
		isForward: boolean,
	): Promise<void> | void;

	/** Route the step to concrete per-step handlers. */
	abstract stepRoute(
		currentStep: StepData,
		animator: DataStructureAnimator,
		annotator: DataStructureAnnotator,
		operationManager: OperationManager,
		isForward?: boolean,
	): Promise<void> | void;
}
