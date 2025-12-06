import type { StepData } from '$lib/data-structures/operation/operationData';
import {
	ChangeDirection,
	EventType,
	type CurrentOperationChangedEvent,
	type CurrentStepChangedEvent,
	type OperationManager,
} from '$lib/data-structures/operation/operationManager';
import { clearAnimations, DEFAULT_ANIMATION_DURATION_MS, FAST_PLAYBACK_DURATION_MS, setGlobalAnimationDuration } from '$lib/utils/animator';

import type { DataStructureAnimator } from '../animators/dataStructureAnimator';
import type { DataStructureAnnotator } from '../annotators/dataStructureAnnotator';
import type { StepHandlerBase } from './stepHandlerBase';

export class AnimationOrchestrator {
	lastSnapshot: any = null;

	constructor(
		public animator: DataStructureAnimator,
		public annotator: DataStructureAnnotator,
		public operationManager: OperationManager,
		public handlers: StepHandlerBase,
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
				// ensure global duration is reset to default for step-by-step playback
				setGlobalAnimationDuration(DEFAULT_ANIMATION_DURATION_MS);
				this.annotator.showAnnotationNode();
				await this.playStep({
					currentStepId: operationManager.getCurrentStepIndex(),
					currentStep: operationManager.getCurrentStep(),
					direction: ChangeDirection.Forward,
				});
			} else {
				// set fast playback duration globally so annotators use same speed
				setGlobalAnimationDuration(FAST_PLAYBACK_DURATION_MS);
				this.annotator.hideAnnotationNode();
				await this.playOperation({
					currentOperationId: operationManager.getCurrentOperationIndex(),
					currentOperation: operationManager.getCurrentOperation(),
					direction: ChangeDirection.Forward,
				});
			}
		});
	}

	public async playOperation(opEvent: CurrentOperationChangedEvent) {
		if (this.lastSnapshot == opEvent.currentOperation.endSnapshot) {
			return;
		}
		this.lastSnapshot = opEvent.currentOperation.endSnapshot;

		this.operationManager.beginAnimation();
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
			this.operationManager.endAnimation();
		}
	}

	public async playStep(stepEvent: CurrentStepChangedEvent) {
		this.operationManager.beginAnimation();
		try {
			const isForward = stepEvent.direction === 'forward' || stepEvent.direction === 'unknown';

			const currentStep = isForward ? stepEvent.currentStep : stepEvent.previousStep;
			if (!currentStep) return;

			console.log(`Play step ${currentStep.type} (${isForward ? 'forward' : 'backward'})`, currentStep);

			await this.animateStep(currentStep, isForward);
		} finally {
			this.operationManager.endAnimation();
		}
	}

	private async animateStep(currentStep: StepData, isForward: boolean) {
		await this.handlers.stepSetup(currentStep, this.animator, this.annotator, isForward);
		await this.handlers.stepRoute(currentStep, this.animator, this.annotator, this.operationManager, isForward);
		await this.handlers.stepCleanup(currentStep, this.animator, this.annotator, isForward);
	}
}
