<script lang="ts">
	import { BSTreeSteps, OperationData } from '$lib/operation/operationData';
	import {
		ChangeDirection,
		CurrentOperationChangedEvent,
		CurrentStepChangedEvent,
		EventType,
		type OperationManager,
	} from '$lib/operation/operationManager';
	import type { BSTree } from '$lib/structures/bsTree';
	import { bsTreetoGraph, getDummyNodeId } from '$lib/utils/graphs';
	import { lerp, relationTextToSymbol } from '$lib/utils/utils';
	import { onMount } from 'svelte';
	import { Network, type Edge, type Node, type Options, type Position } from 'vis-network';
	import { addAnimation, clearAnimations } from '$lib/animation/animator';
	import { DataSet } from 'vis-data';

	export let operationManager: OperationManager;

	let nodes: DataSet<Node>;
	let edges: DataSet<Edge>;

	let data;
	let options = {
		layout: {
			hierarchical: {
				direction: 'UD', // top to bottom
				sortMethod: 'directed',
				shakeTowards: 'roots',
				levelSeparation: 100,
			},
		},
		physics: false,
		interaction: {
			dragNodes: false,
		},
		nodes: {
			shape: 'box',
			color: '#9fd4ff',
			font: { color: 'black', size: 30 },
		},
	};
	let container: HTMLElement = document.getElementById('network')!;
	let network: Network;

	const infoNodeId = 'info-node';
	const infoNodeAboveOffset = 50;
	const movementDurationMs = 500;
	const infoNodeSize = 15;
	const infoNodeColor = '#aaaaaa';

	onMount(() => {
		({ nodes, edges } = bsTreetoGraph(null));
		nodes.add({
			id: infoNodeId,
			title: 'Info Node',
			label: 'Info',
			color: infoNodeColor,
			font: { color: 'black', size: infoNodeSize },
			hidden: true,
		});
		network = new Network(container, { nodes, edges }, options);

		network.on('selectNode', params => {
			if (params.nodes.length == 1) {
				const node = nodes.get(params.nodes[0]) as Node;
				console.log('Node selected:', node);
				let label = node.label!;
				operationManager.updateCurrentValue(parseInt(label));
			}
		});

		operationManager.addEventListener(EventType.CurrentOperationChanged, (e: Event) => {
			const event = e as CustomEvent<CurrentOperationChangedEvent>;
			console.log('CurrentOperationChanged event received:', event.detail.currentOperation);

			if (!operationManager.getShowSteps()) {
				handleOperationAnimation(event.detail);
			}
		});

		operationManager.addEventListener(EventType.CurrentStepChanged, (e: Event) => {
			const event = e as CustomEvent<CurrentStepChangedEvent>;
			console.log('CurrentStepChanged event received:', event.detail.currentStep);

			if (operationManager.getShowSteps()) {
				handleStepAnimation(event.detail);
			}
		});

		operationManager.addEventListener(EventType.ShowStepsToggled, () => {
			console.log('ShowStepsToggled event received');

			// Clear any ongoing animations
			clearAnimations();

			// Reset to current operation and step
			if (operationManager.getShowSteps()) {
				handleStepAnimation({
					currentStepId: operationManager.getCurrentStepIndex(),
					currentStep: operationManager.getCurrentStep(),
					direction: ChangeDirection.Forward,
				});
			} else {
				handleOperationAnimation({
					currentOperationId: operationManager.getCurrentOperationIndex(),
					currentOperation: operationManager.getCurrentOperation(),
					direction: ChangeDirection.Forward,
				});
			}
		});
	});

	function snapNodeTo(nodeId: string | number, x: number, y: number) {
		network.moveNode(nodeId, x, y);
	}

	function snapNodeAbove(nodeId: string | number, aboveId: string | number, howMuch = infoNodeAboveOffset) {
		const position = network.getPosition(aboveId);
		snapNodeTo(nodeId, position.x, position.y - howMuch);
	}

	function getPositionAbove(aboveId: string | number, howMuch = infoNodeAboveOffset): Position {
		const position = network.getPosition(aboveId);
		return { x: position.x, y: position.y - howMuch };
	}

	export function animateNodeMovement(nodeId: string | number, from: Position, to: Position, durationMs: number = movementDurationMs) {
		return new Promise<void>(resolve => {
			// Ensure node exists
			if (!nodes.get(nodeId)) {
				resolve();
				console.warn(`animateNodeMovement: Node ${nodeId} does not exist.`);
				return;
			}

			// start at from position
			network.moveNode(nodeId, from.x, from.y);

			const cancel = addAnimation((dt, elapsed) => {
				const t = Math.min(1, elapsed / durationMs);
				const x = lerp(from.x, to.x, t);
				const y = lerp(from.y, to.y, t);

				network.moveNode(nodeId, x, y);

				if (t >= 1) {
					cancel();
					resolve();
					return false;
				}
				return true;
			});
		});
	}

	function animateNodeGrowth(
		nodeId: string | number,
		targetSize: number = options.nodes.font.size,
		durationMs: number = movementDurationMs,
	) {
		return new Promise<void>(resolve => {
			if (!nodes.get(nodeId)) {
				resolve();
				console.warn(`animateNodeGrowth: Node ${nodeId} does not exist.`);
				return;
			}

			const initialScale = 0.1;
			const targetScale = 1.0;

			const cancel = addAnimation((dt, elapsed) => {
				const t = Math.min(1, elapsed / durationMs);
				const scale = lerp(initialScale, targetScale, t);

				nodes.update({
					id: nodeId,
					font: { size: targetSize * scale },
				});

				if (t >= 1) {
					cancel();
					resolve();
					return false;
				}
				return true;
			});
		});
	}

	function animateNodeShrink(
		nodeId: string | number,
		initialSize: number = options.nodes.font.size,
		durationMs: number = movementDurationMs,
	) {
		return new Promise<void>(resolve => {
			if (!nodes.get(nodeId)) {
				resolve();
				console.warn(`animateNodeShrink: Node ${nodeId} does not exist.`);
				return;
			}

			const initialScale = 1.0;
			const targetScale = 0.1;

			const cancel = addAnimation((dt, elapsed) => {
				const t = Math.min(1, elapsed / durationMs);
				const scale = lerp(initialScale, targetScale, t);

				nodes.update({
					id: nodeId,
					font: { size: initialSize * scale },
					opacity: Math.min(1, scale + 0.1),
				});

				if (t >= 1) {
					cancel();
					resolve();
					return false;
				}
				return true;
			});
		});
	}

	async function animateLegsGrowth(nodeId: string | number, durationMs: number = movementDurationMs) {
		let leftDummyId = getDummyNodeId(Number(nodeId), 'left');
		let rightDummyId = getDummyNodeId(Number(nodeId), 'right');

		let initialPos = network.getPosition(nodeId);
		let leftFinalPos = network.getPosition(leftDummyId);
		let rightFinalPos = network.getPosition(rightDummyId);

		snapNodeTo(leftDummyId, initialPos.x - infoNodeAboveOffset, initialPos.y);
		snapNodeTo(rightDummyId, initialPos.x + infoNodeAboveOffset, initialPos.y);

		animateNodeMovement(leftDummyId, initialPos, leftFinalPos, durationMs);
		animateNodeMovement(rightDummyId, initialPos, rightFinalPos, durationMs);
	}

	async function animateLegsShrink(nodeId: string | number, durationMs: number = movementDurationMs) {
		let leftDummyId = getDummyNodeId(Number(nodeId), 'left');
		let rightDummyId = getDummyNodeId(Number(nodeId), 'right');

		let finalPos = network.getPosition(nodeId);

		if (nodes.get(leftDummyId) != null) {
			let initialPosLeft = network.getPosition(leftDummyId);
			animateNodeMovement(leftDummyId, initialPosLeft, finalPos, durationMs);
		}

		if (nodes.get(rightDummyId) != null) {
			let initialPosRight = network.getPosition(rightDummyId);
			animateNodeMovement(rightDummyId, initialPosRight, finalPos, durationMs);
		}
	}

	function animateAddingNode(nodeId: number) {
		animateNodeGrowth(nodeId);
		animateLegsGrowth(nodeId);
	}

	function animateRemovingNode(nodeId: number) {
		animateLegsShrink(nodeId);
		animateNodeShrink(nodeId);
	}

	function animateAnnotateNode(annotation: string, nodeId?: string | number) {
		console.log('Animating annotate node:', annotation, 'above node:', nodeId);
		nodes.update({
			id: infoNodeId,
			label: annotation,
			hidden: false,
			color: infoNodeColor,
			font: { color: 'black', size: infoNodeSize },
		});

		if (nodeId === undefined) {
			snapNodeTo(infoNodeId, 0, 0);
		} else {
			snapNodeAbove(infoNodeId, nodeId, infoNodeAboveOffset);
		}
	}

	function handleOperationAnimation(operation: CurrentOperationChangedEvent) {
		console.log('Handling operation animation:', operation);

		updateGraph(operation.currentOperation.endSnapshot as BSTree);
	}

	function handleStartStep() {
		console.log('Animating start step');

		let snapshot = operationManager.getCurrentOperation().startSnapshot as BSTree;
		updateGraph(snapshot);

		// put operation name into info node, position above root and grow it
		animateAnnotateNode(`${operationManager.getCurrentOperation().operation.toString()}`, snapshot.root?.id);
		animateNodeGrowth(infoNodeId, infoNodeSize);
	}

	function handleEndStep() {
		console.log('Animating end step');

		// hide info node
		nodes.update({
			id: infoNodeId,
			hidden: true,
		});

		let snapshot = operationManager.getCurrentOperation().endSnapshot as BSTree;
		updateGraph(snapshot);
	}

	function handleCreateRootStep(data: BSTreeSteps.CreateRootData) {
		console.log('Animating create root step:', data);

		addNode(data.nodeId, data.value);
		animateAddingNode(data.nodeId);

		// say what we're doing in info node
		animateAnnotateNode(`Create root node with value ${data.value}`, data.nodeId);
	}

	function handleCreateLeafStep(data: BSTreeSteps.CreateLeafData) {
		console.log('Animating create leaf step:', data);

		addNode(data.nodeId, data.value, data.parentId, data.direction);
		animateAddingNode(data.nodeId);

		// say what we're doing in info node
		animateAnnotateNode(`Create ${data.direction} child with value ${data.value}`, data.nodeId);
		animateNodeMovement(infoNodeId, getPositionAbove(data.parentId), getPositionAbove(data.nodeId));
	}

	function handleCompareStep(data: BSTreeSteps.CompareData, direction: ChangeDirection) {
		console.log('Animating compare step:', data, direction);

		let relationSymbol = relationTextToSymbol(data.result);
		animateAnnotateNode(`Compare ${data.value} ${relationSymbol} ${data.comparisonValue}`, data.comparisonId);
	}

	function handleTraverseStep(data: BSTreeSteps.TraverseData, direction: ChangeDirection) {
		console.log('Animating traverse step:', data, direction);

		animateAnnotateNode(`Traverse to ${data.direction} child`, data.fromId);

		let positionFrom = getPositionAbove(data.fromId);
		let positionTo;
		if (data.toId == -1) {
			positionTo = getPositionAbove(getDummyNodeId(data.fromId, data.direction));
		} else {
			positionTo = getPositionAbove(data.toId);
		}

		if (direction == ChangeDirection.Forward) {
			// animate movement from current position to target
			animateNodeMovement(infoNodeId, positionFrom, positionTo);
		} else {
			// just snap back to fromId
			if (data.toId == -1) {
				snapNodeAbove(infoNodeId, getDummyNodeId(data.fromId, data.direction));
			} else {
				snapNodeAbove(infoNodeId, data.toId);
			}
		}
	}

	function handleDropStep(data: BSTreeSteps.DropData) {
		console.log('Animating drop value step:', data);

		animateAnnotateNode(`Drop value ${data.value}`, data.fromId);

		// move info node downwards to indicate dropping
		let positionFrom = getPositionAbove(data.fromId);
		let positionTo = { x: positionFrom.x, y: positionFrom.y + 400 };

		animateNodeMovement(infoNodeId, positionFrom, positionTo);
	}

	function handleFoundStep(data: BSTreeSteps.FoundData) {
		console.log('Animating found step:', data);

		animateAnnotateNode(`Found node with value ${data.value}`, data.nodeId);

		// highlight found node
		nodes.update([{ id: data.nodeId, color: { background: '#7CFC00' } }]);
	}

	function handleMarkToDeleteStep(data: BSTreeSteps.MarkToDeleteData) {
		console.log('Animating mark to delete step:', data);

		animateAnnotateNode(`Mark node with value ${data.value} to delete`, data.nodeId);

		// highlight marked node
		nodes.update([{ id: data.nodeId, color: { background: '#FF4500' } }]);
	}

	async function handleDeleteStep(data: BSTreeSteps.DeleteData) {
		console.log('Animating delete step:', data);

		animateAnnotateNode(`Delete node with value ${data.value}`, data.nodeId);

		// remove node from graph
		await animateRemovingNode(data.nodeId);
		// nodes.remove(data.nodeId);
	}

	async function handleReplaceWithChildStep(data: BSTreeSteps.ReplaceWithChildData) {
		console.log('Animating replace with child step:', data);

		animateAnnotateNode(`Replace node with its ${data.direction} child`, data.oldNodeId);

		// remove node from graph
		animateNodeMovement(data.newNodeId, network.getPosition(data.newNodeId), network.getPosition(data.oldNodeId));
		animateRemovingNode(data.oldNodeId);
	}

	async function handleRelinkSuccessorChildStep(data: BSTreeSteps.RelinkSuccessorChildData) {
		console.log('Animating relink successor child step:', data);

		animateAnnotateNode(`Relink inorder successor's child`, data.childNodeId);

		// unlink child from successor and link to parent
		edges.remove(`edge-${data.successorNodeId}-${data.childValue < data.newParentValue ? 'left' : 'right'}`);
		edges.add({
			id: `edge-${data.newParentNodeId}-${data.childValue < data.newParentValue ? 'left' : 'right'}`,
			from: data.newParentNodeId,
			to: data.childNodeId,
		});
	}

	async function handleReplaceWithInorderSuccessorStep(data: BSTreeSteps.ReplaceWithInorderSuccessorData) {
		console.log('Animating replace with inorder successor step:', data);

		animateAnnotateNode(`Replace node with inorder successor`, data.oldNodeId);

		// move successor to old node position
		await animateLegsShrink(data.successorNodeId);
		// remove successor legs first
		edges.remove(`edge-${data.successorNodeId}-left`);
		edges.remove(`edge-${data.successorNodeId}-right`);
		await animateNodeMovement(data.successorNodeId, network.getPosition(data.successorNodeId), network.getPosition(data.oldNodeId));

		// remove node from graph
		animateRemovingNode(data.oldNodeId);
	}

	function handleStepAnimation(step: CurrentStepChangedEvent) {
		console.log('Handling step animation:', step);
		clearDisconnectedDummyNodes();

		switch (step.currentStep.type as BSTreeSteps.StepType) {
			case BSTreeSteps.StepType.Start: {
				handleStartStep();
				break;
			}
			case BSTreeSteps.StepType.End: {
				handleEndStep();
				break;
			}
			case BSTreeSteps.StepType.CreateRoot: {
				let data = step.currentStep.data as BSTreeSteps.CreateRootData;
				handleCreateRootStep(data);
				break;
			}
			case BSTreeSteps.StepType.CreateLeaf: {
				let data = step.currentStep.data as BSTreeSteps.CreateLeafData;
				handleCreateLeafStep(data);
				break;
			}
			case BSTreeSteps.StepType.Compare: {
				let data = step.currentStep.data as BSTreeSteps.CompareData;
				handleCompareStep(data, step.direction);
				break;
			}
			case BSTreeSteps.StepType.Traverse: {
				let data = step.currentStep.data as BSTreeSteps.TraverseData;
				handleTraverseStep(data, step.direction);
				break;
			}
			case BSTreeSteps.StepType.Drop: {
				let data = step.currentStep.data as BSTreeSteps.DropData;
				handleDropStep(data);
				break;
			}
			case BSTreeSteps.StepType.Found: {
				let data = step.currentStep.data as BSTreeSteps.FoundData;
				handleFoundStep(data);
				break;
			}
			case BSTreeSteps.StepType.MarkToDelete: {
				let data = step.currentStep.data as BSTreeSteps.MarkToDeleteData;
				handleMarkToDeleteStep(data);
				break;
			}
			case BSTreeSteps.StepType.Delete: {
				let data = step.currentStep.data as BSTreeSteps.DeleteData;
				handleDeleteStep(data);
				break;
			}
			case BSTreeSteps.StepType.ReplaceWithChild: {
				let data = step.currentStep.data as BSTreeSteps.ReplaceWithChildData;
				handleReplaceWithChildStep(data);
				break;
			}
			case BSTreeSteps.StepType.FoundInorderSuccessor: {
				let data = step.currentStep.data as BSTreeSteps.FoundInorderSuccessorData;
				handleFoundStep(new BSTreeSteps.FoundData(data.successorId, data.successorValue));
				break;
			}
			case BSTreeSteps.StepType.RelinkSuccessorChild: {
				let data = step.currentStep.data as BSTreeSteps.RelinkSuccessorChildData;
				handleRelinkSuccessorChildStep(data);
				break;
			}
			case BSTreeSteps.StepType.ReplaceWithInorderSuccessor: {
				let data = step.currentStep.data as BSTreeSteps.ReplaceWithInorderSuccessorData;
				handleReplaceWithInorderSuccessorStep(data);
				break;
			}
		}

		network.fit();
	}

	function clearDisconnectedDummyNodes() {
		let toRemove: string[] = [];
		for (let node of nodes.get()) {
			if (typeof node.id === 'string' && node.id.startsWith('dummy-')) {
				// dummy node
				let connectedEdges = network.getConnectedEdges(node.id);
				if (connectedEdges.length === 0) {
					toRemove.push(node.id as string);
				}
			}
		}
		nodes.remove(toRemove);
	}

	function addNode(nodeId: number, value: number, parentId?: number, direction?: 'left' | 'right') {
		nodes.add({
			id: nodeId,
			title: `Node ${nodeId}`,
			label: `${value}`,
		});

		if (parentId !== undefined && direction !== undefined) {
			let edgeId = `edge-${parentId}-${direction}`;
			nodes.remove(getDummyNodeId(parentId, direction));
			edges.remove(edgeId);
			edges.add({
				id: edgeId,
				from: parentId,
				to: nodeId,
			});

			if (direction === 'left') {
				// switch this node position and the right dummy node position
				nodes.remove(getDummyNodeId(parentId, 'right'));
				nodes.add({
					id: getDummyNodeId(parentId, 'right'),
					color: 'transparent',
				});
			}
		}

		nodes.add({
			id: getDummyNodeId(nodeId, 'left'),
			color: 'transparent',
		});
		nodes.add({
			id: getDummyNodeId(nodeId, 'right'),
			color: 'transparent',
		});
		edges.add({
			id: `edge-${nodeId}-left`,
			from: nodeId,
			to: getDummyNodeId(nodeId, 'left'),
			dashes: true,
		});
		edges.add({
			id: `edge-${nodeId}-right`,
			from: nodeId,
			to: getDummyNodeId(nodeId, 'right'),
			dashes: true,
		});
	}

	function updateGraph(tree: BSTree) {
		let newData = bsTreetoGraph(tree.root);

		// update existing nodes or add new ones
		for (let n of newData.nodes.get()) {
			if (nodes.get(n.id!)) {
				nodes.update(n);
				continue;
			} else {
				nodes.add(n);
				animateNodeGrowth(n.id!);
			}
		}
		// delete nodes that are no longer present
		let newNodeIds = new Set(newData.nodes.get().map(n => n.id));
		for (let existingNode of nodes.get()) {
			if (!newNodeIds.has(existingNode.id)) {
				nodes.remove(existingNode.id!);
			}
		}

		edges.clear();
		for (let e of newData.edges.get()) {
			if (!edges.get(e.id!)) {
				edges.add(e);
			}
		}

		// clear disconnected dummy nodes
		clearDisconnectedDummyNodes();
		network.fit();
	}
</script>

<div
	bind:this={container}
	class="h-full w-full rounded border border-gray-300">
</div>
