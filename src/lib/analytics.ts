import { init } from '@plausible-analytics/tracker';

/**
 * The site domain exactly as it is registered in Plausible's settings.
 *
 * The site is served from a GitHub Pages project page, so the registered site
 * includes the repository sub-path. Override at build time by setting
 * `PUBLIC_PLAUSIBLE_DOMAIN` (SvelteKit exposes `PUBLIC_`-prefixed variables to
 * client code).
 */
const PLAUSIBLE_DOMAIN =
	import.meta.env.PUBLIC_PLAUSIBLE_DOMAIN ?? 'lumc-dcc.github.io/research_software_training';

let started = false;

/** Starts Plausible. Browser only, and safe to call more than once. */
export const startAnalytics = () => {
	if (started) return;
	started = true;

	init({
		domain: PLAUSIBLE_DOMAIN,
		// SvelteKit navigates with `pushState`, which the tracker hooks into,
		// so client-side route changes are counted as pageviews.
		autoCapturePageviews: true,
		// Most of this site is links out to slide decks and resources.
		outboundLinks: true,
		fileDownloads: true
	});
};
