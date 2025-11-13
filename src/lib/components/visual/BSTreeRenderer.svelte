<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Network, type Edge, type Node, type Options } from 'vis-network';
	import { DataSet } from 'vis-data';
	import { bsTreetoGraph } from '$lib/utils/graphs';
	import type { OperationManager } from '$lib/operation/operationManager';
	import { BSTreeAnimator } from '$lib/animators/bstAnimator';

	let container: HTMLElement | null = null;

	let nodes: DataSet<Node>;
	let edges: DataSet<Edge>;
	let network: Network;
	let animator: BSTreeAnimator;

	const nodeOptions = {
		shape: 'box',
		color: '#9fd4ff',
		font: { color: 'black', size: 30 },
	};

	const infoNodeOptions = {
		shape: 'ellipse',
		color: '#aaaaaa',
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

	export let operationManager: OperationManager;

	onMount(() => {
		({ nodes, edges } = bsTreetoGraph(null));
		network = new Network(container!, { nodes, edges }, options);

		animator = new BSTreeAnimator({ network, nodes, edges, infoNodeOptions, nodeOptions });
		animator.createInfoNode();

		network.on('selectNode', params => {
			if (params.nodes.length === 1 && operationManager) {
				const node = nodes.get(params.nodes[0]) as Node;
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
