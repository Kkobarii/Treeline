<script lang="ts">
	import DescriptionCard from '$lib/components/DescriptionCard.svelte';
	import StackControls from '$lib/data-structures/controls/specific/StackControls.svelte';
	import { OperationManager } from '$lib/data-structures/operation/operationManager';
	import { StructureType } from '$lib/data-structures/structures/dataStructure';
	import StackVisual from '$lib/data-structures/structures/stack/StackVisual.svelte';
	import { getLocale, translate } from '$lib/i18n';

	const locale = getLocale();
	const t = (key: string) => translate(locale, key);

	let operationManager: OperationManager = new OperationManager(StructureType.Stack, 5);
</script>

<h1 class="page-title">{t('dataStructures.stack')}</h1>
<div class="page-layout">
	<StackVisual {operationManager} />
	<StackControls {operationManager} />
</div>

<DescriptionCard filename="data-structures/stack" />
