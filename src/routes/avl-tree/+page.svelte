<script lang="ts">
	import TreeControls from '$lib/components/controls/TreeControls.svelte';
	import AVLTreeVisual from '$lib/components/visual/AVLTreeVisual.svelte';
	import { OperationManager } from '$lib/operation/operationManager';
	import { StructureType } from '$lib/structures/dataStructure';

	let operationManager: OperationManager = new OperationManager(StructureType.AVLTree);
</script>

<h1 class="mb-4 text-2xl font-bold">AVL Tree Simulation</h1>
<div
	class="display: mb-4 flex"
	style="height: 75vh;">
	<div>
		<AVLTreeVisual {operationManager} />
	</div>

	<div class="mr-4 ml-4">
		<TreeControls {operationManager} />
	</div>
</div>
