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
	title="Queue Controls"
	bind:manualValue
	bind:locked>
	<div class="buttons-in-col">
		<div class="buttons-in-row">
			<button
				on:click={() => operationManager.operation(OperationType.Queue.Enqueue, Math.floor(Math.random() * 1000))}
				disabled={locked}>
				Enqueue Random
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
			on:click={() => operationManager.operation(OperationType.Queue.Enqueue, manualValue)}
			disabled={locked}>
			Enqueue
		</button>
	</div>

	<div class="buttons-in-row">
		<button
			on:click={() => operationManager.operation(OperationType.Queue.Dequeue, null)}
			disabled={locked}>
			Dequeue
		</button>
		<button
			on:click={() => operationManager.operation(OperationType.Queue.Peek, null)}
			disabled={locked}>
			Peek
		</button>
	</div>
</BaseControls>
