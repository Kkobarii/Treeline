import type { StepData } from '$lib/data-structures/operation/operationData';
import type { OperationManager } from '$lib/data-structures/operation/operationManager';
import type { BTreeAnimator } from '$lib/data-structures/structures/bTree/bTreeAnimator';
import { StepType, type StepTypeValue } from '$lib/data-structures/structures/dataStructure';
import type { DataStructureAnimator } from '$lib/data-structures/visual/animators/dataStructureAnimator';
import type { DataStructureAnnotator } from '$lib/data-structures/visual/annotators/dataStructureAnnotator';
import { StepHandlerBase } from '$lib/data-structures/visual/orchestrators/stepHandlerBase';
import * as Common from '$lib/data-structures/visual/orchestrators/treeStepHandlersCommon';

export class BTreeStepHandler extends StepHandlerBase {
	async stepSetup(currentStep: StepData, baseAnimator: DataStructureAnimator, baseAnnotator: DataStructureAnnotator, isForward: boolean) {
		let animator = baseAnimator as BTreeAnimator;
		if (isForward && currentStep.startSnapshot) {
			console.log('setup forward');
			animator.ensure(currentStep.startSnapshot);
		}
		if (!isForward && currentStep.endSnapshot) {
			console.log('setup backward');
			animator.ensure(currentStep.endSnapshot);
		}
	}

	async stepCleanup(
		currentStep: StepData,
		baseAnimator: DataStructureAnimator,
		baseAnnotator: DataStructureAnnotator,
		isForward: boolean,
	) {
		let animator = baseAnimator as BTreeAnimator;

		if (isForward && currentStep.endSnapshot) {
			console.log('cleanup forward');
			animator.ensure(currentStep.endSnapshot);
		}
		if (!isForward && currentStep.startSnapshot) {
			console.log('cleanup backward');
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
		let animator = baseAnimator as BTreeAnimator;
		let annotator = baseAnnotator as DataStructureAnnotator;

		switch (currentStep.type as StepTypeValue) {
			case StepType.BTree.Start:
				if (isForward) await Common.handleStartForwardCommon(animator, annotator, operationManager);
				else await Common.handleStartBackwardCommon(animator, annotator, operationManager);
				break;
			case StepType.BTree.End:
				if (isForward) await Common.handleEndForwardCommon(animator, annotator, operationManager);
				else await Common.handleEndBackwardCommon(animator, annotator, operationManager);
				break;
			case StepType.BTree.CreateRoot:
				if (isForward) await Common.handleCreateRootForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleCreateRootBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.BTree.CreateLeaf:
				if (isForward) await Common.handleCreateLeafForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleCreateLeafBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.BTree.Compare:
				if (isForward) await Common.handleCompareForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleCompareBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.BTree.Traverse:
				if (isForward) await Common.handleTraverseForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleTraverseBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.BTree.Drop:
				if (isForward) await Common.handleDropForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleDropBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.BTree.Found:
				if (isForward) await Common.handleFoundForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleFoundBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.BTree.MarkToDelete:
				if (isForward) await Common.handleMarkToDeleteForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleMarkToDeleteBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.BTree.Delete:
				if (isForward) await Common.handleDeleteForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleDeleteBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.BTree.ReplaceWithChild:
				if (isForward) await Common.handleReplaceWithChildForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleReplaceWithChildBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.BTree.FoundInorderSuccessor:
				if (isForward) await Common.handleFoundInorderSuccessorForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleFoundInorderSuccessorBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.BTree.RelinkSuccessorChild:
				if (isForward) await Common.handleRelinkSuccessorChildForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleRelinkSuccessorChildBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.BTree.ReplaceWithInorderSuccessor:
				if (isForward) await Common.handleReplaceWithInorderSuccessorForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleReplaceWithInorderSuccessorBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.BTree.CaseAnalysis:
				if (isForward) await Common.handleCaseAnalysisForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleCaseAnalysisBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.BTree.MarkOverfull:
				if (isForward) await this.handleMarkOverfullForward(animator, annotator, currentStep.data as any);
				else await this.handleMarkOverfullBackward(animator, annotator, currentStep.data as any);
				break;
			default:
				console.warn('Unhandled BTree step type:', currentStep.type);
		}
	}

	async handleMarkOverfullForward(animator: BTreeAnimator, annotator: DataStructureAnnotator, data: any) {
		const { nodeId } = data;
		// Color the overfull node red to highlight the constraint violation
		animator.setNodeColor(nodeId, '#FF4500');
		annotator.annotateNode(`Overfull: ${data.currentCount}/${data.maxCount}`, nodeId);
	}

	async handleMarkOverfullBackward(animator: BTreeAnimator, annotator: DataStructureAnnotator, data: any) {
		const { nodeId } = data;
		// Restore the original color
		animator.resetNodeColor(nodeId);
		annotator.clearAnnotation();
	}
}
