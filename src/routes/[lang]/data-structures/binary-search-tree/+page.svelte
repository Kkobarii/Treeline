<script lang="ts">
	import DescriptionCard from '$lib/components/DescriptionCard.svelte';
	import TreeControls from '$lib/data-structures/controls/specific/TreeControls.svelte';
	import { OperationManager } from '$lib/data-structures/operations/operationManager';
	import BSTreeVisual from '$lib/data-structures/structures/bsTree/BSTreeVisual.svelte';
	import { StructureType } from '$lib/data-structures/structures/dataStructure';
	import { getLocale, translate } from '$lib/i18n';

	const locale = getLocale();
	const t = (key: string) => translate(locale, key);

	let operationManager: OperationManager = new OperationManager(StructureType.BSTree);
</script>

<h1 class="page-title">{t('dataStructures.binarySearchTree')}</h1>
<div class="page-layout">
	<BSTreeVisual {operationManager} />
	<TreeControls {operationManager} />
</div>

<DescriptionCard />
