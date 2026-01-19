<script lang="ts">
	import HeapControls from '$lib/data-structures/controls/HeapControls.svelte';
	import DataStructureDescription from '$lib/data-structures/DataStructureDescription.svelte';
	import { OperationManager } from '$lib/data-structures/operation/operationManager';
	import { StructureType } from '$lib/data-structures/structures/dataStructure';
	import HeapVisual from '$lib/data-structures/structures/heap/HeapVisual.svelte';

	let operationManager: OperationManager = new OperationManager(StructureType.Heap);
</script>

<h1 class="page-title">Heap Simulation</h1>
<div class="page-layout">
	<div>
		<HeapVisual {operationManager} />
	</div>

	<div>
		<HeapControls {operationManager} />
	</div>
</div>

<DataStructureDescription filename="heap.md" />
