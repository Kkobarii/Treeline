<script lang="ts">
	import type { OperationManager } from '$lib/data-structures/operations/operationManager';
	import { getLocale, translate } from '$lib/i18n';

	const locale = getLocale();
	const t = (key: string) => translate(locale, key);

	export let operationManager: OperationManager;
	export let locked: boolean = false;
</script>

<div class="buttons-in-row">
	<button
		on:click={() => operationManager.clear()}
		disabled={locked}>
		{t('common.clear')}
	</button>
	<button
		on:click={() => operationManager.rebuild()}
		disabled={locked}>
		{t('common.rebuild')}
	</button>
</div>
