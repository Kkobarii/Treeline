<script lang="ts">
	import type { OperationManager } from '$lib/data-structures/operations/operationManager';
	import { OperationType } from '$lib/data-structures/structures/dataStructure';
	import { enforceMinMax } from '$lib/data-structures/utils/utils';
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
	title={t('controls.tree.title')}
	bind:manualValue
	bind:locked>
	<div class="buttons-in-col">
		<button
			on:click={() => operationManager.operation(OperationType.Tree.Insert, Math.floor(Math.random() * 1000))}
			disabled={locked}>
			{t('controls.tree.insertRandom')}
		</button>
		<button
			on:click={() => operationManager.reset()}
			disabled={locked}>
			{t('common.reset')}
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
			{t('common.insert')}
		</button>
		<button
			on:click={() => operationManager.operation(OperationType.Tree.Remove, manualValue)}
			disabled={locked}>
			{t('common.remove')}
		</button>
		<button
			on:click={() => operationManager.operation(OperationType.Tree.Find, manualValue)}
			disabled={locked}>
			{t('common.find')}
		</button>
	</div>
</BaseControls>
