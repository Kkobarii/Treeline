<script lang="ts">
	import StackControls from '$lib/data-structures/controls/specific/StackControls.svelte';
	import DataStructureDescription from '$lib/data-structures/DataStructureDescription.svelte';
	import { OperationManager } from '$lib/data-structures/operation/operationManager';
	import { StructureType } from '$lib/data-structures/structures/dataStructure';
	import StackVisual from '$lib/data-structures/structures/stack/StackVisual.svelte';

	let operationManager: OperationManager = new OperationManager(StructureType.Stack, 5);
</script>

<h1 class="page-title">Stack</h1>
<div class="page-layout">
	<StackVisual {operationManager} />
	<StackControls {operationManager} />
</div>

<DataStructureDescription filename="stack.md" />
