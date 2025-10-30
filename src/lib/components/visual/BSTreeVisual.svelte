<script lang="ts">
	import { OperationData, StepType } from '$lib/operation/operationData';
	import { CurrentOperationChangedEvent, EventType, type OperationManager } from '$lib/operation/operationManager';
	import type { BSTree } from '$lib/structures/bsTree';
	import { bsTreetoGraph } from '$lib/utils/graphs';
	import { onMount } from 'svelte';
	import { Network, type Edge, type Node } from 'vis-network/standalone';

	export let operationManager: OperationManager;

	let container: HTMLElement;
	let { nodes, edges }: { nodes: Node[]; edges: Edge[] } = { nodes: [], edges: [] };
	let network: Network;

	const infoNodeId = 9999;

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

	onMount(() => {
		({ nodes, edges } = bsTreetoGraph(null));
		network = setupNetwork();

		operationManager.addEventListener(EventType.CurrentOperationChanged, (e: Event) => {
			const event = e as CustomEvent<CurrentOperationChangedEvent>;
			console.log('CurrentOperationChanged event received:', event.detail.currentOperation);
			updateGraph(event.detail.currentOperation);

			// if (event.detail.list) {
			// 	let listData = operationManager.getListData();

			// 	updateGraph();

			// 	if (listData.showSteps) {
			// 		let step = listData.operations[listData.currentOperation].steps[listData.currentStep];
			// 		console.log('Printing step:', step);

			// 		removeNodeIfExists(infoNodeId);
			// 		const infoNode = createInfoNode();

			// 		switch (step.type) {
			// 			// case StepType.Start:
			// 			// 	// Prepare extra node
			// 			// 	extraNode.color = '#aaaaaa';
			// 			// 	extraNode.font = { color: 'black', size: 15 };
			// 			// 	if (!nodes.find(n => n.id === extraNode.id)) {
			// 			// 		nodes.push(extraNode);
			// 			// 		network.setData({ nodes, edges });
			// 			// 	}
			// 			// 	break;
			// 			case StepType.End:
			// 				({ nodes, edges } = bsTreetoGraph(operationManager.getEndTree().root));
			// 				network.setData({ nodes, edges });
			// 				break;
			// 			case StepType.Compare:
			// 				{
			// 					let resultText = step.data.result == 'less' ? '<' : step.data.result == 'greater' ? '>' : '=';
			// 					infoNode.label = `Comparing ${step.data.value} ${resultText} ${step.data.comparisonValue}`;

			// 					addNodeIfNotExists(infoNode);

			// 					let position = network.getPosition(step.data.comparisonId);
			// 					position.y -= 40;

			// 					network.moveNode(infoNodeId, position.x, position.y);
			// 				}
			// 				break;
			// 			case StepType.Traverse:
			// 				{
			// 					infoNode.label = `Traversing to ${step.data.direction} child`;
			// 					addNodeIfNotExists(infoNode);

			// 					let positionFrom = network.getPosition(step.data.fromId);
			// 					let positionTo;

			// 					if (step.data.toId == -1) {
			// 						positionTo = network.getPosition(
			// 							`dummy-${step.data.fromId}-${step.data.direction == 'left' ? 'L' : 'R'}`,
			// 						);
			// 					} else {
			// 						positionTo = network.getPosition(step.data.toId);
			// 					}

			// 					let position = {
			// 						x: (positionFrom.x + positionTo.x) / 2,
			// 						y: (positionFrom.y + positionTo.y) / 2,
			// 					};

			// 					network.moveNode(infoNodeId, position.x, position.y - 15);
			// 				}
			// 				break;
			// 			case StepType.CreateRoot:
			// 				{
			// 					infoNode.label = `Creating root node with value ${step.data.value}`;
			// 					addNodeIfNotExists(infoNode);

			// 					network.moveNode(infoNodeId, 0, -20);
			// 				}
			// 				break;
			// 			case StepType.CreateLeaf:
			// 				{
			// 					infoNode.label = `Creating leaf as ${step.data.direction} child`;
			// 					addNodeIfNotExists(infoNode);

			// 					let position = network.getPosition(
			// 						`dummy-${step.data.parentId}-${step.data.direction == 'left' ? 'L' : 'R'}`,
			// 					);

			// 					network.moveNode(infoNodeId, position.x, position.y);
			// 				}
			// 				break;
			// 			case StepType.Found:
			// 				{
			// 					infoNode.label = `Found!`;
			// 					infoNode.color = '#aaffaa';
			// 					addNodeIfNotExists(infoNode);

			// 					let position = network.getPosition(step.data.nodeId);
			// 					position.y -= 40;

			// 					network.moveNode(infoNodeId, position.x, position.y);
			// 				}
			// 				break;
			// 			case StepType.Drop:
			// 				{
			// 					infoNode.label = `Drop ${step.data.value}\n${step.data.reason}`;
			// 					infoNode.color = '#ffaaaa';
			// 					addNodeIfNotExists(infoNode);

			// 					let position = network.getPosition(step.data.fromId);
			// 					position.y += 50;

			// 					network.moveNode(infoNodeId, position.x, position.y);
			// 				}
			// 				break;
			// 		}
			// 	}
			// }
		});
	});

	function updateGraph(operation: OperationData) {
		let tree: BSTree;
		tree = operation.endSnapshot as BSTree;
		// if (operationManager.getListData().showSteps) {
		// 	tree = operationManager.getStartTree() as BSTree;
		// } else {
		// 	tree = operationManager.getEndTree() as BSTree;
		// }
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
