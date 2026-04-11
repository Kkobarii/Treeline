import type { StepData } from '$lib/data-structures/operations/operationData';
import type { OperationManager } from '$lib/data-structures/operations/operationManager';
import { StepType, type StepTypeValue } from '$lib/data-structures/structures/dataStructure';
import type { HeapAnimator } from '$lib/data-structures/structures/heap/heapAnimator';
import type {
	AppendData,
	CompareWithChildrenData,
	CompareWithParentData,
	FindLargestChildData,
	ReplaceRootWithLastData,
	SwapData,
} from '$lib/data-structures/structures/heap/heapSteps';
import type { DataStructureAnimator } from '$lib/data-structures/visual/animators/dataStructureAnimator';
import type { DataStructureAnnotator } from '$lib/data-structures/visual/annotators/dataStructureAnnotator';
import { StepHandlerBase } from '$lib/data-structures/visual/orchestrators/stepHandlerBase';
import * as Common from '$lib/data-structures/visual/orchestrators/treeStepHandlersCommon';
import { translate as t } from '$lib/i18n';
import { Colors } from '$lib/utils/colors';

async function handleSwapForward(animator: HeapAnimator, annotator: DataStructureAnnotator, data: SwapData) {
	const info = t((annotator as any).locale, 'steps.dataStructures.heap.swapData', {
		fromValue: String(data.fromValue),
		toValue: String(data.toValue),
	});
	annotator.annotateNode(info, data.fromId);
	animator.setNodeColor(data.toId, Colors.HeapAffectedNode);
	animator.setNodeColor(data.fromId, Colors.HeapCurrentNode);
	await animator.ensureAndAnimate(data.endSnapshot);
}

async function handleSwapBackward(animator: HeapAnimator, annotator: DataStructureAnnotator, data: SwapData) {
	const info = t((annotator as any).locale, 'steps.dataStructures.heap.swapData', {
		fromValue: String(data.fromValue),
		toValue: String(data.toValue),
	});
	annotator.annotateNode(info, data.fromId);
	animator.resetNodeColor(data.toId);
	await animator.ensureAndAnimate(data.startSnapshot);
}

async function handleFindLargestChildForward(animator: HeapAnimator, annotator: DataStructureAnnotator, data: FindLargestChildData) {
	const info =
		data.largestChildId !== null
			? t((annotator as any).locale, 'steps.dataStructures.heap.findLargestChildData', {
					largestChildValue: String(data.largestChildValue),
				})
			: t((annotator as any).locale, 'steps.dataStructures.heap.findLargestChildNotFoundData');
	annotator.annotateNode(info, data.parentId);
	animator.setNodeColor(data.largestChildId, Colors.HeapAffectedNode);
}

async function handleFindLargestChildBackward(animator: HeapAnimator, annotator: DataStructureAnnotator, data: FindLargestChildData) {
	const info =
		data.largestChildId !== null
			? t((annotator as any).locale, 'steps.dataStructures.heap.findLargestChildData', {
					largestChildValue: String(data.largestChildValue),
				})
			: t((annotator as any).locale, 'steps.dataStructures.heap.findLargestChildNotFoundData');
	annotator.annotateNode(info, data.parentId);
	animator.resetNodeColor(data.largestChildId);
}

async function handleAppendForward(animator: HeapAnimator, annotator: DataStructureAnnotator, data: AppendData) {
	const info = t((annotator as any).locale, 'steps.dataStructures.heap.appendData', { value: String(data.value) });
	annotator.annotateNode(info, data.parentId);

	annotator.clearValueAnnotation();
	await animator.ensureAndAnimate(data.endSnapshot);

	animator.setNodeColor(data.nodeId, Colors.HeapCurrentNode);
}

async function handleAppendBackward(animator: HeapAnimator, annotator: DataStructureAnnotator, data: AppendData) {
	const info = t((annotator as any).locale, 'steps.dataStructures.heap.appendData', { value: String(data.value) });
	annotator.annotateNode(info, data.parentId);
	animator.resetNodeColor(data.nodeId);

	await animator.ensureAndAnimate(data.startSnapshot);
	annotator.createValueAnnotation(String(data.value), data.parentId);
}

async function handleCompareWithChildrenForward(animator: HeapAnimator, annotator: DataStructureAnnotator, data: CompareWithChildrenData) {
	const info =
		data.largestChildId !== null
			? t((annotator as any).locale, 'steps.dataStructures.heap.compareWithChildrenData')
			: t((annotator as any).locale, 'steps.dataStructures.heap.compareWithChildrenCorrectData');
	annotator.annotateNode(info, data.nodeId);
}

async function handleCompareWithChildrenBackward(animator: HeapAnimator, annotator: DataStructureAnnotator, data: CompareWithChildrenData) {
	const info =
		data.largestChildId !== null
			? t((annotator as any).locale, 'steps.dataStructures.heap.compareWithChildrenData')
			: t((annotator as any).locale, 'steps.dataStructures.heap.compareWithChildrenCorrectData');
	annotator.annotateNode(info, data.nodeId);
}

async function handleCompareWithParentForward(animator: HeapAnimator, annotator: DataStructureAnnotator, data: CompareWithParentData) {
	const info = data.needsSwap
		? t((annotator as any).locale, 'steps.dataStructures.heap.compareWithParentNeedsSwapData')
		: t((annotator as any).locale, 'steps.dataStructures.heap.compareWithParentCorrectData');
	annotator.annotateNode(info, data.nodeId);
}

async function handleCompareWithParentBackward(animator: HeapAnimator, annotator: DataStructureAnnotator, data: CompareWithParentData) {
	const info = data.needsSwap
		? t((annotator as any).locale, 'steps.dataStructures.heap.compareWithParentNeedsSwapData')
		: t((annotator as any).locale, 'steps.dataStructures.heap.compareWithParentCorrectData');
	annotator.annotateNode(info, data.nodeId);
}

async function handleReplaceRootWithLastForward(animator: HeapAnimator, annotator: DataStructureAnnotator, data: ReplaceRootWithLastData) {
	const info = t((annotator as any).locale, 'steps.dataStructures.heap.replaceRootWithLastData', {
		rootValue: String(data.rootValue),
		lastValue: String(data.lastValue),
	});
	annotator.annotateNode(info, data.rootId);
	animator.setNodeColor(data.lastId, Colors.HeapCurrentNode);
	animator.setNodeColor(data.rootId, Colors.Red);
	await animator.ensureAndAnimate(data.endSnapshot);
}

async function handleReplaceRootWithLastBackward(animator: HeapAnimator, annotator: DataStructureAnnotator, data: ReplaceRootWithLastData) {
	const info = t((annotator as any).locale, 'steps.dataStructures.heap.replaceRootWithLastData', {
		rootValue: String(data.rootValue),
		lastValue: String(data.lastValue),
	});
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
				if (isForward) await handleAppendForward(animator, annotator, currentStep.data as AppendData);
				else await handleAppendBackward(animator, annotator, currentStep.data as AppendData);
				break;
			case StepType.Heap.CompareWithChildren:
				if (isForward) await handleCompareWithChildrenForward(animator, annotator, currentStep.data as CompareWithChildrenData);
				else await handleCompareWithChildrenBackward(animator, annotator, currentStep.data as CompareWithChildrenData);
				break;
			case StepType.Heap.CompareWithParent:
				if (isForward) await handleCompareWithParentForward(animator, annotator, currentStep.data as CompareWithParentData);
				else await handleCompareWithParentBackward(animator, annotator, currentStep.data as CompareWithParentData);
				break;
			case StepType.Heap.ReplaceRootWithLast:
				if (isForward) await handleReplaceRootWithLastForward(animator, annotator, currentStep.data as ReplaceRootWithLastData);
				else await handleReplaceRootWithLastBackward(animator, annotator, currentStep.data as ReplaceRootWithLastData);
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
