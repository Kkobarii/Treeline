<script lang="ts">
	import TreeControls from '$lib/data-structures/controls/TreeControls.svelte';
	import DataStructureDescription from '$lib/data-structures/DataStructureDescription.svelte';
	import { OperationManager } from '$lib/data-structures/operation/operationManager';
	import AVLTreeVisual from '$lib/data-structures/structures/avlTree/AVLTreeVisual.svelte';
	import { StructureType } from '$lib/data-structures/structures/dataStructure';

	let operationManager: OperationManager = new OperationManager(StructureType.AVLTree);
</script>

<h1 class="page-title">AVL Tree Simulation</h1>
<div class="page-layout">
	<div>
		<AVLTreeVisual {operationManager} />
	</div>

	<div>
		<TreeControls {operationManager} />
	</div>
</div>

<DataStructureDescription filename="avl_tree.md" />
