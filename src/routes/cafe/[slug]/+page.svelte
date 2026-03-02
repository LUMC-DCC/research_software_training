<script lang="ts">
	import { base } from '$app/paths';

	let { data } = $props();

	const withBase = (path: string) => (path === '/' ? `${base}/` : `${base}${path}`);
	const event = $derived(data.event);
	const SessionContent = $derived(data.content as any);
	const metadata = $derived(data.metadata ?? {});
	const slidesUrl = $derived(event.slides);
	const isPowerPoint = $derived(Boolean(slidesUrl && /\.(ppt|pptx)([?#].*)?$/i.test(slidesUrl)));
	const canEmbedSlides = $derived(Boolean(slidesUrl) && !isPowerPoint);

	const links = $derived(
		[
			{ label: 'Slides (open in new tab)', href: event.slides },
			{ label: 'Repository', href: event.repo },
			{ label: 'Zenodo', href: event.zenodo ? `https://doi.org/${event.zenodo}` : undefined },
			{ label: 'Calendar', href: event.calendar }
		].filter((item) => item.href)
	);
</script>

<div class="page">
	<div class="container">
		<a class="back" href={withBase('/cafe')}>&larr; Back to Coding Cafe</a>

		<header class="hero">
			<div class="meta">{new Date(event.date).toLocaleDateString()} • {event.location}</div>
			<h1>{metadata.title ?? event.title}</h1>
			{#if event.subtitle}<p class="subtitle">{event.subtitle}</p>{/if}
			<p class="summary">{metadata.summary ?? event.description}</p>

			<div class="hero-details">
				<div class="facts">
					<div><span>Speaker</span>{event.speaker ?? 'TBA'}</div>
					<div><span>Date</span>{new Date(event.date).toLocaleDateString()}</div>
					<div>
						<span>Time</span>
						{event.time ??
							new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
					</div>
					<div><span>Location</span>{event.location}</div>
				</div>

				{#if links.length > 0}
					<div class="materials">
						{#each links as link}
							<a href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>
						{/each}
					</div>
				{/if}
			</div>
		</header>
	</div>

	{#if slidesUrl}
		<section class="viewer">
			{#if canEmbedSlides}
				<iframe class="slides-frame" src={slidesUrl} title={`${event.title} slides`} loading="lazy"></iframe>
			{:else}
				<div class="container">
					<div class="slides-fallback">
						<p>
							This session uses a presentation file format that is not embedded inline.
							Open the deck in a new tab to view or download it.
						</p>
						<a class="viewer-link" href={slidesUrl} target="_blank" rel="noopener noreferrer">
							Open slides in new tab
						</a>
					</div>
				</div>
			{/if}
		</section>
	{/if}

	<div class="container">
		<article class="content">
			{#if SessionContent}
				<SessionContent />
			{:else}
				<h2>Session Notes</h2>
				<p>No markdown page found for this session yet. Add one in `src/lib/content/cafe-sessions/{event.slug}.md`.</p>
			{/if}
		</article>
	</div>
</div>

<style>
	.page {
		min-height: 100%;
		background: #f8fafc;
		padding: 2rem 0 4rem;
	}
	.container {
		max-width: 72rem;
		margin: 0 auto;
		padding: 0 1rem;
	}
	.back {
		text-decoration: none;
		font-size: 0.85rem;
		font-weight: 700;
		color: #0369a1;
	}
	.hero {
		margin: 0.75rem 0 0.85rem;
		background: #fff;
		border: 1px solid #e2e8f0;
		border-radius: 0.85rem;
		padding: 0.75rem 0.95rem;
	}
	.meta {
		font-size: 0.8rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: #64748b;
	}
	h1 {
		margin: 0.3rem 0 0.2rem;
		font-size: clamp(1.8rem, 4vw, 2.7rem);
		color: #0f172a;
	}
	.subtitle {
		margin: 0;
		font-size: 1.2rem;
		font-weight: 800;
		color: #059669;
	}
	.summary {
		margin: 0.45rem 0 0;
		max-width: 62rem;
		color: #475569;
		line-height: 1.65;
	}
	.hero-details {
		margin-top: 0.6rem;
		display: grid;
		gap: 0.55rem;
	}
	.facts {
		display: grid;
		grid-template-columns: repeat(1, minmax(0, 1fr));
		gap: 0.65rem;
	}
	.facts div {
		padding: 0.5rem 0.62rem;
		border: 1px solid #e2e8f0;
		border-radius: 0.65rem;
		background: #f8fafc;
		font-size: 0.9rem;
		color: #0f172a;
		font-weight: 700;
	}
	.facts span {
		display: block;
		font-size: 0.68rem;
		color: #64748b;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: 0.2rem;
	}
	.materials {
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem;
	}
	.materials a {
		text-decoration: none;
		color: #0369a1;
		font-weight: 700;
		padding: 0.36rem 0.62rem;
		border-radius: 999px;
		background: #eff6ff;
		border: 1px solid #bfdbfe;
		font-size: 0.83rem;
	}
	.content {
		background: #fff;
		border: 1px solid #e2e8f0;
		border-radius: 0.85rem;
		padding: 1.2rem;
	}
	.viewer {
		margin: 0.8rem 0 1rem;
		padding: 0 1rem;
	}
	.slides-frame {
		width: 100%;
		aspect-ratio: 16 / 9;
		height: auto;
		max-height: 82vh;
		border: 1px solid #cbd5e1;
		border-radius: 0.75rem;
		background: #fff;
		display: block;
	}
	.slides-fallback {
		background: #fff;
		border: 1px solid #e2e8f0;
		border-radius: 0.85rem;
		padding: 1rem;
	}
	.viewer-link {
		display: inline-flex;
		align-items: center;
		margin-top: 0.35rem;
		text-decoration: none;
		color: #0369a1;
		font-weight: 700;
	}
	.content :global(h2) {
		margin-top: 0;
	}
	.content :global(p),
	.content :global(li) {
		color: #334155;
		line-height: 1.65;
	}
	@media (min-width: 740px) {
		.facts {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (min-width: 1024px) {
		.container {
			padding: 0 1.5rem;
		}
		.facts {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
		.viewer {
			padding: 0 1.5rem;
		}
	}
</style>
