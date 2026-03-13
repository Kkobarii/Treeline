<script lang="ts">
	import { getLocale, translate } from '$lib/i18n';

	import type { SortingAlgorithmId } from '../misc/types';

	const locale = getLocale();
	const t = (key: string) => translate(locale, key);

	let { algorithmId, view }: { algorithmId: SortingAlgorithmId; view: 'big-picture' | 'detailed' } = $props();
	const basePath = `/${locale}/sorting-algorithms/${algorithmId}`;
</script>

<div
	class="view-switcher"
	style={`--pill-x: ${view === 'big-picture' ? 0 : 1};`}>
	<div
		class="switcher-pill"
		aria-hidden="true">
	</div>
	{#if view === 'big-picture'}
		<span class="switcher-option switcher-active">{t('sorting.views.bigPicture')}</span>
		<a
			href={`${basePath}/detail`}
			class="switcher-option switcher-inactive">
			{t('sorting.views.detailed')}
		</a>
	{:else}
		<a
			href={basePath}
			class="switcher-option switcher-inactive">
			{t('sorting.views.bigPicture')}
		</a>
		<span class="switcher-option switcher-active">{t('sorting.views.detailed')}</span>
	{/if}
</div>

<style>
	.view-switcher {
		position: relative;
		display: grid;
		grid-template-columns: 1fr 1fr;
		align-items: center;
		background-color: oklch(from var(--color-gray-100) l c h / 0.8);
		border: 1px solid oklch(from var(--color-gray-400) l c h / 0.6);
		border-radius: 1rem;
		padding: 0.4rem;
		backdrop-filter: blur(8px);
		gap: var(--switcher-gap);
		--switcher-gap: 0.25rem;
	}

	.switcher-pill {
		position: absolute;
		top: 0.4rem;
		left: 0.4rem;
		height: calc(100% - 0.8rem);
		width: calc((100% - var(--switcher-gap) - 0.8rem) / 2);
		border-radius: 0.7rem;
		background-color: oklch(from var(--color-primary-light) l c h / 0.8);
		transition: transform 220ms ease;
		transform: translateX(calc(var(--pill-x) * (100% + var(--switcher-gap))));
		z-index: 0;
		pointer-events: none;
	}

	.switcher-option {
		padding: 0.5rem 1.2rem;
		text-decoration: none;
		font-size: 0.9rem;
		font-weight: 500;
		border-radius: 0.7rem;
		transition: all 200ms ease;
		cursor: pointer;
		color: var(--color-text);
		border: none;
		background: none;
		font-family: inherit;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		text-align: center;
		align-items: center;
		position: relative;
		z-index: 1;
	}

	.switcher-inactive:hover {
		background-color: oklch(from var(--color-gray-200) l c h / 0.8);
	}
</style>
