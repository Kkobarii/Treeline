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
	title="Stack Controls"
	bind:manualValue
	bind:locked>
	<div class="buttons-in-col">
		<div class="buttons-in-row">
			<button
				on:click={() => operationManager.operation(OperationType.Stack.Push, Math.floor(Math.random() * 1000))}
				disabled={locked}>
				Push Random
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
			on:click={() => operationManager.operation(OperationType.Stack.Push, manualValue)}
			disabled={locked}>
			Push
		</button>
	</div>

	<div class="buttons-in-row">
		<button
			on:click={() => operationManager.operation(OperationType.Stack.Pop, null)}
			disabled={locked}>
			Pop
		</button>
		<button
			on:click={() => operationManager.operation(OperationType.Stack.Peek, null)}
			disabled={locked}>
			Peek
		</button>
	</div>
</BaseControls>
