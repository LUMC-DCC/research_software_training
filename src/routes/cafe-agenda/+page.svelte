<script lang="ts">
	import { events } from '$lib/data';
	import { base } from '$app/paths';

	type ViewMode = 'list' | 'grid';

	const withBase = (path: string) => (path === '/' ? `${base}/` : `${base}${path}`);

	const cafeEvents = events
		.filter((event) => event.type === 'cafe')
		.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

	const now = new Date();
	const upcoming = cafeEvents.filter((event) => new Date(event.date) > now);
	const past = cafeEvents.filter((event) => new Date(event.date) <= now).reverse();

	let viewMode = $state<ViewMode>('list');

	const formatDate = (date: string) =>
		new Date(date).toLocaleDateString(undefined, {
			month: 'long',
			day: 'numeric',
			year: 'numeric'
		});

	const formatShortDate = (date: string) =>
		new Date(date).toLocaleDateString(undefined, {
			month: 'short',
			day: '2-digit',
			year: 'numeric'
		});

	const formatTime = (eventDate: string, explicitTime?: string) =>
		explicitTime ||
		new Date(eventDate).toLocaleTimeString([], {
			hour: 'numeric',
			minute: '2-digit'
		});

	const agendaHref = (slug?: string, fallback?: string) =>
		slug ? withBase(`/cafe/${slug}`) : fallback || withBase('/contact');
</script>

<section class="agenda-hero">
	<div class="container hero-copy">
		<p class="hero-eyebrow">Agenda</p>
		<h1>Explore upcoming and past Coding Cafe sessions.</h1>
		<p class="hero-body">
			Upcoming sessions, past materials, and direct links to talks and exercises live here.
		</p>
	</div>
</section>

<section class="agenda-shell container">
	<div class="agenda-stack">
		<section class="agenda-section">
			<div class="agenda-section-head">
				<div>
					<p class="section-eyebrow">Upcoming</p>
					<h2>Next sessions</h2>
				</div>

				<div class="browser-card">
					<div>
						<p class="browser-title">Event browser</p>
						<p class="browser-copy">
							{upcoming.length} upcoming session{upcoming.length === 1 ? '' : 's'} and {past.length}
							archived session{past.length === 1 ? '' : 's'}.
						</p>
					</div>

					<div class="view-toggle" role="tablist" aria-label="Agenda view">
						<button
							type="button"
							class:view-toggle__button--active={viewMode === 'list'}
							class="view-toggle__button"
							onclick={() => (viewMode = 'list')}
							aria-pressed={viewMode === 'list'}
						>
							List
						</button>
						<button
							type="button"
							class:view-toggle__button--active={viewMode === 'grid'}
							class="view-toggle__button"
							onclick={() => (viewMode = 'grid')}
							aria-pressed={viewMode === 'grid'}
						>
							Grid
						</button>
					</div>
				</div>
			</div>

			{#if upcoming.length}
				<div class={viewMode === 'grid' ? 'event-grid' : 'event-list'}>
					{#each upcoming as event (event.id)}
						<article class:card-grid-view={viewMode === 'grid'} class="agenda-card">
							<div class="agenda-card__rail">
								<span class="agenda-card__badge">{formatDate(event.date)}</span>
								{#if event.time}
									<p class="agenda-card__rail-note">{formatTime(event.date, event.time)}</p>
								{/if}
								{#if event.location}
									<div class="agenda-card__rail-location-block">
										<p class="agenda-card__rail-label">Location</p>
										<p class="agenda-card__rail-location">{event.location}</p>
									</div>
								{/if}
							</div>

							<div class="agenda-card__content">
								<div class="agenda-card__header">
									<h3>{event.title}</h3>
									{#if event.tags?.length}
										<div class="agenda-card__tags">
											{#each event.tags as tag}
												<span>{tag}</span>
											{/each}
										</div>
									{/if}
									<p>{event.description}</p>
								</div>
							</div>

							<div class="agenda-card__aside">
								<div class="agenda-card__speaker">
									<div class="agenda-card__avatar" aria-hidden="true">CC</div>
									<div>
										<p class="agenda-card__speaker-label">Speaker</p>
										{#if event.speaker}
											<p class="agenda-card__speaker-name">{event.speaker}</p>
										{:else}
											<p class="agenda-card__speaker-name">Coding Cafe</p>
										{/if}
									</div>
								</div>
							</div>
						</article>
					{/each}
				</div>
			{:else}
				<p class="agenda-empty">No upcoming sessions are published yet.</p>
			{/if}
		</section>

		<section class="agenda-section">
			<div class="agenda-section-head archive-head">
				<div>
					<p class="section-eyebrow archive-eyebrow">Archive</p>
					<h2>Past sessions</h2>
				</div>
			</div>

			{#if past.length}
				<div class={viewMode === 'grid' ? 'event-grid' : 'event-list'}>
					{#each past as event (event.id)}
						<a class:card-grid-view={viewMode === 'grid'} class="agenda-card agenda-card--past" href={agendaHref(event.slug, withBase('/resources'))}>
							<div class="agenda-card__rail">
								<span class="agenda-card__badge archive-badge">{formatDate(event.date)}</span>
							</div>

							<div class="agenda-card__content">
								<div class="agenda-card__header">
									<h3>{event.title}</h3>
									{#if event.tags?.length}
										<div class="agenda-card__tags">
											{#each event.tags as tag}
												<span>{tag}</span>
											{/each}
										</div>
									{/if}
									<p>{event.description}</p>
								</div>
							</div>

							<div class="agenda-card__aside">
								<div class="agenda-card__speaker">
									<div class="agenda-card__avatar agenda-card__avatar--muted" aria-hidden="true">CC</div>
									<div>
										<p class="agenda-card__speaker-label">Speaker</p>
										{#if event.speaker}
											<p class="agenda-card__speaker-name">{event.speaker}</p>
										{:else}
											<p class="agenda-card__speaker-name">Coding Cafe</p>
										{/if}
									</div>
								</div>

								<div class="agenda-card__action agenda-card__action--archive">
									<div class="agenda-card__action-copy">
										<p class="agenda-card__action-label">Session page</p>
										<p class="agenda-card__action-title">Open materials and details</p>
									</div>
									<span class="agenda-card__action-icon" aria-hidden="true">
										<svg viewBox="0 0 24 24">
											<path d="M7 17L17 7M17 7H8M17 7V16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
										</svg>
									</span>
								</div>
							</div>
						</a>
					{/each}
				</div>
			{:else}
				<p class="agenda-empty">Past sessions will appear here once they are archived.</p>
			{/if}
		</section>
	</div>
</section>

<style>
	.agenda-hero {
		background:
			radial-gradient(circle at top left, rgb(14 165 233 / 0.12), transparent 22rem),
			linear-gradient(180deg, #f8fafc 0%, #ffffff 55%, #eff6ff 100%);
	}

	.container {
		max-width: 80rem;
		margin: 0 auto;
		padding: 0 1rem;
	}

	.hero-copy {
		padding-top: 3.5rem;
		padding-bottom: 2.5rem;
	}

	.hero-eyebrow,
	.section-eyebrow {
		margin: 0;
		font-size: 0.78rem;
		font-weight: 800;
		letter-spacing: 0.28em;
		text-transform: uppercase;
		color: #0284c7;
	}

	.archive-eyebrow {
		color: #64748b;
	}

	h1 {
		margin: 1rem 0 0;
		max-width: 14ch;
		font-size: clamp(2.6rem, 6vw, 4.8rem);
		font-weight: 900;
		line-height: 0.95;
		letter-spacing: -0.05em;
		color: #0f172a;
	}

	.hero-body {
		margin: 1.1rem 0 0;
		max-width: 42rem;
		font-size: 1.05rem;
		line-height: 1.8;
		color: #475569;
	}

	.agenda-shell {
		padding-top: 1.5rem;
		padding-bottom: 4rem;
	}

	.agenda-stack {
		display: grid;
		gap: 3rem;
	}

	.agenda-section {
		display: grid;
		gap: 1.5rem;
	}

	.agenda-section-head {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid #e2e8f0;
	}

	.archive-head {
		padding-bottom: 0.9rem;
	}

	h2 {
		margin: 0.5rem 0 0;
		font-size: clamp(1.8rem, 4vw, 2.3rem);
		font-weight: 800;
		letter-spacing: -0.03em;
		color: #0f172a;
	}

	.browser-card {
		display: grid;
		gap: 1rem;
		padding: 1rem 1.1rem;
		border: 1px solid #e2e8f0;
		border-radius: 1.4rem;
		background: rgb(255 255 255 / 0.86);
		box-shadow: 0 24px 60px -32px rgb(15 23 42 / 0.18);
	}

	.browser-title {
		margin: 0;
		font-size: 1rem;
		font-weight: 800;
		letter-spacing: -0.02em;
		color: #0f172a;
	}

	.browser-copy {
		margin: 0.35rem 0 0;
		font-size: 0.9rem;
		line-height: 1.6;
		color: #64748b;
	}

	.view-toggle {
		display: inline-flex;
		width: fit-content;
		border-radius: 1rem;
		background: #f1f5f9;
		padding: 0.25rem;
	}

	.view-toggle__button {
		border: 0;
		background: transparent;
		padding: 0.65rem 1rem;
		border-radius: 0.8rem;
		font-size: 0.82rem;
		font-weight: 700;
		color: #64748b;
		cursor: pointer;
	}

	.view-toggle__button--active {
		background: #fff;
		color: #0369a1;
		box-shadow: 0 1px 2px rgb(15 23 42 / 0.08);
	}

	.event-list,
	.event-grid {
		display: grid;
		gap: 1rem;
	}

	.agenda-card {
		display: grid;
		gap: 1.25rem;
		padding: 1.4rem;
		border: 1px solid #e2e8f0;
		border-radius: 1.75rem;
		background: rgb(255 255 255 / 0.9);
		box-shadow: 0 24px 60px -36px rgb(15 23 42 / 0.16);
		text-decoration: none;
		transition:
			transform 0.18s ease,
			box-shadow 0.18s ease,
			border-color 0.18s ease,
			background-color 0.18s ease;
	}

	.agenda-card:hover {
		transform: translateY(-4px);
		border-color: #bae6fd;
		box-shadow: 0 28px 70px -36px rgb(14 165 233 / 0.2);
	}

	.agenda-card--past {
		background: rgb(255 255 255 / 0.8);
	}

	.agenda-card__rail {
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
	}

	.agenda-card__badge {
		display: inline-flex;
		width: fit-content;
		padding: 0;
		border-radius: 0;
		background: transparent;
		color: #0f172a;
		font-size: 1.5rem;
		font-weight: 700;
		line-height: 1.12;
		letter-spacing: -0.04em;
	}

	.archive-badge {
		color: #0f172a;
	}

	.agenda-card__rail-note {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 700;
		line-height: 1.12;
		letter-spacing: -0.04em;
		color: #0f172a;
	}

	.agenda-card__rail-location {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 700;
		line-height: 1.12;
		letter-spacing: -0.04em;
		color: #0f172a;
	}

	.agenda-card__rail-location-block {
		display: grid;
		gap: 0.25rem;
	}

	.agenda-card__rail-label {
		margin: 0;
		font-size: 0.72rem;
		font-weight: 800;
		line-height: 1.2;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: #64748b;
	}

	.agenda-card__content {
		display: grid;
		gap: 0.9rem;
	}

	.agenda-card__header {
		display: grid;
		gap: 0.85rem;
	}

	.agenda-card__tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem;
	}

	.agenda-card__tags span {
		display: inline-flex;
		padding: 0.35rem 0.7rem;
		border-radius: 999px;
		background: #f1f5f9;
		font-size: 0.65rem;
		font-weight: 800;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: #475569;
	}

	h3 {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 800;
		line-height: 1.15;
		color: #0f172a;
		transition: color 0.18s ease;
	}

	.agenda-card:hover h3 {
		color: #075985;
	}

	.agenda-card p {
		margin: 0;
		font-size: 0.96rem;
		line-height: 1.7;
		color: #475569;
	}

	.agenda-card__aside {
		display: grid;
		gap: 1rem;
		padding-top: 0.2rem;
	}

	.agenda-card__speaker {
		display: flex;
		align-items: center;
		gap: 0.85rem;
		padding: 0.85rem 0.95rem;
		border: 1px solid #e2e8f0;
		border-radius: 1.2rem;
		background: #f8fafc;
		transition:
			border-color 0.18s ease,
			background-color 0.18s ease,
			transform 0.18s ease;
	}

	.agenda-card:hover .agenda-card__speaker {
		border-color: #cbd5e1;
		background: #f8fcff;
		transform: translateY(-1px);
	}

	.agenda-card__avatar {
		display: grid;
		place-items: center;
		width: 2.9rem;
		height: 2.9rem;
		border-radius: 999px;
		background: linear-gradient(135deg, #0369a1, #0ea5e9);
		color: white;
		font-size: 0.78rem;
		font-weight: 800;
		letter-spacing: 0.08em;
	}

	.agenda-card__avatar--muted {
		background: linear-gradient(135deg, #64748b, #94a3b8);
	}

	.agenda-card__speaker-name {
		margin: 0;
		font-size: 0.94rem;
		font-weight: 700;
		line-height: 1.35;
		color: #0f172a;
	}

	.agenda-card__speaker-label {
		margin: 0 0 0.2rem;
		font-size: 0.68rem;
		font-weight: 800;
		line-height: 1.2;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: #64748b;
	}

	.agenda-card__action {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.95rem 1rem;
		border: 1px solid #bae6fd;
		border-radius: 1.2rem;
		background: linear-gradient(180deg, #f0f9ff 0%, #ffffff 100%);
		transition:
			border-color 0.18s ease,
			box-shadow 0.18s ease,
			background-color 0.18s ease;
	}

	.agenda-card:hover .agenda-card__action {
		border-color: #7dd3fc;
		box-shadow: 0 16px 36px -28px rgb(14 165 233 / 0.45);
	}

	.agenda-card__action--archive {
		border-color: #cbd5e1;
		background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
	}

	.agenda-card__action-copy {
		min-width: 0;
	}

	.agenda-card__action-label {
		margin: 0;
		font-size: 0.68rem;
		font-weight: 800;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: #0369a1;
	}

	.agenda-card__action--archive .agenda-card__action-label {
		color: #475569;
	}

	.agenda-card__action-title {
		margin: 0.25rem 0 0;
		font-size: 0.92rem;
		font-weight: 700;
		line-height: 1.4;
		color: #0f172a;
	}

	.agenda-card__action-icon {
		display: grid;
		place-items: center;
		width: 2.5rem;
		height: 2.5rem;
		flex-shrink: 0;
		border-radius: 999px;
		background: white;
		color: #475569;
		box-shadow: 0 8px 20px -18px rgb(15 23 42 / 0.5);
		transition:
			transform 0.18s ease,
			background-color 0.18s ease,
			color 0.18s ease;
	}

	.agenda-card__action-icon svg {
		width: 1rem;
		height: 1rem;
	}

	.agenda-card:hover .agenda-card__action-icon {
		transform: translateX(3px);
		background: #0369a1;
		color: white;
	}

	.card-grid-view {
		height: 100%;
		align-content: start;
	}

	.agenda-empty {
		margin: 0;
		padding: 2rem;
		border: 1px dashed #cbd5e1;
		border-radius: 1.5rem;
		background: #f8fafc;
		font-size: 0.95rem;
		color: #64748b;
	}

	@media (min-width: 768px) {
		.container {
			padding: 0 1.5rem;
		}

		.agenda-section-head {
			flex-direction: row;
			align-items: end;
			justify-content: space-between;
		}
	}

	@media (min-width: 900px) {
		.browser-card {
			grid-template-columns: minmax(0, 1fr) auto;
			align-items: center;
			gap: 1.5rem;
		}
	}

	@media (min-width: 960px) {
		.event-list .agenda-card:not(.card-grid-view) {
			grid-template-columns: minmax(10rem, 1.1fr) minmax(0, 2.4fr) minmax(13rem, 1fr);
			align-items: start;
		}

		.event-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.card-grid-view {
			grid-template-rows: auto 1fr auto;
		}
	}

	@media (min-width: 1280px) {
		.event-grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
</style>
