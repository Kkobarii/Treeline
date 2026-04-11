import type { StepData } from '$lib/data-structures/operations/operationData';
import type { OperationManager } from '$lib/data-structures/operations/operationManager';
import type { BTreeAnimator } from '$lib/data-structures/structures/bTree/bTreeAnimator';
import { StepType, type StepTypeValue } from '$lib/data-structures/structures/dataStructure';
import { getBTreeNodeId } from '$lib/data-structures/utils/graphs';
import type { DataStructureAnimator } from '$lib/data-structures/visual/animators/dataStructureAnimator';
import type { DataStructureAnnotator } from '$lib/data-structures/visual/annotators/dataStructureAnnotator';
import { StepHandlerBase } from '$lib/data-structures/visual/orchestrators/stepHandlerBase';
import * as Common from '$lib/data-structures/visual/orchestrators/treeStepHandlersCommon';
import { translate as t } from '$lib/i18n';

import type {
	BorrowFromLeftData,
	BorrowFromRightData,
	ChooseBranchData,
	FindInorderReplacementData,
	InsertValueData,
	MarkOverfullData,
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
			case StepType.BTree.MarkOverfull:
				if (isForward) await this.handleMarkOverfullForward(animator, annotator, data);
				else await this.handleMarkOverfullBackward(animator, annotator, data);
				break;
			case StepType.BTree.Split:
				if (isForward) await this.handleSplitForward(animator, annotator, data);
				else await this.handleSplitBackward(animator, annotator, data);
				break;
			case StepType.BTree.PromoteMiddle:
				if (isForward) await this.handlePromoteMiddleForward(animator, annotator, data);
				else await this.handlePromoteMiddleBackward(animator, annotator, data);
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
			case StepType.BTree.BorrowFromLeft:
				if (isForward) await this.handleBorrowFromLeftForward(animator, annotator, data);
				else await this.handleBorrowFromLeftBackward(animator, annotator, data);
				break;
			case StepType.BTree.BorrowFromRight:
				if (isForward) await this.handleBorrowFromRightForward(animator, annotator, data);
				else await this.handleBorrowFromRightBackward(animator, annotator, data);
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
	}

	private translateStepData(data: any): any {
		if (!data) return data;
		if (typeof data !== 'object') return data;

		const result: any = Array.isArray(data) ? [] : {};
		for (const key in data) {
			if (key === 'nodeId' || key === 'id' || key.endsWith('Id') || key.endsWith('Id')) {
				result[key] = getBTreeNodeId(data[key]);
			} else if (typeof data[key] === 'object') {
				result[key] = this.translateStepData(data[key]);
			} else {
				result[key] = data[key];
			}
		}
		return result;
	}

	async handleMarkOverfullForward(animator: BTreeAnimator, annotator: DataStructureAnnotator, data: MarkOverfullData) {
		animator.setNodeColor(data.nodeId, '#FF4500');
		const info = t(annotator.locale, 'steps.dataStructures.bTree.markOverfullData', {
			currentCount: String(data.currentCount),
			maxCount: String(data.maxCount),
		});
		annotator.annotateNode(info, data.nodeId);
	}

	async handleMarkOverfullBackward(animator: BTreeAnimator, annotator: DataStructureAnnotator, data: MarkOverfullData) {
		animator.resetNodeColor(data.nodeId);
		annotator.clearAnnotation();
	}

	async handleSplitForward(animator: BTreeAnimator, annotator: DataStructureAnnotator, data: SplitData) {
		animator.ensure(data.endSnapshot);
		const info = t(annotator.locale, 'steps.dataStructures.bTree.splitData', { middleValue: String(data.middleValue) });
		annotator.annotateNode(info, data.nodeId);
	}

	async handleSplitBackward(animator: BTreeAnimator, annotator: DataStructureAnnotator, data: SplitData) {
		animator.ensure(data.startSnapshot);
		annotator.clearAnnotation();
	}

	async handlePromoteMiddleForward(animator: BTreeAnimator, annotator: DataStructureAnnotator, data: PromoteMiddleData) {
		animator.ensure(data.endSnapshot);
		const info = data.isNewRoot
			? t(annotator.locale, 'steps.dataStructures.bTree.promoteMiddleAsNewRootData', {
					middleValue: String(data.middleValue),
				})
			: t(annotator.locale, 'steps.dataStructures.bTree.promoteMiddleIntoParentData', {
					middleValue: String(data.middleValue),
				});
		annotator.annotateNode(info, data.targetNodeId);
	}

	async handlePromoteMiddleBackward(animator: BTreeAnimator, annotator: DataStructureAnnotator, data: PromoteMiddleData) {
		animator.ensure(data.startSnapshot);
		annotator.clearAnnotation();
	}

	async handleChooseBranchForward(animator: BTreeAnimator, annotator: DataStructureAnnotator, data: ChooseBranchData) {
		animator.setEdgeStyle(data.nodeId, data.childId, '#FF4500', 4);
		let info: string;
		if (data.lowerBound !== null && data.upperBound !== null) {
			info = t(annotator.locale, 'steps.dataStructures.bTree.chooseBranchBetweenData', {
				childIndexHumanReadable: String(data.childIndexHumanReadable),
				lowerBound: String(data.lowerBound),
				value: String(data.value),
				upperBound: String(data.upperBound),
			});
		} else if (data.lowerBound !== null) {
			info = t(annotator.locale, 'steps.dataStructures.bTree.chooseBranchGreaterThanData', {
				childIndexHumanReadable: String(data.childIndexHumanReadable),
				value: String(data.value),
				lowerBound: String(data.lowerBound),
			});
		} else if (data.upperBound !== null) {
			info = t(annotator.locale, 'steps.dataStructures.bTree.chooseBranchLessThanData', {
				childIndexHumanReadable: String(data.childIndexHumanReadable),
				value: String(data.value),
				upperBound: String(data.upperBound),
			});
		} else {
			info = t(annotator.locale, 'steps.dataStructures.bTree.chooseBranchData', {
				childIndexHumanReadable: String(data.childIndexHumanReadable),
			});
		}
		annotator.annotateNode(info, data.nodeId);
	}

	async handleChooseBranchBackward(animator: BTreeAnimator, annotator: DataStructureAnnotator, data: ChooseBranchData) {
		animator.resetEdgeStyle(data.nodeId, data.childId);
		annotator.clearAnnotation();
	}

	async handleInsertValueForward(animator: BTreeAnimator, annotator: DataStructureAnnotator, data: InsertValueData) {
		animator.ensure(data.endSnapshot);
		animator.setNodeColor(data.nodeId, '#90EE90');
		const info = t(annotator.locale, 'steps.dataStructures.bTree.insertValueData', { value: String(data.value) });
		annotator.annotateNode(info, data.nodeId);
	}

	async handleInsertValueBackward(animator: BTreeAnimator, annotator: DataStructureAnnotator, data: InsertValueData) {
		animator.ensure(data.startSnapshot);
		animator.resetNodeColor(data.nodeId);
		annotator.clearAnnotation();
	}

	async handleRemoveValueForward(animator: BTreeAnimator, annotator: DataStructureAnnotator, data: RemoveValueData) {
		animator.ensure(data.endSnapshot);
		animator.setNodeColor(data.nodeId, '#FFB6C1');
		const info = t(annotator.locale, 'steps.dataStructures.bTree.removeValueData', { value: String(data.value) });
		annotator.annotateNode(info, data.nodeId);
	}

	async handleRemoveValueBackward(animator: BTreeAnimator, annotator: DataStructureAnnotator, data: RemoveValueData) {
		animator.ensure(data.startSnapshot);
		animator.resetNodeColor(data.nodeId);
		annotator.clearAnnotation();
	}

	async handleReplaceValueForward(animator: BTreeAnimator, annotator: DataStructureAnnotator, data: ReplaceValueData) {
		animator.ensure(data.endSnapshot);
		animator.setNodeColor(data.nodeId, '#FFD700');
		const info = t(annotator.locale, 'steps.dataStructures.bTree.replaceValueData', {
			oldValue: String(data.oldValue),
			newValue: String(data.newValue),
			replacementSource: String(data.replacementSource),
		});
		annotator.annotateNode(info, data.nodeId);
	}

	async handleReplaceValueBackward(animator: BTreeAnimator, annotator: DataStructureAnnotator, data: ReplaceValueData) {
		animator.ensure(data.startSnapshot);
		animator.resetNodeColor(data.nodeId);
		annotator.clearAnnotation();
	}

	async handleBorrowFromLeftForward(animator: BTreeAnimator, annotator: DataStructureAnnotator, data: BorrowFromLeftData) {
		animator.ensure(data.endSnapshot);
		animator.setNodeColor(data.childId, '#87CEEB');
		animator.setNodeColor(data.siblingId, '#FFA07A');
		const info = t(annotator.locale, 'steps.dataStructures.bTree.borrowFromLeftData', {
			borrowedValue: String(data.borrowedValue),
		});
		annotator.annotateNode(info, data.childId);
	}

	async handleBorrowFromLeftBackward(animator: BTreeAnimator, annotator: DataStructureAnnotator, data: BorrowFromLeftData) {
		animator.ensure(data.startSnapshot);
		animator.resetNodeColor(data.childId);
		animator.resetNodeColor(data.siblingId);
		annotator.clearAnnotation();
	}

	async handleBorrowFromRightForward(animator: BTreeAnimator, annotator: DataStructureAnnotator, data: BorrowFromRightData) {
		animator.ensure(data.endSnapshot);
		animator.setNodeColor(data.childId, '#87CEEB');
		animator.setNodeColor(data.siblingId, '#FFA07A');
		const info = t(annotator.locale, 'steps.dataStructures.bTree.borrowFromRightData', {
			borrowedValue: String(data.borrowedValue),
		});
		annotator.annotateNode(info, data.childId);
	}

	async handleBorrowFromRightBackward(animator: BTreeAnimator, annotator: DataStructureAnnotator, data: BorrowFromRightData) {
		animator.ensure(data.startSnapshot);
		animator.resetNodeColor(data.childId);
		animator.resetNodeColor(data.siblingId);
		annotator.clearAnnotation();
	}

	async handleMergeChildrenForward(animator: BTreeAnimator, annotator: DataStructureAnnotator, data: MergeChildrenData) {
		animator.ensure(data.endSnapshot);
		animator.setNodeColor(data.leftChildId, '#DDA0DD');
		const info = t(annotator.locale, 'steps.dataStructures.bTree.mergeChildrenData', {
			parentValue: String(data.parentValue),
		});
		annotator.annotateNode(info, data.leftChildId);
	}

	async handleMergeChildrenBackward(animator: BTreeAnimator, annotator: DataStructureAnnotator, data: MergeChildrenData) {
		animator.ensure(data.startSnapshot);
		animator.resetNodeColor(data.leftChildId);
		annotator.clearAnnotation();
	}

	async handleFindInorderReplacementForward(
		animator: BTreeAnimator,
		annotator: DataStructureAnnotator,
		data: FindInorderReplacementData,
	) {
		animator.setNodeColor(data.childId, '#98FB98');
		const info =
			data.replacementType === 'predecessor'
				? t(annotator.locale, 'steps.dataStructures.bTree.findInorderReplacementPredecessorData', {
						replacementValue: String(data.replacementValue),
					})
				: t(annotator.locale, 'steps.dataStructures.bTree.findInorderReplacementSuccessorData', {
						replacementValue: String(data.replacementValue),
					});
		annotator.annotateNode(info, data.childId);
	}

	async handleFindInorderReplacementBackward(
		animator: BTreeAnimator,
		annotator: DataStructureAnnotator,
		data: FindInorderReplacementData,
	) {
		animator.resetNodeColor(data.childId);
		annotator.clearAnnotation();
	}
}
