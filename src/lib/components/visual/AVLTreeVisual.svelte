<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { DataSet } from 'vis-data';
	import { Network, type Edge, type Node, type Options } from 'vis-network';

	import { Colors } from '$lib/assets/colors';
	import type { OperationManager } from '$lib/operation/operationManager';
	import { avlTreeToGraph as avlTreeToGraph } from '$lib/utils/graphs';
	import { AnimationOrchestrator } from '$lib/visual/animationOrchestrator';
	import { AVLTreeAnimator } from '$lib/animators/avlTreeAnimator';
	import { AVLTreeStepHandlers } from '$lib/visual/avlTreeStepHandlers';

	export let operationManager: OperationManager;

	let container: HTMLElement | null = null;
	let nodes: DataSet<Node>;
	let edges: DataSet<Edge>;
	let network: Network;

	let animator: AVLTreeAnimator;
	let orchestrator: AnimationOrchestrator;

	const nodeOptions = {
		shape: 'box',
		color: Colors.Node,
		font: { color: 'black', size: 30 },
	};

	const infoNodeOptions = {
		shape: 'ellipse',
		color: Colors.Info,
		font: { color: 'black', size: 15 },
		id: 'info-node',
		aboveOffset: 50,
	} as const;

	const options: Options = {
		layout: {
			hierarchical: {
				direction: 'UD',
				sortMethod: 'directed',
				shakeTowards: 'roots',
				levelSeparation: 100,
				treeSpacing: 0,
			},
		},
		physics: false,
		interaction: { dragNodes: false },
		nodes: nodeOptions,
	};

	onMount(() => {
		({ nodes, edges } = avlTreeToGraph(null));
		network = new Network(container!, { nodes, edges }, options);

		animator = new AVLTreeAnimator({ network, nodes, edges, infoNodeOptions, nodeOptions });
		animator.createInfoNode();

		orchestrator = new AnimationOrchestrator(animator, operationManager, new AVLTreeStepHandlers());

		network.on('selectNode', params => {
			if (params.nodes.length === 1 && operationManager) {
				const node = nodes.get(params.nodes[0]) as Node;
                console.log('Node selected:', node);
				let label = node.label!;
				operationManager.updateCurrentValue(parseInt(label));
			}
		});
	});

	onDestroy(() => {
		try {
			network?.destroy();
		} catch (e) {
			// ignore
		}
	});

	export function getAnimator() {
		return animator;
	}
</script>

<div
	bind:this={container}
	class="h-full w-full rounded border border-gray-300">
</div>
