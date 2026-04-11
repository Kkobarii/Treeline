<script lang="ts">
	import type { NodeOptions } from 'vis-network';

	import type { OperationManager } from '$lib/data-structures/operations/operationManager';
	import StructureVisual from '$lib/data-structures/visual/StructureVisual.svelte';
	import { Colors } from '$lib/utils/colors';

	import { StackAnimator } from './stackAnimator';
	import { StackAnnotator } from './stackAnnotator';
	import { StackStepHandler } from './stackStepHandler';

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
			direction: 'UD',
			sortMethod: 'directed',
			levelSeparation: 80,
			treeSpacing: 0,
		},
	};
</script>

<StructureVisual
	{operationManager}
	Animator={StackAnimator}
	Annotator={StackAnnotator}
	StepHandler={StackStepHandler}
	{nodeOptions}
	{layout} />
