<script lang="ts">
	import PillSwitcher from '$lib/components/PillSwitcher.svelte';
	import { getLocale, translate } from '$lib/i18n';

	import type { SortingAlgorithmId } from '../misc/types';

	const locale = getLocale();
	const t = (key: string) => translate(locale, key);

	let { algorithmId, view }: { algorithmId: SortingAlgorithmId; view: 'big-picture' | 'detailed' } = $props();
	const basePath = `/${locale}/sorting-algorithms/${algorithmId}`;
</script>

<PillSwitcher
	selected={view === 'big-picture' ? 0 : 1}
	leftLabel={t('sorting.views.bigPicture')}
	rightLabel={t('sorting.views.detailed')}
	leftIcon="/big.svg"
	rightIcon="/small.svg"
	hasIcons={true}
	leftHref={view === 'detailed' ? basePath : undefined}
	rightHref={view === 'big-picture' ? `${basePath}/detail` : undefined} />
