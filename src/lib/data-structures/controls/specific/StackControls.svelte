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
	title={$t('controls.stack.title')}
	bind:manualValue
	bind:locked>
	<div class="buttons-in-col">
		<div class="buttons-in-row">
			<button
				on:click={() => operationManager.operation(OperationType.Stack.Push, Math.floor(Math.random() * 1000))}
				disabled={locked}>
				{$t('controls.stack.pushRandom')}
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
			on:click={() => operationManager.operation(OperationType.Stack.Push, manualValue)}
			disabled={locked}>
			{$t('controls.stack.push')}
		</button>
	</div>

	<div class="buttons-in-row">
		<button
			on:click={() => operationManager.operation(OperationType.Stack.Pop, null)}
			disabled={locked}>
			{$t('controls.stack.pop')}
		</button>
		<button
			on:click={() => operationManager.operation(OperationType.Stack.Peek, null)}
			disabled={locked}>
			{$t('controls.stack.peek')}
		</button>
	</div>
</BaseControls>
