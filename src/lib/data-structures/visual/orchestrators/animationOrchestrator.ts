import { clearAnimations } from '$lib/utils/animator';
import type { StepData } from '$lib/data-structures/operation/operationData';
import {
	ChangeDirection,
	EventType,
	type CurrentOperationChangedEvent,
	type CurrentStepChangedEvent,
	type OperationManager,
} from '$lib/data-structures/operation/operationManager';
import type { DataStructureAnimator } from '../animators/dataStructureAnimator';
import type { StepHandlersBase } from './stepHandlersBase';
import type { DataStructureAnnotator } from '../annotators/dataStructureAnnotator';

export class AnimationOrchestrator {
	constructor(
		public animator: DataStructureAnimator,
		public annotator: DataStructureAnnotator,
		public operationManager: OperationManager,
		public handlers: StepHandlersBase,
	) {
		operationManager.addEventListener(EventType.CurrentOperationChanged, (e: Event) => {
			const event = e as CustomEvent<CurrentOperationChangedEvent>;
			if (!operationManager.getShowSteps()) {
				this.playOperation(event.detail);
			}
		});

		operationManager.addEventListener(EventType.CurrentStepChanged, (e: Event) => {
			const event = e as CustomEvent<CurrentStepChangedEvent>;
			if (operationManager.getShowSteps()) {
				this.playStep(event.detail);
			}
		});

		operationManager.addEventListener(EventType.ShowStepsToggled, async () => {
			clearAnimations();

			if (operationManager.getShowSteps()) {
				this.animator.resetAnimationDuration();
				await this.playStep({
					currentStepId: operationManager.getCurrentStepIndex(),
					currentStep: operationManager.getCurrentStep(),
					direction: ChangeDirection.Forward,
				});
			} else {
				this.animator.setAnimationDuration(75);
				await this.playOperation({
					currentOperationId: operationManager.getCurrentOperationIndex(),
					currentOperation: operationManager.getCurrentOperation(),
					direction: ChangeDirection.Forward,
				});
			}
		});
	}

	public async playOperation(opEvent: CurrentOperationChangedEvent) {
		this.operationManager.setLocked(true);
		try {
			console.log('Play full operation (fast playback)', opEvent);

			const operation = opEvent.currentOperation;

			this.annotator.clearAnnotation();
			this.animator.resetFormatting();

			if (opEvent.direction === ChangeDirection.Forward || opEvent.direction === ChangeDirection.Unknown) {
				const steps = operation.steps;
				this.handlers.stepSetup(steps[0], this.animator, this.annotator, true);

				for (let i = 0; i < steps.length - 1; i++) {
					try {
						await this.animateStep(steps[i], true);
						await new Promise(resolve => setTimeout(resolve, 50));
					} catch (err) {
						console.warn('Fast operation playback step error', err);
					}
				}
			} else if (opEvent.direction === ChangeDirection.Backward) {
				const steps = operation.steps;
				this.handlers.stepSetup(steps[steps.length - 1], this.animator, this.annotator, false);

				for (let i = steps.length - 1; i > 0; i--) {
					try {
						await this.animateStep(steps[i], false);
						await new Promise(resolve => setTimeout(resolve, 50));
					} catch (err) {
						console.warn('Fast operation playback step error', err);
					}
				}
			}

			console.log('Finished full operation playback');
		} finally {
			this.animator.animateFit();
			this.operationManager.setLocked(false);
		}
	}

	public async playStep(stepEvent: CurrentStepChangedEvent) {
		this.operationManager.setLocked(true);
		try {
			const isForward = stepEvent.direction === 'forward' || stepEvent.direction === 'unknown';

			const currentStep = isForward ? stepEvent.currentStep : stepEvent.previousStep;
			if (!currentStep) return;

			console.log(`Play step ${currentStep.type} (${isForward ? 'forward' : 'backward'})`, currentStep);

			await this.animateStep(currentStep, isForward);
		} finally {
			this.operationManager.setLocked(false);
		}
	}

	private async animateStep(currentStep: StepData, isForward: boolean) {
		await this.handlers.stepSetup(currentStep, this.animator, this.annotator, isForward);
		await this.handlers.stepRoute(currentStep, this.animator, this.annotator, this.operationManager, isForward);
		await this.handlers.stepCleanup(currentStep, this.animator, this.annotator, isForward);
	}
}
