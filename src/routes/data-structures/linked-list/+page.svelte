<script lang="ts">
	import LinkedListControls from '$lib/data-structures/controls/specific/LinkedListControls.svelte';
	import DataStructureDescription from '$lib/data-structures/DataStructureDescription.svelte';
	import { OperationManager } from '$lib/data-structures/operation/operationManager';
	import { StructureType } from '$lib/data-structures/structures/dataStructure';
	import LinkedListVisual from '$lib/data-structures/structures/linkedList/LinkedListVisual.svelte';

	let operationManager: OperationManager = new OperationManager(StructureType.LinkedList, 5);
</script>

<h1 class="page-title">Linked List</h1>
<div class="page-layout">
	<LinkedListVisual {operationManager} />
	<LinkedListControls {operationManager} />
</div>

<DataStructureDescription filename="linked_list.md" />
