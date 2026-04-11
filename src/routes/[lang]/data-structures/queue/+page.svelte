<script lang="ts">
	import DescriptionCard from '$lib/components/DescriptionCard.svelte';
	import QueueControls from '$lib/data-structures/controls/specific/QueueControls.svelte';
	import { OperationManager } from '$lib/data-structures/operations/operationManager';
	import { StructureType } from '$lib/data-structures/structures/dataStructure';
	import QueueVisual from '$lib/data-structures/structures/queue/QueueVisual.svelte';
	import { getLocale, translate } from '$lib/i18n';

	const locale = getLocale();
	const t = (key: string) => translate(locale, key);

	let operationManager: OperationManager = new OperationManager(StructureType.Queue, 5);
</script>

<h1 class="page-title">{t('dataStructures.queue')}</h1>
<div class="page-layout">
	<QueueVisual {operationManager} />
	<QueueControls {operationManager} />
</div>

<DescriptionCard />
