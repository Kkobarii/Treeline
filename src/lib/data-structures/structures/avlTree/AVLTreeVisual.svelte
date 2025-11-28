<script lang="ts">
	import { Colors } from '$lib/assets/colors';
	import type { OperationManager } from '$lib/data-structures/operation/operationManager';
	import StructureVisual from '$lib/data-structures/visual/StructureVisual.svelte';

	import { AVLTreeAnimator } from './avlTreeAnimator';
	import { AVLTreeAnnotator } from './avlTreeAnnotator';
	import { AVLTreeStepHandler } from './avlTreeStepHandler';

	export let operationManager: OperationManager;

	const nodeOptions = {
		shape: 'box',
		color: Colors.Node,
		font: { color: 'black', size: 30 },
	};
</script>

<StructureVisual
	{operationManager}
	Animator={AVLTreeAnimator}
	Annotator={AVLTreeAnnotator}
	StepHandler={AVLTreeStepHandler}
	{nodeOptions} />
