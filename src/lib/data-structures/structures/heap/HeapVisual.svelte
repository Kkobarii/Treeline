<script lang="ts">
	import type { OperationManager } from '$lib/data-structures/operations/operationManager';
	import StructureVisual from '$lib/data-structures/visual/StructureVisual.svelte';
	import { Colors } from '$lib/utils/colors';

	import { HeapAnimator } from './heapAnimator';
	import { HeapAnnotator } from './heapAnnotator';
	import { HeapStepHandler } from './heapStepHandler';

	export let operationManager: OperationManager;

	const nodeOptions = {
		shape: 'box',
		color: Colors.Node,
		font: { color: 'black', size: 30 },
	};
</script>

<StructureVisual
	{operationManager}
	Animator={HeapAnimator}
	Annotator={HeapAnnotator}
	StepHandler={HeapStepHandler}
	{nodeOptions} />
