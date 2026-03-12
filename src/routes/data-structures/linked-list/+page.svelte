<script lang="ts">
	import DescriptionCard from '$lib/components/DescriptionCard.svelte';
	import LinkedListControls from '$lib/data-structures/controls/specific/LinkedListControls.svelte';
	import { OperationManager } from '$lib/data-structures/operation/operationManager';
	import { StructureType } from '$lib/data-structures/structures/dataStructure';
	import LinkedListVisual from '$lib/data-structures/structures/linkedList/LinkedListVisual.svelte';
	import { t } from '$lib/i18n';

	let operationManager: OperationManager = new OperationManager(StructureType.LinkedList, 5);
</script>

<h1 class="page-title">{$t('dataStructures.linkedList')}</h1>
<div class="page-layout">
	<LinkedListVisual {operationManager} />
	<LinkedListControls {operationManager} />
</div>

<DescriptionCard filename="data-structures/linked_list" />
