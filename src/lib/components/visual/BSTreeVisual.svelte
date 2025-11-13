<script lang="ts">
	import {
		ChangeDirection,
		CurrentOperationChangedEvent,
		CurrentStepChangedEvent,
		EventType,
		type OperationManager,
	} from '$lib/operation/operationManager';
	import { onMount } from 'svelte';
	import { clearAnimations } from '$lib/animators/animator';
	import BSTreeRenderer from '$lib/components/visual/BSTreeRenderer.svelte';
	import { playStep, playOperation } from '$lib/visual/animationOrchestrator';

	export let operationManager: OperationManager;

	let renderer: any = null;

	onMount(() => {
		operationManager.addEventListener(EventType.CurrentOperationChanged, (e: Event) => {
			const event = e as CustomEvent<CurrentOperationChangedEvent>;
			if (!operationManager.getShowSteps()) {
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
			clearAnimations();

			const animator = renderer?.getAnimator?.();

			if (operationManager.getShowSteps()) {
				// Entering step-by-step mode: disable operation-playback
				animator?.resetAnimationDuration();
				await playStep(animator, operationManager, {
					currentStepId: operationManager.getCurrentStepIndex(),
					currentStep: operationManager.getCurrentStep(),
					direction: ChangeDirection.Forward,
				});
			} else {
				// Switching to operations mode: enable operation-playback using
				// the animator's persisted default. The animator will shorten
				// durations for the fast step-through.
				animator?.setAnimationDuration(75);
				await playOperation(animator, operationManager, {
					currentOperationId: operationManager.getCurrentOperationIndex(),
					currentOperation: operationManager.getCurrentOperation(),
					direction: ChangeDirection.Forward,
				});
			}
		});
	});
</script>

<BSTreeRenderer
	bind:this={renderer}
	{operationManager} />
