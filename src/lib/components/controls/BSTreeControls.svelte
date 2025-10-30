<script lang="ts">
	import { OperationType } from '$lib/structures/dataStructure';
	import { EventType, InputValueChangedEvent, type OperationManager } from '$lib/operation/operationManager';
	import { enforceMinMax } from '$lib/utils/utils';
	import { onMount } from 'svelte';
	import OperationControls from './OperationControls.svelte';

	export let operationManager: OperationManager;

	let manualValue: number = 0;

	onMount(() => {
		operationManager.addEventListener(EventType.InputValueChanged, (e: Event) => {
			const event = e as CustomEvent<InputValueChangedEvent>;
			console.log('InputValueChanged event received:', event.detail.inputValue);
			manualValue = event.detail.inputValue;
		});
	});
</script>

<div
	class="rounded bg-gray-100 p-4"
	style="width: 25em; height: 100%;">
	<div>
		<h2 class="mb-2 text-xl font-semibold">Tree Controls</h2>
		<div>
			<button
				type="button"
				on:click={() => operationManager?.operation(OperationType.BSTree.Insert, Math.floor(Math.random() * 1000))}>
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
				on:keyup={e => enforceMinMax(e.target as HTMLInputElement)}
				on:change={e => operationManager?.updateCurrentValue(manualValue)} />
			<button
				type="button"
				on:click={() => operationManager?.operation(OperationType.BSTree.Insert, manualValue)}>
				Insert
			</button>
			<button
				type="button"
				on:click={() => operationManager?.operation(OperationType.BSTree.Remove, manualValue)}>
				Remove
			</button>
			<button
				type="button"
				on:click={() => operationManager?.operation(OperationType.BSTree.Find, manualValue)}>
				Find
			</button>
		</div>
	</div>
	<OperationControls {operationManager} />
</div>
