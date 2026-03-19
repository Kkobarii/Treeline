import { Colors } from '$lib/assets/colors';
import type { OperationManager } from '$lib/data-structures/operation/operationManager';
import type { AVLTreeAnimator } from '$lib/data-structures/structures/avlTree/avlTreeAnimator';
import type { BSTreeAnimator } from '$lib/data-structures/structures/bsTree/bsTreeAnimator';
import type { BTreeAnimator } from '$lib/data-structures/structures/bTree/bTreeAnimator';
import type { HeapAnimator } from '$lib/data-structures/structures/heap/heapAnimator';
import type { LinkedListAnimator } from '$lib/data-structures/structures/linkedList/linkedListAnimator';
import type { QueueAnimator } from '$lib/data-structures/structures/queue/queueAnimator';
import type { RBTreeAnimator } from '$lib/data-structures/structures/rbTree/rbTreeAnimator';
import type { StackAnimator } from '$lib/data-structures/structures/stack/stackAnimator';
import { comparisonValuesToSymbol } from '$lib/data-structures/utils/utils';
import type { DataStructureAnnotator } from '$lib/data-structures/visual/annotators/dataStructureAnnotator';

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
} from '../../operation/stepData';

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

	if (operationManager.getCurrentOperation().operation == 'Empty') {
		const info = `Start an operation to begin!`;
		annotator.annotateNode(info, null);
		return;
	}

	const info = `Starting ${operationManager.getCurrentOperation().operation.toString()} operation`;
	annotator.annotateNode(info, null);

	if (animator.hasNodes()) {
		const parts = operationManager.getCurrentOperation().operation.split(' ');
		const value = parts.length > 1 ? parts[1] : null;
		if (value !== null && value !== undefined && value !== '') {
			annotator.createValueAnnotation(value, null);
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
	if (operationManager.getCurrentOperation().operation == 'Empty') {
		const info = `The tree is empty`;
		annotator.annotateNode(info, null);
		return;
	}

	const info = `Starting ${operationManager.getCurrentOperation().operation.toString()} operation`;
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
	annotator.annotateNode(`Create root node with value ${data.value}`, data.nodeId);

	await Promise.all([animator.animateNodeGrowth(data.nodeId), animator.animateLegsGrowth(data.nodeId)]);
}

export async function handleCreateRootBackwardCommon(animator: TreeAnimator, annotator: DataStructureAnnotator, data: CreateRootData) {
	annotator.annotateNode(`Create root node with value ${data.value}`, data.nodeId);
	await Promise.all([animator.animateNodeShrink(data.nodeId), animator.animateLegsShrink(data.nodeId)]);
	await animator.ensureAndAnimate(data.startSnapshot);
}

export async function handleCreateLeafForwardCommon(animator: CommonAnimator, annotator: DataStructureAnnotator, data: CreateLeafData) {
	const info = `Create ${data.direction} child with value ${data.value}`;
	annotator.annotateNode(info, data.parentId);

	annotator.clearValueAnnotation();
	await animator.ensureAndAnimate(data.endSnapshot);
}

export async function handleCreateLeafBackwardCommon(animator: CommonAnimator, annotator: DataStructureAnnotator, data: CreateLeafData) {
	const info = `Create ${data.direction} child with value ${data.value}`;
	annotator.annotateNode(info, data.parentId);

	await animator.ensureAndAnimate(data.startSnapshot);
	annotator.createValueAnnotation(String(data.value), data.parentId);
}

export async function handleCompareForwardCommon(animator: CommonAnimator, annotator: DataStructureAnnotator, data: CompareData) {
	annotator.annotateNode(
		`${data.value} ${comparisonValuesToSymbol(data.value, data.comparisonValue)} ${data.comparisonValue}`,
		data.comparisonId,
	);
}

export async function handleCompareBackwardCommon(animator: CommonAnimator, annotator: DataStructureAnnotator, data: CompareData) {
	annotator.annotateNode(
		`${data.value} ${comparisonValuesToSymbol(data.value, data.comparisonValue)} ${data.comparisonValue}`,
		data.comparisonId,
	);
}

export async function handleTraverseForwardCommon(animator: CommonAnimator, annotator: DataStructureAnnotator, data: TraverseData) {
	annotator.annotateNode(`Traverse to ${data.direction} child`, data.fromId);
	await annotator.moveValueAnnotationTo(data.toId);
}

export async function handleTraverseBackwardCommon(animator: CommonAnimator, annotator: DataStructureAnnotator, data: TraverseData) {
	await annotator.moveValueAnnotationTo(data.fromId);
	annotator.annotateNode(`Traverse to ${data.direction} child`, data.fromId);
}

export async function handleDropForwardCommon(animator: CommonAnimator, annotator: DataStructureAnnotator, data: DropData) {
	annotator.annotateNode(`Drop value ${data.value}`, data.fromId);
	annotator.clearValueAnnotation();
}

export async function handleDropBackwardCommon(animator: CommonAnimator, annotator: DataStructureAnnotator, data: DropData) {
	annotator.annotateNode(`Drop value ${data.value}`, data.fromId);
	annotator.createValueAnnotation(String(data.value), data.fromId);
}

export function handleFoundForwardCommon(animator: CommonAnimator, annotator: DataStructureAnnotator, data: FoundData) {
	annotator.annotateNode(`Found node with value ${data.value}`, data.nodeId);
	animator.setNodeColor(data.nodeId, Colors.Green);
	annotator.clearValueAnnotation();
}

export function handleFoundBackwardCommon(animator: CommonAnimator, annotator: DataStructureAnnotator, data: FoundData) {
	annotator.annotateNode(`Found node with value ${data.value}`, data.nodeId);
	animator.resetNodeColor(data.nodeId);
	annotator.createValueAnnotation(String(data.value), data.nodeId);
}

export function handleMarkToDeleteForwardCommon(animator: CommonAnimator, annotator: DataStructureAnnotator, data: MarkToDeleteData) {
	annotator.annotateNode(`Mark node with value ${data.value} to delete`, data.nodeId);
	animator.setNodeColor(data.nodeId, Colors.Red);
	annotator.clearValueAnnotation();
}

export function handleMarkToDeleteBackwardCommon(animator: CommonAnimator, annotator: DataStructureAnnotator, data: MarkToDeleteData) {
	annotator.annotateNode(`Mark node with value ${data.value} to delete`, data.nodeId);
	animator.resetNodeColor(data.nodeId);
	annotator.createValueAnnotation(String(data.value), data.nodeId);
}

export async function handleDeleteForwardCommon(animator: TreeAnimator, annotator: DataStructureAnnotator, data: DeleteData) {
	annotator.annotateNode(`Delete node with value ${data.value}`, data.nodeId);
	await Promise.all([animator.animateNodeShrink(data.nodeId), animator.animateLegsShrink(data.nodeId)]);
	annotator.clearAnnotation();
	await animator.ensureAndAnimate(data.endSnapshot);
}

export async function handleDeleteBackwardCommon(animator: TreeAnimator, annotator: DataStructureAnnotator, data: DeleteData) {
	await animator.ensureAndAnimate(data.startSnapshot);
	annotator.annotateNode(`Delete node with value ${data.value}`, data.nodeId);
	animator.setNodeColor(data.nodeId, Colors.Red);
	await Promise.all([animator.animateNodeGrowth(data.nodeId), animator.animateLegsGrowth(data.nodeId)]);
}

export async function handleReplaceWithChildForwardCommon(
	animator: CommonAnimator,
	annotator: DataStructureAnnotator,
	data: ReplaceWithChildData,
) {
	await animator.ensureAndAnimate(data.endSnapshot);
	annotator.annotateNode(`Replace node with its ${data.direction} child`, data.newNodeId);
}

export async function handleReplaceWithChildBackwardCommon(
	animator: CommonAnimator,
	annotator: DataStructureAnnotator,
	data: ReplaceWithChildData,
) {
	await animator.ensureAndAnimate(data.startSnapshot);
	annotator.annotateNode(`Replace node with its ${data.direction} child`, data.oldNodeId);

	animator.setNodeColor(data.oldNodeId, Colors.Red);
	animator.setNodeColor(data.newNodeId, Colors.Blue);
}

export async function handleFoundInorderSuccessorForwardCommon(
	animator: CommonAnimator,
	annotator: DataStructureAnnotator,
	data: FoundInorderSuccessorData,
) {
	annotator.annotateNode(`Found inorder successor`, data.successorId);
	animator.setNodeColor(data.successorId, Colors.Blue);
}

export async function handleFoundInorderSuccessorBackwardCommon(
	animator: CommonAnimator,
	annotator: DataStructureAnnotator,
	data: FoundInorderSuccessorData,
) {
	annotator.annotateNode(`Found inorder successor`, data.successorId);
	animator.resetNodeColor(data.successorId);
}

export async function handleRelinkSuccessorChildForwardCommon(
	animator: TreeAnimator,
	annotator: DataStructureAnnotator,
	data: RelinkSuccessorChildData,
) {
	annotator.annotateNode(`Relink inorder successor's child`, data.childNodeId);

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
	annotator.annotateNode(`Relink inorder successor's child`, data.childNodeId);
	await animator.ensureAndAnimate(data.startSnapshot);
}

export async function handleReplaceWithInorderSuccessorForwardCommon(
	animator: CommonAnimator,
	annotator: DataStructureAnnotator,
	data: ReplaceWithInorderSuccessorData,
) {
	annotator.annotateNode(`Replace node with inorder successor`, data.successorNodeId);
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

	annotator.annotateNode(`Replace node with inorder successor`, data.successorNodeId);
}

export async function handleCaseAnalysisForwardCommon(animator: CommonAnimator, annotator: DataStructureAnnotator, data: CaseAnalysisData) {
	annotator.annotateNode(`Case ${data.caseNumber}: ${data.description}`, data.nodeId || null);
}

export async function handleCaseAnalysisBackwardCommon(
	animator: CommonAnimator,
	annotator: DataStructureAnnotator,
	data: CaseAnalysisData,
) {
	annotator.annotateNode(`Case ${data.caseNumber}: ${data.description}`, data.nodeId || null);
}
