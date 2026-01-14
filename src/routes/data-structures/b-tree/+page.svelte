<script lang="ts">
	import TreeControls from '$lib/data-structures/controls/TreeControls.svelte';
	import DataStructureDescription from '$lib/data-structures/DataStructureDescription.svelte';
	import { OperationManager } from '$lib/data-structures/operation/operationManager';
	import BTreeVisual from '$lib/data-structures/structures/bTree/BTreeVisual.svelte';
	import { StructureType } from '$lib/data-structures/structures/dataStructure';

	let operationManager: OperationManager = new OperationManager(StructureType.BTree);
</script>

<h1 class="page-title">B-Tree Simulation</h1>
<div class="page-layout">
	<div>
		<BTreeVisual {operationManager} />
	</div>

	<div>
		<TreeControls {operationManager} />
	</div>
</div>

<DataStructureDescription filename="b_tree.md" />
