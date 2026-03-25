<script lang="ts">
	import { onMount, type Snippet } from 'svelte';

	import { EventType, InputValueChangedEvent, type OperationManager } from '$lib/data-structures/operation/operationManager';

	import OperationControls from './OperationControls.svelte';

	interface Props {
		operationManager: OperationManager;
		title: string;
		manualValue?: number;
		locked?: boolean;
		children?: Snippet;
	}

	let { operationManager, title, manualValue = $bindable(0), locked = $bindable(false), children }: Props = $props();

	onMount(() => {
		operationManager.addEventListener(EventType.InputValueChanged, (e: Event) => {
			const event = e as CustomEvent<InputValueChangedEvent>;
			if (!isNaN(event.detail.inputValue)) manualValue = event.detail.inputValue;
		});

		operationManager.addEventListener(EventType.AnimationLockChanged, (e: Event) => {
			const ev = e as CustomEvent<boolean>;
			locked = ev.detail;
		});
	});
</script>

<div class="controls-container treeline-card flex flex-col gap-6">
	<div class="flex flex-col gap-4">
		<h2 class="text-primary text-lg font-bold">{title}</h2>
		<div class="flex flex-col gap-4">
			{@render children?.()}
		</div>
	</div>

	<OperationControls {operationManager} />
</div>

<style>
	.controls-container {
		width: 450px;
		height: 100%;
	}

	@media (max-width: 768px) {
		.controls-container {
			min-width: 0;
			width: 100%;
			min-height: 30em;
		}
	}

	:global(.controls-container .buttons-in-col) {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		width: 100%;
	}

	:global(.controls-container .buttons-in-col button) {
		width: 100%;
	}

	:global(.controls-container .buttons-in-row) {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		width: 100%;
		flex-wrap: wrap;
	}

	:global(.controls-container .buttons-in-row button) {
		flex: 1;
	}

	:global(.controls-container input[type='number']) {
		width: 3.75rem;
		border-radius: 0.25rem;
		border: 1px solid var(--color-gray-300);
		background-color: var(--color-gray-100);
		text-align: center;
	}
</style>
