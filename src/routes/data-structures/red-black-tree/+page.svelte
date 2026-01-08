<script lang="ts">
	import TreeControls from '$lib/data-structures/controls/TreeControls.svelte';
	import DataStructureDescription from '$lib/data-structures/DataStructureDescription.svelte';
	import { OperationManager } from '$lib/data-structures/operation/operationManager';
	import { StructureType } from '$lib/data-structures/structures/dataStructure';
	import RBTreeVisual from '$lib/data-structures/structures/rbTree/RBTreeVisual.svelte';

	let operationManager: OperationManager = new OperationManager(StructureType.RBTree);
</script>

<h1 class="mb-4 text-2xl font-bold">Red-Black Tree Simulation</h1>
<div
	class="display: mb-4 flex gap-4"
	style="height: 75vh;">
	<div style="flex-grow: 1;">
		<RBTreeVisual {operationManager} />
	</div>

	<div>
		<TreeControls {operationManager} />
	</div>
</div>

<DataStructureDescription filename="rb_tree.md" />
