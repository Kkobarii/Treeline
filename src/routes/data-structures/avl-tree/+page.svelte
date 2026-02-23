<script lang="ts">
	import TreeControls from '$lib/data-structures/controls/specific/TreeControls.svelte';
	import DataStructureDescription from '$lib/data-structures/DataStructureDescription.svelte';
	import { OperationManager } from '$lib/data-structures/operation/operationManager';
	import AVLTreeVisual from '$lib/data-structures/structures/avlTree/AVLTreeVisual.svelte';
	import { StructureType } from '$lib/data-structures/structures/dataStructure';

	let operationManager: OperationManager = new OperationManager(StructureType.AVLTree);
</script>

<h1 class="page-title">AVL Tree</h1>
<div class="page-layout">
	<AVLTreeVisual {operationManager} />
	<TreeControls {operationManager} />
</div>

<DataStructureDescription filename="data-structures/avl_tree" />
