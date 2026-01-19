<script lang="ts">
	import type { Core } from 'cytoscape';
	import cytoscape from 'cytoscape';
	import { onMount } from 'svelte';

	import { Colors } from '$lib/assets/colors';
	import type { OperationManager } from '$lib/data-structures/operation/operationManager';
	import { AnimationOrchestrator } from '$lib/data-structures/visual/orchestrators/animationOrchestrator';

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
	let cy: Core | null = null;

	let orchestrator: AnimationOrchestrator;
	let animator: any;
	let annotator: any;

	let overlayCanvas: HTMLCanvasElement | null = null;
	let showOverlay: boolean = true;
	let debugMode: boolean = false;

	function toggleDebugMode() {
		debugMode = !debugMode;
		if (!debugMode) {
			showOverlay = true;
		}
		annotator.toggleDebugMode();
		console.log('Debug mode toggled:', debugMode);
	}

	const defaultLayout = {
		name: 'breadthfirst',
		directed: true,
		roots: '[indegree = 0]',
		spacingFactor: 2,
		padding: 20,
	};

	onMount(() => {
		// Ensure container has dimensions
		if (container) {
			container.style.width = '100%';
			container.style.height = '100%';
		}

		// Initialize cytoscape
		cy = cytoscape({
			container: container!,
			elements: [],
			style: [
				{
					selector: 'node',
					style: {
						'background-color': Colors.Node,
						'text-valign': 'center',
						'text-halign': 'center',
						label: 'data(label)',
						'font-size': 30,
						'border-width': 2,
						'border-color': '#333',
						padding: '10px',
					},
				},
				{
					selector: 'node[isPlaceholder]',
					style: {
						'background-color': 'transparent',
						'border-color': 'transparent',
						width: 1,
						height: 1,
						opacity: 0.1,
					},
				},
				{
					selector: 'node[isBTreeNode]',
					style: {
						'font-size': 20,
						'min-width': '60px',
						color: 'black',
					},
				},
				{
					selector: 'edge',
					style: {
						'target-arrow-shape': 'triangle',
						'line-color': '#333',
						'target-arrow-color': '#333',
						width: 2,
					},
				},
				{
					selector: 'edge[?dashed]',
					style: {
						'line-style': 'dashed',
						opacity: 0.3,
					},
				},
			],
			layout: layout || defaultLayout,
			wheelSensitivity: 0.1,
			panningEnabled: true,
			userPanningEnabled: true,
		});

		animator = new Animator({ cy, nodeOptions });
		annotator = new Annotator({ canvas: overlayCanvas!, cy, nodeOptions });
		debugMode = annotator.debugMode;

		orchestrator = new AnimationOrchestrator(animator, annotator, operationManager, new StepHandler());

		cy.on('tap', 'node', (event: any) => {
			const node = event.target;
			if (node.data('id').toString().startsWith('dummy-')) {
				return; // Don't select dummy nodes
			}
			console.log('Node selected:', node.data());
			const label = node.data('label');
			if (label && !isNaN(parseInt(label))) {
				operationManager.updateCurrentValue(parseInt(label));
			}
			cy!.elements().unselect();
		});

		// Redraw overlay on pan/zoom
		cy.on('viewport', () => {
			if (showOverlay && overlayCanvas && annotator) {
				overlayCanvas.height = container!.clientHeight;
				overlayCanvas.width = container!.clientWidth;
				annotator.redrawCanvas();
			}
		});

		// Keep cy sized to container changes
		if (container) {
			const resizeObserver = new ResizeObserver(() => {
				cy?.resize();
				if (overlayCanvas && container) {
					overlayCanvas.height = container.clientHeight;
					overlayCanvas.width = container.clientWidth;
					annotator?.redrawCanvas();
				}
			});
			resizeObserver.observe(container);
		}
	});
</script>

<div class="treeline-card relative h-full min-h-[400px] w-full overflow-hidden">
	<div
		bind:this={container}
		class="absolute inset-0 rounded">
	</div>
	<canvas
		bind:this={overlayCanvas}
		class="pointer-events-none absolute inset-0 z-50 rounded"></canvas>

	<div class="absolute bottom-4 left-4 z-40 flex gap-2">
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
				console.log('Overlay toggled:', showOverlay);
			}}>
			{showOverlay ? 'Hide' : 'Show'} Overlay
		</button>
	</div>
</div>
