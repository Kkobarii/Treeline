<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { DataSet } from 'vis-data';
	import { Network, type Edge, type Font, type Node, type Options } from 'vis-network';

	import { Colors } from '$lib/assets/colors';
	import type { OperationManager } from '$lib/data-structures/operation/operationManager';
	import { avlTreeToGraph as avlTreeToGraph } from '$lib/data-structures/utils/graphs';
	import { AnimationOrchestrator } from '$lib/data-structures/visual/orchestrators/animationOrchestrator';
	import { AVLTreeStepHandlers } from '$lib/data-structures/structures/avlTree/avlTreeStepHandlers';
	import { AVLTreeAnimator } from '$lib/data-structures/structures/avlTree/avlTreeAnimator';
	import { DataStructureAnnotator } from '$lib/data-structures/visual/annotators/dataStructureAnnotator';

	export let operationManager: OperationManager;

	let container: HTMLElement | null = null;
	let nodes: DataSet<Node>;
	let edges: DataSet<Edge>;
	let network: Network;
	
	let orchestrator: AnimationOrchestrator;
	let animator: AVLTreeAnimator;
	let annotator: DataStructureAnnotator;

	let overlayCanvas: HTMLCanvasElement | null = null;
	let showOverlay: boolean = true;

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
		annotator = new DataStructureAnnotator({ canvas: overlayCanvas!, network, nodes, edges });

		orchestrator = new AnimationOrchestrator(animator, annotator, operationManager, new AVLTreeStepHandlers());

		network.on('selectNode', params => {
			if (params.nodes.length === 1 && operationManager) {
				const node = nodes.get(params.nodes[0]) as Node;
                console.log('Node selected:', node);
				let label = node.label!;
				operationManager.updateCurrentValue(parseInt(label));
			}
		});

		network.on('afterDrawing', () => {
			if (showOverlay) {
				overlayCanvas!.height = container!.clientHeight;
				overlayCanvas!.width = container!.clientWidth;

				annotator.redrawCanvas();
			}
		});

		overlayCanvas!.height = container!.clientHeight;
  		overlayCanvas!.width = container!.clientWidth;
	});

	function overlayTest() {
		// overlayCanvas!.height = container!.clientHeight;
  		// overlayCanvas!.width = container!.clientWidth;

		// overlayContext!.clearRect(0, 0, overlayCanvas!.width, overlayCanvas!.height);

		// // Draw height markers above each node
		// nodes.forEach(node => {
		// 	if (typeof node.id !== 'number') return;

		// 	const pos = network.canvasToDOM(network.getPosition(node.id!));
		// 	const height = animator.getHeight(node.id!);

		// 	const scale = network.getScale();

		// 	// draw curved bordered box behind the text
		// 	overlayContext!.beginPath();

		// 	let fontsize = 12 * scale;
		// 	let fontface = 'Arial';
		// 	let lineheight = fontsize;
		// 	let text = `H: ${height}`;

		// 	overlayContext!.font = `${fontsize}px ${fontface}`;
		// 	let textWidth = overlayContext!.measureText(text).width;

		// 	overlayContext!.textAlign = 'left';
		// 	overlayContext!.textBaseline = 'top';

		// 	let x = pos.x;
		// 	let y = pos.y - 40 * scale;

		// 	let padding = 3 * scale;

		// 	overlayContext!.fillStyle = 'grey';
		// 	overlayContext!.roundRect(x, y, textWidth + padding * 2, lineheight + padding * 2, 7);
		// 	overlayContext!.fill();
		// 	overlayContext!.stroke();
		// 	overlayContext!.fillStyle = 'black';
		// 	overlayContext!.fillText(text, x + padding, y + padding);
		// });
	}

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

<div class="w-full h-full rounded border border-gray-300 relative">
	<div
		bind:this={container}
		class="absolute inset-0 rounded border border-gray-300">
	</div>
	<canvas bind:this={overlayCanvas} class="absolute inset-0 pointer-events-none z-50 rounded">
	</canvas>
</div>

<button class="mt-2"
 	on:click={() => { 
		showOverlay = !showOverlay; 
		if (showOverlay) {
			annotator.redrawCanvas();
		} else {
			annotator.clearCanvas();
		}
		console.log('Overlay toggled:', showOverlay); 
	}}>
	{showOverlay ? 'Hide' : 'Show'} Overlay
</button>

