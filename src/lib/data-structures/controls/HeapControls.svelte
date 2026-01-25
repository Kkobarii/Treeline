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

<div class="tree-controls-container treeline-card flex flex-col gap-6">
	<div class="flex flex-col gap-4">
		<h2 class="text-primary text-lg font-bold">Heap Controls</h2>
		<div class="flex flex-col gap-4">
			<div class="flex w-full flex-col gap-2">
				<button
					class="w-full"
					type="button"
					on:click={() => operationManager.operation(OperationType.Heap.Insert, Math.floor(Math.random() * 1000))}
					disabled={locked}>
					Insert Random Node
				</button>
				<button
					class="w-full"
					type="button"
					on:click={() => operationManager.reset()}
					disabled={locked}>
					Reset
				</button>
			</div>
			<div class="flex w-full items-center gap-2">
				<input
					type="number"
					class="w-15 rounded border border-gray-300 bg-gray-100 text-center"
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
					class="flex-1"
					type="button"
					on:click={() => operationManager.operation(OperationType.Heap.Insert, manualValue)}
					disabled={locked}>
					Insert
				</button>
				<button
					class="flex-1"
					type="button"
					on:click={() => operationManager.operation(OperationType.Heap.ExtractRoot, null)}
					disabled={locked}>
					Extract Root
				</button>
			</div>
		</div>
	</div>

	<OperationControls {operationManager} />
</div>
