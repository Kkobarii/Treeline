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

	function animateLegsGrowth(nodeId: string | number, durationMs: number = movementDurationMs) {
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

	function animateAddingNode(nodeId: number) {
		animateNodeGrowth(nodeId);
		animateLegsGrowth(nodeId);
	}

	function animateAnnotateNode(annotation: string, nodeId?: number) {
		console.log('Animating annotate node:', annotation, 'above node:', nodeId);
		nodes.update({
			id: infoNodeId,
			label: annotation,
			hidden: false,
			color: infoNodeColor,
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

	function handleStepAnimation(step: CurrentStepChangedEvent) {
		console.log('Handling step animation:', step);
		clearDisconnectedDummyNodes();

		// removeNodeIfExists(infoNodeId);
		// let infoNode = createInfoNode();

		// if (step.previousStep && step.previousStep.type === BSTreeSteps.StepType.End) {
		// 	let snapshot = operationManager.getCurrentOperation().startSnapshot as BSTree;
		// 	// setNetwork(snapshot);
		// }

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
		}

		network.fit();
		// 	// case BSTreeSteps.StepType.End: {
		// 	// 	// set tree as end snapshot
		// 	// 	let snapshot: BSTree;
		// 	// 	console.log('Setting end snapshot');
		// 	// 	snapshot = operationManager.getCurrentOperation().endSnapshot as BSTree;
		// 	// 	setNetwork(snapshot);
		// 	// 	break;
		// 	// }
		// 	// case BSTreeSteps.StepType.Compare: {
		// 	// 	// put comparison info node above comparison node
		// 	// 	let data = step.currentStep.data as BSTreeSteps.CompareData;
		// 	// 	infoNode.label = `Compare\n${data.value} ${relationTextToSymbol(data.result)} ${data.comparisonValue}`;
		// 	// 	addNodeIfNotExists(infoNode);

		// 	// 	moveInfoNodeAbove(data.comparisonId);
		// 	// 	break;
		// 	// }
		// 	// case BSTreeSteps.StepType.Traverse: {
		// 	// 	let data = step.currentStep.data as BSTreeSteps.TraverseData;
		// 	// 	infoNode.label = `Traverse to ${data.direction} child`;
		// 	// 	addNodeIfNotExists(infoNode);

		// 	// 	if (step.direction == ChangeDirection.Forward) {
		// 	// 		// animate movement from current position to target
		// 	// 		let positionFrom = getPositionAbove(data.fromId);
		// 	// 		let positionTo;
		// 	// 		if (data.toId == -1) {
		// 	// 			positionTo = getPositionAbove(getDummyNodeId(data.fromId, data.direction));
		// 	// 		} else {
		// 	// 			positionTo = getPositionAbove(data.toId);
		// 	// 		}

		// 	// 		await animateInfoNodeMovement(positionFrom, positionTo);
		// 	// 	} else {
		// 	// 		// just snap back to fromId
		// 	// 		if (data.toId == -1) {
		// 	// 			moveInfoNodeAbove(getDummyNodeId(data.fromId, data.direction));
		// 	// 		} else {
		// 	// 			moveInfoNodeAbove(data.toId);
		// 	// 		}
		// 	// 	}
		// 	// 	break;
		// 	// }
		// 	// case BSTreeSteps.StepType.CreateRoot: {
		// 	// 	let data = step.currentStep.data as BSTreeSteps.CreateRootData;
		// 	// 	infoNode.label = `Create root node\nwith value ${data.value}`;
		// 	// 	addNodeIfNotExists(infoNode);

		// 	// 	network.moveNode(infoNodeId, 0, -20);
		// 	// 	break;
		// 	// }
		// 	// case BSTreeSteps.StepType.CreateLeaf: {
		// 	// 	let data = step.currentStep.data as BSTreeSteps.CreateLeafData;
		// 	// 	infoNode.label = `Create leaf\nas ${data.direction} child`;
		// 	// 	addNodeIfNotExists(infoNode);

		// 	// 	if (step.direction == ChangeDirection.Forward) {
		// 	// 		// animate movement from current position to target
		// 	// 		let positionFrom = getPositionAbove(data.parentId);
		// 	// 		let positionTo = getPositionAbove(getDummyNodeId(data.parentId, data.direction), 0);

		// 	// 		await animateInfoNodeMovement(positionFrom, positionTo);
		// 	// 	} else {
		// 	// 		// just snap back to parent
		// 	// 		moveInfoNodeAbove(getDummyNodeId(data.parentId, data.direction), 0);
		// 	// 	}
		// 	// 	break;
		// 	// }
		// 	case BSTreeSteps.StepType.Found: {
		// 		let data = step.currentStep.data as BSTreeSteps.FoundData;
		// 		// infoNode.label = `Found node\nwith value ${data.value}`;
		// 		console.log('Found node with value', data.value);
		// 		nodes.update([{ id: data.nodeId, color: { background: '#7CFC00' } }]);
		// 		break;
		// 	}
		// }
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
			edges.add({
				id: `edge-${parentId}-${direction}`,
				from: parentId,
				to: nodeId,
			});
			nodes.remove(getDummyNodeId(parentId, direction));

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
	}
</script>

<div
	bind:this={container}
	class="h-full w-full rounded border border-gray-300">
</div>
