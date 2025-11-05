<script lang="ts">
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
	import { StepType, type StepTypeValue } from '$lib/structures/dataStructure';
	import { Step } from '$lib/operation/operationData';

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

	import { NetworkAnimator } from '$lib/visual/networkAnimator';
	let net: NetworkAnimator | null = null;

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

		net = new NetworkAnimator({
			network,
			nodes,
			edges,
			infoNodeId,
			infoNodeAboveOffset,
			movementDurationMs,
			infoNodeSize,
		});

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

	function animateAddingNode(nodeId: number) {
		net!.animateNodeGrowth(nodeId);
		net!.animateLegsGrowth(nodeId);
	}

	function animateRemovingNode(nodeId: number) {
		net!.animateLegsShrink(nodeId);
		net!.animateNodeShrink(nodeId);
	}

	function handleOperationAnimation(operation: CurrentOperationChangedEvent) {
		console.log('Handling operation animation:', operation);

		ensureTree(operation.currentOperation.endSnapshot as BSTree);
	}

	function handleStartStep() {
		console.log('Animating start step');

		let snapshot = operationManager.getCurrentOperation().startSnapshot as BSTree;
		ensureTree(snapshot);
		removeColoring();

		// put operation name into info node, position above root and grow it
		net!.animateAnnotateNode(`${operationManager.getCurrentOperation().operation.toString()}`, snapshot.root?.id);
		net!.animateNodeGrowth(infoNodeId, infoNodeSize);
	}

	function handleEndStep() {
		console.log('Animating end step');

		// hide info node
		nodes.update({
			id: infoNodeId,
			hidden: true,
		});

		let snapshot = operationManager.getCurrentOperation().endSnapshot as BSTree;
		ensureTree(snapshot);
	}

	function handleCreateRootStep(data: Step.BSTree.CreateRootData) {
		console.log('Animating create root step:', data);

		addNode(data.nodeId, data.value);
		animateAddingNode(data.nodeId);

		// say what we're doing in info node
		net!.animateAnnotateNode(`Create root node with value ${data.value}`, data.nodeId);
	}

	function handleCreateLeafStep(data: Step.BSTree.CreateLeafData) {
		console.log('Animating create leaf step:', data);

		addNode(data.nodeId, data.value, data.parentId, data.direction);
		animateAddingNode(data.nodeId);

		// say what we're doing in info node
		net!.animateAnnotateNode(`Create ${data.direction} child with value ${data.value}`, data.nodeId);
		net!.animateNodeMovement(infoNodeId, net!.getPositionAbove(data.parentId), net!.getPositionAbove(data.nodeId));
	}

	function handleCompareStep(data: Step.BSTree.CompareData, direction: ChangeDirection) {
		console.log('Animating compare step:', data, direction);

		let relationSymbol = relationTextToSymbol(data.result);
		net!.animateAnnotateNode(`Compare ${data.value} ${relationSymbol} ${data.comparisonValue}`, data.comparisonId);
	}

	function handleTraverseStep(data: Step.BSTree.TraverseData, direction: ChangeDirection) {
		console.log('Animating traverse step:', data, direction);

		net!.animateAnnotateNode(`Traverse to ${data.direction} child`, data.fromId);

		let positionFrom = net!.getPositionAbove(data.fromId);
		let positionTo;
		if (data.toId == -1) {
			positionTo = net!.getPositionAbove(getDummyNodeId(data.fromId, data.direction));
		} else {
			positionTo = net!.getPositionAbove(data.toId);
		}

		if (direction == ChangeDirection.Forward) {
			// animate movement from current position to target
			net!.animateNodeMovement(infoNodeId, positionFrom, positionTo);
		} else {
			// just snap back to fromId
			if (data.toId == -1) {
				net!.snapNodeAbove(infoNodeId, getDummyNodeId(data.fromId, data.direction));
			} else {
				net!.snapNodeAbove(infoNodeId, data.toId);
			}
		}
	}

	function handleDropStep(data: Step.BSTree.DropData) {
		console.log('Animating drop value step:', data);

		net!.animateAnnotateNode(`Drop value ${data.value}`, data.fromId);

		// move info node downwards to indicate dropping
		let positionFrom = net!.getPositionAbove(data.fromId);
		let positionTo = { x: positionFrom.x, y: positionFrom.y + 400 };

		net!.animateNodeMovement(infoNodeId, positionFrom, positionTo);
	}

	function handleFoundStep(data: Step.BSTree.FoundData) {
		console.log('Animating found step:', data);

		net!.animateAnnotateNode(`Found node with value ${data.value}`, data.nodeId);

		// highlight found node
		nodes.update([{ id: data.nodeId, color: { background: '#7CFC00' } }]);
	}

	function handleMarkToDeleteStep(data: Step.BSTree.MarkToDeleteData) {
		console.log('Animating mark to delete step:', data);

		net!.animateAnnotateNode(`Mark node with value ${data.value} to delete`, data.nodeId);

		// highlight marked node
		nodes.update([{ id: data.nodeId, color: { background: '#FF4500' } }]);
	}

	async function handleDeleteStep(data: Step.BSTree.DeleteData) {
		console.log('Animating delete step:', data);

		net!.animateAnnotateNode(`Delete node with value ${data.value}`, data.nodeId);

		// remove node from graph
		await animateRemovingNode(data.nodeId);
		// nodes.remove(data.nodeId);
	}

	async function handleReplaceWithChildStep(data: Step.BSTree.ReplaceWithChildData) {
		console.log('Animating replace with child step:', data);

		net!.animateAnnotateNode(`Replace node with its ${data.direction} child`, data.oldNodeId);

		// remove node from graph
		net!.animateNodeMovement(data.newNodeId, network.getPosition(data.newNodeId), network.getPosition(data.oldNodeId));
		animateRemovingNode(data.oldNodeId);
	}

	async function handleRelinkSuccessorChildStep(data: Step.BSTree.RelinkSuccessorChildData) {
		console.log('Animating relink successor child step:', data);

		net!.animateAnnotateNode(`Relink inorder successor's child`, data.childNodeId);

		// unlink child from successor and link to parent
		edges.remove(`edge-${data.successorNodeId}-${data.childValue < data.newParentValue ? 'left' : 'right'}`);
		edges.add({
			id: `edge-${data.newParentNodeId}-${data.childValue < data.newParentValue ? 'left' : 'right'}`,
			from: data.newParentNodeId,
			to: data.childNodeId,
		});
	}

	async function handleReplaceWithInorderSuccessorStep(data: Step.BSTree.ReplaceWithInorderSuccessorData) {
		console.log('Animating replace with inorder successor step:', data);

		net!.animateAnnotateNode(`Replace node with inorder successor`, data.oldNodeId);

		// move successor to old node position
		await net!.animateLegsShrink(data.successorNodeId);
		// remove successor legs first
		edges.remove(`edge-${data.successorNodeId}-left`);
		edges.remove(`edge-${data.successorNodeId}-right`);
		await net!.animateNodeMovement(
			data.successorNodeId,
			network.getPosition(data.successorNodeId),
			network.getPosition(data.oldNodeId),
		);

		// remove node from graph
		animateRemovingNode(data.oldNodeId);
	}

	function handleStepAnimation(step: CurrentStepChangedEvent) {
		console.log('Handling step animation:', step);
		clearDisconnectedDummyNodes();

		let currentStep = step.direction === 'forward' ? step.currentStep : step.previousStep;

		if (!currentStep) {
			return;
		}

		if (step.direction === 'forward' && currentStep.startSnapshot) {
			ensureTree(currentStep.startSnapshot as BSTree);
		} else if (step.direction === 'backward' && currentStep.endSnapshot) {
			ensureTree(currentStep.endSnapshot as BSTree);
		}

		switch (currentStep.type as StepTypeValue) {
			case StepType.BSTree.Start: {
				handleStartStep();
				break;
			}
			case StepType.BSTree.End: {
				handleEndStep();
				break;
			}
			case StepType.BSTree.CreateRoot: {
				let data = currentStep.data as Step.BSTree.CreateRootData;
				handleCreateRootStep(data);
				break;
			}
			case StepType.BSTree.CreateLeaf: {
				let data = currentStep.data as Step.BSTree.CreateLeafData;
				handleCreateLeafStep(data);
				break;
			}
			case StepType.BSTree.Compare: {
				let data = currentStep.data as Step.BSTree.CompareData;
				handleCompareStep(data, step.direction);
				break;
			}
			case StepType.BSTree.Traverse: {
				let data = currentStep.data as Step.BSTree.TraverseData;
				handleTraverseStep(data, step.direction);
				break;
			}
			case StepType.BSTree.Drop: {
				let data = currentStep.data as Step.BSTree.DropData;
				handleDropStep(data);
				break;
			}
			case StepType.BSTree.Found: {
				let data = currentStep.data as Step.BSTree.FoundData;
				handleFoundStep(data);
				break;
			}
			case StepType.BSTree.MarkToDelete: {
				let data = currentStep.data as Step.BSTree.MarkToDeleteData;
				handleMarkToDeleteStep(data);
				break;
			}
			case StepType.BSTree.Delete: {
				let data = currentStep.data as Step.BSTree.DeleteData;
				handleDeleteStep(data);
				break;
			}
			case StepType.BSTree.ReplaceWithChild: {
				let data = currentStep.data as Step.BSTree.ReplaceWithChildData;
				handleReplaceWithChildStep(data);
				break;
			}
			case StepType.BSTree.FoundInorderSuccessor: {
				let data = currentStep.data as Step.BSTree.FoundInorderSuccessorData;
				handleFoundStep(new Step.BSTree.FoundData(data.successorId, data.successorValue));
				break;
			}
			case StepType.BSTree.RelinkSuccessorChild: {
				let data = currentStep.data as Step.BSTree.RelinkSuccessorChildData;
				handleRelinkSuccessorChildStep(data);
				break;
			}
			case StepType.BSTree.ReplaceWithInorderSuccessor: {
				let data = currentStep.data as Step.BSTree.ReplaceWithInorderSuccessorData;
				handleReplaceWithInorderSuccessorStep(data);
				break;
			}
		}

		if (step.direction === 'forward' && step.currentStep.endSnapshot) {
			ensureTree(step.currentStep.endSnapshot as BSTree);
		}
		if (step.direction === 'backward' && step.currentStep.startSnapshot) {
			ensureTree(step.currentStep.startSnapshot as BSTree);
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

	function ensureTree(tree: BSTree) {
		let newData = bsTreetoGraph(tree.root);

		// update existing nodes or add new ones
		for (let n of newData.nodes.get()) {
			if (nodes.get(n.id!)) {
				nodes.update(n);
				continue;
			} else {
				nodes.add(n);
				net!.animateNodeGrowth(n.id!);
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

	function removeColoring() {
		let updatedNodes: Node[] = [];
		for (let node of nodes.get()) {
			if (node.id === infoNodeId || node.id.toString().startsWith('dummy-')) continue;
			updatedNodes.push({ id: node.id!, color: options.nodes.color });
		}
		nodes.update(updatedNodes);
	}
</script>

<div
	bind:this={container}
	class="h-full w-full rounded border border-gray-300">
</div>
