<script lang="ts">
	import type { StepData } from '$lib/data-structures/operations/operationDataa';
	import { getBTreeNodeId } from '$lib/data-structures/utils/graphs';

	export let step: StepData;
	export let isCurrent: boolean = false;
	export let label: string;

	let expanded: boolean = false;

	const ignoredKeys = new Set(['label', 'params', 'startSnapshot', 'endSnapshot']);

	function isBTreeStep(step: any): boolean {
		return step.data.label.includes('bTree');
	}

	function translateIds(obj: unknown): unknown {
		if (typeof obj !== 'object' || obj === null) return obj;
		if (Array.isArray(obj)) return obj.map(translateIds);

		const result: Record<string, unknown> = {};
		for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
			if (key.endsWith('Id') && typeof value === 'number') {
				result[key] = getBTreeNodeId(value);
			} else if (typeof value === 'object') {
				result[key] = translateIds(value);
			} else {
				result[key] = value;
			}
		}
		return result;
	}

	$: translatedData = isBTreeStep(step) ? translateIds(step?.data ?? {}) : (step?.data ?? {});
	$: detailEntries = Object.entries(translatedData as Record<string, unknown>).filter(([key]) => !ignoredKeys.has(key));
	$: hasDetails = detailEntries.length > 0;

	function toggleExpanded() {
		if (!hasDetails) return;
		expanded = !expanded;
	}

	function formatValue(value: unknown): string {
		if (value === null) return 'null';
		if (value === undefined) return 'undefined';
		if (typeof value === 'string') return value;
		if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
			return String(value);
		}

		try {
			return JSON.stringify(value, null, 2);
		} catch {
			return String(value);
		}
	}
</script>

<li
	class="operation-step operation-step-item rounded p-1 text-sm transition-colors {isCurrent
		? 'operation-step-item--current is-current-step'
		: 'operation-step-item--normal'}">
	<button
		type="button"
		class="operation-step-trigger flex w-full items-start gap-2 text-left"
		on:click={toggleExpanded}
		aria-expanded={expanded}
		disabled={!hasDetails}>
		<span class="break-words">{step.id + 1}: {label}</span>
		{#if hasDetails}
			<span
				class="operation-step-indicator text-xs {isCurrent
					? 'operation-step-indicator--current'
					: 'operation-step-indicator--normal'}">
				{expanded ? '-' : '+'}
			</span>
		{/if}
	</button>

	{#if expanded && hasDetails}
		<div
			class="operation-step-details mt-2 rounded border px-1 text-xs leading-relaxed {isCurrent
				? 'operation-step-details--current'
				: 'operation-step-details--normal'}">
			<ul class="flex flex-col">
				{#each detailEntries as [key, value]}
					<li class="break-words">
						<span class="font-semibold">{key}:</span>
						<span class="inline whitespace-pre-wrap">{formatValue(value)}</span>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</li>

<style>
	.operation-step-trigger {
		background-color: transparent;
		color: inherit;
		border: none;
		padding: 0;
		cursor: pointer;
		justify-content: space-between;
		align-items: start;
	}

	.operation-step-trigger:hover {
		background-color: transparent;
	}

	.operation-step-trigger:focus {
		background-color: transparent;
		box-shadow: none;
	}

	.operation-step-item--current {
		background-color: oklch(from var(--color-secondary-dark) l c h / 0.3);
	}

	.operation-step-item--normal {
		color: var(--color-gray-700);
	}
</style>
