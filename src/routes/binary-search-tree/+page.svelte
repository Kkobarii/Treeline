<script lang="ts">
	import { onMount } from 'svelte';
	import { Network } from 'vis-network/standalone';
	import { BinaryTreeNode } from '$lib/structures/binaryTree';
	import { treeToGraph } from '$lib/utils/trees';
	import { enforceMinMax } from '$lib/utils/utils';
	import { OperationManager } from '$lib/operation/operationManager';
	import { OperationType, TreeType } from '$lib/structures/generic';
	import type { OperationData } from '$lib/operation/operationData';

	let container: HTMLElement;
	let network: Network | null = null;
	let { nodes, edges } = treeToGraph(null);

	let operationManager: OperationManager | undefined;
	let operations: OperationData[] = [];
	let currentOperation: number = 0;
	let currentStep: number = 0;

	let manualValue: number = 0;
	let autoPlay: boolean = false;
	let canDoNext: boolean = false;
	let canDoPrevious: boolean = false;

	onMount(() => {
		network = new Network(
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
			if (params.nodes.length > 0) {
				const nodeId = params.nodes[0];
				let node = undefined;
				for (let n of nodes) {
					if (n.id === nodeId) {
						node = n;
						break;
					}
				}
				console.log('Selected node:', node);
				manualValue = node ? Number(node.label) || 0 : 0;
			}
		});

		operationManager = new OperationManager(TreeType.Binary);
		operationManager.addEventListener('change', e => {
			updateOperationState();
		});
		updateOperationState();
	});

	function updateOperationState() {
		const opsState = operationManager?.getState();
		if (opsState) {
			operations = opsState.operations;
			currentOperation = opsState.currentOperation;
			currentStep = opsState.currentStep;
			({ nodes, edges } = treeToGraph(operations[currentOperation].endSnapshot?.root as BinaryTreeNode));
			network?.setData({ nodes, edges });
			canDoNext = opsState.canDoNext;
			canDoPrevious = opsState.canDoPrevious;
		}
	}
</script>

<h1 class="mb-4 text-2xl font-bold">Binary Tree Prototype</h1>
<div class="display: mb-4 flex">
	<div
		bind:this={container}
		style="width: 1200px; height: 700px; border: 1px solid lightgray;">
	</div>

	<div class="mr-4 ml-4 w-100 rounded bg-gray-100 p-4">
		<div>
			<h2 class="mb-2 text-xl font-semibold">Tree Controls</h2>
			<div>
				<button
					type="button"
					on:click={() => operationManager?.doOperation(OperationType.Insert, Math.floor(Math.random() * 1000))}>
					Insert Random Node
				</button>
				<button
					type="button"
					on:click={() => operationManager?.reset()}>
					Reset
				</button>
			</div>

			<div class="mt-4">
				<input
					type="number"
					class="w-15 rounded border p-2"
					bind:value={manualValue}
					max="999"
					min="0"
					on:keyup={e => enforceMinMax(e.target as HTMLInputElement)} />
				<button
					type="button"
					on:click={() => operationManager?.doOperation(OperationType.Insert, manualValue)}>
					Insert
				</button>
				<button
					type="button"
					on:click={() => operationManager?.doOperation(OperationType.Remove, manualValue)}>
					Remove
				</button>
				<button
					type="button"
					on:click={() => operationManager?.doOperation(OperationType.Find, manualValue)}>
					Find
				</button>
			</div>
		</div>

		<div class="mt-6">
			<h2 class="mb-2 text-xl font-semibold">Operation Controls</h2>
			<button
				type="button"
				on:click={() => operationManager?.previous()}
				disabled={!canDoPrevious}>
				Previous
			</button>
			<button
				type="button"
				on:click={() => operationManager?.next()}
				disabled={!canDoNext}>
				Next
			</button>
			<input
				id="steps-checkbox"
				type="checkbox"
				bind:checked={autoPlay}
				class="h-4 w-4"
				on:change={() => operationManager?.toggleShowSteps()} />
			<label
				for="steps-checkbox"
				class="mr-4">
				Steps
			</label>
		</div>

		<div class="mt-6">
			<h2 class="mb-2 text-xl font-semibold">Operation Info</h2>
			<!-- scroll element -->
			<div class="max-h-80 overflow-y-auto">
				<ul>
					{#each operations as op}
						<li class="{operations[currentOperation] === op ? 'bg-gray-300' : 'bg-gray-200'} mb-2 rounded p-2 text-sm">
							{op.operation}
							{#if operations[currentOperation] === op}
								<ul>
									{#each op.steps as step}
										<li
											class="{operations[currentOperation].steps[currentStep] === step &&
											operations[currentOperation] === op
												? 'bg-gray-400'
												: 'text-gray-700'} rounded p-1 text-sm">
											{step.id + 1}: {step.tmp}
										</li>
									{/each}
								</ul>
							{/if}
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
</div>
