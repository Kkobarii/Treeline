<script lang="ts">
	import { Colors } from '$lib/assets/colors';
	import type { OperationManager } from '$lib/data-structures/operation/operationManager';
	import StructureVisual from '$lib/data-structures/visual/StructureVisual.svelte';

	import { BSTreeAnimator } from './bsTreeAnimator';
	import { BSTreeAnnotator } from './bsTreeAnnotator';
	import { BSTreeStepHandler } from './bsTreeStepHandler';

	export let operationManager: OperationManager;

	const nodeOptions = {
		shape: 'box',
		color: Colors.Node,
		font: { color: 'black', size: 30 },
	};
</script>

<StructureVisual
	{operationManager}
	Animator={BSTreeAnimator}
	Annotator={BSTreeAnnotator}
	StepHandler={BSTreeStepHandler}
	{nodeOptions} />
