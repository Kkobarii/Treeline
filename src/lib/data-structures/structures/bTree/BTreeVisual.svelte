<script lang="ts">
	import { Colors } from '$lib/assets/colors';
	import type { OperationManager } from '$lib/data-structures/operation/operationManager';
	import StructureVisual from '$lib/data-structures/visual/StructureVisual.svelte';

	import { BTreeAnimator } from './bTreeAnimator';
	import { BTreeAnnotator } from './bTreeAnnotator';
	import { BTreeStepHandler } from './bTreeStepHandler';

	export let operationManager: OperationManager;

	const nodeOptions = {
		shape: 'box',
		color: Colors.Node,
		font: { color: 'black', size: 30 },
		margin: {
			top: 10,
			bottom: 10,
		},
	};

	const layoutOptions = {
		name: 'breadthfirst',
		directed: true,
		roots: '[indegree = 0]',
		spacingFactor: 1.5,
	};
</script>

<StructureVisual
	{operationManager}
	Animator={BTreeAnimator}
	Annotator={BTreeAnnotator}
	StepHandler={BTreeStepHandler}
	{nodeOptions}
	layout={layoutOptions} />
