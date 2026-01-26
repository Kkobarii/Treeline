import { StepData } from '$lib/data-structures/operation/operationData';
import type { OperationManager } from '$lib/data-structures/operation/operationManager';
import { StepType, type StepTypeValue } from '$lib/data-structures/structures/dataStructure';
import { DataStructureAnimator } from '$lib/data-structures/visual/animators/dataStructureAnimator';
import { DataStructureAnnotator } from '$lib/data-structures/visual/annotators/dataStructureAnnotator';
import { StepHandlerBase } from '$lib/data-structures/visual/orchestrators/stepHandlerBase';
import * as Common from '$lib/data-structures/visual/orchestrators/treeStepHandlersCommon';

import { StackAnimator } from './stackAnimator';

// Start / End handlers
async function handleStartForward(animator: StackAnimator, annotator: DataStructureAnnotator, operationManager: OperationManager) {
	await Common.handleStartForwardCommon(animator, annotator, operationManager);
}

async function handleStartBackward(animator: StackAnimator, annotator: DataStructureAnnotator, operationManager: OperationManager) {
	await Common.handleStartBackwardCommon(animator, annotator, operationManager);
}

async function handleEndForward(animator: StackAnimator, annotator: DataStructureAnnotator, operationManager: OperationManager) {
	await Common.handleEndForwardCommon(animator, annotator, operationManager);
}

async function handleEndBackward(animator: StackAnimator, annotator: DataStructureAnnotator, operationManager: OperationManager) {
	await Common.handleEndBackwardCommon(animator, annotator, operationManager);
}

// Push handlers
async function handlePushForward(animator: StackAnimator, annotator: DataStructureAnnotator, data: any) {
	await animator.ensureAndAnimate(data.endSnapshot);
	annotator.annotateNode(`Pushed ${data.value} onto stack`, data.nodeId);
}

async function handlePushBackward(animator: StackAnimator, annotator: DataStructureAnnotator, data: any) {
	await animator.ensureAndAnimate(data.startSnapshot);
	annotator.annotateNode(`Pushed ${data.value} onto stack`, data.nodeId);
}

// Pop handlers
async function handlePopForward(animator: StackAnimator, annotator: DataStructureAnnotator, data: any) {
	await animator.ensureAndAnimate(data.endSnapshot);
	annotator.annotateNode(`Popped ${data.value} from stack`, null);
}

async function handlePopBackward(animator: StackAnimator, annotator: DataStructureAnnotator, data: any) {
	await animator.ensureAndAnimate(data.startSnapshot);
	annotator.annotateNode(`Popped ${data.value} from stack`, data.nodeId);
}

// Peek handlers
async function handlePeekForward(animator: StackAnimator, annotator: DataStructureAnnotator, data: any) {
	annotator.annotateNode(`Peeked value ${data.value}`, data.nodeId);
}

async function handlePeekBackward(animator: StackAnimator, annotator: DataStructureAnnotator, data: any) {
	annotator.annotateNode(`Peeked value ${data.value}`, data.nodeId);
}

// Empty handlers
async function handleEmptyForward(animator: StackAnimator, annotator: DataStructureAnnotator, data: any) {
	annotator.annotateNode(`Stack is empty`, null);
}

async function handleEmptyBackward(animator: StackAnimator, annotator: DataStructureAnnotator, data: any) {
	annotator.annotateNode(`Stack is empty`, null);
}

export class StackStepHandler extends StepHandlerBase {
	async stepSetup(currentStep: StepData, baseAnimator: DataStructureAnimator, baseAnnotator: DataStructureAnnotator, isForward: boolean) {
		let animator = baseAnimator as StackAnimator;

		if (isForward && currentStep.startSnapshot) {
			await animator.ensureAndAnimate(currentStep.startSnapshot);
		}
		if (!isForward && currentStep.endSnapshot) {
			await animator.ensureAndAnimate(currentStep.endSnapshot);
		}
	}

	async stepCleanup(
		currentStep: StepData,
		baseAnimator: DataStructureAnimator,
		baseAnnotator: DataStructureAnnotator,
		isForward: boolean,
	) {
		let animator = baseAnimator as StackAnimator;

		if (isForward && currentStep.endSnapshot) {
			await animator.ensureAndAnimate(currentStep.endSnapshot);
		}
		if (!isForward && currentStep.startSnapshot) {
			await animator.ensureAndAnimate(currentStep.startSnapshot);
		}
	}

	async stepRoute(
		currentStep: StepData,
		baseAnimator: DataStructureAnimator,
		baseAnnotator: DataStructureAnnotator,
		operationManager: OperationManager,
		isForward: boolean = true,
	) {
		let animator = baseAnimator as StackAnimator;
		let annotator = baseAnnotator as DataStructureAnnotator;

		switch (currentStep.type as StepTypeValue) {
			case StepType.Stack.Start:
				if (isForward) await handleStartForward(animator, annotator, operationManager);
				else await handleStartBackward(animator, annotator, operationManager);
				break;
			case StepType.Stack.End:
				if (isForward) await handleEndForward(animator, annotator, operationManager);
				else await handleEndBackward(animator, annotator, operationManager);
				break;
			case StepType.Stack.Push:
				if (isForward) await handlePushForward(animator, annotator, currentStep.data);
				else await handlePushBackward(animator, annotator, currentStep.data);
				break;
			case StepType.Stack.Pop:
				if (isForward) await handlePopForward(animator, annotator, currentStep.data);
				else await handlePopBackward(animator, annotator, currentStep.data);
				break;
			case StepType.Stack.Peek:
				if (isForward) await handlePeekForward(animator, annotator, currentStep.data);
				else await handlePeekBackward(animator, annotator, currentStep.data);
				break;
			case StepType.Stack.Empty:
				if (isForward) await handleEmptyForward(animator, annotator, currentStep.data);
				else await handleEmptyBackward(animator, annotator, currentStep.data);
				break;
			default:
				console.warn('Unhandled Stack step type:', currentStep.type);
		}
	}
}
