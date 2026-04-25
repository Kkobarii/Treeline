import { StepData } from '$lib/data-structures/operations/operationData';
import type { OperationManager } from '$lib/data-structures/operations/operationManager';
import { StepType, type StepTypeValue } from '$lib/data-structures/structures/dataStructure';
import { DataStructureAnimator } from '$lib/data-structures/visual/animators/dataStructureAnimator';
import { DataStructureAnnotator } from '$lib/data-structures/visual/annotators/dataStructureAnnotator';
import { StepHandlerBase } from '$lib/data-structures/visual/orchestrators/stepHandlerBase';
import * as Common from '$lib/data-structures/visual/orchestrators/treeStepHandlersCommon';
import { translate as t } from '$lib/i18n';
import { Colors } from '$lib/utils/colors';

import { QueueAnimator } from './queueAnimator';
import type { DequeueData, EmptyData, EnqueueData, PeekData } from './queueSteps';

// Start / End handlers
async function handleStartForward(animator: QueueAnimator, annotator: DataStructureAnnotator, operationManager: OperationManager) {
	await Common.handleStartForwardCommon(animator, annotator, operationManager);
}

async function handleStartBackward(animator: QueueAnimator, annotator: DataStructureAnnotator, operationManager: OperationManager) {
	await Common.handleStartBackwardCommon(animator, annotator, operationManager);
}

async function handleEndForward(animator: QueueAnimator, annotator: DataStructureAnnotator, operationManager: OperationManager) {
	await Common.handleEndForwardCommon(animator, annotator, operationManager);
}

async function handleEndBackward(animator: QueueAnimator, annotator: DataStructureAnnotator, operationManager: OperationManager) {
	await Common.handleEndBackwardCommon(animator, annotator, operationManager);
}

// Enqueue handlers
async function handleEnqueueForward(animator: QueueAnimator, annotator: DataStructureAnnotator, data: EnqueueData) {
	const info = t(annotator.locale, data.label, data.params);
	annotator.annotateNode(info, data.rearId);
	await animator.ensureAndAnimate(data.endSnapshot);
}

async function handleEnqueueBackward(animator: QueueAnimator, annotator: DataStructureAnnotator, data: EnqueueData) {
	const info = t(annotator.locale, data.label, data.params);
	annotator.annotateNode(info, data.rearId);
	await animator.ensureAndAnimate(data.startSnapshot);
}

// Dequeue handlers
async function handleDequeueForward(animator: QueueAnimator, annotator: DataStructureAnnotator, data: DequeueData) {
	const info = t(annotator.locale, data.label, data.params);
	annotator.annotateNode(info, data.frontId);
	await animator.ensureAndAnimate(data.endSnapshot);
}

async function handleDequeueBackward(animator: QueueAnimator, annotator: DataStructureAnnotator, data: DequeueData) {
	await animator.ensureAndAnimate(data.startSnapshot);
	const info = t(annotator.locale, data.label, data.params);
	annotator.annotateNode(info, data.frontId);
}

// Peek handlers
async function handlePeekForward(animator: QueueAnimator, annotator: DataStructureAnnotator, data: PeekData) {
	const info = t(annotator.locale, data.label, data.params);
	annotator.annotateNode(info, data.nodeId);
	animator.setNodeColor(data.nodeId, Colors.Blue);
}

async function handlePeekBackward(animator: QueueAnimator, annotator: DataStructureAnnotator, data: PeekData) {
	const info = t(annotator.locale, data.label, data.params);
	annotator.annotateNode(info, data.nodeId);
	animator.resetNodeColor(data.nodeId);
}

// Empty handlers
async function handleEmptyForward(animator: QueueAnimator, annotator: DataStructureAnnotator, data: EmptyData) {
	const info = t(annotator.locale, data.label);
	annotator.annotateNode(info, null);
}

async function handleEmptyBackward(animator: QueueAnimator, annotator: DataStructureAnnotator, data: EmptyData) {
	const info = t(annotator.locale, data.label);
	annotator.annotateNode(info, null);
}

export class QueueStepHandler extends StepHandlerBase {
	async stepSetup(currentStep: StepData, baseAnimator: DataStructureAnimator, baseAnnotator: DataStructureAnnotator, isForward: boolean) {
		let animator = baseAnimator as QueueAnimator;
		if (isForward && currentStep.startSnapshot) {
			await animator.ensure(currentStep.startSnapshot);
		}
		if (!isForward && currentStep.endSnapshot) {
			await animator.ensure(currentStep.endSnapshot);
		}
	}

	async stepCleanup(
		currentStep: StepData,
		baseAnimator: DataStructureAnimator,
		baseAnnotator: DataStructureAnnotator,
		isForward: boolean,
	) {
		let animator = baseAnimator as QueueAnimator;
		if (isForward && currentStep.endSnapshot) {
			await animator.ensure(currentStep.endSnapshot);
		}
		if (!isForward && currentStep.startSnapshot) {
			await animator.ensure(currentStep.startSnapshot);
		}
	}

	async stepRoute(
		currentStep: StepData,
		baseAnimator: DataStructureAnimator,
		baseAnnotator: DataStructureAnnotator,
		operationManager: OperationManager,
		isForward: boolean = true,
	) {
		let animator = baseAnimator as QueueAnimator;
		let annotator = baseAnnotator as DataStructureAnnotator;

		switch (currentStep.type as StepTypeValue) {
			case StepType.Queue.Start:
				if (isForward) await handleStartForward(animator, annotator, operationManager);
				else await handleStartBackward(animator, annotator, operationManager);
				break;
			case StepType.Queue.End:
				if (isForward) await handleEndForward(animator, annotator, operationManager);
				else await handleEndBackward(animator, annotator, operationManager);
				break;
			case StepType.Queue.Enqueue:
				if (isForward) await handleEnqueueForward(animator, annotator, currentStep.data as any);
				else await handleEnqueueBackward(animator, annotator, currentStep.data as any);
				break;
			case StepType.Queue.Dequeue:
				if (isForward) await handleDequeueForward(animator, annotator, currentStep.data as any);
				else await handleDequeueBackward(animator, annotator, currentStep.data as any);
				break;
			case StepType.Queue.Peek:
				if (isForward) await handlePeekForward(animator, annotator, currentStep.data as any);
				else await handlePeekBackward(animator, annotator, currentStep.data as any);
				break;
			case StepType.Queue.Empty:
				if (isForward) await handleEmptyForward(animator, annotator, currentStep.data as any);
				else await handleEmptyBackward(animator, annotator, currentStep.data as any);
				break;
			default:
				console.warn('Unhandled Queue step type:', currentStep.type);
		}
		await new Promise(resolve => setTimeout(resolve, 50));
	}
}
