<script lang="ts">
	import DescriptionCard from '$lib/components/DescriptionCard.svelte';
	import HeapControls from '$lib/data-structures/controls/specific/HeapControls.svelte';
	import { OperationManager } from '$lib/data-structures/operation/operationManager';
	import { StructureType } from '$lib/data-structures/structures/dataStructure';
	import HeapVisual from '$lib/data-structures/structures/heap/HeapVisual.svelte';
	import { getLocale, translate } from '$lib/i18n';

	const locale = getLocale();
	const t = (key: string) => translate(locale, key);

	let operationManager: OperationManager = new OperationManager(StructureType.Heap);
</script>

<h1 class="page-title">{t('dataStructures.heap')}</h1>
<div class="page-layout">
	<HeapVisual {operationManager} />
	<HeapControls {operationManager} />
</div>

<DescriptionCard />
