import type { StepData } from '$lib/operation/operationData';
import {
	ChangeDirection,
	type CurrentOperationChangedEvent,
	type CurrentStepChangedEvent,
	type OperationManager,
} from '$lib/operation/operationManager';
import type { BSTree } from '$lib/structures/bsTree';
import { StepType, type StepTypeValue } from '$lib/structures/dataStructure';
import type { BSTreeAnimator } from './bstAnimator';
import * as StepHandlers from './bstStepHandlers';

export async function playOperation(renderer: BSTreeAnimator, operationManager: OperationManager, opEvent: CurrentOperationChangedEvent) {
	if (opEvent.currentOperation.operation === 'Empty') return;

	operationManager.setLocked(true);
	try {
		console.log('Play full operation (fast playback)', opEvent);

		renderer.clearDisconnectedDummyNodes();

		const operation = opEvent.currentOperation;

		renderer.ensureTree(operation.startSnapshot as BSTree);
		renderer.resetFormatting();

		if (opEvent.direction === ChangeDirection.Forward) {
			const steps = operation.steps;
			// iterate over the inner steps (skip Start at 0 and End at last)
			for (let i = 0; i < steps.length - 1; i++) {
				const step = steps[i];
				try {
					console.log(`Play operation step ${step.type} (fast playback)`, step);
					await routeStep(step, renderer, operationManager, true);
					await new Promise(resolve => setTimeout(resolve, 50));
				} catch (err) {
					// swallow per-step errors so the fast playback completes
					console.warn('Fast operation playback step error', err);
				}
			}
		}

		// ensure final authoritative snapshot and fit view
		if (operation.endSnapshot) renderer.ensureTree(operation.endSnapshot as BSTree);

		// hide info node
		renderer.hideInfoNode();

		renderer.clearDisconnectedDummyNodes();
		await renderer.animateFit();
		console.log('Finished full operation playback');
	} finally {
		operationManager.setLocked(false);
	}
}

export async function playStep(renderer: BSTreeAnimator, operationManager: OperationManager, stepEvent: CurrentStepChangedEvent) {
	operationManager.setLocked(true);
	try {
		// renderer.clearDisconnectedDummyNodes();
		const isForward = stepEvent.direction === 'forward' || stepEvent.direction === 'unknown';

		const currentStep = isForward ? stepEvent.currentStep : stepEvent.previousStep;
		if (!currentStep) return;

		console.log(`Play step ${currentStep.type} (${isForward ? 'forward' : 'backward'})`, currentStep);

		// restore start or end snapshot appropriate for the direction
		if (isForward && currentStep.startSnapshot) {
			renderer.ensureTree(currentStep.startSnapshot as BSTree);
		}
		if (!isForward && currentStep.endSnapshot) {
			renderer.ensureTree(currentStep.endSnapshot as BSTree);
		}

		// pick handler based on step type; call forward/backward variant
		await routeStep(currentStep, renderer, operationManager, isForward);

		// after handler run, restore authoritative snapshot for the step end
		if (stepEvent.direction === 'forward' && stepEvent.currentStep?.endSnapshot && renderer) {
			renderer.ensureTree(stepEvent.currentStep.endSnapshot as BSTree);
		}
		if (stepEvent.direction === 'backward' && stepEvent.currentStep?.startSnapshot && renderer) {
			renderer.ensureTree(stepEvent.currentStep.startSnapshot as BSTree);
		}

		renderer.clearDisconnectedDummyNodes();
	} finally {
		operationManager.setLocked(false);
	}
}

async function routeStep(currentStep: StepData, renderer: BSTreeAnimator, operationManager: OperationManager, isForward: boolean = true) {
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
