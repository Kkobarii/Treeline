<script lang="ts">
	import TreeControls from '$lib/data-structures/controls/specific/TreeControls.svelte';
	import DataStructureDescription from '$lib/data-structures/DataStructureDescription.svelte';
	import { OperationManager } from '$lib/data-structures/operation/operationManager';
	import BSTreeVisual from '$lib/data-structures/structures/bsTree/BSTreeVisual.svelte';
	import { StructureType } from '$lib/data-structures/structures/dataStructure';

	let operationManager: OperationManager = new OperationManager(StructureType.BSTree);
</script>

<h1 class="page-title">Binary Search Tree</h1>
<div class="page-layout">
	<BSTreeVisual {operationManager} />
	<TreeControls {operationManager} />
</div>

<DataStructureDescription filename="data-structures/bs_tree" />
