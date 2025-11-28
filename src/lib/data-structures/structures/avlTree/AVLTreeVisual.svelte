<script lang="ts">
	import { onMount } from 'svelte';
	import { DataSet } from 'vis-data';
	import { Network, type Edge, type Node, type Options } from 'vis-network';

	import { Colors } from '$lib/assets/colors';
	import type { OperationManager } from '$lib/data-structures/operation/operationManager';
	import { AnimationOrchestrator } from '$lib/data-structures/visual/orchestrators/animationOrchestrator';

	import { AVLTreeAnimator } from './avlTreeAnimator';
	import { AVLTreeAnnotator } from './avlTreeAnnotator';
	import { AVLTreeStepHandler } from './avlTreeStepHandler';

	export let operationManager: OperationManager;

	let container: HTMLElement | null = null;
	let nodes: DataSet<Node> = new DataSet<Node>();
	let edges: DataSet<Edge> = new DataSet<Edge>();
	let network: Network;

	let orchestrator: AnimationOrchestrator;
	let animator: AVLTreeAnimator;
	let annotator: AVLTreeAnnotator;

	let overlayCanvas: HTMLCanvasElement | null = null;
	let showOverlay: boolean = true;
	let debugMode: boolean = false;

	const nodeOptions = {
		shape: 'box',
		color: Colors.Node,
		font: { color: 'black', size: 30 },
	};

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
		edges: {
			chosen: false,
		},
	};

	onMount(() => {
		network = new Network(container!, { nodes, edges }, options);

		animator = new AVLTreeAnimator({ network, nodes, edges, nodeOptions });
		annotator = new AVLTreeAnnotator({ canvas: overlayCanvas!, network, nodes, edges });
		debugMode = annotator.debugMode;

		orchestrator = new AnimationOrchestrator(animator, annotator, operationManager, new AVLTreeStepHandler());

		network.on('selectNode', params => {
			if (params.nodes.length === 1) {
				const node = nodes.get(params.nodes[0]) as Node;
				console.log('Node selected:', node);
				operationManager.updateCurrentValue(parseInt(node.label!));

				setTimeout(() => {
					network.unselectAll();
				}, 200);
			}
		});

		network.on('afterDrawing', () => {
			if (showOverlay) {
				overlayCanvas!.height = container!.clientHeight;
				overlayCanvas!.width = container!.clientWidth;

				annotator.redrawCanvas();
			}
		});
	});
</script>

<div class="relative h-full w-full rounded border border-gray-300">
	<div
		bind:this={container}
		class="absolute inset-0 rounded border border-gray-300">
	</div>
	<canvas
		bind:this={overlayCanvas}
		class="pointer-events-none absolute inset-0 z-50 rounded">
	</canvas>
</div>

<div class="mt-2 flex">
	<button
		on:click={() => {
			showOverlay = !showOverlay;
			annotator.toggleShown();
			console.log('Overlay toggled:', showOverlay);
		}}>
		{showOverlay ? 'Hide' : 'Show'} Overlay
	</button>

	<button
		hidden={!showOverlay}
		class="ml-2"
		style="padding: 1px!important;"
		aria-label="Toggle debug mode"
		on:click={() => {
			debugMode = !debugMode;
			annotator.toggleDebugMode();
			console.log('Debug mode toggled:', debugMode);
		}}>
		<span class="inline-flex h-6 w-6 items-center justify-center rounded-full">
			<img
				src="/bug.svg"
				alt={debugMode ? 'Disable debug mode' : 'Enable debug mode'}
				width="18"
				height="18"
				class="h-4 w-4"
				style="background: transparent; filter: {!debugMode ? 'invert(1) brightness(2)' : 'grayscale(1) brightness(0.8)'};" />
		</span>
	</button>
</div>
