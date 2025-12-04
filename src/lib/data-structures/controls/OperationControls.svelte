<script lang="ts">
	import { onMount } from 'svelte';

	import type { OperationData } from '$lib/data-structures/operation/operationData';
	import {
		CurrentOperationChangedEvent,
		CurrentStepChangedEvent,
		EventType,
		OperationManager,
	} from '$lib/data-structures/operation/operationManager';

	export let operationManager: OperationManager;

	let canDoNext: boolean = false;
	let canDoPrevious: boolean = false;
	let locked: boolean = false;

	let operations: OperationData[] = [];
	let currentOperation: number = 0;
	let currentStep: number = 0;

	onMount(() => {
		operationManager.addEventListener(EventType.CurrentOperationChanged, (e: Event) => {
			const event = e as CustomEvent<CurrentOperationChangedEvent>;

			currentOperation = event.detail.currentOperationId;
			updateCanDoFlags();
		});

		operationManager.addEventListener(EventType.CurrentStepChanged, (e: Event) => {
			const event = e as CustomEvent<CurrentStepChangedEvent>;

			currentStep = event.detail.currentStepId;
			updateCanDoFlags();

			setTimeout(() => {
				scrollToCurrentStep();
			}, 50);
		});

		operationManager.addEventListener(EventType.OperationListChanged, (e: Event) => {
			const event = e as CustomEvent<{ operations: OperationData[] }>;
			operations = event.detail.operations;
			updateCanDoFlags();
		});

		operationManager.addEventListener(EventType.ShowStepsToggled, () => {
			updateCanDoFlags();
		});

		operationManager.addEventListener(EventType.AnimationLockChanged, (e: Event) => {
			const ev = e as CustomEvent<boolean>;
			locked = ev.detail;
			updateCanDoFlags();
		});
	});

	function updateCanDoFlags() {
		canDoNext = operationManager.canDoNext();
		canDoPrevious = operationManager.canDoPrevious();
	}

	function scrollToCurrentStep() {
		const stepElements = document.querySelectorAll('.operation-step');
		stepElements.forEach(el => {
			if (el.classList.contains('bg-gray-400')) {
				el.scrollIntoView({ behavior: 'smooth', block: 'center' });
			}
		});
	}
</script>

<div class="flex flex-none flex-col gap-2">
	<h2 class="text-xl font-semibold">Operation Controls</h2>
	<div>
		<button
			type="button"
			on:click={() => operationManager.previous()}
			disabled={!canDoPrevious || locked}>
			Previous
		</button>
		<button
			type="button"
			on:click={() => operationManager.next()}
			disabled={!canDoNext || locked}>
			Next
		</button>
		<input
			id="steps-checkbox"
			type="checkbox"
			class="h-4 w-4"
			on:change={() => operationManager.toggleShowSteps()}
			disabled={locked} />
		<label
			for="steps-checkbox"
			class="mr-4">
			Steps
		</label>
	</div>
</div>

<div class="flex min-h-0 flex-1 flex-col gap-2">
	<h2 class="flex-none text-xl font-semibold">Operation Info</h2>

	<div class="flex-1 overflow-y-auto" id="operation-info">
		<ul class="flex flex-col gap-2">
			{#each operations as op}
				<li class="{operations[currentOperation] === op ? 'bg-gray-300' : 'bg-gray-200'} rounded p-2 text-sm mr-1">
					{op.operation}
					{#if operations[currentOperation] === op}
						<ul>
							{#each op.steps as step}
								<li
									class="{operations[currentOperation].steps[currentStep] === step && operations[currentOperation] === op
										? 'bg-gray-400'
										: 'text-gray-700'} operation-step rounded p-1 text-sm">
									{step.id + 1}: {(step.data as any).action}
								</li>
							{/each}
						</ul>
					{/if}
				</li>
			{/each}
		</ul>
	</div>
</div>
