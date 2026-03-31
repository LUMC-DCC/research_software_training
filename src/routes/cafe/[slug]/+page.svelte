<script lang="ts">
	import { base } from '$app/paths';

	let { data } = $props();

	const withBase = (path: string) => (path === '/' ? `${base}/` : `${base}${path}`);
	const event = $derived(data.event);
	const sessionHtml = $derived((data.content as string) ?? '');
	const metadata = $derived(data.metadata ?? {});
	const isPlaceholder = $derived(Boolean(data.isPlaceholder));
	const eventDate = $derived(new Date(event.date));
	const dateParts = $derived({
		day: eventDate.toLocaleDateString(undefined, { day: '2-digit' }),
		month: eventDate.toLocaleDateString(undefined, { month: 'long' }),
		year: eventDate.toLocaleDateString(undefined, { year: 'numeric' })
	});
	const slidesUrl = $derived(event.slides);
	const hasSlides = $derived(Boolean(slidesUrl));
	const isPowerPoint = $derived(Boolean(slidesUrl && /\.(ppt|pptx)([?#].*)?$/i.test(slidesUrl)));
	const canEmbedSlides = $derived(Boolean(slidesUrl) && !isPowerPoint);

	const links = $derived(
		[
			{ label: 'Repository', href: event.repo },
			{ label: 'Zenodo', href: event.zenodo ? `https://doi.org/${event.zenodo}` : undefined },
			{ label: 'Calendar', href: event.calendar }
		].filter((item) => item.href)
	);
</script>

<div class="min-h-full bg-slate-50 py-8 md:py-10 lg:py-12">
	<div class="mx-auto max-w-7xl px-4 lg:px-6">
		<a class="text-sm font-bold text-sky-700 no-underline" href={withBase('/cafe-agenda')}
			>&larr; Back to Coding Cafe Agenda</a
		>

		<article class="mt-3 rounded-xl border border-slate-200 bg-white px-5 py-4 md:px-6 md:py-5">
			<header class="border-b border-slate-200 pb-4">
				<div class="grid gap-3 min-[900px]:grid-cols-[minmax(16rem,19rem)_minmax(0,1fr)] min-[900px]:gap-5">
					<div class="grid content-start gap-2.5">
						<div
							class="w-full rounded-2xl border border-sky-200 bg-linear-to-b from-sky-50 to-white px-4 py-3"
							aria-label={eventDate.toLocaleDateString()}
						>
							<p class="m-0 text-[clamp(1.2rem,2.8vw,1.8rem)] leading-tight font-extrabold uppercase tracking-[0.08em] text-slate-900">
								{dateParts.day}
							</p>
							<p class="mt-1 text-[clamp(2rem,5.4vw,3.15rem)] leading-[0.92] font-black tracking-[-0.04em] text-sky-700">
								{dateParts.month} {dateParts.year}
							</p>
						</div>
						<div class="rounded-2xl border-l-4 border-sky-500 bg-linear-to-b from-slate-50 to-white px-4 py-3 shadow-[inset_0_0_0_1px_#e2e8f0]">
							<span class="mb-1 block text-[0.7rem] uppercase tracking-[0.14em] text-slate-500"
								>Speaker</span
							>
							<p class="m-0 text-base leading-[1.35] font-bold text-slate-900">
								{isPlaceholder ? 'To be announced' : event.speaker ?? 'TBA'}
							</p>
						</div>
					</div>

					<div class="grid gap-1.5">
						<h1 class="m-0 text-[clamp(2.1rem,4.2vw,3.15rem)] leading-[1.05] font-black text-slate-900">
							{metadata.title ?? event.title}
						</h1>
						{#if event.subtitle}
							<p class="m-0 text-xl font-extrabold text-emerald-600">{event.subtitle}</p>
						{/if}
						<p class="mt-1 text-[1.08rem] leading-[1.7] text-slate-600">
							{metadata.summary ?? event.description}
						</p>
					</div>
				</div>

				<div class="mt-3 grid gap-2">
					{#if hasSlides || links.length > 0}
						<div class="flex flex-wrap gap-2">
							{#if hasSlides}
								<a
									class="rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-sm font-bold text-sky-700 no-underline"
									href={slidesUrl}
									target="_blank"
									rel="noopener noreferrer">Slides (open in new tab)</a
								>
							{:else}
								<p
									class="m-0 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-bold text-slate-600"
								>
									Materials will be here soon.
								</p>
							{/if}
							{#each links as link}
								<a
									class="rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-sm font-bold text-sky-700 no-underline"
									href={link.href}
									target="_blank"
									rel="noopener noreferrer">{link.label}</a
								>
							{/each}
						</div>
					{/if}
				</div>
			</header>

			<section class="markdown-content pt-4">
				{#if sessionHtml}
					{@html sessionHtml}
				{:else if isPlaceholder}
					<h2>Session materials</h2>
					<p>The materials for this session will be updated soon.</p>
				{:else}
					<h2>Session Notes</h2>
					<p>No markdown page found for this session yet. Add one in `src/lib/content/cafe-sessions/{event.slug}.md`.</p>
				{/if}
			</section>

			{#if slidesUrl}
				<section class="mt-5 border-t border-slate-200 pt-4">
					{#if canEmbedSlides}
						<iframe
							class="slides-frame"
							src={slidesUrl}
							title={`${event.title} slides`}
							loading="lazy"
						></iframe>
					{:else}
						<div class="slides-fallback">
							<p>
								This session uses a presentation file format that is not embedded inline.
								Open the deck in a new tab to view or download it.
							</p>
							<a class="viewer-link" href={slidesUrl} target="_blank" rel="noopener noreferrer">
								Open slides in new tab
							</a>
						</div>
					{/if}
				</section>
			{/if}
		</article>
	</div>
</div>

<style>
	.slides-frame {
		width: 100%;
		aspect-ratio: 16 / 10.5;
		height: auto;
		max-height: 88vh;
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
	.markdown-content :global(> :first-child) {
		margin-top: 0;
	}
	.markdown-content :global(h2),
	.markdown-content :global(h3),
	.markdown-content :global(h4) {
		margin: 1.45rem 0 0.55rem;
		line-height: 1.2;
		color: #0f172a;
	}
	.markdown-content :global(h2) {
		font-size: clamp(1.5rem, 2.7vw, 1.95rem);
		font-weight: 800;
	}
	.markdown-content :global(h3) {
		font-size: 1.28rem;
		font-weight: 750;
	}
	.markdown-content :global(h4) {
		font-size: 1rem;
		font-weight: 750;
	}
	.markdown-content :global(p),
	.markdown-content :global(li),
	.markdown-content :global(blockquote) {
		color: #334155;
		line-height: 1.72;
		font-size: 1.06rem;
	}
	.markdown-content :global(p),
	.markdown-content :global(ul),
	.markdown-content :global(ol),
	.markdown-content :global(blockquote),
	.markdown-content :global(pre) {
		margin: 0.72rem 0;
	}
	.markdown-content :global(ul),
	.markdown-content :global(ol) {
		padding-left: 1.35rem;
	}
	.markdown-content :global(li + li) {
		margin-top: 0.35rem;
	}
	.markdown-content :global(a) {
		color: #0369a1;
		font-weight: 700;
		text-decoration: underline;
		text-decoration-thickness: 0.08em;
		text-underline-offset: 0.16em;
	}
	.markdown-content :global(strong) {
		color: #0f172a;
		font-weight: 800;
	}
	.markdown-content :global(code) {
		font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
		font-size: 0.92em;
		background: #eff6ff;
		color: #0f172a;
		padding: 0.15rem 0.35rem;
		border-radius: 0.35rem;
	}
	.markdown-content :global(pre) {
		overflow-x: auto;
		padding: 0.9rem 1rem;
		border-radius: 0.75rem;
		background: #0f172a;
	}
	.markdown-content :global(pre code) {
		background: transparent;
		color: #e2e8f0;
		padding: 0;
	}
	.markdown-content :global(blockquote) {
		padding-left: 1rem;
		border-left: 3px solid #7dd3fc;
		color: #475569;
	}
</style>
