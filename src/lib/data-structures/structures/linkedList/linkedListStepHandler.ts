import type { StepData } from '$lib/data-structures/operation/operationData';
import type { OperationManager } from '$lib/data-structures/operation/operationManager';
import { StepType, type StepTypeValue } from '$lib/data-structures/structures/dataStructure';
import type { LinkedListAnimator } from '$lib/data-structures/structures/linkedList/linkedListAnimator';
import type { DataStructureAnimator } from '$lib/data-structures/visual/animators/dataStructureAnimator';
import type { DataStructureAnnotator } from '$lib/data-structures/visual/annotators/dataStructureAnnotator';
import { StepHandlerBase } from '$lib/data-structures/visual/orchestrators/stepHandlerBase';
import * as Common from '$lib/data-structures/visual/orchestrators/treeStepHandlersCommon';

// Start / End handlers
async function handleStartForward(animator: LinkedListAnimator, annotator: DataStructureAnnotator, operationManager: OperationManager) {
	await Common.handleStartForwardCommon(animator, annotator, operationManager);
}

async function handleStartBackward(animator: LinkedListAnimator, annotator: DataStructureAnnotator, operationManager: OperationManager) {
	await Common.handleStartBackwardCommon(animator, annotator, operationManager);
}

async function handleEndForward(animator: LinkedListAnimator, annotator: DataStructureAnnotator, operationManager: OperationManager) {
	await Common.handleEndForwardCommon(animator, annotator, operationManager);
}

async function handleEndBackward(animator: LinkedListAnimator, annotator: DataStructureAnnotator, operationManager: OperationManager) {
	await Common.handleEndBackwardCommon(animator, annotator, operationManager);
}

// CreateHead handlers
async function handleCreateHeadForward(animator: LinkedListAnimator, annotator: DataStructureAnnotator, data: any) {
	await animator.ensureAndAnimate(data.endSnapshot);
	annotator.annotateNode(`Created head node with value ${data.value}`, data.nodeId);
}

async function handleCreateHeadBackward(animator: LinkedListAnimator, annotator: DataStructureAnnotator, data: any) {
	await animator.ensureAndAnimate(data.startSnapshot);
	annotator.annotateNode(`Created head node with value ${data.value}`, data.nodeId);
}

// InsertAtHead handlers
async function handleInsertAtHeadForward(animator: LinkedListAnimator, annotator: DataStructureAnnotator, data: any) {
	await animator.ensureAndAnimate(data.endSnapshot);
	annotator.annotateNode(`Inserted ${data.value} at head`, data.nodeId);
}

async function handleInsertAtHeadBackward(animator: LinkedListAnimator, annotator: DataStructureAnnotator, data: any) {
	await animator.ensureAndAnimate(data.startSnapshot);
	annotator.annotateNode(`Inserted ${data.value} at head`, data.nodeId);
}

// InsertAtTail handlers
async function handleInsertAtTailForward(animator: LinkedListAnimator, annotator: DataStructureAnnotator, data: any) {
	await animator.ensureAndAnimate(data.endSnapshot);
	annotator.annotateNode(`Inserted ${data.value} at tail`, data.nodeId);
}

async function handleInsertAtTailBackward(animator: LinkedListAnimator, annotator: DataStructureAnnotator, data: any) {
	await animator.ensureAndAnimate(data.startSnapshot);
	annotator.annotateNode(`Inserted ${data.value} at tail`, data.nodeId);
}

// Compare handlers
async function handleCompareForward(animator: LinkedListAnimator, annotator: DataStructureAnnotator, data: any) {
	annotator.annotateNode(`Comparing ${data.searchValue} with node value ${data.currentValue}`, data.currentId);
}

async function handleCompareBackward(animator: LinkedListAnimator, annotator: DataStructureAnnotator, data: any) {
	annotator.annotateNode(`Comparing ${data.searchValue} with node value ${data.currentValue}`, data.currentId);
}

// TraverseNext handlers
async function handleTraverseNextForward(animator: LinkedListAnimator, annotator: DataStructureAnnotator, data: any) {
	annotator.annotateNode(`Traversing to next node`, data.toId);
}

async function handleTraverseNextBackward(animator: LinkedListAnimator, annotator: DataStructureAnnotator, data: any) {
	annotator.annotateNode(`Traversing to next node`, data.fromId);
}

// TraverseToTail handlers
async function handleTraverseToTailForward(animator: LinkedListAnimator, annotator: DataStructureAnnotator, data: any) {
	annotator.annotateNode(`Traversing to tail`, null);
}

async function handleTraverseToTailBackward(animator: LinkedListAnimator, annotator: DataStructureAnnotator, data: any) {
	annotator.annotateNode(`Traversing to tail`, null);
}

// Found handlers
async function handleFoundForward(animator: LinkedListAnimator, annotator: DataStructureAnnotator, data: any) {
	annotator.annotateNode(`Found ${data.value} at position ${data.position}`, data.nodeId);
}

async function handleFoundBackward(animator: LinkedListAnimator, annotator: DataStructureAnnotator, data: any) {
	annotator.annotateNode(`Found ${data.value} at position ${data.position}`, data.nodeId);
}

// NotFound handlers
async function handleNotFoundForward(animator: LinkedListAnimator, annotator: DataStructureAnnotator, data: any) {
	annotator.annotateNode(`Value ${data.value} not found`, null);
}

async function handleNotFoundBackward(animator: LinkedListAnimator, annotator: DataStructureAnnotator, data: any) {
	annotator.annotateNode(`Value ${data.value} not found`, null);
}

// MarkToDelete handlers
async function handleMarkToDeleteForward(animator: LinkedListAnimator, annotator: DataStructureAnnotator, data: any) {
	annotator.annotateNode(`Marking node ${data.value} for deletion`, data.nodeId);
}

async function handleMarkToDeleteBackward(animator: LinkedListAnimator, annotator: DataStructureAnnotator, data: any) {
	annotator.annotateNode(`Marking node ${data.value} for deletion`, data.nodeId);
}

// RemoveHead handlers
async function handleRemoveHeadForward(animator: LinkedListAnimator, annotator: DataStructureAnnotator, data: any) {
	await animator.ensureAndAnimate(data.endSnapshot);
	annotator.annotateNode(`Removed head node`, null);
}

async function handleRemoveHeadBackward(animator: LinkedListAnimator, annotator: DataStructureAnnotator, data: any) {
	await animator.ensureAndAnimate(data.startSnapshot);
	annotator.annotateNode(`Removed head node`, null);
}

// RemoveNode handlers
async function handleRemoveNodeForward(animator: LinkedListAnimator, annotator: DataStructureAnnotator, data: any) {
	await animator.ensureAndAnimate(data.endSnapshot);
	annotator.annotateNode(`Removed node`, null);
}

async function handleRemoveNodeBackward(animator: LinkedListAnimator, annotator: DataStructureAnnotator, data: any) {
	await animator.ensureAndAnimate(data.startSnapshot);
	annotator.annotateNode(`Removed node`, null);
}

// EmptyList handlers
async function handleEmptyListForward(animator: LinkedListAnimator, annotator: DataStructureAnnotator, data: any) {
	annotator.annotateNode(`List is empty`, null);
}

async function handleEmptyListBackward(animator: LinkedListAnimator, annotator: DataStructureAnnotator, data: any) {
	annotator.annotateNode(`List is empty`, null);
}

export class LinkedListStepHandler extends StepHandlerBase {
	async stepSetup(currentStep: StepData, baseAnimator: DataStructureAnimator, baseAnnotator: DataStructureAnnotator, isForward: boolean) {
		let animator = baseAnimator as LinkedListAnimator;

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
		let animator = baseAnimator as LinkedListAnimator;

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
		let animator = baseAnimator as LinkedListAnimator;
		let annotator = baseAnnotator as DataStructureAnnotator;

		switch (currentStep.type as StepTypeValue) {
			case StepType.LinkedList.Start:
				if (isForward) await handleStartForward(animator, annotator, operationManager);
				else await handleStartBackward(animator, annotator, operationManager);
				break;
			case StepType.LinkedList.End:
				if (isForward) await handleEndForward(animator, annotator, operationManager);
				else await handleEndBackward(animator, annotator, operationManager);
				break;
			case StepType.LinkedList.CreateHead:
				if (isForward) await handleCreateHeadForward(animator, annotator, currentStep.data as any);
				else await handleCreateHeadBackward(animator, annotator, currentStep.data as any);
				break;
			case StepType.LinkedList.InsertAtHead:
				if (isForward) await handleInsertAtHeadForward(animator, annotator, currentStep.data as any);
				else await handleInsertAtHeadBackward(animator, annotator, currentStep.data as any);
				break;
			case StepType.LinkedList.InsertAtTail:
				if (isForward) await handleInsertAtTailForward(animator, annotator, currentStep.data as any);
				else await handleInsertAtTailBackward(animator, annotator, currentStep.data as any);
				break;
			case StepType.LinkedList.Compare:
				if (isForward) await handleCompareForward(animator, annotator, currentStep.data as any);
				else await handleCompareBackward(animator, annotator, currentStep.data as any);
				break;
			case StepType.LinkedList.TraverseNext:
				if (isForward) await handleTraverseNextForward(animator, annotator, currentStep.data as any);
				else await handleTraverseNextBackward(animator, annotator, currentStep.data as any);
				break;
			case StepType.LinkedList.TraverseToTail:
				if (isForward) await handleTraverseToTailForward(animator, annotator, currentStep.data as any);
				else await handleTraverseToTailBackward(animator, annotator, currentStep.data as any);
				break;
			case StepType.LinkedList.Found:
				if (isForward) await handleFoundForward(animator, annotator, currentStep.data as any);
				else await handleFoundBackward(animator, annotator, currentStep.data as any);
				break;
			case StepType.LinkedList.NotFound:
				if (isForward) await handleNotFoundForward(animator, annotator, currentStep.data as any);
				else await handleNotFoundBackward(animator, annotator, currentStep.data as any);
				break;
			case StepType.LinkedList.MarkToDelete:
				if (isForward) await handleMarkToDeleteForward(animator, annotator, currentStep.data as any);
				else await handleMarkToDeleteBackward(animator, annotator, currentStep.data as any);
				break;
			case StepType.LinkedList.RemoveHead:
				if (isForward) await handleRemoveHeadForward(animator, annotator, currentStep.data as any);
				else await handleRemoveHeadBackward(animator, annotator, currentStep.data as any);
				break;
			case StepType.LinkedList.RemoveNode:
				if (isForward) await handleRemoveNodeForward(animator, annotator, currentStep.data as any);
				else await handleRemoveNodeBackward(animator, annotator, currentStep.data as any);
				break;
			case StepType.LinkedList.EmptyList:
				if (isForward) await handleEmptyListForward(animator, annotator, currentStep.data as any);
				else await handleEmptyListBackward(animator, annotator, currentStep.data as any);
				break;
			default:
				console.warn('Unhandled LinkedList step type:', currentStep.type);
		}
	}
}
