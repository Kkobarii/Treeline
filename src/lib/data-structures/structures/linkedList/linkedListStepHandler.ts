import type { StepData } from '$lib/data-structures/operations/operationData';
import type { OperationManager } from '$lib/data-structures/operations/operationManager';
import { StepType, type StepTypeValue } from '$lib/data-structures/structures/dataStructure';
import type { LinkedListAnimator } from '$lib/data-structures/structures/linkedList/linkedListAnimator';
import type { DataStructureAnimator } from '$lib/data-structures/visual/animators/dataStructureAnimator';
import type { DataStructureAnnotator } from '$lib/data-structures/visual/annotators/dataStructureAnnotator';
import { StepHandlerBase } from '$lib/data-structures/visual/orchestrators/stepHandlerBase';
import * as Common from '$lib/data-structures/visual/orchestrators/treeStepHandlersCommon';
import { translate as t } from '$lib/i18n';
import { Colors } from '$lib/utils/colors';

import type {
	CompareData,
	CreateHeadData,
	EmptyListData,
	FoundData,
	InsertAtHeadData,
	InsertAtTailData,
	MarkToDeleteData,
	NotFoundData,
	RemoveHeadData,
	RemoveNodeData,
	TraverseNextData,
	TraverseToTailData,
} from './linkedListSteps';

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
async function handleCreateHeadForward(animator: LinkedListAnimator, annotator: DataStructureAnnotator, data: CreateHeadData) {
	annotator.clearValueAnnotation();
	await animator.ensureAndAnimate(data.endSnapshot);
	const info = t((annotator as any).locale, data.label, { value: String(data.value) });
	annotator.annotateNode(info, data.nodeId);
}

async function handleCreateHeadBackward(animator: LinkedListAnimator, annotator: DataStructureAnnotator, data: CreateHeadData) {
	await animator.ensureAndAnimate(data.startSnapshot);
	const info = t((annotator as any).locale, data.label, { value: String(data.value) });
	annotator.annotateNode(info, data.nodeId);
	annotator.createValueAnnotation(String(data.value), data.nodeId);
}

// InsertAtHead handlers
async function handleInsertAtHeadForward(animator: LinkedListAnimator, annotator: DataStructureAnnotator, data: InsertAtHeadData) {
	annotator.clearValueAnnotation();
	await animator.ensureAndAnimate(data.endSnapshot);
	const info = t((annotator as any).locale, data.label, { value: String(data.value) });
	annotator.annotateNode(info, data.nodeId);
}

async function handleInsertAtHeadBackward(animator: LinkedListAnimator, annotator: DataStructureAnnotator, data: InsertAtHeadData) {
	annotator.createValueAnnotation(String(data.value), data.headId);
	const info = t((annotator as any).locale, data.label, { value: String(data.value) });
	annotator.annotateNode(info, data.headId);
	await animator.ensureAndAnimate(data.startSnapshot);
}

// InsertAtTail handlers
async function handleInsertAtTailForward(animator: LinkedListAnimator, annotator: DataStructureAnnotator, data: InsertAtTailData) {
	annotator.clearValueAnnotation();
	await animator.ensureAndAnimate(data.endSnapshot);
	const info = t((annotator as any).locale, data.label, { value: String(data.value) });
	annotator.annotateNode(info, data.nodeId);
}

async function handleInsertAtTailBackward(animator: LinkedListAnimator, annotator: DataStructureAnnotator, data: InsertAtTailData) {
	annotator.createValueAnnotation(String(data.value), data.tailId);
	const info = t((annotator as any).locale, data.label, { value: String(data.value) });
	annotator.annotateNode(info, data.tailId);
	await animator.ensureAndAnimate(data.startSnapshot);
}

// Compare handlers
async function handleCompareForward(animator: LinkedListAnimator, annotator: DataStructureAnnotator, data: CompareData) {
	const info = t((annotator as any).locale, data.label, {
		searchValue: String(data.searchValue),
		currentValue: String(data.currentValue),
		position: String(data.position),
	});
	annotator.annotateNode(info, data.currentId);
}

async function handleCompareBackward(animator: LinkedListAnimator, annotator: DataStructureAnnotator, data: CompareData) {
	const info = t((annotator as any).locale, data.label, {
		searchValue: String(data.searchValue),
		currentValue: String(data.currentValue),
		position: String(data.position),
	});
	annotator.annotateNode(info, data.currentId);
}

// TraverseNext handlers
async function handleTraverseNextForward(animator: LinkedListAnimator, annotator: DataStructureAnnotator, data: TraverseNextData) {
	const info = t((annotator as any).locale, data.label, { value: String(data.toValue) });
	annotator.annotateNode(info, data.toId);
	annotator.moveValueAnnotationTo(data.toId);
}

async function handleTraverseNextBackward(animator: LinkedListAnimator, annotator: DataStructureAnnotator, data: TraverseNextData) {
	const info = t((annotator as any).locale, data.label, { value: String(data.toValue) });
	annotator.annotateNode(info, data.toId);
	annotator.moveValueAnnotationTo(data.fromId);
}

// TraverseToTail handlers
async function handleTraverseToTailForward(animator: LinkedListAnimator, annotator: DataStructureAnnotator, data: TraverseToTailData) {
	const info = t((annotator as any).locale, data.label);
	annotator.annotateNode(info, data.tailId);
	annotator.moveValueAnnotationTo(data.tailId);
}

async function handleTraverseToTailBackward(animator: LinkedListAnimator, annotator: DataStructureAnnotator, data: TraverseToTailData) {
	const info = t((annotator as any).locale, data.label);
	annotator.annotateNode(info, data.tailId);
	annotator.moveValueAnnotationTo(data.tailId);
}

// Found handlers
async function handleFoundForward(animator: LinkedListAnimator, annotator: DataStructureAnnotator, data: FoundData) {
	const info = t((annotator as any).locale, data.label, { value: String(data.value) });
	annotator.annotateNode(info, data.nodeId);
	annotator.clearValueAnnotation();
	animator.setNodeColor(data.nodeId, Colors.Blue);
}

async function handleFoundBackward(animator: LinkedListAnimator, annotator: DataStructureAnnotator, data: FoundData) {
	const info = t((annotator as any).locale, data.label, { value: String(data.value) });
	annotator.annotateNode(info, data.nodeId);
	annotator.createValueAnnotation(String(data.value), data.nodeId);
	animator.resetNodeColor(data.nodeId);
}

// NotFound handlers
async function handleNotFoundForward(animator: LinkedListAnimator, annotator: DataStructureAnnotator, data: NotFoundData) {
	const info = t((annotator as any).locale, data.label, { value: String(data.value) });
	annotator.annotateNode(info, null);
	annotator.clearValueAnnotation();
}

async function handleNotFoundBackward(animator: LinkedListAnimator, annotator: DataStructureAnnotator, data: NotFoundData) {
	const info = t((annotator as any).locale, data.label, { value: String(data.value) });
	annotator.annotateNode(info, null);
	annotator.createValueAnnotation(String(data.value), data.position);
}

// MarkToDelete handlers
async function handleMarkToDeleteForward(animator: LinkedListAnimator, annotator: DataStructureAnnotator, data: MarkToDeleteData) {
	const info = t((annotator as any).locale, data.label, { value: String(data.value) });
	annotator.annotateNode(info, data.nodeId);
	animator.setNodeColor(data.nodeId, Colors.Red);
}

async function handleMarkToDeleteBackward(animator: LinkedListAnimator, annotator: DataStructureAnnotator, data: MarkToDeleteData) {
	const info = t((annotator as any).locale, data.label, { value: String(data.value) });
	annotator.annotateNode(info, data.nodeId);
	animator.resetNodeColor(data.nodeId);
}

// RemoveHead handlers
async function handleRemoveHeadForward(animator: LinkedListAnimator, annotator: DataStructureAnnotator, data: RemoveHeadData) {
	annotator.clearAnnotation();
	annotator.clearValueAnnotation();
	await animator.animateNodeShrink(data.nodeId);
	await animator.ensureAndAnimate(data.endSnapshot);
}

async function handleRemoveHeadBackward(animator: LinkedListAnimator, annotator: DataStructureAnnotator, data: RemoveHeadData) {
	await animator.ensureAndAnimate(data.startSnapshot);
	const info = t((annotator as any).locale, data.label);
	annotator.annotateNode(info, data.nodeId);
	animator.setNodeColor(data.nodeId, Colors.Red);
	annotator.createValueAnnotation(String(data.value), data.nodeId);
}

// RemoveNode handlers
async function handleRemoveNodeForward(animator: LinkedListAnimator, annotator: DataStructureAnnotator, data: RemoveNodeData) {
	annotator.clearAnnotation();
	annotator.clearValueAnnotation();
	await animator.animateNodeShrink(data.nodeId);
	await animator.ensureAndAnimate(data.endSnapshot);
}

async function handleRemoveNodeBackward(animator: LinkedListAnimator, annotator: DataStructureAnnotator, data: RemoveNodeData) {
	await animator.ensureAndAnimate(data.startSnapshot);
	const info = t((annotator as any).locale, data.label, { value: String(data.value) });
	annotator.annotateNode(info, data.nodeId);
	animator.setNodeColor(data.nodeId, Colors.Red);
	annotator.createValueAnnotation(String(data.value), data.nodeId);
}

// EmptyList handlers
async function handleEmptyListForward(animator: LinkedListAnimator, annotator: DataStructureAnnotator, data: EmptyListData) {
	const info = t((annotator as any).locale, data.label);
	annotator.annotateNode(info, null);
}

async function handleEmptyListBackward(animator: LinkedListAnimator, annotator: DataStructureAnnotator, data: EmptyListData) {
	const info = t((annotator as any).locale, data.label);
	annotator.annotateNode(info, null);
}

export class LinkedListStepHandler extends StepHandlerBase {
	async stepSetup(currentStep: StepData, baseAnimator: DataStructureAnimator, baseAnnotator: DataStructureAnnotator, isForward: boolean) {
		let animator = baseAnimator as LinkedListAnimator;
		if (isForward && currentStep.startSnapshot) {
			animator.ensure(currentStep.startSnapshot);
		}
		if (!isForward && currentStep.endSnapshot) {
			animator.ensure(currentStep.endSnapshot);
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
			animator.ensure(currentStep.endSnapshot);
		}
		if (!isForward && currentStep.startSnapshot) {
			animator.ensure(currentStep.startSnapshot);
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
		await new Promise(resolve => setTimeout(resolve, 50));
	}
}
