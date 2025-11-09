import type { CurrentOperationChangedEvent, CurrentStepChangedEvent, OperationManager } from '$lib/operation/operationManager';
import type { BSTree } from '$lib/structures/bsTree';
import { StepType, type StepTypeValue } from '$lib/structures/dataStructure';
import type { RendererAPI } from './bstStepHandlers';
import * as Handlers from './bstStepHandlers';

/**
 * Orchestrator: sequences per-step animations using handlers and the renderer.
 * It is responsible for locking/unlocking the OperationManager while animations run,
 * restoring authoritative snapshots when required, and awaiting fit animations.
 */

export async function playOperation(renderer: RendererAPI, operationManager: OperationManager, opEvent: CurrentOperationChangedEvent) {
	operationManager.setLocked(true);
	try {
		// ensure the tree reflects the operation end state
		if (opEvent.currentOperation && opEvent.currentOperation.endSnapshot) {
			renderer.ensureTree(opEvent.currentOperation.endSnapshot as BSTree);
		}

		await renderer.animateFit();
	} finally {
		operationManager.setLocked(false);
	}
}

export async function playStep(renderer: RendererAPI, operationManager: OperationManager, stepEvent: CurrentStepChangedEvent) {
	operationManager.setLocked(true);
	console.log('playStep', stepEvent);
	try {
		renderer.clearDisconnectedDummyNodes();

		const currentStep = stepEvent.direction === 'backward' ? stepEvent.previousStep : stepEvent.currentStep;
		if (!currentStep) return;

		// restore start or end snapshot appropriate for the direction
		if (stepEvent.direction === 'forward' && currentStep.startSnapshot) {
			renderer.ensureTree(currentStep.startSnapshot as BSTree);
		} else if (stepEvent.direction === 'backward' && currentStep.endSnapshot) {
			renderer.ensureTree(currentStep.endSnapshot as BSTree);
		}

		// pick handler based on step type; call forward/backward variant
		const isForward = stepEvent.direction === 'forward' || stepEvent.direction === 'unknown';
		switch (currentStep.type as StepTypeValue) {
			case StepType.BSTree.Start:
				if (isForward) await Handlers.handleStartForward(renderer, operationManager);
				else await Handlers.handleStartBackward(renderer, operationManager);
				break;
			case StepType.BSTree.End:
				if (isForward) await Handlers.handleEndForward(renderer, operationManager);
				else await Handlers.handleEndBackward(renderer, operationManager);
				break;
			case StepType.BSTree.CreateRoot:
				if (isForward) await Handlers.handleCreateRootForward(renderer, currentStep.data as any);
				else await Handlers.handleCreateRootBackward(renderer, currentStep.data as any);
				break;
			case StepType.BSTree.CreateLeaf:
				if (isForward) await Handlers.handleCreateLeafForward(renderer, currentStep.data as any);
				else await Handlers.handleCreateLeafBackward(renderer, currentStep.data as any);
				break;
			case StepType.BSTree.Compare:
				if (isForward) await Handlers.handleCompareForward(renderer, currentStep.data as any);
				else await Handlers.handleCompareBackward(renderer, currentStep.data as any);
				break;
			case StepType.BSTree.Traverse:
				if (isForward) await Handlers.handleTraverseForward(renderer, currentStep.data as any);
				else await Handlers.handleTraverseBackward(renderer, currentStep.data as any);
				break;
			case StepType.BSTree.Drop:
				if (isForward) await Handlers.handleDropForward(renderer, currentStep.data as any);
				else await Handlers.handleDropBackward(renderer, currentStep.data as any);
				break;
			case StepType.BSTree.Found:
				if (isForward) await Handlers.handleFoundForward(renderer, currentStep.data as any);
				else await Handlers.handleFoundBackward(renderer, currentStep.data as any);
				break;
			case StepType.BSTree.MarkToDelete:
				if (isForward) await Handlers.handleMarkToDeleteForward(renderer, currentStep.data as any);
				else await Handlers.handleMarkToDeleteBackward(renderer, currentStep.data as any);
				break;
			case StepType.BSTree.Delete:
				if (isForward) await Handlers.handleDeleteForward(renderer, currentStep.data as any);
				else await Handlers.handleDeleteBackward(renderer, currentStep.data as any);
				break;
			case StepType.BSTree.ReplaceWithChild:
				if (isForward) await Handlers.handleReplaceWithChildForward(renderer, currentStep.data as any);
				else await Handlers.handleReplaceWithChildBackward(renderer, currentStep.data as any);
				break;
			case StepType.BSTree.FoundInorderSuccessor:
				if (isForward) await Handlers.handleFoundInorderSuccessorForward(renderer, currentStep.data as any);
				else await Handlers.handleFoundInorderSuccessorBackward(renderer, currentStep.data as any);
				break;
			case StepType.BSTree.RelinkSuccessorChild:
				if (isForward) await Handlers.handleRelinkSuccessorChildForward(renderer, currentStep.data as any);
				else await Handlers.handleRelinkSuccessorChildBackward(renderer, currentStep.data as any);
				break;
			case StepType.BSTree.ReplaceWithInorderSuccessor:
				if (isForward) await Handlers.handleReplaceWithInorderSuccessorForward(renderer, currentStep.data as any);
				else await Handlers.handleReplaceWithInorderSuccessorBackward(renderer, currentStep.data as any);
				break;
		}

		// after handler run, restore authoritative snapshot for the step end
		if (stepEvent.direction === 'forward' && stepEvent.currentStep?.endSnapshot) {
			renderer.ensureTree(stepEvent.currentStep.endSnapshot as BSTree);
		}
		if (stepEvent.direction === 'backward' && stepEvent.currentStep?.startSnapshot) {
			renderer.ensureTree(stepEvent.currentStep.startSnapshot as BSTree);
		}

		renderer.clearDisconnectedDummyNodes();
		// await renderer.animateFit();
	} finally {
		operationManager.setLocked(false);
	}
}

export default { playStep, playOperation };
