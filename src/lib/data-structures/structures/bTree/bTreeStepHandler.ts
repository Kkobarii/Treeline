import type { StepData } from '$lib/data-structures/operations/operationData';
import type { OperationManager } from '$lib/data-structures/operations/operationManager';
import type { BTreeAnimator } from '$lib/data-structures/structures/bTree/bTreeAnimator';
import { StepType, type StepTypeValue } from '$lib/data-structures/structures/dataStructure';
import type { DataStructureAnimator } from '$lib/data-structures/visual/animators/dataStructureAnimator';
import type { DataStructureAnnotator } from '$lib/data-structures/visual/annotators/dataStructureAnnotator';
import { StepHandlerBase } from '$lib/data-structures/visual/orchestrators/stepHandlerBase';
import * as Common from '$lib/data-structures/visual/orchestrators/treeStepHandlersCommon';
import { translate as t } from '$lib/i18n';
import { Colors } from '$lib/utils/colors';

import type { BTreeAnnotator } from './bTreeAnnotator';
import type {
	BorrowFromSiblingData,
	ChooseBranchData,
	CollapseRootData,
	FindInorderReplacementData,
	InsertValueData,
	MergeChildrenData,
	PromoteMiddleData,
	RemoveValueData,
	ReplaceValueData,
	SplitData,
} from './bTreeSteps';

export class BTreeStepHandler extends StepHandlerBase {
	async stepSetup(currentStep: StepData, baseAnimator: DataStructureAnimator, baseAnnotator: DataStructureAnnotator, isForward: boolean) {
		let animator = baseAnimator as BTreeAnimator;
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
		let animator = baseAnimator as BTreeAnimator;

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
		let animator = baseAnimator as BTreeAnimator;
		let annotator = baseAnnotator as BTreeAnnotator;
		let data = this.translateStepData(currentStep.data);

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
				if (isForward) await Common.handleCreateRootForwardCommon(animator, annotator, data);
				else await Common.handleCreateRootBackwardCommon(animator, annotator, data);
				break;
			case StepType.BTree.CreateLeaf:
				if (isForward) await Common.handleCreateLeafForwardCommon(animator, annotator, data);
				else await Common.handleCreateLeafBackwardCommon(animator, annotator, data);
				break;
			case StepType.BTree.Compare:
				if (isForward) await Common.handleCompareForwardCommon(animator, annotator, data);
				else await Common.handleCompareBackwardCommon(animator, annotator, data);
				break;
			case StepType.BTree.Traverse:
				if (isForward) await Common.handleTraverseForwardCommon(animator, annotator, data);
				else await Common.handleTraverseBackwardCommon(animator, annotator, data);
				break;
			case StepType.BTree.Drop:
				if (isForward) await Common.handleDropForwardCommon(animator, annotator, data);
				else await Common.handleDropBackwardCommon(animator, annotator, data);
				break;
			case StepType.BTree.Found:
				if (isForward) await Common.handleFoundForwardCommon(animator, annotator, data);
				else await Common.handleFoundBackwardCommon(animator, annotator, data);
				break;
			case StepType.BTree.MarkToDelete:
				if (isForward) await Common.handleMarkToDeleteForwardCommon(animator, annotator, data);
				else await Common.handleMarkToDeleteBackwardCommon(animator, annotator, data);
				break;
			case StepType.BTree.Delete:
				if (isForward) await Common.handleDeleteForwardCommon(animator, annotator, data);
				else await Common.handleDeleteBackwardCommon(animator, annotator, data);
				break;
			case StepType.BTree.ReplaceWithChild:
				if (isForward) await Common.handleReplaceWithChildForwardCommon(animator, annotator, data);
				else await Common.handleReplaceWithChildBackwardCommon(animator, annotator, data);
				break;
			case StepType.BTree.FoundInorderSuccessor:
				if (isForward) await Common.handleFoundInorderSuccessorForwardCommon(animator, annotator, data);
				else await Common.handleFoundInorderSuccessorBackwardCommon(animator, annotator, data);
				break;
			case StepType.BTree.RelinkSuccessorChild:
				if (isForward) await Common.handleRelinkSuccessorChildForwardCommon(animator, annotator, data);
				else await Common.handleRelinkSuccessorChildBackwardCommon(animator, annotator, data);
				break;
			case StepType.BTree.ReplaceWithInorderSuccessor:
				if (isForward) await Common.handleReplaceWithInorderSuccessorForwardCommon(animator, annotator, data);
				else await Common.handleReplaceWithInorderSuccessorBackwardCommon(animator, annotator, data);
				break;
			case StepType.BTree.CaseAnalysis:
				if (isForward) await Common.handleCaseAnalysisForwardCommon(animator, annotator, data);
				else await Common.handleCaseAnalysisBackwardCommon(animator, annotator, data);
				break;
			// BTree-specific steps
			case StepType.BTree.MarkOverfull:
			case StepType.BTree.MarkUnderfull:
				if (isForward) await this.handleMarkForward(animator, annotator, data);
				else await this.handleMarkBackward(animator, annotator, data);
				break;
			case StepType.BTree.Split:
				if (isForward) await this.handleSplitForward(animator, annotator, data);
				else await this.handleSplitBackward(animator, annotator, data);
				break;
			case StepType.BTree.PromoteMiddle:
				if (isForward) await this.handlePromoteMiddleForward(animator, annotator, data);
				else await this.handlePromoteMiddleBackward(animator, annotator, data);
				break;
			case StepType.BTree.CollapseRoot:
				if (isForward) await this.handleCollapseRootForward(animator, annotator, data);
				else await this.handleCollapseRootBackward(animator, annotator, data);
				break;
			case StepType.BTree.ChooseBranch:
				if (isForward) await this.handleChooseBranchForward(animator, annotator, data);
				else await this.handleChooseBranchBackward(animator, annotator, data);
				break;
			case StepType.BTree.InsertValue:
				if (isForward) await this.handleInsertValueForward(animator, annotator, data);
				else await this.handleInsertValueBackward(animator, annotator, data);
				break;
			case StepType.BTree.RemoveValue:
				if (isForward) await this.handleRemoveValueForward(animator, annotator, data);
				else await this.handleRemoveValueBackward(animator, annotator, data);
				break;
			case StepType.BTree.ReplaceValue:
				if (isForward) await this.handleReplaceValueForward(animator, annotator, data);
				else await this.handleReplaceValueBackward(animator, annotator, data);
				break;
			case StepType.BTree.BorrowFromSibling:
				if (isForward) await this.handleBorrowFromSiblingForward(animator, annotator, data);
				else await this.handleBorrowFromSiblingBackward(animator, annotator, data);
				break;
			case StepType.BTree.MergeChildren:
				if (isForward) await this.handleMergeChildrenForward(animator, annotator, data);
				else await this.handleMergeChildrenBackward(animator, annotator, data);
				break;
			case StepType.BTree.FindInorderReplacement:
				if (isForward) await this.handleFindInorderReplacementForward(animator, annotator, data);
				else await this.handleFindInorderReplacementBackward(animator, annotator, data);
				break;
			default:
				console.warn('Unhandled BTree step type:', currentStep.type);
		}
		await new Promise(resolve => setTimeout(resolve, 50)); // Small pause to ensure animations have time to start
	}

	private translateStepData(data: any): any {
		if (!data) return data;
		if (typeof data !== 'object') return data;

		const result: any = Array.isArray(data) ? [] : {};
		for (const key in data) {
			if (typeof data[key] === 'object') {
				result[key] = this.translateStepData(data[key]);
			} else {
				result[key] = data[key];
			}
		}
		return result;
	}

	async handleMarkForward(animator: BTreeAnimator, annotator: BTreeAnnotator, data: any) {
		animator.setNodeColor(data.nodeId, Colors.Red);
		const info = t(annotator.locale, data.label, data.params);
		annotator.annotateNode(info, data.nodeId);
	}

	async handleMarkBackward(animator: BTreeAnimator, annotator: BTreeAnnotator, data: any) {
		animator.resetNodeColor(data.nodeId);
		const info = t(annotator.locale, data.label, data.params);
		annotator.annotateNode(info, data.nodeId);
	}

	async handleSplitForward(animator: BTreeAnimator, annotator: BTreeAnnotator, data: SplitData) {
		const promise = animator.ensureAndAnimateSplit(data.endSnapshot, data.translationMap);
		const info = t(annotator.locale, data.label, data.params);
		annotator.annotateNode(info, data.nodeId);
		annotator.createTransplantedValueAnnotation(data.middleValue.toString(), [data.leftNodeId, data.rightNodeId]);

		await promise;
	}

	async handleSplitBackward(animator: BTreeAnimator, annotator: BTreeAnnotator, data: SplitData) {
		const reversedTranslationMap = data.translationMap.map(({ oldId, newId }) => ({ oldId: newId, newId: oldId }));
		const promise = animator.ensureAndAnimateMerge(data.startSnapshot, reversedTranslationMap);

		const info = t(annotator.locale, data.label, data.params);
		annotator.clearTransplantedValueAnnotation();

		await promise;
		annotator.annotateNode(info, data.nodeId);
		animator.setNodeColor(data.nodeId, Colors.Red);
	}

	async handlePromoteMiddleForward(animator: BTreeAnimator, annotator: BTreeAnnotator, data: PromoteMiddleData) {
		animator.ensure(data.endSnapshot);
		const info = t(annotator.locale, data.label, data.params);
		annotator.annotateNode(info, data.targetNodeId);
		await annotator.moveTransplantedValueAnnotationTo([data.targetNodeId]).then(() => annotator.clearTransplantedValueAnnotation());
	}

	async handlePromoteMiddleBackward(animator: BTreeAnimator, annotator: BTreeAnnotator, data: PromoteMiddleData) {
		animator.ensure(data.startSnapshot);
		const info = t(annotator.locale, data.label, data.params);
		annotator.annotateNode(info, data.targetNodeId);

		annotator.createTransplantedValueAnnotation(String(data.middleValue), [data.targetNodeId]);
		await annotator.moveTransplantedValueAnnotationTo([data.sourceLeftId, data.sourceRightId]);
	}

	async handleChooseBranchForward(animator: BTreeAnimator, annotator: BTreeAnnotator, data: ChooseBranchData) {
		animator.setEdgeStyle(data.nodeId, data.childId, Colors.Red, 4);
		const info = t(annotator.locale, data.label, data.params);
		annotator.annotateNode(info, data.nodeId);
		annotator.moveValueAnnotationTo(data.childId);
	}

	async handleCollapseRootForward(animator: BTreeAnimator, annotator: BTreeAnnotator, data: CollapseRootData) {
		animator.ensureAndAnimate(data.endSnapshot);
		const info = t(annotator.locale, data.label, data.params);
		annotator.annotateNode(info, data.newRootId);
	}

	async handleCollapseRootBackward(animator: BTreeAnimator, annotator: BTreeAnnotator, data: CollapseRootData) {
		animator.ensureAndAnimate(data.startSnapshot);
		const info = t(annotator.locale, data.label, data.params);
		annotator.annotateNode(info, data.oldRootId);
	}

	async handleChooseBranchBackward(animator: BTreeAnimator, annotator: BTreeAnnotator, data: ChooseBranchData) {
		animator.resetEdgeStyle(data.nodeId, data.childId);
		const info = t(annotator.locale, data.label, data.params);
		annotator.annotateNode(info, data.nodeId);
		annotator.moveValueAnnotationTo(data.nodeId);
	}

	async handleInsertValueForward(animator: BTreeAnimator, annotator: BTreeAnnotator, data: InsertValueData) {
		const info = t(annotator.locale, data.label, data.params);
		annotator.annotateNode(info, data.nodeId);
		annotator.clearValueAnnotation();
	}

	async handleInsertValueBackward(animator: BTreeAnimator, annotator: BTreeAnnotator, data: InsertValueData) {
		const info = t(annotator.locale, data.label, data.params);
		annotator.annotateNode(info, data.nodeId);
		annotator.createValueAnnotation(data.value.toString(), data.nodeId);
	}

	async handleRemoveValueForward(animator: BTreeAnimator, annotator: BTreeAnnotator, data: RemoveValueData) {
		animator.ensure(data.endSnapshot);
		const info = t(annotator.locale, data.label, data.params);
		annotator.annotateNode(info, data.nodeId);
	}

	async handleRemoveValueBackward(animator: BTreeAnimator, annotator: BTreeAnnotator, data: RemoveValueData) {
		animator.ensure(data.endSnapshot);
		const info = t(annotator.locale, data.label, data.params);
		annotator.annotateNode(info, data.nodeId);
	}

	async handleReplaceValueForward(animator: BTreeAnimator, annotator: BTreeAnnotator, data: ReplaceValueData) {
		animator.ensure(data.endSnapshot);
		animator.setNodeColor(data.nodeId, Colors.Yellow);
		const info = t(annotator.locale, data.label, data.params);
		annotator.annotateNode(info, data.nodeId);

		annotator.createTransplantedValueAnnotation(String(data.newValue), [data.sourceId]);
		await annotator.moveTransplantedValueAnnotationTo([data.nodeId]).then(() => annotator.clearTransplantedValueAnnotation());
	}

	async handleReplaceValueBackward(animator: BTreeAnimator, annotator: BTreeAnnotator, data: ReplaceValueData) {
		animator.ensure(data.startSnapshot);
		animator.resetNodeColor(data.nodeId);
		const info = t(annotator.locale, data.label, data.params);
		annotator.annotateNode(info, data.nodeId);

		annotator.createTransplantedValueAnnotation(String(data.oldValue), [data.nodeId]);
		await annotator.moveTransplantedValueAnnotationTo([data.sourceId]).then(() => annotator.clearTransplantedValueAnnotation());
	}

	async handleBorrowFromSiblingForward(animator: BTreeAnimator, annotator: BTreeAnnotator, data: BorrowFromSiblingData) {
		animator.ensure(data.endSnapshot);
		const info = t(annotator.locale, data.label, data.params);
		annotator.annotateNode(info, data.childId);

		annotator.createTransplantedValueAnnotation(String(data.borrowedValue), [data.siblingId]);
		await annotator
			.moveTransplantedValueAnnotationTo([data.parentId])
			.then(() => new Promise(resolve => setTimeout(resolve, 300)))
			.then(() => annotator.clearTransplantedValueAnnotation());

		annotator.createTransplantedValueAnnotation(String(data.parentValue), [data.parentId]);
		await annotator.moveTransplantedValueAnnotationTo([data.childId]).then(() => annotator.clearTransplantedValueAnnotation());
	}

	async handleBorrowFromSiblingBackward(animator: BTreeAnimator, annotator: BTreeAnnotator, data: BorrowFromSiblingData) {
		animator.ensure(data.startSnapshot);
		const info = t(annotator.locale, data.label, data.params);
		annotator.annotateNode(info, data.childId);

		annotator.createTransplantedValueAnnotation(String(data.parentValue), [data.childId]);
		await annotator
			.moveTransplantedValueAnnotationTo([data.parentId])
			.then(() => new Promise(resolve => setTimeout(resolve, 300)))
			.then(() => annotator.clearTransplantedValueAnnotation());

		annotator.createTransplantedValueAnnotation(String(data.borrowedValue), [data.parentId]);
		await annotator.moveTransplantedValueAnnotationTo([data.siblingId]).then(() => annotator.clearTransplantedValueAnnotation());
	}

	async handleMergeChildrenForward(animator: BTreeAnimator, annotator: BTreeAnnotator, data: MergeChildrenData) {
		const info = t(annotator.locale, data.label, data.params);

		await animator.ensureAndAnimateMergeFirstPart(data.endSnapshot, data.translationMap);
		annotator.annotateNode(info, data.originalParentId);
		annotator.currentAnnotation?.freeze();

		let valuePromise: Promise<void> = Promise.resolve();
		if (data.parentValue !== null) {
			annotator.createTransplantedValueAnnotation(String(data.parentValue), [data.originalParentId]);
			valuePromise = new Promise(resolve => setTimeout(resolve, 50))
				.then(() => annotator.moveTransplantedValueAnnotationTo([data.mergedNodeId]))
				.then(() => annotator.clearTransplantedValueAnnotation());
		}
		annotator.annotateNode(info, data.parentId);

		await Promise.all([animator.ensureAndAnimateMergeSecondPart(data.endSnapshot, data.translationMap), valuePromise]);
	}

	async handleMergeChildrenBackward(animator: BTreeAnimator, annotator: BTreeAnnotator, data: MergeChildrenData) {
		const info = t(annotator.locale, data.label, data.params);
		annotator.annotateNode(info, data.originalParentId);

		let valuePromise = Promise.resolve();
		if (data.parentValue !== null) {
			annotator.createTransplantedValueAnnotation(String(data.parentValue), [data.originalLeftChildId, data.originalRightChildId]);
			valuePromise = new Promise(resolve => setTimeout(resolve, 50))
				.then(() => annotator.moveTransplantedValueAnnotationTo([data.originalParentId]))
				.then(() => annotator.clearTransplantedValueAnnotation());
		}

		const reversedTranslationMap = data.translationMap.map(({ oldId, newId }) => ({ oldId: newId, newId: oldId }));

		await Promise.all([valuePromise, animator.ensureAndAnimateSplit(data.startSnapshot, reversedTranslationMap)]);
	}

	async handleFindInorderReplacementForward(animator: BTreeAnimator, annotator: BTreeAnnotator, data: FindInorderReplacementData) {
		animator.setNodeColor(data.childId, Colors.Yellow);
		const info = t(annotator.locale, data.label, data.params);
		annotator.annotateNode(info, data.childId);
	}

	async handleFindInorderReplacementBackward(animator: BTreeAnimator, annotator: BTreeAnnotator, data: FindInorderReplacementData) {
		animator.resetNodeColor(data.childId);
		annotator.clearAnnotation();
	}
}
