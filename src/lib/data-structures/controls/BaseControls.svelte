<script lang="ts">
	import { onMount, type Snippet } from 'svelte';

	import { EventType, InputValueChangedEvent, type OperationManager } from '$lib/data-structures/operations/operationManager';
	import { getLocale, translate } from '$lib/i18n';

	import OperationControls from './OperationControls.svelte';
	import ResetRebuildControls from './specific/ResetRebuildControls.svelte';

	interface Props {
		operationManager: OperationManager;
		manualValue?: number;
		locked?: boolean;
		children?: Snippet;
	}

	let { operationManager, manualValue = $bindable(0), locked = $bindable(false), children }: Props = $props();

	const locale = getLocale();
	const t = (key: string) => translate(locale, key);

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

<div class="controls-container treeline-card flex flex-col gap-4">
	<h2 class="text-secondary order-first mb-1 text-lg font-bold break-words">{t('controls.common.title')}</h2>
	<div class="controls-children">
		<div class="flex flex-col gap-4">
			<div>
				<div class="section-divider">
					<span class="section-title">{t('controls.common.structure')}</span>
					<div class="divider-line"></div>
				</div>
				<div class="flex flex-col gap-4">
					<ResetRebuildControls
						{operationManager}
						{locked} />
				</div>
			</div>
			<div>
				<div class="section-divider">
					<span class="section-title">{t('controls.common.nodes')}</span>
					<div class="divider-line"></div>
				</div>
				<div class="flex flex-col gap-4">
					{@render children?.()}
				</div>
			</div>
		</div>
	</div>

	<div class="controls-operations">
		<div class="section-divider">
			<span class="section-title">{t('controls.common.operations')}</span>
			<div class="divider-line"></div>
		</div>
		<OperationControls {operationManager} />
	</div>
</div>

<style>
	.controls-container {
		width: 25%;
		min-width: 300px;
		height: 100%;
	}

	.controls-operations {
		height: 100%;
		overflow: hidden;
	}

	@media (max-width: 768px) {
		.controls-container {
			min-width: 0;
			width: 100%;
			height: auto;
		}

		.controls-operations {
			order: -1;
			height: auto;
			overflow: visible;
		}

		.controls-children {
			order: 0;
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
		height: auto;
		align-self: stretch;
		text-align: center;
	}

	.section-divider {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		width: 100%;
		margin-bottom: 0.2rem;
	}

	.section-title {
		font-size: 0.75rem;
		color: var(--color-green-600);
		white-space: nowrap;
		user-select: none;
	}

	.divider-line {
		flex: 1;
		height: 1px;
		background-color: var(--color-green-300);
	}
</style>
