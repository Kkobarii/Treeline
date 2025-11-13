import type { StepData } from '$lib/operation/operationData';
import {
	ChangeDirection,
	type CurrentOperationChangedEvent,
	type CurrentStepChangedEvent,
	type OperationManager,
} from '$lib/operation/operationManager';
import { StepType, type StepTypeValue } from '$lib/structures/dataStructure';
import type { BSTreeAnimator } from '../animators/bstAnimator';
import type { DataStructureAnimator } from '../animators/dataStructureAnimator';
import * as StepHandlers from './bstStepHandlers';

export async function playOperation(
	renderer: DataStructureAnimator,
	operationManager: OperationManager,
	opEvent: CurrentOperationChangedEvent,
) {
	operationManager.setLocked(true);
	try {
		console.log('Play full operation (fast playback)', opEvent);

		const operation = opEvent.currentOperation;

		renderer.resetFormatting();

		if (opEvent.direction === ChangeDirection.Forward || opEvent.direction === ChangeDirection.Unknown) {
			const steps = operation.steps;
			stepSetup(steps[0], renderer, true);

			for (let i = 0; i < steps.length - 1; i++) {
				try {
					await animateStep(renderer, operationManager, steps[i], true);
					await new Promise(resolve => setTimeout(resolve, 50));
				} catch (err) {
					console.warn('Fast operation playback step error', err);
				}
			}
		} else if (opEvent.direction === ChangeDirection.Backward) {
			const steps = operation.steps;
			stepSetup(steps[steps.length - 1], renderer, false);

			for (let i = steps.length - 1; i > 0; i--) {
				try {
					await animateStep(renderer, operationManager, steps[i], false);
					await new Promise(resolve => setTimeout(resolve, 50));
				} catch (err) {
					console.warn('Fast operation playback step error', err);
				}
			}
		}

		console.log('Finished full operation playback');
	} finally {
		operationManager.setLocked(false);
	}
}

export async function playStep(renderer: DataStructureAnimator, operationManager: OperationManager, stepEvent: CurrentStepChangedEvent) {
	operationManager.setLocked(true);
	try {
		const isForward = stepEvent.direction === 'forward' || stepEvent.direction === 'unknown';

		const currentStep = isForward ? stepEvent.currentStep : stepEvent.previousStep;
		if (!currentStep) return;

		console.log(`Play step ${currentStep.type} (${isForward ? 'forward' : 'backward'})`, currentStep);

		await animateStep(renderer, operationManager, currentStep, isForward);
	} finally {
		operationManager.setLocked(false);
	}
}

async function animateStep(renderer: DataStructureAnimator, operationManager: OperationManager, currentStep: StepData, isForward: boolean) {
	await stepSetup(currentStep, renderer, isForward);
	await stepRoute(currentStep, renderer, operationManager, isForward);
	await stepCleanup(currentStep, renderer, isForward);
}

async function stepSetup(currentStep: StepData, baseRenderer: DataStructureAnimator, isForward: boolean) {
	let renderer = baseRenderer as BSTreeAnimator;
	if (isForward && currentStep.startSnapshot) {
		renderer.ensureTree(currentStep.startSnapshot);
	}
	if (!isForward && currentStep.endSnapshot) {
		renderer.ensureTree(currentStep.endSnapshot);
	}
}

async function stepCleanup(currentStep: StepData, baseRenderer: DataStructureAnimator, isForward: boolean) {
	let renderer = baseRenderer as BSTreeAnimator;

	if (isForward && currentStep.endSnapshot) {
		renderer.ensureTree(currentStep.endSnapshot);
	}
	if (!isForward && currentStep.startSnapshot) {
		renderer.ensureTree(currentStep.startSnapshot);
	}
}

async function stepRoute(
	currentStep: StepData,
	baseRenderer: DataStructureAnimator,
	operationManager: OperationManager,
	isForward: boolean = true,
) {
	let renderer = baseRenderer as BSTreeAnimator;

	switch (currentStep.type as StepTypeValue) {
		case StepType.BSTree.Start:
			if (isForward) await StepHandlers.handleStartForward(renderer, operationManager);
			else await StepHandlers.handleStartBackward(renderer, operationManager);
			break;
		case StepType.BSTree.End:
			if (isForward) await StepHandlers.handleEndForward(renderer, operationManager);
			else await StepHandlers.handleEndBackward(renderer, operationManager);
			break;
		case StepType.BSTree.CreateRoot:
			if (isForward) await StepHandlers.handleCreateRootForward(renderer, currentStep.data as any);
			else await StepHandlers.handleCreateRootBackward(renderer, currentStep.data as any);
			break;
		case StepType.BSTree.CreateLeaf:
			if (isForward) await StepHandlers.handleCreateLeafForward(renderer, currentStep.data as any);
			else await StepHandlers.handleCreateLeafBackward(renderer, currentStep.data as any);
			break;
		case StepType.BSTree.Compare:
			if (isForward) await StepHandlers.handleCompareForward(renderer, currentStep.data as any);
			else await StepHandlers.handleCompareBackward(renderer, currentStep.data as any);
			break;
		case StepType.BSTree.Traverse:
			if (isForward) await StepHandlers.handleTraverseForward(renderer, currentStep.data as any);
			else await StepHandlers.handleTraverseBackward(renderer, currentStep.data as any);
			break;
		case StepType.BSTree.Drop:
			if (isForward) await StepHandlers.handleDropForward(renderer, currentStep.data as any);
			else await StepHandlers.handleDropBackward(renderer, currentStep.data as any);
			break;
		case StepType.BSTree.Found:
			if (isForward) await StepHandlers.handleFoundForward(renderer, currentStep.data as any);
			else await StepHandlers.handleFoundBackward(renderer, currentStep.data as any);
			break;
		case StepType.BSTree.MarkToDelete:
			if (isForward) await StepHandlers.handleMarkToDeleteForward(renderer, currentStep.data as any);
			else await StepHandlers.handleMarkToDeleteBackward(renderer, currentStep.data as any);
			break;
		case StepType.BSTree.Delete:
			if (isForward) await StepHandlers.handleDeleteForward(renderer, currentStep.data as any);
			else await StepHandlers.handleDeleteBackward(renderer, currentStep.data as any);
			break;
		case StepType.BSTree.ReplaceWithChild:
			if (isForward) await StepHandlers.handleReplaceWithChildForward(renderer, currentStep.data as any);
			else await StepHandlers.handleReplaceWithChildBackward(renderer, currentStep.data as any);
			break;
		case StepType.BSTree.FoundInorderSuccessor:
			if (isForward) await StepHandlers.handleFoundInorderSuccessorForward(renderer, currentStep.data as any);
			else await StepHandlers.handleFoundInorderSuccessorBackward(renderer, currentStep.data as any);
			break;
		case StepType.BSTree.RelinkSuccessorChild:
			if (isForward) await StepHandlers.handleRelinkSuccessorChildForward(renderer, currentStep.data as any);
			else await StepHandlers.handleRelinkSuccessorChildBackward(renderer, currentStep.data as any);
			break;
		case StepType.BSTree.ReplaceWithInorderSuccessor:
			if (isForward) await StepHandlers.handleReplaceWithInorderSuccessorForward(renderer, currentStep.data as any);
			else await StepHandlers.handleReplaceWithInorderSuccessorBackward(renderer, currentStep.data as any);
			break;
	}
}
