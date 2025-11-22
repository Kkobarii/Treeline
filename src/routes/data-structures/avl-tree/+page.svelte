<script lang="ts">
	import TreeControls from '$lib/data-structures/controls/TreeControls.svelte';
	import AVLTreeVisual from '$lib/data-structures/structures/avlTree/AVLTreeVisual.svelte';
	import { OperationManager } from '$lib/data-structures/operation/operationManager';
	import { StructureType } from '$lib/data-structures/structures/dataStructure';

	let operationManager: OperationManager = new OperationManager(StructureType.AVLTree);
</script>

<h1 class="mb-4 text-2xl font-bold">AVL Tree Simulation</h1>
<div
	class="display: mb-4 flex"
	style="height: 75vh;">
	<div style="flex-grow: 1;">
		<AVLTreeVisual {operationManager} />
	</div>

	<div class="mr-4 ml-4">
		<TreeControls {operationManager} />
	</div>
</div>
