<script lang="ts">
	import {
		ChangeDirection,
		CurrentOperationChangedEvent,
		CurrentStepChangedEvent,
		EventType,
		type OperationManager,
	} from '$lib/operation/operationManager';
	import { onMount } from 'svelte';
	import { clearAnimations } from '$lib/animation/animator';
	import BSTreeRenderer from '$lib/components/visual/BSTreeRenderer.svelte';
	import { playStep, playOperation } from '$lib/visual/bsStepOrchestrator';

	export let operationManager: OperationManager;

	let renderer: any = null;

	onMount(() => {
		operationManager.addEventListener(EventType.CurrentOperationChanged, (e: Event) => {
			const event = e as CustomEvent<CurrentOperationChangedEvent>;
			if (!operationManager.getShowSteps()) {
				// pass the animator instance from the renderer component so handlers operate on the animator directly
				playOperation(renderer?.getAnimator?.(), operationManager, event.detail);
			}
		});

		operationManager.addEventListener(EventType.CurrentStepChanged, (e: Event) => {
			const event = e as CustomEvent<CurrentStepChangedEvent>;
			if (operationManager.getShowSteps()) {
				playStep(renderer?.getAnimator?.(), operationManager, event.detail);
			}
		});

		operationManager.addEventListener(EventType.ShowStepsToggled, async () => {
			// clear any ongoing animations
			clearAnimations();

			if (operationManager.getShowSteps()) {
				await playStep(renderer?.getAnimator?.(), operationManager, {
					currentStepId: operationManager.getCurrentStepIndex(),
					currentStep: operationManager.getCurrentStep(),
					direction: ChangeDirection.Forward,
				} as any);
			} else {
				await playOperation(renderer?.getAnimator?.(), operationManager, {
					currentOperationId: operationManager.getCurrentOperationIndex(),
					currentOperation: operationManager.getCurrentOperation(),
					direction: ChangeDirection.Forward,
				} as any);
			}
		});
	});
</script>

<BSTreeRenderer
	bind:this={renderer}
	{operationManager} />
