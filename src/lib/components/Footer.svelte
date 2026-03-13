<script lang="ts">
	import { getLocale, translate } from '$lib/i18n';

	const locale = getLocale();
	const t = (key: string) => translate(locale, key);
</script>

<footer class="footer-nav">
	<div class="container mx-auto flex flex-col items-center justify-between gap-4 px-6 py-4 md:flex-row">
		<div class="flex flex-col items-center gap-3 md:flex-row">
			<img
				src="/branch.svg"
				alt="Treeline logo"
				class="h-6 w-6" />
			<span class="footer-text">{'© 2026 Treeline. ' + t('footer.copyright')}</span>
		</div>
		<div class="flex items-center gap-4">
			<a
				href="https://github.com/Kkobarii/Treeline"
				class="footer-link"
				target="_blank"
				rel="noopener noreferrer">GitHub</a>
			<a
				href="/{locale}/about"
				class="footer-link">{t('nav.about')}</a>
		</div>
	</div>
</footer>
