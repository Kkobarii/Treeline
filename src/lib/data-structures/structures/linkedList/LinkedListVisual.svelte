<script lang="ts">
	import type { NodeOptions } from 'vis-network';

	import { Colors } from '$lib/assets/colors';
	import type { OperationManager } from '$lib/data-structures/operation/operationManager';
	import StructureVisual from '$lib/data-structures/visual/StructureVisual.svelte';

	import { LinkedListAnimator } from './linkedListAnimator';
	import { LinkedListAnnotator } from './linkedListAnnotator';
	import { LinkedListStepHandler } from './linkedListStepHandler';

	export let operationManager: OperationManager;

	const nodeOptions = {
		shape: 'box',
		color: Colors.Node,
		font: { color: 'black', size: 30 },
		// widthConstraint: 40,
		// heightConstraint: 40,
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
	Animator={LinkedListAnimator}
	Annotator={LinkedListAnnotator}
	StepHandler={LinkedListStepHandler}
	{nodeOptions}
	{layout} />
