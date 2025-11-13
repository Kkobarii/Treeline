<script lang="ts">
	import BSTreeControls from '$lib/components/controls/BSTreeControls.svelte';
	import BSTreeVisual from '$lib/components/visual/BSTreeVisual.svelte';
	import { OperationManager } from '$lib/operation/operationManager';
	import { StructureType } from '$lib/structures/dataStructure';

	let operationManager: OperationManager = new OperationManager(StructureType.BSTree);
</script>

<h1 class="mb-4 text-2xl font-bold">Binary Search Tree Simulation</h1>
<div
	class="display: mb-4 flex"
	style="height: 75vh;">
	<div>
		<BSTreeVisual {operationManager} />
	</div>

	<div class="mr-4 ml-4">
		<BSTreeControls {operationManager} />
	</div>
</div>
