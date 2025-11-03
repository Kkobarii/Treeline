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
	import { bsTreetoGraph } from '$lib/utils/graphs';
	import { relationTextToSymbol } from '$lib/utils/utils';
	import { onMount } from 'svelte';
	import { DataSet, Network, type Edge, type Node, type Position } from 'vis-network/standalone';
	import { addAnimation, clearAnimations } from '$lib/animation/animator';

	export let operationManager: OperationManager;

	let container: HTMLElement;
	let { nodes, edges }: { nodes: Node[]; edges: Edge[] } = { nodes: [], edges: [] };
	let network: Network;

	const infoNodeId = 9999;
	const infoNodeAboveOffset = 50;
	const movementDurationMs = 500;

	function createInfoNode(): Node {
		return {
			id: infoNodeId,
			title: 'Info Node',
			label: 'Info',
			color: '#aaaaaa',
			font: { color: 'black', size: 15 },
		};
	}

	function addNodeIfNotExists(node: Node) {
		if (!nodes.find(n => n.id === node.id)) {
			nodes.push(node);
			network.setData({ nodes, edges });
		}
	}

	function removeNodeIfExists(nodeId: number) {
		nodes = nodes.filter(n => n.id !== nodeId);
		network.setData({ nodes, edges });
	}

	function setNetwork(tree: BSTree | null) {
		({ nodes, edges } = bsTreetoGraph(tree ? tree.root : null));
		network.setData({ nodes, edges });
	}

	function getDummyNodeId(parentId: number, direction: 'left' | 'right'): string {
		return `dummy-${parentId}-${direction == 'left' ? 'L' : 'R'}`;
	}

	onMount(() => {
		network = setupNetwork();
		setNetwork(null);

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

			// Reset info node
			removeNodeIfExists(infoNodeId);

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

	function moveInfoNodeTo(x: number, y: number) {
		network.moveNode(infoNodeId, x, y);
	}

	function moveInfoNodeAbove(nodeId: string | number, howMuch = infoNodeAboveOffset) {
		const position = network.getPosition(nodeId);
		moveInfoNodeTo(position.x, position.y - howMuch);
	}

	function getPositionAbove(nodeId: string | number, howMuch = infoNodeAboveOffset): Position {
		const position = network.getPosition(nodeId);
		return { x: position.x, y: position.y - howMuch };
	}

	/** Linear interpolate helper */
	function lerp(a: number, b: number, t: number) {
		return a + (b - a) * t;
	}

	/**
	 * Animate moving the info node from its current position to target (x,y) over durationMs.
	 * Returns a Promise resolved when complete.
	 */
	export function animateInfoNodeMovement(from: Position, to: Position, durationMs: number = movementDurationMs) {
		return new Promise<void>(resolve => {
			// Ensure info node exists
			const infoNode = createInfoNode();
			addNodeIfNotExists(infoNode);

			// if undefined, place at 0,0
			if (!from) from = { x: 0, y: 0 };
			network.moveNode(infoNodeId, from.x, from.y);

			const cancel = addAnimation((dt, elapsed) => {
				const t = Math.min(1, elapsed / durationMs);
				const x = lerp(from.x, to.x, t);
				const y = lerp(from.y, to.y, t);
				network.moveNode(infoNodeId, x, y);
				if (t >= 1) {
					cancel();
					resolve();
					return false;
				}
				return true;
			});
		});
	}

	// export function

	function handleOperationAnimation(operation: CurrentOperationChangedEvent) {
		console.log('Handling operation animation:', operation);

		updateGraph(operation.currentOperation);
	}

	async function handleStepAnimation(step: CurrentStepChangedEvent) {
		console.log('Handling step animation:', step);

		removeNodeIfExists(infoNodeId);
		let infoNode = createInfoNode();

		if (step.previousStep && step.previousStep.type === BSTreeSteps.StepType.End) {
			let snapshot = operationManager.getCurrentOperation().startSnapshot as BSTree;
			setNetwork(snapshot);
		}

		switch (step.currentStep.type as BSTreeSteps.StepType) {
			case BSTreeSteps.StepType.Start: {
				// set tree as start snapshot
				console.log('Setting start snapshot');
				let snapshot = operationManager.getCurrentOperation().startSnapshot as BSTree;
				setNetwork(snapshot);

				// add info node with name of operation
				infoNode.label = `${operationManager.getCurrentOperation().operation.toString()}`;

				addNodeIfNotExists(infoNode);

				if (snapshot.root == null) {
					moveInfoNodeTo(0, -infoNodeAboveOffset);
				} else {
					moveInfoNodeAbove(snapshot.root.id, infoNodeAboveOffset);
				}
				break;
			}
			case BSTreeSteps.StepType.End: {
				// set tree as end snapshot
				let snapshot: BSTree;
				console.log('Setting end snapshot');
				snapshot = operationManager.getCurrentOperation().endSnapshot as BSTree;
				setNetwork(snapshot);
				break;
			}
			case BSTreeSteps.StepType.Compare: {
				// put comparison info node above comparison node
				let data = step.currentStep.data as BSTreeSteps.CompareData;
				infoNode.label = `Compare\n${data.value} ${relationTextToSymbol(data.result)} ${data.comparisonValue}`;
				addNodeIfNotExists(infoNode);

				moveInfoNodeAbove(data.comparisonId);
				break;
			}
			case BSTreeSteps.StepType.Traverse: {
				let data = step.currentStep.data as BSTreeSteps.TraverseData;
				infoNode.label = `Traverse to ${data.direction} child`;
				addNodeIfNotExists(infoNode);

				if (step.direction == ChangeDirection.Forward) {
					// animate movement from current position to target
					let positionFrom = getPositionAbove(data.fromId);
					let positionTo;
					if (data.toId == -1) {
						positionTo = getPositionAbove(getDummyNodeId(data.fromId, data.direction));
					} else {
						positionTo = getPositionAbove(data.toId);
					}

					await animateInfoNodeMovement(positionFrom, positionTo);
				} else {
					// just snap back to fromId
					if (data.toId == -1) {
						moveInfoNodeAbove(getDummyNodeId(data.fromId, data.direction));
					} else {
						moveInfoNodeAbove(data.toId);
					}
				}
				break;
			}
			case BSTreeSteps.StepType.CreateRoot: {
				let data = step.currentStep.data as BSTreeSteps.CreateRootData;
				infoNode.label = `Create root node\nwith value ${data.value}`;
				addNodeIfNotExists(infoNode);

				network.moveNode(infoNodeId, 0, -20);
				break;
			}
			case BSTreeSteps.StepType.CreateLeaf: {
				let data = step.currentStep.data as BSTreeSteps.CreateLeafData;
				infoNode.label = `Create leaf\nas ${data.direction} child`;
				addNodeIfNotExists(infoNode);

				if (step.direction == ChangeDirection.Forward) {
					// animate movement from current position to target
					let positionFrom = getPositionAbove(data.parentId);
					let positionTo = getPositionAbove(getDummyNodeId(data.parentId, data.direction), 0);

					await animateInfoNodeMovement(positionFrom, positionTo);
				} else {
					// just snap back to parent
					moveInfoNodeAbove(getDummyNodeId(data.parentId, data.direction), 0);
				}
				break;
			}
		}
	}

	function updateGraph(operation: OperationData) {
		let tree: BSTree;
		tree = operation.endSnapshot as BSTree;
		({ nodes, edges } = bsTreetoGraph(tree.root));
		network.setData({ nodes, edges });
	}

	function setupNetwork(): Network {
		let network = new Network(
			container,
			{ nodes, edges },
			{
				layout: {
					hierarchical: {
						direction: 'UD', // top to bottom
						sortMethod: 'directed',
						shakeTowards: 'roots',
						levelSeparation: 100,
					},
				},
				physics: false,
				nodes: {
					shape: 'box',
					color: '#9fd4ff',
					font: { color: 'black', size: 30 },
				},
			},
		);
		network.on('selectNode', function (params) {
			if (params.nodes.length == 1) {
				const nodeId = params.nodes[0];
				let node: Node | null = null;
				for (let n of nodes) {
					if (n.id === nodeId) {
						node = n;
						break;
					}
				}
				operationManager.updateCurrentValue(Number(node?.label) || 0);
			}
		});

		return network;
	}
</script>

<div
	bind:this={container}
	class="h-full w-full rounded border border-gray-300">
</div>
