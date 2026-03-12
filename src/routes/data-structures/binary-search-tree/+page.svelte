<script lang="ts">
	import DescriptionCard from '$lib/components/DescriptionCard.svelte';
	import TreeControls from '$lib/data-structures/controls/specific/TreeControls.svelte';
	import { OperationManager } from '$lib/data-structures/operation/operationManager';
	import BSTreeVisual from '$lib/data-structures/structures/bsTree/BSTreeVisual.svelte';
	import { StructureType } from '$lib/data-structures/structures/dataStructure';
	import { t } from '$lib/i18n';

	let operationManager: OperationManager = new OperationManager(StructureType.BSTree);
</script>

<h1 class="page-title">{$t('dataStructures.binarySearchTree')}</h1>
<div class="page-layout">
	<BSTreeVisual {operationManager} />
	<TreeControls {operationManager} />
</div>

<DescriptionCard filename="data-structures/bs_tree" />
