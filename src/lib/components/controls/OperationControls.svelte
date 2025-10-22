<script lang="ts">
	import type { OperationData } from '$lib/operation/operationData';
	import { ChangeFlags, OperationManager } from '$lib/operation/operationManager';
	import { onMount } from 'svelte';

	export let operationManager: OperationManager;

	let canDoNext: boolean = false;
	let canDoPrevious: boolean = false;

	let operations: OperationData[] = [];
	let currentOperation: number = 0;
	let currentStep: number = 0;

	onMount(() => {
		console.log('Mount OperationControls component');
		operationManager.addEventListener((e: Event) => {
			const event = e as CustomEvent<ChangeFlags>;
			if (!event.detail.list) return;

			let data = operationManager.getListData();

			canDoNext = data.canDoNext;
			canDoPrevious = data.canDoPrevious;

			operations = data.operations;
			currentOperation = data.currentOperation;
			currentStep = data.currentStep;

			setTimeout(() => {
				scrollToCurrentStep();
			}, 50);
		});
	});

	function scrollToCurrentStep() {
		const stepElements = document.querySelectorAll('.operation-step');
		stepElements.forEach(el => {
			if (el.classList.contains('bg-gray-400')) {
				el.scrollIntoView({ behavior: 'smooth', block: 'center' });
			}
		});
	}
</script>

<div class="mt-6">
	<h2 class="mb-2 text-xl font-semibold">Operation Controls</h2>
	<button
		type="button"
		on:click={() => operationManager.previous()}
		disabled={!canDoPrevious}>
		Previous
	</button>
	<button
		type="button"
		on:click={() => operationManager.next()}
		disabled={!canDoNext}>
		Next
	</button>
	<input
		id="steps-checkbox"
		type="checkbox"
		class="h-4 w-4"
		on:change={() => operationManager.toggleShowSteps()} />
	<label
		for="steps-checkbox"
		class="mr-4">
		Steps
	</label>
</div>

<div class="mt-6">
	<h2 class="mb-2 text-xl font-semibold">Operation Info</h2>
	<div
		class="overflow-y-auto"
		style="max-height: 35vh;">
		<ul>
			{#each operations as op}
				<li class="{operations[currentOperation] === op ? 'bg-gray-300' : 'bg-gray-200'} mb-2 rounded p-2 text-sm">
					{op.operation}
					{#if operations[currentOperation] === op}
						<ul>
							{#each op.steps as step}
								<li
									class="{operations[currentOperation].steps[currentStep] === step && operations[currentOperation] === op
										? 'bg-gray-400'
										: 'text-gray-700'} operation-step rounded p-1 text-sm">
									{step.id + 1}: {step.data.action}
								</li>
							{/each}
						</ul>
					{/if}
				</li>
			{/each}
		</ul>
	</div>
</div>
