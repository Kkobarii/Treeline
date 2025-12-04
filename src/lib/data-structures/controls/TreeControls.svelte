<script lang="ts">
	import { onMount } from 'svelte';

	import { EventType, InputValueChangedEvent, type OperationManager } from '$lib/data-structures/operation/operationManager';
	import { OperationType } from '$lib/data-structures/structures/dataStructure';
	import { enforceMinMax } from '$lib/data-structures/utils/utils';

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

<div
	class="flex flex-col gap-6 rounded bg-gray-100 p-4"
	style="width: 22em; height: 100%;">
	<div class="flex flex-col gap-2">
		<h2 class="text-xl font-semibold">Tree Controls</h2>
		<div class="flex flex-col gap-4">
			<div>
				<button
					type="button"
					on:click={() => operationManager.operation(OperationType.Tree.Insert, Math.floor(Math.random() * 1000))}
					disabled={locked}>
					Insert Random Node
				</button>
				<button
					type="button"
					on:click={() => operationManager.reset()}
					disabled={locked}>
					Reset
				</button>
			</div>
			<div>
				<input
					type="number"
					class="w-15 rounded border p-2"
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
					type="button"
					on:click={() => operationManager.operation(OperationType.Tree.Insert, manualValue)}
					disabled={locked}>
					Insert
				</button>
				<button
					type="button"
					on:click={() => operationManager.operation(OperationType.Tree.Remove, manualValue)}
					disabled={locked}>
					Remove
				</button>
				<button
					type="button"
					on:click={() => operationManager.operation(OperationType.Tree.Find, manualValue)}
					disabled={locked}>
					Find
				</button>
			</div>
		</div>
	</div>

	<OperationControls {operationManager} />
</div>
