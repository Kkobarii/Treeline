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
	title={$t('controls.linkedList.title')}
	bind:manualValue
	bind:locked>
	<div class="buttons-in-col">
		<div class="buttons-in-row">
			<button
				on:click={() => operationManager.operation(OperationType.LinkedList.InsertHead, Math.floor(Math.random() * 1000))}
				disabled={locked}>
				{$t('controls.linkedList.insertRandomHead')}
			</button>
			<button
				on:click={() => operationManager.operation(OperationType.LinkedList.InsertTail, Math.floor(Math.random() * 1000))}
				disabled={locked}>
				{$t('controls.linkedList.insertRandomTail')}
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
			on:click={() => operationManager.operation(OperationType.LinkedList.InsertHead, manualValue)}
			disabled={locked}>
			{$t('controls.linkedList.insertHead')}
		</button>
		<button
			on:click={() => operationManager.operation(OperationType.LinkedList.InsertTail, manualValue)}
			disabled={locked}>
			{$t('controls.linkedList.insertTail')}
		</button>
	</div>

	<div class="buttons-in-row">
		<button
			on:click={() => operationManager.operation(OperationType.LinkedList.Find, manualValue)}
			disabled={locked}>
			{$t('common.find')}
		</button>
		<button
			on:click={() => operationManager.operation(OperationType.LinkedList.Remove, manualValue)}
			disabled={locked}>
			{$t('common.remove')}
		</button>
	</div>
</BaseControls>
