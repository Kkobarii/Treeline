<script lang="ts">
	import type { OperationManager } from '$lib/data-structures/operation/operationManager';
	import { OperationType } from '$lib/data-structures/structures/dataStructure';
	import { t } from '$lib/i18n';

	import BaseControls from '../BaseControls.svelte';

	export let operationManager: OperationManager;

	let manualValue: number = 0;
	let locked: boolean = false;
</script>

<BaseControls
	{operationManager}
	title={$t('controls.queue.title')}
	bind:manualValue
	bind:locked>
	<div class="buttons-in-col">
		<div class="buttons-in-row">
			<button
				on:click={() => operationManager.operation(OperationType.Queue.Enqueue, Math.floor(Math.random() * 1000))}
				disabled={locked}>
				{$t('controls.queue.enqueueRandom')}
			</button>
		</div>
		<button
			on:click={() => operationManager.reset()}
			disabled={locked}>
			{$t('common.reset')}
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
			{$t('controls.queue.enqueue')}
		</button>
	</div>

	<div class="buttons-in-row">
		<button
			on:click={() => operationManager.operation(OperationType.Queue.Dequeue, null)}
			disabled={locked}>
			{$t('controls.queue.dequeue')}
		</button>
		<button
			on:click={() => operationManager.operation(OperationType.Queue.Peek, null)}
			disabled={locked}>
			{$t('controls.queue.peek')}
		</button>
	</div>
</BaseControls>
