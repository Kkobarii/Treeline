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
			console.debug('CurrentOperationChanged event received:', event.detail);

			if (!operationManager.getShowSteps()) {
				handleOperationAnimation(event.detail);
			}
		});

		operationManager.addEventListener(EventType.CurrentStepChanged, (e: Event) => {
			const event = e as CustomEvent<CurrentStepChangedEvent>;
			console.debug('CurrentStepChanged event received:', event.detail);

			if (operationManager.getShowSteps()) {
				handleStepAnimation(event.detail);
			}
		});

		operationManager.addEventListener(EventType.ShowStepsToggled, () => {
			console.debug('ShowStepsToggled event received');

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

	async function animateAddingNode(nodeId: number): Promise<void> {
		await Promise.all([net!.animateNodeGrowth(nodeId), net!.animateLegsGrowth(nodeId)]);
	}

	async function animateRemovingNode(nodeId: number): Promise<void> {
		await Promise.all([net!.animateLegsShrink(nodeId), net!.animateNodeShrink(nodeId)]);
	}

	function handleOperationAnimation(operation: CurrentOperationChangedEvent) {
		console.log('Handling operation animation:', operation);

		ensureTree(operation.currentOperation.endSnapshot as BSTree);
	}

	async function handleStartStep(direction: ChangeDirection) {
		console.log('Animating start step', direction);

		let info = `Starting ${operationManager.getCurrentOperation().operation.toString()} operation`;

		// put operation name into info node, position above root and grow it
		if (direction === ChangeDirection.Backward) {
			// hide info node
			nodes.update({
				id: infoNodeId,
				hidden: true,
			});
		} else {
			let snapshot = operationManager.getCurrentOperation().startSnapshot as BSTree;
			ensureTree(snapshot);
			await Promise.all([net!.changeInfoNodeAnnotation(info), net!.animateNodeGrowth(infoNodeId, infoNodeSize)]);
		}
		removeColoring();
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

	async function handleCreateRootStep(data: Step.BSTree.CreateRootData, direction: ChangeDirection) {
		console.log('Animating create root step:', data);

		if (direction === ChangeDirection.Backward) {
			// if going backwards, remove the node to the before state
			await Promise.all([
				net!.animateAnnotateNode(`Create root node with value ${data.value}`, data.nodeId),
				animateRemovingNode(data.nodeId),
			]);
			removeNode(data.nodeId);
			return;
		}

		// add node to graph
		addNode(data.nodeId, data.value);
		await Promise.all([
			net!.animateAnnotateNode(`Create root node with value ${data.value}`, data.nodeId),
			animateAddingNode(data.nodeId),
		]);
	}

	async function handleCreateLeafStep(data: Step.BSTree.CreateLeafData, direction: ChangeDirection) {
		console.log('Animating create leaf step:', data);

		let info = `Create ${data.direction} child with value ${data.value}`;

		if (direction === ChangeDirection.Backward) {
			// if going backwards, remove the node to the before state
			await Promise.all([
				net!.animateAnnotateNode(info, data.nodeId),
				animateRemovingNode(data.nodeId),
				net!.animateNodeMovement(infoNodeId, net!.getPositionAbove(data.nodeId), net!.getPositionAbove(data.parentId)),
			]);
			removeNode(data.nodeId, data.parentId, data.direction);
			net!.snapNodeAbove(infoNodeId, data.parentId);
			return;
		}

		// add node to parent
		addNode(data.nodeId, data.value, data.parentId, data.direction);

		// say what we're doing in info node
		await Promise.all([
			net!.animateAnnotateNode(info, data.parentId),
			animateAddingNode(data.nodeId),
			net!.animateNodeMovement(infoNodeId, net!.getPositionAbove(data.parentId), net!.getPositionAbove(data.nodeId)),
		]);
	}

	async function handleCompareStep(data: Step.BSTree.CompareData, direction: ChangeDirection) {
		console.log('Animating compare step:', data, direction);

		let relationSymbol = relationTextToSymbol(data.result);
		await net!.animateAnnotateNode(`Compare ${data.value} ${relationSymbol} ${data.comparisonValue}`, data.comparisonId);
	}

	async function handleTraverseStep(data: Step.BSTree.TraverseData, direction: ChangeDirection) {
		console.log('Animating traverse step:', data, direction);

		let positionFrom = net!.getPositionAbove(data.fromId);
		let positionTo;
		if (data.toId == -1) {
			positionTo = net!.getPositionAbove(getDummyNodeId(data.fromId, data.direction));
		} else {
			positionTo = net!.getPositionAbove(data.toId);
		}

		if (direction == ChangeDirection.Forward) {
			// animate movement from current position to target
			await net!.animateAnnotateNode(`Traverse to ${data.direction} child`, data.fromId);
			net!.animateNodeMovement(infoNodeId, positionFrom, positionTo);
		} else {
			// animate movement from target position to current position
			await net!.animateAnnotateNode(`Traverse to ${data.direction} child`, data.toId);
			net!.animateNodeMovement(infoNodeId, positionTo, positionFrom);
		}
	}

	async function handleDropStep(data: Step.BSTree.DropData, direction: ChangeDirection) {
		console.log('Animating drop value step:', data);

		// move info node downwards to indicate dropping
		let positionFrom = net!.getPositionAbove(data.fromId);
		let positionTo = { x: positionFrom.x, y: positionFrom.y + 400 };

		if (direction == ChangeDirection.Forward) {
			await Promise.all([
				net!.animateAnnotateNode(`Drop value ${data.value}`, data.fromId),
				net!.animateNodeMovement(infoNodeId, positionFrom, positionTo),
			]);
		} else {
			await Promise.all([
				net!.changeInfoNodeAnnotation(`Drop value ${data.value}`),
				net!.animateNodeMovement(infoNodeId, positionTo, positionFrom),
			]);
		}
	}

	function handleFoundStep(data: Step.BSTree.FoundData, direction: ChangeDirection) {
		console.log('Animating found step:', data);

		net!.animateAnnotateNode(`Found node with value ${data.value}`, data.nodeId);

		// highlight found node
		let color = direction === ChangeDirection.Forward ? '#7CFC00' : options.nodes.color;
		nodes.update([{ id: data.nodeId, color: { background: color } }]);
	}

	function handleMarkToDeleteStep(data: Step.BSTree.MarkToDeleteData, direction: ChangeDirection) {
		console.log('Animating mark to delete step:', data);

		net!.animateAnnotateNode(`Mark node with value ${data.value} to delete`, data.nodeId);

		// highlight marked node
		let color = direction === ChangeDirection.Forward ? '#FF4500' : options.nodes.color;
		nodes.update([{ id: data.nodeId, color: { background: color } }]);
	}

	async function handleDeleteStep(data: Step.BSTree.DeleteData, direction: ChangeDirection) {
		console.log('Animating delete step:', data);

		net!.animateAnnotateNode(`Delete node with value ${data.value}`, data.nodeId);

		if (direction === ChangeDirection.Backward) {
			// if going backwards, ensure graph reflects the before state
			ensureTree(data.startSnapshot! as BSTree);
			// set color to red
			let color = '#FF4500';
			nodes.update([{ id: data.nodeId, color: { background: color } }]);
			return;
		}

		// remove node from graph
		await animateRemovingNode(data.nodeId);
		// removeNode(data.nodeId);
	}

	async function handleReplaceWithChildStep(data: Step.BSTree.ReplaceWithChildData, direction: ChangeDirection) {
		console.log('Animating replace with child step:', data);

		net!.animateAnnotateNode(`Replace node with its ${data.direction} child`, data.oldNodeId);

		if (direction === ChangeDirection.Backward) {
			// if going backwards, ensure graph reflects the before state
			ensureTree(data.startSnapshot! as BSTree);
			return;
		}

		// remove node from graph
		net!.animateNodeMovement(data.newNodeId, network.getPosition(data.newNodeId), network.getPosition(data.oldNodeId));
		animateRemovingNode(data.oldNodeId);
	}

	async function handleRelinkSuccessorChildStep(data: Step.BSTree.RelinkSuccessorChildData, direction: ChangeDirection) {
		console.log('Animating relink successor child step:', data);

		net!.animateAnnotateNode(`Relink inorder successor's child`, data.childNodeId);

		if (direction === ChangeDirection.Backward) {
			// if going backwards, ensure graph reflects the before state
			ensureTree(data.startSnapshot! as BSTree);
			return;
		}

		// unlink child from successor and link to parent
		edges.remove(`edge-${data.successorNodeId}-${data.childValue < data.newParentValue ? 'left' : 'right'}`);
		edges.add({
			id: `edge-${data.newParentNodeId}-${data.childValue < data.newParentValue ? 'left' : 'right'}`,
			from: data.newParentNodeId,
			to: data.childNodeId,
		});
	}

	async function handleReplaceWithInorderSuccessorStep(data: Step.BSTree.ReplaceWithInorderSuccessorData, direction: ChangeDirection) {
		console.log('Animating replace with inorder successor step:', data);

		if (direction === ChangeDirection.Backward) {
			// if going backwards, ensure graph reflects the before state
			ensureTree(data.startSnapshot! as BSTree);
			net!.animateAnnotateNode(`Replace node with inorder successor`, data.oldNodeId);
			return;
		}

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

	async function handleStepAnimation(step: CurrentStepChangedEvent) {
		// console.log('Handling step animation:', step);
		clearDisconnectedDummyNodes();

		let currentStep = step.direction === 'backward' ? step.previousStep : step.currentStep;

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
				handleStartStep(step.direction);
				break;
			}
			case StepType.BSTree.End: {
				handleEndStep();
				break;
			}
			case StepType.BSTree.CreateRoot: {
				let data = currentStep.data as Step.BSTree.CreateRootData;
				await handleCreateRootStep(data, step.direction);
				break;
			}
			case StepType.BSTree.CreateLeaf: {
				let data = currentStep.data as Step.BSTree.CreateLeafData;
				await handleCreateLeafStep(data, step.direction);
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
				handleDropStep(data, step.direction);
				break;
			}
			case StepType.BSTree.Found: {
				let data = currentStep.data as Step.BSTree.FoundData;
				handleFoundStep(data, step.direction);
				break;
			}
			case StepType.BSTree.MarkToDelete: {
				let data = currentStep.data as Step.BSTree.MarkToDeleteData;
				handleMarkToDeleteStep(data, step.direction);
				break;
			}
			case StepType.BSTree.Delete: {
				let data = currentStep.data as Step.BSTree.DeleteData;
				handleDeleteStep(data, step.direction);
				break;
			}
			case StepType.BSTree.ReplaceWithChild: {
				let data = currentStep.data as Step.BSTree.ReplaceWithChildData;
				handleReplaceWithChildStep(data, step.direction);
				break;
			}
			case StepType.BSTree.FoundInorderSuccessor: {
				let data = currentStep.data as Step.BSTree.FoundInorderSuccessorData;
				handleFoundStep(new Step.BSTree.FoundData(data.successorId, data.successorValue), step.direction);
				break;
			}
			case StepType.BSTree.RelinkSuccessorChild: {
				let data = currentStep.data as Step.BSTree.RelinkSuccessorChildData;
				handleRelinkSuccessorChildStep(data, step.direction);
				break;
			}
			case StepType.BSTree.ReplaceWithInorderSuccessor: {
				let data = currentStep.data as Step.BSTree.ReplaceWithInorderSuccessorData;
				handleReplaceWithInorderSuccessorStep(data, step.direction);
				break;
			}
		}

		if (step.direction === 'forward' && step.currentStep.endSnapshot) {
			ensureTree(step.currentStep.endSnapshot as BSTree);
		}
		if (step.direction === 'backward' && step.currentStep.startSnapshot) {
			ensureTree(step.currentStep.startSnapshot as BSTree);
		}

		clearDisconnectedDummyNodes();
		network.fit();
	}

	function clearDisconnectedDummyNodes() {
		let toRemove: string[] = [];
		for (let node of nodes.get()) {
			if (typeof node.id === 'string' && node.id.startsWith('dummy-')) {
				// dummy node
				let connectedEdges = network.getConnectedNodes(node.id);
				if (connectedEdges.length === 0) {
					toRemove.push(node.id as string);
					console.debug('Removing disconnected dummy node:', node.id);
				}
			}
		}
		nodes.remove(toRemove);
	}

	function addNode(nodeId: number, value: number, parentId?: number, direction?: 'left' | 'right') {
		if (nodes.get(nodeId)) {
			console.warn(`Node with id ${nodeId} already exists. Skipping addNode.`);
			return;
		}

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

	function removeNode(nodeId: number, parentId?: number, direction?: 'left' | 'right') {
		// get connected edges and remove them
		let connectedEdges = network.getConnectedEdges(nodeId);
		edges.remove(connectedEdges);

		// remove the node itself
		nodes.remove(nodeId);

		// remove dummy children if they exist
		if (nodes.get(getDummyNodeId(nodeId, 'left'))) {
			nodes.remove(getDummyNodeId(nodeId, 'left'));
		}
		if (nodes.get(getDummyNodeId(nodeId, 'right'))) {
			nodes.remove(getDummyNodeId(nodeId, 'right'));
		}

		if (parentId === undefined || direction === undefined) {
			return;
		}

		// add back dummy node to parent
		nodes.add({
			id: getDummyNodeId(parentId, direction),
			color: 'transparent',
		});
		edges.add({
			id: `edge-${parentId}-${direction}`,
			from: parentId,
			to: getDummyNodeId(parentId, direction),
			dashes: true,
		});

		// if left child was removed, we need to re-add the right child node to the graph
		if (direction === 'left') {
			// get right child of parent
			let rightChildEdgeId = `edge-${parentId}-right`;
			let rightChildEdge = edges.get(rightChildEdgeId);

			if (!rightChildEdge || !rightChildEdge.to) {
				console.warn(`Right child edge not found for parent ${parentId}`);
				return;
			}

			let node = nodes.get(rightChildEdge.to);
			if (!node) {
				console.warn(`Right child node not found for parent ${parentId}`);
				return;
			}

			// remove this node from graph and add it back again
			nodes.remove(node.id!);
			nodes.add(node);
		}
	}

	function ensureTree(tree: BSTree) {
		console.info('Ensuring tree');
		let newData = bsTreetoGraph(tree.root);

		// update existing nodes or add new ones
		for (let n of newData.nodes.get()) {
			if (nodes.get(n.id!)) {
				// console.debug('Updating existing node:', n.id!);
				nodes.update(n);
			} else {
				nodes.add(n);
				net!.animateNodeGrowth(n.id!);
				console.debug('Added new node:', n.id!);
			}
		}

		// delete nodes that are no longer present and also check node sizes
		let newNodeIds = new Set(newData.nodes.get().map(n => n.id));
		for (let existingNode of nodes.get()) {
			if (!newNodeIds.has(existingNode.id) && existingNode.id !== infoNodeId) {
				nodes.remove(existingNode.id!);
				console.debug('Removed dead node:', existingNode.id);
			} else if (existingNode.id != infoNodeId && !existingNode.id.toString().startsWith('dummy-')) {
				// check node sizes
				nodes.update([{ id: existingNode.id!, font: { size: options.nodes.font.size } }]);
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
