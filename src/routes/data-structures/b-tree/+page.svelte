<script lang="ts">
	import DescriptionCard from '$lib/components/DescriptionCard.svelte';
	import TreeControls from '$lib/data-structures/controls/specific/TreeControls.svelte';
	import { OperationManager } from '$lib/data-structures/operation/operationManager';
	import BTreeVisual from '$lib/data-structures/structures/bTree/BTreeVisual.svelte';
	import { StructureType } from '$lib/data-structures/structures/dataStructure';

	let operationManager: OperationManager = new OperationManager(StructureType.BTree);
</script>

<h1 class="page-title">B-Tree</h1>
<p style="color: red; font-weight: bold;">This is very much broken and I know it. Will fix later.</p>
<div class="page-layout">
	<BTreeVisual {operationManager} />
	<TreeControls {operationManager} />
</div>

<DescriptionCard filename="data-structures/b_tree" />
