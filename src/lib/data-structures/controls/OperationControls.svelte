<script lang="ts">
	import { onMount } from 'svelte';

	import type { OperationData } from '$lib/data-structures/operation/operationData';
	import {
		CurrentOperationChangedEvent,
		CurrentStepChangedEvent,
		EventType,
		OperationManager,
	} from '$lib/data-structures/operation/operationManager';
	import { getLocale, translate } from '$lib/i18n';

	const locale = getLocale();
	const t = (key: string) => translate(locale, key);

	export let operationManager: OperationManager;

	let canDoNext: boolean = false;
	let canDoPrevious: boolean = false;
	let locked: boolean = false;

	let operations: OperationData[] = [];
	let currentOperation: number = 0;
	let currentStep: number = 0;

	onMount(() => {
		operationManager.addEventListener(EventType.CurrentOperationChanged, (e: Event) => {
			const event = e as CustomEvent<CurrentOperationChangedEvent>;

			currentOperation = event.detail.currentOperationId;
			updateCanDoFlags();
		});

		operationManager.addEventListener(EventType.CurrentStepChanged, (e: Event) => {
			const event = e as CustomEvent<CurrentStepChangedEvent>;

			currentStep = event.detail.currentStepId;
			updateCanDoFlags();

			setTimeout(() => {
				scrollToCurrentStep();
			}, 50);
		});

		operationManager.addEventListener(EventType.OperationListChanged, (e: Event) => {
			const event = e as CustomEvent<{ operations: OperationData[] }>;
			operations = event.detail.operations;
			updateCanDoFlags();
		});

		operationManager.addEventListener(EventType.ShowStepsToggled, () => {
			updateCanDoFlags();
		});

		operationManager.addEventListener(EventType.AnimationLockChanged, (e: Event) => {
			const ev = e as CustomEvent<boolean>;
			locked = ev.detail;
			updateCanDoFlags();
		});
	});

	function updateCanDoFlags() {
		canDoNext = operationManager.canDoNext();
		canDoPrevious = operationManager.canDoPrevious();
	}

	function scrollToCurrentStep() {
		const operationInfo = document.getElementById('operation-info');
		if (!operationInfo) return;

		const stepElements = operationInfo.querySelectorAll('.operation-step');
		stepElements.forEach(el => {
			if (el.classList.contains('text-white')) {
				const container = operationInfo;
				const htmlEl = el as HTMLElement;
				const offset = htmlEl.offsetTop - container.offsetTop;

				container.scrollTo({
					top: offset - container.clientHeight / 2 + htmlEl.clientHeight / 2,
					behavior: 'smooth',
				});
			}
		});
	}
</script>

<div class="flex min-h-0 flex-1 flex-row gap-2 md:flex-col md:gap-6">
	<div class="flex flex-col gap-3">
		<h2 class="text-primary text-lg font-bold break-words">{t('controls.operation.title')}</h2>
		<div class="flex flex-col items-start gap-2 md:flex-row md:items-center">
			<button
				class="w-full md:w-auto"
				type="button"
				on:click={() => operationManager.previous()}
				disabled={!canDoPrevious || locked}>
				{t('common.previous')}
			</button>
			<button
				class="w-full md:w-auto"
				type="button"
				on:click={() => operationManager.next()}
				disabled={!canDoNext || locked}>
				{t('common.next')}
			</button>
			<label class="inline-flex items-center gap-2">
				<input
					id="steps-checkbox"
					type="checkbox"
					class="styled-checkbox"
					on:change={() => operationManager.toggleShowSteps()}
					disabled={locked} />
				<span>{t('common.steps')}</span>
			</label>
		</div>
	</div>

	<div class="flex min-h-0 flex-1 flex-col gap-3">
		<h2 class="text-primary text-lg font-bold break-words">{t('controls.operation.info')}</h2>

		<div
			class="min-h-0 flex-1 overflow-y-auto"
			id="operation-info">
			<ul class="flex flex-col gap-2">
				{#each operations as op}
					<li
						class="{operations[currentOperation] === op
							? 'bg-primary-light'
							: 'bg-gray-200'} mr-1 rounded p-2 text-sm break-words transition-colors">
						{op.operation}
						{#if operations[currentOperation] === op}
							<ul class="mt-2 flex flex-col gap-1">
								{#each op.steps as step}
									<li
										class="{operations[currentOperation].steps[currentStep] === step &&
										operations[currentOperation] === op
											? 'bg-primary text-white'
											: 'text-gray-700'} operation-step rounded p-1 text-sm transition-colors">
										{step.id + 1}: {(step.data as any).action}
									</li>
								{/each}
							</ul>
						{/if}
					</li>
				{/each}
			</ul>
		</div>
	</div>
</div>
