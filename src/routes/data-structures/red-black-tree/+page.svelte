<script lang="ts">
	import DescriptionCard from '$lib/components/DescriptionCard.svelte';
	import TreeControls from '$lib/data-structures/controls/specific/TreeControls.svelte';
	import { OperationManager } from '$lib/data-structures/operation/operationManager';
	import { StructureType } from '$lib/data-structures/structures/dataStructure';
	import RBTreeVisual from '$lib/data-structures/structures/rbTree/RBTreeVisual.svelte';

	let operationManager: OperationManager = new OperationManager(StructureType.RBTree);
</script>

<h1 class="page-title">Red-Black Tree</h1>
<div class="page-layout">
	<RBTreeVisual {operationManager} />
	<TreeControls {operationManager} />
</div>

<DescriptionCard filename="data-structures/rb_tree" />
