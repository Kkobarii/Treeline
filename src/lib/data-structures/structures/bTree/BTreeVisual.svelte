<script lang="ts">
	import type { NodeOptions } from 'vis-network';

	import type { OperationManager } from '$lib/data-structures/operations/operationManager';
	import StructureVisual from '$lib/data-structures/visual/StructureVisual.svelte';
	import { Colors } from '$lib/utils/colors';

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
	} as NodeOptions;

	const layoutOptions = {
		hierarchical: {
			direction: 'UD',
			sortMethod: 'directed',
			shakeTowards: 'roots',
			levelSeparation: 100,
			nodeSpacing: 250,
		},
	};
</script>

<StructureVisual
	{operationManager}
	Animator={BTreeAnimator}
	Annotator={BTreeAnnotator}
	StepHandler={BTreeStepHandler}
	{nodeOptions}
	layout={layoutOptions} />
