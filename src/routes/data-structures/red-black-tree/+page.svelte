<script lang="ts">
	import TreeControls from '$lib/data-structures/controls/specific/TreeControls.svelte';
	import DataStructureDescription from '$lib/data-structures/DataStructureDescription.svelte';
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

<DataStructureDescription filename="rb_tree.md" />
