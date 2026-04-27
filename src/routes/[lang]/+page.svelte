<script lang="ts">
	import { onMount } from 'svelte';

	import { goto } from '$app/navigation';

	import { dataStructures } from '$lib/data-structures/registry';
	import { getLocale, translate } from '$lib/i18n';
	import { dataSets, searchingAlgorithms, sortingAlgorithms } from '$lib/sorting-algorithms/registry';

	const locale = getLocale();
	const t = (key: string) => translate(locale, key);

	let structureDescription: HTMLParagraphElement | null = null;
	let sortingDescription: HTMLParagraphElement | null = null;
	let descriptionHeight = 0;

	function pickRandomItem<T>(items: T[]): T {
		return items[Math.floor(Math.random() * items.length)];
	}

	function goToRandomStructure(event: MouseEvent) {
		event.preventDefault();
		const selected = pickRandomItem(dataStructures);
		goto(`/${locale}/data-structures/${selected.id}`);
	}

	function goToRandomSorting(event: MouseEvent) {
		event.preventDefault();
		const selected = pickRandomItem(sortingAlgorithms);
		goto(`/${locale}/sorting-algorithms/${selected.id}`);
	}

	onMount(() => {
		if (!structureDescription || !sortingDescription) return;

		const structureElement = structureDescription;
		const sortingElement = sortingDescription;

		const updateDescriptionHeight = () => {
			const structureLineHeight = Number.parseFloat(getComputedStyle(structureElement).lineHeight);
			const sortingLineHeight = Number.parseFloat(getComputedStyle(sortingElement).lineHeight);
			const tallestHeight = Math.max(structureElement.offsetHeight, sortingElement.offsetHeight);
			const tallestLineHeight = Math.max(structureLineHeight, sortingLineHeight);

			descriptionHeight = tallestHeight > tallestLineHeight * 1.4 ? tallestHeight : 0;
		};

		const observer = new ResizeObserver(updateDescriptionHeight);
		observer.observe(structureElement);
		observer.observe(sortingElement);
		updateDescriptionHeight();

		return () => observer.disconnect();
	});
</script>

<div class="landing-root">
	<section class="landing-hero">
		<div class="hero-glow hero-glow-left"></div>
		<div class="hero-glow hero-glow-right"></div>

		<p class="hero-kicker">{t('home.kicker')}</p>
		<h1 class="hero-brand">Treeline</h1>
		<p class="hero-title">{t('home.title')}</p>
		<p class="hero-subtitle">{t('home.subtitle')}</p>

		<div class="hero-actions">
			<a
				href="/{locale}/data-structures/{pickRandomItem(dataStructures).id}"
				onclick={goToRandomStructure}
				class="hero-button hero-button-primary">
				{t('home.ctaRandomStructure')}
			</a>
			<a
				href="/{locale}/sorting-algorithms/{pickRandomItem(sortingAlgorithms).id}"
				onclick={goToRandomSorting}
				class="hero-button hero-button-secondary">
				{t('home.ctaRandomSorting')}
			</a>
			<a
				href="/{locale}/about"
				class="hero-button hero-button-subtle">
				{t('home.ctaAbout')}
			</a>
		</div>
	</section>

	<section class="stat-grid">
		<article class="treeline-card stat-card">
			<p class="stat-value">{dataStructures.length}</p>
			<p class="stat-label">{t('home.stats.structures')}</p>
		</article>
		<article class="treeline-card stat-card">
			<p class="stat-value">{sortingAlgorithms.length}</p>
			<p class="stat-label">{t('home.stats.sorting')}</p>
		</article>
		<article class="treeline-card stat-card">
			<p class="stat-value">{searchingAlgorithms.length}</p>
			<p class="stat-label">{t('home.stats.searching')}</p>
		</article>
		<article class="treeline-card stat-card">
			<p class="stat-value">{dataSets.length}</p>
			<p class="stat-label">{t('home.stats.datasets')}</p>
		</article>
	</section>

	<section
		class="content-grid"
		style={`--section-description-height: ${descriptionHeight}px`}>
		<article class="treeline-card section-card">
			<div class="section-header-row">
				<h2 class="section-title">{t('nav.dataStructures')}</h2>
			</div>
			<p
				bind:this={structureDescription}
				class="section-description">
				{t('home.structureDescription')}
			</p>
			<ul class="resource-list">
				{#each dataStructures as ds}
					<li>
						<a
							href="/{locale}/data-structures/{ds.id}"
							class="resource-link">{t(ds.nameKey)}</a>
					</li>
				{/each}
			</ul>
		</article>

		<article class="treeline-card section-card">
			<div class="section-header-row">
				<h2 class="section-title">{t('home.sortingResourcesTitle')}</h2>
			</div>
			<p
				bind:this={sortingDescription}
				class="section-description">
				{t('home.sortingDescription')}
			</p>
			<ul class="resource-list">
				{#each sortingAlgorithms as algorithm}
					<li>
						<a
							href="/{locale}/sorting-algorithms/{algorithm.id}"
							class="resource-link">{t(algorithm.nameKey)}</a>
					</li>
				{/each}
				<li>
					<a
						href="/{locale}/sorting-algorithms/searching"
						class="resource-link">{t('sortingAlgorithms.searching')}</a>
				</li>
				<li>
					<a
						href="/{locale}/sorting-algorithms/comparison"
						class="resource-link">{t('sorting.comparison.title')}</a>
				</li>
			</ul>
		</article>
	</section>

	<section class="study-track-grid">
		<article class="treeline-card track-card">
			<p class="track-number">01</p>
			<h3 class="text-base font-bold text-[var(--color-gray-800)]">{t('home.tracks.interactiveTitle')}</h3>
			<p class="mt-2 text-sm leading-6 text-[var(--color-gray-700)]">{t('home.tracks.interactiveBody')}</p>
		</article>
		<article class="treeline-card track-card">
			<p class="track-number">02</p>
			<h3 class="text-base font-bold text-[var(--color-gray-800)]">{t('home.tracks.multipleViewsTitle')}</h3>
			<p class="mt-2 text-sm leading-6 text-[var(--color-gray-700)]">{t('home.tracks.multipleViewsBody')}</p>
		</article>
		<article class="treeline-card track-card">
			<p class="track-number">03</p>
			<h3 class="text-base font-bold text-[var(--color-gray-800)]">{t('home.tracks.comparisonTitle')}</h3>
			<p class="mt-2 text-sm leading-6 text-[var(--color-gray-700)]">{t('home.tracks.comparisonBody')}</p>
		</article>
	</section>
</div>

<style lang="postcss">
	@reference '../../app.css';
	.landing-root {
		@apply flex flex-col gap-5 pb-4;
	}

	.landing-hero {
		@apply relative overflow-hidden rounded-xl p-6;
		background:
			radial-gradient(circle at 8% 10%, color-mix(in srgb, var(--color-secondary) 31%, transparent), transparent 52%),
			radial-gradient(circle at 90% 90%, color-mix(in srgb, var(--color-yellow-400) 30%, transparent), transparent 58%),
			linear-gradient(
				148deg,
				color-mix(in srgb, var(--color-gray-50) 74%, var(--color-white)) 0%,
				color-mix(in srgb, var(--color-secondary-light) 22%, var(--color-gray-100)) 18%,
				color-mix(in srgb, var(--color-yellow-200) 36%, var(--color-gray-100)) 100%
			);
		box-shadow:
			0 14px 38px color-mix(in srgb, var(--color-secondary-dark) 16%, transparent),
			inset 0 1px 0 color-mix(in srgb, var(--color-white) 70%, transparent);
	}

	.hero-glow {
		@apply pointer-events-none absolute h-[220px] w-[220px] rounded-full opacity-[0.58] blur-[56px];
	}

	.hero-glow-left {
		top: -100px;
		left: -30px;
		background: color-mix(in srgb, var(--color-secondary) 48%, transparent);
	}

	.hero-glow-right {
		top: -120px;
		right: -20px;
		background: color-mix(in srgb, var(--color-yellow-500) 35%, transparent);
	}

	.hero-kicker {
		@apply relative mb-3 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold tracking-[0.08em] uppercase;
		background: color-mix(in srgb, var(--color-secondary) 13%, transparent);
		border: 1px solid color-mix(in srgb, var(--color-secondary) 28%, transparent);
		color: color-mix(in srgb, var(--color-secondary-dark) 70%, var(--color-black));
	}

	.hero-brand {
		@apply relative mb-2 text-[clamp(3rem,7vw,5.5rem)] leading-none font-black tracking-[-0.06em] text-balance;
		color: var(--color-secondary);
	}

	.hero-title {
		@apply relative mb-3 max-w-[16ch] text-[clamp(1.9rem,4vw,2.95rem)] leading-[1.05];
		color: var(--color-secondary-dark);
	}

	.hero-subtitle {
		@apply relative max-w-[62ch] text-[clamp(0.97rem,1.7vw,1.08rem)] leading-[1.72];
		color: color-mix(in srgb, var(--color-secondary-dark) 78%, var(--color-black));
	}

	.hero-actions {
		@apply relative mt-5 flex flex-wrap gap-3;
	}

	.hero-button {
		@apply inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-bold no-underline transition duration-200;
	}

	.hero-button:hover {
		@apply -translate-y-px;
	}

	.hero-button-primary {
		color: #ffffff;
		background: var(--color-secondary);
		border: 1px solid var(--color-secondary-dark);
		box-shadow: 0 8px 18px color-mix(in srgb, var(--color-secondary-dark) 33%, transparent);
	}

	.hero-button-primary:hover {
		background: color-mix(in srgb, var(--color-secondary) 84%, var(--color-secondary-dark));
	}

	.hero-button-secondary {
		color: var(--color-gray-800);
		background: color-mix(in srgb, var(--color-secondary-light) 80%, var(--color-white));
		border: 1px solid color-mix(in srgb, var(--color-secondary) 30%, transparent);
	}

	.hero-button-secondary:hover {
		background: color-mix(in srgb, var(--color-secondary) 40%, var(--color-white));
	}

	.hero-button-subtle {
		color: var(--color-gray-700);
		background: color-mix(in srgb, var(--color-gray-100) 74%, var(--color-white));
		border: 1px solid var(--color-gray-200);
	}

	.hero-button-subtle:hover {
		background: color-mix(in srgb, var(--color-gray-200) 66%, var(--color-white));
	}

	.stat-grid {
		@apply mx-auto grid w-full max-w-4xl grid-cols-2 gap-3 md:grid-cols-4;
	}

	.stat-card {
		@apply justify-self-center rounded-xl border border-gray-200 px-4 py-4 text-center;
		width: min(100%, 10rem);
	}

	.stat-value {
		@apply text-[clamp(1.3rem,3.3vw,1.95rem)] leading-none font-extrabold;
		color: var(--color-secondary);
	}

	.stat-label {
		@apply mt-1 text-xs tracking-[0.01em];
		color: var(--color-gray-700);
	}

	.content-grid {
		@apply grid gap-3 lg:grid-cols-2;
	}

	.section-card {
		@apply p-5;
	}

	.section-header-row {
		@apply flex items-baseline justify-between gap-4;
	}

	.section-title {
		@apply text-lg font-bold tracking-tight;
		color: var(--color-gray-800);
	}

	.section-description {
		@apply mt-2 mb-4 text-sm leading-6;
		color: var(--color-gray-700);
		min-height: var(--section-description-height, 0px);
	}

	.resource-list {
		@apply grid gap-2 xl:grid-cols-2;
	}

	.resource-link {
		@apply block rounded-lg border border-transparent px-3 py-2 text-sm font-semibold no-underline transition duration-200;
		color: color-mix(in srgb, var(--color-gray-800) 84%, var(--color-black));
		background-color: color-mix(in srgb, var(--color-secondary) 5%, var(--color-gray-100));
	}

	.resource-link:hover {
		@apply translate-x-1;
		border-color: color-mix(in srgb, var(--color-secondary) 35%, transparent);
		background-color: color-mix(in srgb, var(--color-secondary) 11%, var(--color-gray-100));
	}

	.study-track-grid {
		@apply grid gap-3 md:grid-cols-3;
	}

	.track-card {
		@apply relative p-5;
	}

	.track-number {
		@apply mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold;
		color: var(--color-secondary-dark);
		background: color-mix(in srgb, var(--color-secondary) 13%, transparent);
		border: 1px solid color-mix(in srgb, var(--color-secondary) 33%, transparent);
	}

	@media (min-width: 1200px) {
		.resource-list {
			@apply xl:grid-cols-2;
		}
	}

	@media (max-width: 768px) {
		.landing-hero {
			@apply p-5;
		}

		.hero-title {
			@apply text-[clamp(1.7rem,9vw,2.3rem)];
		}

		.hero-subtitle {
			@apply text-sm leading-6;
		}

		.hero-actions {
			@apply mt-4;
		}

		.hero-button {
			@apply w-full;
		}

		.section-description {
			min-height: 0;
		}
	}
</style>
