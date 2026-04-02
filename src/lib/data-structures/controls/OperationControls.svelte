<script lang="ts">
	import { onMount } from 'svelte';

	import PillSwitcher from '$lib/components/PillSwitcher.svelte';
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

	// Recursively translate parameter values if they are translation keys
	function translateParams(params: Record<string, any>): Record<string, any> {
		const translated: Record<string, any> = {};
		for (const [key, value] of Object.entries(params)) {
			if (typeof value === 'string' && value.startsWith('steps.')) {
				translated[key] = translate(locale, value);
			} else {
				translated[key] = value;
			}
		}
		return translated;
	}

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
	let showSteps: boolean = false;

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
			showSteps = operationManager.getShowSteps();
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

<div class="operation-card flex flex-row gap-2 max-md:max-h-[30vh] md:min-h-0 md:flex-1 md:flex-col md:gap-6">
	<div class="flex flex-1 flex-col gap-3 md:flex-none">
		<h2 class="text-secondary text-lg font-bold break-words">{t('controls.operation.title')}</h2>
		<div class="flex flex-col flex-wrap items-start gap-2 md:flex-row md:items-center">
			<div class="flex w-full gap-2">
				<button
					class="inline-flex w-full items-center justify-center md:w-auto"
					type="button"
					on:click={() => operationManager.previous()}
					aria-label={t('common.previous')}
					disabled={!canDoPrevious || locked}>
					<img
						src="/controls/previous.svg"
						alt="previous"
						aria-hidden="true"
						class="h-4 w-4 dark:invert" />
				</button>
				<button
					class="inline-flex w-full items-center justify-center md:w-auto"
					type="button"
					on:click={() => operationManager.next()}
					aria-label={t('common.next')}
					disabled={!canDoNext || locked}>
					<img
						src="/controls/next.svg"
						alt="next"
						aria-hidden="true"
						class="h-4 w-4 dark:invert" />
				</button>
			</div>
			<PillSwitcher
				selected={showSteps ? 1 : 0}
				leftLabel={t('common.operation')}
				rightLabel={t('common.step')}
				size="sm"
				onLeftClick={() => {
					if (showSteps) operationManager.toggleShowSteps();
				}}
				onRightClick={() => {
					if (!showSteps) operationManager.toggleShowSteps();
				}}
				disabled={locked}
				className="w-full md:w-auto" />
		</div>
	</div>

	{#if debugMode}
		<div class="flex min-h-0 flex-1 flex-col gap-3">
			<h2 class="text-secondary text-lg font-bold break-words">{t('controls.operation.info')}</h2>

			<div
				class="min-h-0 flex-1 overflow-y-auto"
				id="operation-info">
				<ul class="flex flex-col gap-2">
					{#each operations as op}
						<li
							class="{operations[currentOperation] === op
								? 'bg-secondary-light/80'
								: 'bg-gray-200'} mr-1 rounded p-2 text-sm break-words transition-colors">
							{formatOperationTitle(op)}
							{#if operations[currentOperation] === op}
								<ul class="mt-2 flex flex-col gap-1">
									{#each op.steps as step}
										<OperationStep
											{step}
											isCurrent={operations[currentOperation].steps[currentStep] === step &&
												operations[currentOperation] === op}
											label={translate(
												locale,
												(step.data as any).label,
												translateParams((step.data as any).params),
											)} />
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

<style>
	#operation-info::-webkit-scrollbar {
		width: 10px;
		height: 10px;
	}

	#operation-info::-webkit-scrollbar-thumb {
		background: rgba(90, 90, 90);
	}

	#operation-info::-webkit-scrollbar-track {
		background: rgba(0, 0, 0, 0.2);
	}
</style>
