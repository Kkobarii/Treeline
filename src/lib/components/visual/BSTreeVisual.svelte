<script lang="ts">
	import type { ChangeFlags, OperationManager } from '$lib/operation/operationManager';
	import type { BSTree } from '$lib/structures/bsTree';
	import { bsTreetoGraph } from '$lib/utils/graphs';
	import { onMount } from 'svelte';
	import { Network, type Edge, type Node } from 'vis-network/standalone';

	export let operationManager: OperationManager;

	let container: HTMLElement;
	let { nodes, edges }: { nodes: Node[]; edges: Edge[] } = { nodes: [], edges: [] };
	let network: Network;

	onMount(() => {
		({ nodes, edges } = bsTreetoGraph(null));
		network = setupNetwork();

		operationManager.addEventListener((e: Event) => {
			const event = e as CustomEvent<ChangeFlags>;
			if (!event.detail.tree) return;

			({ nodes, edges } = bsTreetoGraph((operationManager.getCurrentTree() as BSTree).root));
			network.setData({ nodes, edges });
		});
	});

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
				physics: true,
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
