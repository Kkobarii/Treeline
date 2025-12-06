import type { StepData } from '$lib/data-structures/operation/operationData';
import type { OperationManager } from '$lib/data-structures/operation/operationManager';
import type { BSTreeAnimator } from '$lib/data-structures/structures/bsTree/bsTreeAnimator';
import { StepType, type StepTypeValue } from '$lib/data-structures/structures/dataStructure';
import type { DataStructureAnimator } from '$lib/data-structures/visual/animators/dataStructureAnimator';
import type { DataStructureAnnotator } from '$lib/data-structures/visual/annotators/dataStructureAnnotator';
import { StepHandlerBase } from '$lib/data-structures/visual/orchestrators/stepHandlerBase';
import * as Common from '$lib/data-structures/visual/orchestrators/treeStepHandlersCommon';

export class BSTreeStepHandler extends StepHandlerBase {
	async stepSetup(currentStep: StepData, baseAnimator: DataStructureAnimator, baseAnnotator: DataStructureAnnotator, isForward: boolean) {
		let animator = baseAnimator as BSTreeAnimator;
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
		let animator = baseAnimator as BSTreeAnimator;

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
		let animator = baseAnimator as BSTreeAnimator;
		let annotator = baseAnnotator as DataStructureAnnotator;

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
			case StepType.BSTree.Compare:
				if (isForward) await Common.handleCompareForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleCompareBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.BSTree.Traverse:
				if (isForward) await Common.handleTraverseForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleTraverseBackwardCommon(animator, annotator, currentStep.data as any);
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
			case StepType.BSTree.ReplaceWithChild:
				if (isForward) await Common.handleReplaceWithChildForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleReplaceWithChildBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.BSTree.FoundInorderSuccessor:
				if (isForward) await Common.handleFoundInorderSuccessorForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleFoundInorderSuccessorBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.BSTree.RelinkSuccessorChild:
				if (isForward) await Common.handleRelinkSuccessorChildForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleRelinkSuccessorChildBackwardCommon(animator, annotator, currentStep.data as any);
				break;
			case StepType.BSTree.ReplaceWithInorderSuccessor:
				if (isForward) await Common.handleReplaceWithInorderSuccessorForwardCommon(animator, annotator, currentStep.data as any);
				else await Common.handleReplaceWithInorderSuccessorBackwardCommon(animator, annotator, currentStep.data as any);
				break;
		}
	}
}
