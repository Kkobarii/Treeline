<script lang="ts">
	import { onMount } from 'svelte';

	import OperationStep from '$lib/data-structures/controls/OperationStep.svelte';
	import { getStoredDebugMode, subscribeToDebugMode } from '$lib/data-structures/debugMode';
	import type { OperationData } from '$lib/data-structures/operation/operationData';
	import {
		CurrentOperationChangedEvent,
		CurrentStepChangedEvent,
		EventType,
		OperationManager,
	} from '$lib/data-structures/operation/operationManager';
	import { OperationType, type OperationTypeValue } from '$lib/data-structures/structures/dataStructure';
	import { getLocale, translate } from '$lib/i18n';

	const locale = getLocale();
	const t = (key: string) => translate(locale, key);

	const operationTypeTranslationMap: Record<OperationTypeValue, string> = {
		[OperationType.Empty]: 'controls.common.initial',
		[OperationType.Tree.Insert]: 'common.insert',
		[OperationType.Tree.Find]: 'common.find',
		[OperationType.Tree.Remove]: 'common.remove',
		[OperationType.Heap.Insert]: 'common.insert',
		[OperationType.Heap.ExtractRoot]: 'controls.heap.extractRoot',
		[OperationType.LinkedList.InsertHead]: 'controls.linkedList.insertHead',
		[OperationType.LinkedList.InsertTail]: 'controls.linkedList.insertTail',
		[OperationType.LinkedList.Find]: 'common.find',
		[OperationType.LinkedList.Remove]: 'common.remove',
		[OperationType.Stack.Push]: 'controls.stack.push',
		[OperationType.Stack.Pop]: 'controls.stack.pop',
		[OperationType.Stack.Peek]: 'controls.stack.peek',
		[OperationType.Queue.Enqueue]: 'controls.queue.enqueue',
		[OperationType.Queue.Dequeue]: 'controls.queue.dequeue',
		[OperationType.Queue.Peek]: 'controls.queue.peek',
	};

	export let operationManager: OperationManager;

	let canDoNext: boolean = false;
	let canDoPrevious: boolean = false;
	let locked: boolean = false;

	let operations: OperationData[] = [];
	let currentOperation: number = 0;
	let currentStep: number = 0;
	let debugMode: boolean = false;
	let unsubscribeDebugMode: (() => void) | null = null;

	onMount(() => {
		debugMode = getStoredDebugMode();
		unsubscribeDebugMode = subscribeToDebugMode(value => {
			debugMode = value;
		});

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

		return () => {
			if (unsubscribeDebugMode) {
				unsubscribeDebugMode();
				unsubscribeDebugMode = null;
			}
		};
	});

	function updateCanDoFlags() {
		canDoNext = operationManager.canDoNext();
		canDoPrevious = operationManager.canDoPrevious();
	}

	function formatOperationTitle(operation: OperationData): string {
		const translationKey = operationTypeTranslationMap[operation.type];
		if (!translationKey) return operation.type;

		const translatedOperation = t(translationKey);
		if (operation.value === null || operation.value === undefined) return translatedOperation;
		return `${translatedOperation} ${operation.value}`;
	}

	function scrollToCurrentStep() {
		const operationInfo = document.getElementById('operation-info');
		if (!operationInfo) return;

		const stepElements = operationInfo.querySelectorAll('.operation-step');
		stepElements.forEach(el => {
			if (el.classList.contains('is-current-step')) {
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

	{#if debugMode}
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
							{formatOperationTitle(op)}
							{#if operations[currentOperation] === op}
								<ul class="mt-2 flex flex-col gap-1">
									{#each op.steps as step}
										<OperationStep
											{step}
											isCurrent={operations[currentOperation].steps[currentStep] === step &&
												operations[currentOperation] === op}
											label={translate(locale, (step.data as any).label, (step.data as any).params)} />
									{/each}
								</ul>
							{/if}
						</li>
					{/each}
				</ul>
			</div>
		</div>
	{/if}
</div>
