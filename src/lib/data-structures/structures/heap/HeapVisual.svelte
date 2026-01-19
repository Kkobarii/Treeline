<script lang="ts">
	import { Colors } from '$lib/assets/colors';
	import type { OperationManager } from '$lib/data-structures/operation/operationManager';
	import StructureVisual from '$lib/data-structures/visual/StructureVisual.svelte';

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
