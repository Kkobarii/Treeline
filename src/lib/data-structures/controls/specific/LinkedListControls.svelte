<script lang="ts">
	import type { OperationManager } from '$lib/data-structures/operation/operationManager';
	import { OperationType } from '$lib/data-structures/structures/dataStructure';

	import BaseControls from '../BaseControls.svelte';

	export let operationManager: OperationManager;

	let manualValue: number = 0;
	let locked: boolean = false;
</script>

<BaseControls
	{operationManager}
	title="Linked List Controls"
	bind:manualValue
	bind:locked>
	<div class="buttons-in-col">
		<div class="buttons-in-row">
			<button
				on:click={() => operationManager.operation(OperationType.LinkedList.InsertHead, Math.floor(Math.random() * 1000))}
				disabled={locked}>
				Insert Random Head
			</button>
			<button
				on:click={() => operationManager.operation(OperationType.LinkedList.InsertTail, Math.floor(Math.random() * 1000))}
				disabled={locked}>
				Insert Random Tail
			</button>
		</div>
		<button
			on:click={() => operationManager.reset()}
			disabled={locked}>
			Reset
		</button>
	</div>

	<div class="buttons-in-row">
		<input
			type="number"
			bind:value={manualValue}
			disabled={locked} />
		<button
			on:click={() => operationManager.operation(OperationType.LinkedList.InsertHead, manualValue)}
			disabled={locked}>
			Insert Head
		</button>
		<button
			on:click={() => operationManager.operation(OperationType.LinkedList.InsertTail, manualValue)}
			disabled={locked}>
			Insert Tail
		</button>
	</div>

	<div class="buttons-in-row">
		<button
			on:click={() => operationManager.operation(OperationType.LinkedList.Find, manualValue)}
			disabled={locked}>
			Find
		</button>
		<button
			on:click={() => operationManager.operation(OperationType.LinkedList.Remove, manualValue)}
			disabled={locked}>
			Remove
		</button>
	</div>
</BaseControls>
