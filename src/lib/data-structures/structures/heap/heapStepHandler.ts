import { Colors } from '$lib/assets/colors';
import type { StepData } from '$lib/data-structures/operation/operationData';
import type { OperationManager } from '$lib/data-structures/operation/operationManager';
import { Step } from '$lib/data-structures/operation/stepData';
import { StepType, type StepTypeValue } from '$lib/data-structures/structures/dataStructure';
import type { HeapAnimator } from '$lib/data-structures/structures/heap/heapAnimator';
import type { DataStructureAnimator } from '$lib/data-structures/visual/animators/dataStructureAnimator';
import type { DataStructureAnnotator } from '$lib/data-structures/visual/annotators/dataStructureAnnotator';
import { StepHandlerBase } from '$lib/data-structures/visual/orchestrators/stepHandlerBase';
import * as Common from '$lib/data-structures/visual/orchestrators/treeStepHandlersCommon';

async function handleSwapForward(animator: HeapAnimator, annotator: DataStructureAnnotator, data: Step.Heap.SwapData) {
	const info = `Swapped nodes`;
	annotator.annotateNode(info, data.fromId);
	animator.setNodeColor(data.toId, Colors.HeapAffectedNode);
	animator.setNodeColor(data.fromId, Colors.HeapCurrentNode);
	await animator.ensureAndAnimate(data.endSnapshot);
}

async function handleSwapBackward(animator: HeapAnimator, annotator: DataStructureAnnotator, data: Step.Heap.SwapData) {
	const info = `Swapped nodes`;
	annotator.annotateNode(info, data.fromId);
	animator.resetNodeColor(data.toId);
	await animator.ensureAndAnimate(data.startSnapshot);
}

async function handleFindLargestChildForward(
	animator: HeapAnimator,
	annotator: DataStructureAnnotator,
	data: Step.Heap.FindLargestChildData,
) {
	const info = data.largestChildId !== null ? `Found largest child` : `Node is in correct position`;
	annotator.annotateNode(info, data.parentId);

	animator.setNodeColor(data.largestChildId, Colors.HeapAffectedNode);
}

async function handleFindLargestChildBackward(
	animator: HeapAnimator,
	annotator: DataStructureAnnotator,
	data: Step.Heap.FindLargestChildData,
) {
	const info = data.largestChildId !== null ? `Found largest child` : `Node is in correct position`;
	annotator.annotateNode(info, data.parentId);

	animator.resetNodeColor(data.largestChildId);
}

async function handleAppendForward(animator: HeapAnimator, annotator: DataStructureAnnotator, data: Step.Heap.AppendData) {
	const info = `Append value ${data.value} to end of heap`;
	annotator.annotateNode(info, data.parentId);

	annotator.clearValueAnnotation();
	await animator.ensureAndAnimate(data.endSnapshot);

	animator.setNodeColor(data.nodeId, Colors.HeapCurrentNode);
}

async function handleAppendBackward(animator: HeapAnimator, annotator: DataStructureAnnotator, data: Step.Heap.AppendData) {
	const info = `Append value ${data.value} to end of heap`;
	annotator.annotateNode(info, data.parentId);
	animator.resetNodeColor(data.nodeId);

	await animator.ensureAndAnimate(data.startSnapshot);
	annotator.createValueAnnotation(String(data.value), data.parentId);
}

async function handleCompareWithChildrenForward(
	animator: HeapAnimator,
	annotator: DataStructureAnnotator,
	data: Step.Heap.CompareWithChildrenData,
) {
	const info = data.largestChildId !== null ? `Comparing node and children` : `Node is in correct position`;
	annotator.annotateNode(info, data.nodeId);
}

async function handleCompareWithChildrenBackward(
	animator: HeapAnimator,
	annotator: DataStructureAnnotator,
	data: Step.Heap.CompareWithChildrenData,
) {
	const info = data.largestChildId !== null ? `Comparing node and children` : `Node is in correct position`;
	annotator.annotateNode(info, data.nodeId);
}

async function handleCompareWithParentForward(
	animator: HeapAnimator,
	annotator: DataStructureAnnotator,
	data: Step.Heap.CompareWithParentData,
) {
	const info = data.needsSwap ? `Comparing with parent - needs swap` : `Comparing with parent - correct position`;
	annotator.annotateNode(info, data.nodeId);
}

async function handleCompareWithParentBackward(
	animator: HeapAnimator,
	annotator: DataStructureAnnotator,
	data: Step.Heap.CompareWithParentData,
) {
	const info = data.needsSwap ? `Comparing with parent - needs swap` : `Comparing with parent - correct position`;
	annotator.annotateNode(info, data.nodeId);
}

async function handleReplaceRootWithLastForward(
	animator: HeapAnimator,
	annotator: DataStructureAnnotator,
	data: Step.Heap.ReplaceRootWithLastData,
) {
	const info = `Replaced root ${data.rootValue} with last ${data.lastValue}`;
	annotator.annotateNode(info, data.rootId);
	animator.setNodeColor(data.lastId, Colors.HeapCurrentNode);
	animator.setNodeColor(data.rootId, Colors.Red);
	await animator.ensureAndAnimate(data.endSnapshot);
}

async function handleReplaceRootWithLastBackward(
	animator: HeapAnimator,
	annotator: DataStructureAnnotator,
	data: Step.Heap.ReplaceRootWithLastData,
) {
	const info = `Replaced root ${data.rootValue} with last ${data.lastValue}`;
	annotator.annotateNode(info, data.rootId);
	animator.resetNodeColor(data.lastId);
	animator.resetNodeColor(data.rootId);
	await animator.ensureAndAnimate(data.startSnapshot);
}

export class HeapStepHandler extends StepHandlerBase {
	async stepSetup(
		currentStep: StepData,
		baseAnimator: DataStructureAnimator,
		_baseAnnotator: DataStructureAnnotator,
		isForward: boolean,
	) {
		const animator = baseAnimator as HeapAnimator;

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
		_baseAnnotator: DataStructureAnnotator,
		isForward: boolean,
	) {
		const animator = baseAnimator as HeapAnimator;

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
		const animator = baseAnimator as HeapAnimator;
		const annotator = baseAnnotator as DataStructureAnnotator;

		switch (currentStep.type as StepTypeValue) {
			case StepType.BSTree.Start:
				if (isForward) await Common.handleStartForwardCommon(animator, annotator, operationManager);
				else await Common.handleStartBackwardCommon(animator, annotator, operationManager);
				break;
			case StepType.BSTree.End:
				if (isForward) await Common.handleEndForwardCommon(animator, annotator, operationManager);
				else await Common.handleEndBackwardCommon(animator, annotator, operationManager);
				break;
			case StepType.BSTree.CreateRoot:
				if (isForward) await Common.handleCreateRootForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleCreateRootBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.BSTree.CreateLeaf:
				if (isForward) await Common.handleCreateLeafForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleCreateLeafBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.Heap.Append:
				if (isForward) await handleAppendForward(animator, annotator, currentStep.data as Step.Heap.AppendData);
				else await handleAppendBackward(animator, annotator, currentStep.data as Step.Heap.AppendData);
				break;
			case StepType.Heap.CompareWithChildren:
				if (isForward)
					await handleCompareWithChildrenForward(animator, annotator, currentStep.data as Step.Heap.CompareWithChildrenData);
				else await handleCompareWithChildrenBackward(animator, annotator, currentStep.data as Step.Heap.CompareWithChildrenData);
				break;
			case StepType.Heap.CompareWithParent:
				if (isForward)
					await handleCompareWithParentForward(animator, annotator, currentStep.data as Step.Heap.CompareWithParentData);
				else await handleCompareWithParentBackward(animator, annotator, currentStep.data as Step.Heap.CompareWithParentData);
				break;
			case StepType.Heap.ReplaceRootWithLast:
				if (isForward)
					await handleReplaceRootWithLastForward(animator, annotator, currentStep.data as Step.Heap.ReplaceRootWithLastData);
				else await handleReplaceRootWithLastBackward(animator, annotator, currentStep.data as Step.Heap.ReplaceRootWithLastData);
				break;
			case StepType.BSTree.Compare:
				if (isForward) await Common.handleCompareForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleCompareBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.BSTree.Drop:
				if (isForward) await Common.handleDropForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleDropBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.BSTree.Found:
				if (isForward) await Common.handleFoundForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleFoundBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.BSTree.MarkToDelete:
				if (isForward) await Common.handleMarkToDeleteForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleMarkToDeleteBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.BSTree.Delete:
				if (isForward) await Common.handleDeleteForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleDeleteBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.BSTree.CaseAnalysis:
				if (isForward) await Common.handleCaseAnalysisForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleCaseAnalysisBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.Heap.FindLargestChild:
				if (isForward) await handleFindLargestChildForward(animator, annotator, currentStep.data as any);
				else await handleFindLargestChildBackward(animator, annotator, currentStep.data as any);
				break;
			case StepType.Heap.Swap:
				if (isForward) await handleSwapForward(animator, annotator, currentStep.data as any);
				else await handleSwapBackward(animator, annotator, currentStep.data as any);
				break;
			default:
				console.warn('Unhandled Heap step type:', currentStep.type);
		}
	}
}
