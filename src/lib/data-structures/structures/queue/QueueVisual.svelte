<script lang="ts">
	import type { NodeOptions } from 'vis-network';

	import type { OperationManager } from '$lib/data-structures/operations/operationManager';
	import StructureVisual from '$lib/data-structures/visual/StructureVisual.svelte';
	import { Colors } from '$lib/utils/colors';

	import { QueueAnimator } from './queueAnimator';
	import { QueueAnnotator } from './queueAnnotator';
	import { QueueStepHandler } from './queueStepHandler';

	export let operationManager: OperationManager;

	const nodeOptions = {
		shape: 'box',
		color: Colors.Node,
		font: { color: 'black', size: 30 },
		widthConstraint: {
			minimum: 50,
		},
	} as NodeOptions;

	const layout = {
		hierarchical: {
			direction: 'LR',
			sortMethod: 'directed',
			levelSeparation: 100,
			treeSpacing: 0,
		},
	};
</script>

<StructureVisual
	{operationManager}
	Animator={QueueAnimator}
	Annotator={QueueAnnotator}
	StepHandler={QueueStepHandler}
	{nodeOptions}
	{layout} />
