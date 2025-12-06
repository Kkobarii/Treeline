<script lang="ts">
	import type { OperationManager } from '$lib/data-structures/operation/operationManager';
	import StructureVisual from '$lib/data-structures/visual/StructureVisual.svelte';

	import { RBTreeAnimator } from './rbTreeAnimator';
	import { RBTreeAnnotator } from './rbTreeAnnotator';
	import { RBTreeStepHandler } from './rbTreeStepHandler';

	export let operationManager: OperationManager;

	const nodeOptions = {
		shape: 'box',
		font: { size: 30 },
	};
</script>

<StructureVisual
	{operationManager}
	Animator={RBTreeAnimator}
	Annotator={RBTreeAnnotator}
	StepHandler={RBTreeStepHandler}
	{nodeOptions} />
