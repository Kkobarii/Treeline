<script lang="ts">
	import DescriptionCard from '$lib/components/DescriptionCard.svelte';
	import TreeControls from '$lib/data-structures/controls/specific/TreeControls.svelte';
	import { OperationManager } from '$lib/data-structures/operation/operationManager';
	import AVLTreeVisual from '$lib/data-structures/structures/avlTree/AVLTreeVisual.svelte';
	import { StructureType } from '$lib/data-structures/structures/dataStructure';
	import { getLocale, translate } from '$lib/i18n';

	const locale = getLocale();
	const t = (key: string) => translate(locale, key);

	let operationManager: OperationManager = new OperationManager(StructureType.AVLTree);
</script>

<h1 class="page-title">{t('dataStructures.avlTree')}</h1>
<div class="page-layout">
	<AVLTreeVisual {operationManager} />
	<TreeControls {operationManager} />
</div>

<DescriptionCard filename="data-structures/avl_tree" />
