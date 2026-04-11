<script lang="ts">
	import { onMount } from 'svelte';
	import { DataSet } from 'vis-data';
	import { Network, type Edge, type Node, type Options } from 'vis-network';

	import type { OperationManager } from '$lib/data-structures/operations/operationManager';
	import { AnimationOrchestrator } from '$lib/data-structures/visual/orchestrators/animationOrchestrator';
	import { getLocale } from '$lib/i18n';
	import { Colors } from '$lib/utils/colors';

	import { getStoredDebugMode, setStoredDebugMode, subscribeToDebugMode } from '../utils/debugMode';

	export let Animator: any;
	export let Annotator: any;
	export let StepHandler: any;
	export let operationManager: OperationManager;
	export let nodeOptions: any = {
		shape: 'box',
		color: Colors.Node,
		font: { color: 'black', size: 30 },
	};
	export let layout: any = null;

	let container: HTMLElement | null = null;
	let nodes: DataSet<Node> = new DataSet<Node>();
	let edges: DataSet<Edge> = new DataSet<Edge>();
	let network: Network;

	let orchestrator: AnimationOrchestrator;
	let animator: any;
	let annotator: any;

	let overlayCanvas: HTMLCanvasElement | null = null;
	let showOverlay: boolean = true;
	let debugMode: boolean = false;
	let unsubscribeDebugMode: (() => void) | null = null;

	function setDebugMode(value: boolean) {
		debugMode = value;
		if (!debugMode) {
			showOverlay = true;
		}

		if (annotator) {
			annotator.setDebugMode(debugMode);
		}
	}

	function toggleDebugMode() {
		setStoredDebugMode(!debugMode);
	}

	const defaultLayout = {
		hierarchical: {
			direction: 'UD',
			sortMethod: 'directed',
			shakeTowards: 'roots',
			levelSeparation: 100,
			treeSpacing: 0,
		},
	};

	const options: Options = {
		layout: layout || defaultLayout,
		physics: false,
		interaction: { dragNodes: false },
		nodes: nodeOptions,
		edges: { chosen: false },
	};

	onMount(() => {
		network = new Network(container!, { nodes, edges }, options);

		animator = new Animator({ network, nodes, edges, nodeOptions });
		annotator = new Annotator({ canvas: overlayCanvas!, network, nodes, edges, locale: getLocale() });
		setDebugMode(getStoredDebugMode());

		unsubscribeDebugMode = subscribeToDebugMode(value => {
			setDebugMode(value);
		});

		orchestrator = new AnimationOrchestrator(animator, annotator, operationManager, new StepHandler());

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

		return () => {
			if (unsubscribeDebugMode) {
				unsubscribeDebugMode();
				unsubscribeDebugMode = null;
			}
		};
	});
</script>

<div class="structure-visual-container treeline-card relative h-full min-h-[400px] w-full overflow-hidden">
	<div
		bind:this={container}
		class="absolute inset-0 rounded">
	</div>
	<canvas
		bind:this={overlayCanvas}
		class="pointer-events-none absolute inset-0 z-50 rounded"></canvas>

	<div class="absolute bottom-4 left-4 z-60 flex gap-2">
		<button
			style="padding: 2px!important;"
			aria-label="Toggle debug mode"
			on:click={toggleDebugMode}>
			<span class="inline-flex h-6 w-6 items-center justify-center rounded-full">
				<span
					role="img"
					aria-label={debugMode ? 'Disable debug mode' : 'Enable debug mode'}
					class="block h-4 w-4"
					style="
						background: {debugMode ? 'var(--color-gray-900)' : 'var(--color-gray-50)'};
						<!-- -webkit-mask: url('/bug.svg') no-repeat center / contain;
						mask: url('/bug.svg') no-repeat center / contain; -->
					"></span>
			</span>
		</button>

		<button
			class="py-2"
			hidden={!debugMode}
			on:click={() => {
				showOverlay = !showOverlay;
				annotator.toggleShown();
			}}>
			{showOverlay ? 'Hide' : 'Show'} Overlay
		</button>
	</div>
</div>

<style>
	.structure-visual-container {
		flex-grow: 1;
	}

	@media (max-width: 768px) {
		.structure-visual-container {
			width: 100%;
		}
	}
</style>
