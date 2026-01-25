<script lang="ts">
	import type { OperationManager } from '$lib/data-structures/operation/operationManager';
	import { OperationType } from '$lib/data-structures/structures/dataStructure';
	import { enforceMinMax } from '$lib/data-structures/utils/utils';

	import BaseControls from '../BaseControls.svelte';

	export let operationManager: OperationManager;

	let manualValue: number = 0;
	let locked: boolean = false;
</script>

<BaseControls
	{operationManager}
	title="Tree Controls"
	bind:manualValue
	bind:locked>
	<div class="buttons-in-col">
		<button
			on:click={() => operationManager.operation(OperationType.Tree.Insert, Math.floor(Math.random() * 1000))}
			disabled={locked}>
			Insert Random Node
		</button>
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
			max="999"
			min="0"
			on:keyup={e => (manualValue = enforceMinMax(e.target as HTMLInputElement))}
			on:change={e => {
				manualValue = enforceMinMax(e.target as HTMLInputElement);
				operationManager.updateCurrentValue(manualValue);
			}}
			disabled={locked} />
		<button
			on:click={() => operationManager.operation(OperationType.Tree.Insert, manualValue)}
			disabled={locked}>
			Insert
		</button>
		<button
			on:click={() => operationManager.operation(OperationType.Tree.Remove, manualValue)}
			disabled={locked}>
			Remove
		</button>
		<button
			on:click={() => operationManager.operation(OperationType.Tree.Find, manualValue)}
			disabled={locked}>
			Find
		</button>
	</div>
</BaseControls>
