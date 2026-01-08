<script lang="ts">
	import TreeControls from '$lib/data-structures/controls/TreeControls.svelte';
	import DataStructureDescription from '$lib/data-structures/DataStructureDescription.svelte';
	import { OperationManager } from '$lib/data-structures/operation/operationManager';
	import BSTreeVisual from '$lib/data-structures/structures/bsTree/BSTreeVisual.svelte';
	import { StructureType } from '$lib/data-structures/structures/dataStructure';

	let operationManager: OperationManager = new OperationManager(StructureType.BSTree);
</script>

<h1 class="mb-4 text-2xl font-bold">Binary Search Tree Simulation</h1>
<div
	class="display: mb-4 flex gap-4"
	style="height: 75vh;">
	<div style="flex-grow: 1;">
		<BSTreeVisual {operationManager} />
	</div>

	<div>
		<TreeControls {operationManager} />
	</div>
</div>

<DataStructureDescription filename="bs_tree.md" />
