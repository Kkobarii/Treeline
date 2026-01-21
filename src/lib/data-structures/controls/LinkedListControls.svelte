<script lang="ts">
	import { onMount } from 'svelte';

	import { EventType, InputValueChangedEvent, type OperationManager } from '$lib/data-structures/operation/operationManager';
	import { OperationType } from '$lib/data-structures/structures/dataStructure';

	import OperationControls from './OperationControls.svelte';

	export let operationManager: OperationManager;

	let manualValue: number = 0;
	let locked: boolean = false;

	onMount(() => {
		operationManager.addEventListener(EventType.InputValueChanged, (e: Event) => {
			const event = e as CustomEvent<InputValueChangedEvent>;
			if (!isNaN(event.detail.inputValue)) manualValue = event.detail.inputValue;
		});

		operationManager.addEventListener(EventType.AnimationLockChanged, (e: Event) => {
			const ev = e as CustomEvent<boolean>;
			locked = ev.detail;
		});
	});
</script>

<div class="list-controls-container treeline-card flex flex-col gap-6">
	<div class="flex flex-col gap-4">
		<h2 class="text-primary text-lg font-bold">Linked List Controls</h2>
		<div class="flex flex-col gap-4">
			<div class="flex flex-col gap-2">
				<div class="flex gap-2">
					<button
						type="button"
						on:click={() => operationManager.operation(OperationType.LinkedList.InsertHead, Math.floor(Math.random() * 1000))}
						disabled={locked}>
						Insert Random at Head
					</button>
					<button
						type="button"
						on:click={() => operationManager.operation(OperationType.LinkedList.InsertTail, Math.floor(Math.random() * 1000))}
						disabled={locked}>
						Insert Random at Tail
					</button>
				</div>
				<button
					type="button"
					on:click={() => operationManager.reset()}
					disabled={locked}>
					Reset
				</button>
			</div>
			<div class="flex items-center gap-2">
				<input
					type="number"
					class="w-15 rounded border border-gray-300 bg-gray-100 text-center"
					bind:value={manualValue}
					disabled={locked} />
				<div class="flex gap-2">
					<button
						type="button"
						on:click={() => operationManager.operation(OperationType.LinkedList.InsertHead, manualValue)}
						disabled={locked}>
						Insert at Head
					</button>
					<button
						type="button"
						on:click={() => operationManager.operation(OperationType.LinkedList.InsertTail, manualValue)}
						disabled={locked}>
						Insert at Tail
					</button>
				</div>
			</div>
			<div class="flex gap-2">
				<button
					type="button"
					class="flex-1"
					on:click={() => operationManager.operation(OperationType.LinkedList.Find, manualValue)}
					disabled={locked}>
					Find
				</button>
				<button
					type="button"
					class="flex-1"
					on:click={() => operationManager.operation(OperationType.LinkedList.Remove, manualValue)}
					disabled={locked}>
					Remove
				</button>
			</div>
		</div>
	</div>
	<OperationControls {operationManager} />
</div>
