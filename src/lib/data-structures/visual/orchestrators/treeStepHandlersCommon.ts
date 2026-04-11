import type { OperationManager } from '$lib/data-structures/operations/operationManager';
import type { AVLTreeAnimator } from '$lib/data-structures/structures/avlTree/avlTreeAnimator';
import type { BSTreeAnimator } from '$lib/data-structures/structures/bsTree/bsTreeAnimator';
import type { BTreeAnimator } from '$lib/data-structures/structures/bTree/bTreeAnimator';
import { OperationType, type OperationTypeValue } from '$lib/data-structures/structures/dataStructure';
import type { HeapAnimator } from '$lib/data-structures/structures/heap/heapAnimator';
import type { LinkedListAnimator } from '$lib/data-structures/structures/linkedList/linkedListAnimator';
import type { QueueAnimator } from '$lib/data-structures/structures/queue/queueAnimator';
import type { RBTreeAnimator } from '$lib/data-structures/structures/rbTree/rbTreeAnimator';
import type { StackAnimator } from '$lib/data-structures/structures/stack/stackAnimator';
import type { DataStructureAnnotator } from '$lib/data-structures/visual/annotators/dataStructureAnnotator';
import { translate as t, type Locale } from '$lib/i18n';
import { Colors } from '$lib/utils/colors';

import type {
	CaseAnalysisData,
	CompareData,
	CreateLeafData,
	CreateRootData,
	DeleteData,
	DropData,
	FoundData,
	FoundInorderSuccessorData,
	MarkToDeleteData,
	RelinkSuccessorChildData,
	ReplaceWithChildData,
	ReplaceWithInorderSuccessorData,
	TraverseData,
} from '../../operations/stepData';

type CommonAnimator =
	| BSTreeAnimator
	| AVLTreeAnimator
	| RBTreeAnimator
	| BTreeAnimator
	| HeapAnimator
	| LinkedListAnimator
	| QueueAnimator
	| StackAnimator;
type TreeAnimator = BSTreeAnimator | AVLTreeAnimator | RBTreeAnimator | BTreeAnimator | HeapAnimator;

const operationTypeLabelMap: Record<OperationTypeValue, string> = {
	[OperationType.Empty]: 'controls.common.initial',
	[OperationType.Tree.Insert]: 'common.insert',
	[OperationType.Tree.Find]: 'common.find',
	[OperationType.Tree.Remove]: 'common.remove',
	[OperationType.Heap.Insert]: 'common.insert',
	[OperationType.Heap.ExtractRoot]: 'controls.heap.extractRoot',
	[OperationType.LinkedList.InsertHead]: 'controls.linkedList.insertHead',
	[OperationType.LinkedList.InsertTail]: 'controls.linkedList.insertTail',
	[OperationType.LinkedList.Find]: 'controls.linkedList.find',
	[OperationType.LinkedList.Remove]: 'controls.linkedList.remove',
	[OperationType.Stack.Push]: 'controls.stack.push',
	[OperationType.Stack.Pop]: 'controls.stack.pop',
	[OperationType.Stack.Peek]: 'controls.stack.peek',
	[OperationType.Queue.Enqueue]: 'controls.queue.enqueue',
	[OperationType.Queue.Dequeue]: 'controls.queue.dequeue',
	[OperationType.Queue.Peek]: 'controls.queue.peek',
};

function getOperationLabel(operationManager: OperationManager, locale: Locale): string {
	const operation = operationManager.getCurrentOperation();
	const base = operationTypeLabelMap[operation.type] ?? operation.type;
	const baseTranslated = t(locale, base);
	if (operation.value === null || operation.value === undefined) return baseTranslated;
	return `${baseTranslated} ${operation.value}`;
}

export async function handleStartForwardCommon(
	animator: CommonAnimator,
	annotator: DataStructureAnnotator,
	operationManager: OperationManager,
) {
	animator.resetFormatting();
	annotator.clearAnnotation();
	annotator.clearValueAnnotation();
	const startPositions = animator.getPositions();

	animator.ensure(operationManager.getCurrentOperation().startSnapshot);

	if (operationManager.getCurrentOperation().type === OperationType.Empty) {
		const info = t(annotator.locale, 'steps.dataStructures.common.startData');
		annotator.annotateNode(info, null);
		return;
	}

	const operationLabel = getOperationLabel(operationManager, annotator.locale);
	const info = t(annotator.locale, 'steps.dataStructures.common.startingOperationData', { operation: operationLabel });
	annotator.annotateNode(info, null);

	if (animator.hasNodes()) {
		const value = operationManager.getCurrentOperation().value;
		if (value !== null && value !== undefined) {
			annotator.createValueAnnotation(String(value), null);
		}
	}
	const endPositions = animator.getPositions();
	await animator.animateRelayout(startPositions, endPositions);
}

export async function handleStartBackwardCommon(
	animator: CommonAnimator,
	annotator: DataStructureAnnotator,
	operationManager: OperationManager,
) {
	if (operationManager.getCurrentOperation().type === OperationType.Empty) {
		const info = t(annotator.locale, 'steps.dataStructures.common.emptyData');
		annotator.annotateNode(info, null);
		return;
	}

	const operationLabel = getOperationLabel(operationManager, annotator.locale);
	const info = t(annotator.locale, 'steps.dataStructures.common.startingOperationData', { operation: operationLabel });
	annotator.annotateNode(info, null);
	annotator.removeValueAnnotation();
}

export async function handleEndForwardCommon(
	animator: CommonAnimator,
	annotator: DataStructureAnnotator,
	operationManager: OperationManager,
) {
	annotator.clearAnnotation();
	annotator.clearValueAnnotation();
	animator.resetFormatting();

	await animator.ensureAndAnimate(operationManager.getCurrentOperation().endSnapshot);
}

export async function handleEndBackwardCommon(
	animator: CommonAnimator,
	annotator: DataStructureAnnotator,
	operationManager: OperationManager,
) {
	annotator.clearAnnotation();
	annotator.clearValueAnnotation();
	animator.resetFormatting();

	await animator.ensureAndAnimate(operationManager.getCurrentOperation().endSnapshot);
}

export async function handleCreateRootForwardCommon(animator: TreeAnimator, annotator: DataStructureAnnotator, data: CreateRootData) {
	animator.ensure(data.endSnapshot);
	const info = t(annotator.locale, 'steps.dataStructures.common.createRootData', { value: String(data.value) });
	annotator.annotateNode(info, data.nodeId);

	await Promise.all([animator.animateNodeGrowth(data.nodeId), animator.animateLegsGrowth(data.nodeId)]);
}

export async function handleCreateRootBackwardCommon(animator: TreeAnimator, annotator: DataStructureAnnotator, data: CreateRootData) {
	const info = t(annotator.locale, 'steps.dataStructures.common.createRootData', { value: String(data.value) });
	annotator.annotateNode(info, data.nodeId);
	await Promise.all([animator.animateNodeShrink(data.nodeId), animator.animateLegsShrink(data.nodeId)]);
	await animator.ensureAndAnimate(data.startSnapshot);
}

export async function handleCreateLeafForwardCommon(animator: CommonAnimator, annotator: DataStructureAnnotator, data: CreateLeafData) {
	const direction = t(annotator.locale, data.direction);
	const info = t(annotator.locale, 'steps.dataStructures.common.createLeafData', {
		direction,
		value: String(data.value),
	});
	annotator.annotateNode(info, data.parentId);

	annotator.clearValueAnnotation();
	await animator.ensureAndAnimate(data.endSnapshot);
}

export async function handleCreateLeafBackwardCommon(animator: CommonAnimator, annotator: DataStructureAnnotator, data: CreateLeafData) {
	const direction = t(annotator.locale, data.direction);
	const info = t(annotator.locale, 'steps.dataStructures.common.createLeafData', {
		direction,
		value: String(data.value),
	});
	annotator.annotateNode(info, data.parentId);

	await animator.ensureAndAnimate(data.startSnapshot);
	annotator.createValueAnnotation(String(data.value), data.parentId);
}

export async function handleCompareForwardCommon(animator: CommonAnimator, annotator: DataStructureAnnotator, data: CompareData) {
	const info = t(annotator.locale, 'steps.dataStructures.common.compareData', {
		value: String(data.value),
		comparisonSymbol: data.comparisonSymbol,
		comparisonValue: String(data.comparisonValue),
	});
	annotator.annotateNode(info, data.comparisonId);
}

export async function handleCompareBackwardCommon(animator: CommonAnimator, annotator: DataStructureAnnotator, data: CompareData) {
	const info = t(annotator.locale, 'steps.dataStructures.common.compareData', {
		value: String(data.value),
		comparisonSymbol: data.comparisonSymbol,
		comparisonValue: String(data.comparisonValue),
	});
	annotator.annotateNode(info, data.comparisonId);
}

export async function handleTraverseForwardCommon(animator: CommonAnimator, annotator: DataStructureAnnotator, data: TraverseData) {
	const direction = t(annotator.locale, data.direction);
	const info = t(annotator.locale, 'steps.dataStructures.common.traverseData', { direction });
	annotator.annotateNode(info, data.fromId);
	await annotator.moveValueAnnotationTo(data.toId);
}

export async function handleTraverseBackwardCommon(animator: CommonAnimator, annotator: DataStructureAnnotator, data: TraverseData) {
	await annotator.moveValueAnnotationTo(data.fromId);
	const direction = t(annotator.locale, data.direction);
	const info = t(annotator.locale, 'steps.dataStructures.common.traverseData', { direction });
	annotator.annotateNode(info, data.fromId);
}

export async function handleDropForwardCommon(animator: CommonAnimator, annotator: DataStructureAnnotator, data: DropData) {
	const reason = t(annotator.locale, data.reason);
	const info = t(annotator.locale, 'steps.dataStructures.common.dropData', { value: String(data.value), reason, fromId: data.fromId });
	annotator.annotateNode(info, data.fromId);
	annotator.clearValueAnnotation();
}

export async function handleDropBackwardCommon(animator: CommonAnimator, annotator: DataStructureAnnotator, data: DropData) {
	const reason = t(annotator.locale, data.reason);
	const info = t(annotator.locale, 'steps.dataStructures.common.dropData', { value: String(data.value), reason, fromId: data.fromId });
	annotator.annotateNode(info, data.fromId);
	annotator.createValueAnnotation(String(data.value), data.fromId);
}

export function handleFoundForwardCommon(animator: CommonAnimator, annotator: DataStructureAnnotator, data: FoundData) {
	const info = t(annotator.locale, 'steps.dataStructures.common.foundData', { value: String(data.value) });
	annotator.annotateNode(info, data.nodeId);
	animator.setNodeColor(data.nodeId, Colors.Blue);
	annotator.clearValueAnnotation();
}

export function handleFoundBackwardCommon(animator: CommonAnimator, annotator: DataStructureAnnotator, data: FoundData) {
	const info = t(annotator.locale, 'steps.dataStructures.common.foundData', { value: String(data.value) });
	annotator.annotateNode(info, data.nodeId);
	animator.resetNodeColor(data.nodeId);
	annotator.createValueAnnotation(String(data.value), data.nodeId);
}

export function handleMarkToDeleteForwardCommon(animator: CommonAnimator, annotator: DataStructureAnnotator, data: MarkToDeleteData) {
	const info = t(annotator.locale, 'steps.dataStructures.common.markToDeleteData', { value: String(data.value) });
	annotator.annotateNode(info, data.nodeId);
	animator.setNodeColor(data.nodeId, Colors.Red);
	annotator.clearValueAnnotation();
}

export function handleMarkToDeleteBackwardCommon(animator: CommonAnimator, annotator: DataStructureAnnotator, data: MarkToDeleteData) {
	const info = t(annotator.locale, 'steps.dataStructures.common.markToDeleteData', { value: String(data.value) });
	annotator.annotateNode(info, data.nodeId);
	animator.resetNodeColor(data.nodeId);
	annotator.createValueAnnotation(String(data.value), data.nodeId);
}

export async function handleDeleteForwardCommon(animator: TreeAnimator, annotator: DataStructureAnnotator, data: DeleteData) {
	const info = t(annotator.locale, 'steps.dataStructures.common.deleteData', { value: String(data.value) });
	annotator.annotateNode(info, data.nodeId);
	await Promise.all([animator.animateNodeShrink(data.nodeId), animator.animateLegsShrink(data.nodeId)]);
	annotator.clearAnnotation();
	await animator.ensureAndAnimate(data.endSnapshot);
}

export async function handleDeleteBackwardCommon(animator: TreeAnimator, annotator: DataStructureAnnotator, data: DeleteData) {
	await animator.ensureAndAnimate(data.startSnapshot);
	const info = t(annotator.locale, 'steps.dataStructures.common.deleteData', { value: String(data.value) });
	annotator.annotateNode(info, data.nodeId);
	animator.setNodeColor(data.nodeId, Colors.Red);
	await Promise.all([animator.animateNodeGrowth(data.nodeId), animator.animateLegsGrowth(data.nodeId)]);
}

export async function handleReplaceWithChildForwardCommon(
	animator: CommonAnimator,
	annotator: DataStructureAnnotator,
	data: ReplaceWithChildData,
) {
	await animator.ensureAndAnimate(data.endSnapshot);
	const direction = t(annotator.locale, data.direction);
	const info = t(annotator.locale, 'steps.dataStructures.common.replaceWithChildData', { direction });
	annotator.annotateNode(info, data.newNodeId);
}

export async function handleReplaceWithChildBackwardCommon(
	animator: CommonAnimator,
	annotator: DataStructureAnnotator,
	data: ReplaceWithChildData,
) {
	await animator.ensureAndAnimate(data.startSnapshot);
	const direction = t(annotator.locale, data.direction);
	const info = t(annotator.locale, 'steps.dataStructures.common.replaceWithChildData', { direction });
	annotator.annotateNode(info, data.oldNodeId);

	animator.setNodeColor(data.oldNodeId, Colors.Red);
	animator.setNodeColor(data.newNodeId, Colors.Blue);
}

export async function handleFoundInorderSuccessorForwardCommon(
	animator: CommonAnimator,
	annotator: DataStructureAnnotator,
	data: FoundInorderSuccessorData,
) {
	const info = t(annotator.locale, 'steps.dataStructures.common.foundInorderSuccessorData');
	annotator.annotateNode(info, data.successorId);
	animator.setNodeColor(data.successorId, Colors.Blue);
}

export async function handleFoundInorderSuccessorBackwardCommon(
	animator: CommonAnimator,
	annotator: DataStructureAnnotator,
	data: FoundInorderSuccessorData,
) {
	const info = t(annotator.locale, 'steps.dataStructures.common.foundInorderSuccessorData');
	annotator.annotateNode(info, data.successorId);
	animator.resetNodeColor(data.successorId);
}

export async function handleRelinkSuccessorChildForwardCommon(
	animator: TreeAnimator,
	annotator: DataStructureAnnotator,
	data: RelinkSuccessorChildData,
) {
	const info = t(annotator.locale, 'steps.dataStructures.common.relinkSuccessorChildData');
	annotator.annotateNode(info, data.childNodeId);

	const oldPositions = animator.getPositions();

	animator.ensure(data.endSnapshot);

	animator.addNode(data.successorNodeId, data.successorValue);
	animator.setNodeColor(data.successorNodeId, Colors.Blue);

	const posAboveChild = animator.getPosition(data.childNodeId);
	posAboveChild.y -= 50;
	animator.snapNodeTo(data.successorNodeId, posAboveChild.x, posAboveChild.y);

	const newPositions = animator.getPositions();
	await animator.animateRelayout(oldPositions, newPositions);
}

export async function handleRelinkSuccessorChildBackwardCommon(
	animator: CommonAnimator,
	annotator: DataStructureAnnotator,
	data: RelinkSuccessorChildData,
) {
	const info = t(annotator.locale, 'steps.dataStructures.common.relinkSuccessorChildData');
	annotator.annotateNode(info, data.childNodeId);
	await animator.ensureAndAnimate(data.startSnapshot);
}

export async function handleReplaceWithInorderSuccessorForwardCommon(
	animator: CommonAnimator,
	annotator: DataStructureAnnotator,
	data: ReplaceWithInorderSuccessorData,
) {
	const info = t(annotator.locale, 'steps.dataStructures.common.replaceWithInorderSuccessorData');
	annotator.annotateNode(info, data.successorNodeId);
	animator.setNodeColor(data.successorNodeId, Colors.Blue);
	animator.setNodeColor(data.oldNodeId, Colors.Red);

	await animator.ensureAndAnimate(data.endSnapshot);
}

export async function handleReplaceWithInorderSuccessorBackwardCommon(
	animator: TreeAnimator,
	annotator: DataStructureAnnotator,
	data: ReplaceWithInorderSuccessorData,
) {
	let startPositions = animator.getPositions();
	animator.ensure(data.startSnapshot);
	animator.addNode(data.successorNodeId, data.successorValue);

	if (data.relinkedChildId !== null) {
		const posAboveChild = animator.getPosition(data.relinkedChildId);
		posAboveChild.y -= 50;
		animator.snapNodeTo(data.successorNodeId, posAboveChild.x, posAboveChild.y);
	}

	let endPositions = animator.getPositions();

	animator.animateRelayout(startPositions, endPositions);

	animator.setNodeColor(data.successorNodeId, Colors.Blue);
	animator.setNodeColor(data.oldNodeId, Colors.Red);

	const info = t(annotator.locale, 'steps.dataStructures.common.replaceWithInorderSuccessorData');
	annotator.annotateNode(info, data.successorNodeId);
}

export async function handleCaseAnalysisForwardCommon(animator: CommonAnimator, annotator: DataStructureAnnotator, data: CaseAnalysisData) {
	const description = t(annotator.locale, data.description);
	const info = t(annotator.locale, 'steps.dataStructures.common.caseAnalysisData', {
		caseNumber: String(data.caseNumber),
		description,
	});
	annotator.annotateNode(info, data.nodeId || null);
}

export async function handleCaseAnalysisBackwardCommon(
	animator: CommonAnimator,
	annotator: DataStructureAnnotator,
	data: CaseAnalysisData,
) {
	const description = t(annotator.locale, data.description);
	const info = t(annotator.locale, 'steps.dataStructures.common.caseAnalysisData', {
		caseNumber: String(data.caseNumber),
		description,
	});
	annotator.annotateNode(info, data.nodeId || null);
}
