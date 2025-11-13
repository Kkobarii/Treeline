import type { StepData } from '$lib/operation/operationData';
import type { OperationManager } from '$lib/operation/operationManager';
import type { DataStructureAnimator } from '../animators/dataStructureAnimator';

export abstract class StepHandlersBase {
	/** Prepare renderer for the incoming step (apply start snapshot when forward, end snapshot when backward). */
	abstract stepSetup(currentStep: StepData, animator: DataStructureAnimator, isForward: boolean): Promise<void> | void;

	/** Clean up after a step (apply end or start snapshot as needed). */
	abstract stepCleanup(currentStep: StepData, animator: DataStructureAnimator, isForward: boolean): Promise<void> | void;

	/** Route the step to concrete per-step handlers. */
	abstract stepRoute(
		currentStep: StepData,
		animator: DataStructureAnimator,
		operationManager: OperationManager,
		isForward?: boolean,
	): Promise<void> | void;
}
