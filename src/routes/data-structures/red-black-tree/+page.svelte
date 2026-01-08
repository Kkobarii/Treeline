<script lang="ts">
	import TreeControls from '$lib/data-structures/controls/TreeControls.svelte';
	import DataStructureDescription from '$lib/data-structures/DataStructureDescription.svelte';
	import { OperationManager } from '$lib/data-structures/operation/operationManager';
	import { StructureType } from '$lib/data-structures/structures/dataStructure';
	import RBTreeVisual from '$lib/data-structures/structures/rbTree/RBTreeVisual.svelte';

	let operationManager: OperationManager = new OperationManager(StructureType.RBTree);
</script>

<h1 class="page-title">Red-Black Tree Simulation</h1>
<div class="page-layout">
	<div>
		<RBTreeVisual {operationManager} />
	</div>

	<div>
		<TreeControls {operationManager} />
	</div>
</div>

<DataStructureDescription filename="rb_tree.md" />
