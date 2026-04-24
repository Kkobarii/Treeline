<script lang="ts">
	import type { OperationManager } from '$lib/data-structures/operations/operationManager';
	import { OperationType } from '$lib/data-structures/structures/dataStructure';
	import { getLocale, translate } from '$lib/i18n';

	import BaseControls from '../BaseControls.svelte';

	const locale = getLocale();
	const t = (key: string) => translate(locale, key);

	export let operationManager: OperationManager;

	let manualValue: number = 0;
	let locked: boolean = false;
</script>

<BaseControls
	{operationManager}
	bind:manualValue
	bind:locked>
	<button
		on:click={() => operationManager.operation(OperationType.Queue.Enqueue, Math.floor(Math.random() * 1000))}
		disabled={locked}>
		{t('controls.queue.enqueueRandom')}
	</button>

	<div class="buttons-in-row">
		<input
			type="number"
			bind:value={manualValue}
			disabled={locked} />
		<button
			on:click={() => operationManager.operation(OperationType.Queue.Enqueue, manualValue)}
			disabled={locked}>
			{t('controls.queue.enqueue')}
		</button>
	</div>

	<div class="buttons-in-row">
		<button
			on:click={() => operationManager.operation(OperationType.Queue.Dequeue, null)}
			disabled={locked}>
			{t('controls.queue.dequeue')}
		</button>
		<button
			on:click={() => operationManager.operation(OperationType.Queue.Peek, null)}
			disabled={locked}>
			{t('controls.queue.peek')}
		</button>
	</div>
</BaseControls>
