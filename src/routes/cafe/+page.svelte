<script lang="ts">
	import { events } from '$lib/data';
	import { base } from '$app/paths';

	const withBase = (path: string) => (path === '/' ? `${base}/` : `${base}${path}`);
	const cafeLogoSrc = withBase('/images/Logo_transparent_bg.png');

	const cafeEvents = events
		.filter((event) => event.type === 'cafe')
		.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

	const now = new Date();
	const upcomingEvents = cafeEvents.filter((event) => new Date(event.date) > now);
	const pastEvents = cafeEvents.filter((event) => new Date(event.date) <= now).reverse();

	const formatDate = (date: string) =>
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

	const eventTagline = (tags?: string[]) => {
		if (!tags || tags.length === 0) return 'Coding Cafe Session';
		return tags[0].replace(/[-_]/g, ' ').toUpperCase();
	};

	const tagList = (tags?: string[]) => (tags && tags.length > 0 ? tags : ['coding-cafe']);
	const sessionPath = (slug?: string) => (slug ? withBase(`/cafe/${slug}`) : undefined);

	const speakerInitials = (name?: string) => {
		if (!name) return 'CC';
		return name
			.split(' ')
			.filter(Boolean)
			.slice(0, 2)
			.map((part) => part[0]?.toUpperCase() ?? '')
			.join('');
	};
</script>

<div class="page">
	<section class="info container">
		<img class="cafe-logo" src={cafeLogoSrc} alt="LUMC Coding Cafe" />
		<p>
			Monthly sessions for researchers and developers to share tools, workflows, and practical
			coding experience. Browse upcoming sessions first, then revisit past sessions in the archive.
		</p>
	</section>

	<section class="section container">
		<div class="section-head">
			<h2>Upcoming Sessions</h2>
			<span class="live">Live schedule</span>
		</div>

		{#if upcomingEvents.length > 0}
			<div class="cards" class:single={upcomingEvents.length === 1}>
				{#each upcomingEvents as event (event.id)}
					<article class="event-card">
						<div class="event-card-body">
							<div class="top-row">
								<span class="topic">{eventTagline(event.tags)}</span>
								<div class="date-block">
									<div>{formatDate(event.date)}</div>
									<div>{formatTime(event.date, event.time)}</div>
								</div>
							</div>

							<h3>{event.title}</h3>
							{#if event.subtitle}<p class="subtitle">{event.subtitle}</p>{/if}
							<p class="description">{event.description}</p>

							<div class="tag-row">
								{#each tagList(event.tags).slice(0, 4) as tag}
									<span>#{tag}</span>
								{/each}
							</div>
						</div>

						<div class="event-card-footer">
							<div class="speaker">
								<div class="avatar">{speakerInitials(event.speaker)}</div>
								<div>
									<div class="speaker-name">{event.speaker ?? 'Community Session'}</div>
									<div class="speaker-role">Coding Cafe Speaker</div>
								</div>
							</div>
							<div class="key-info">
								<div class="key-info-row"><span>Date</span> {formatDate(event.date)}</div>
								<div class="key-info-row"><span>Time</span> {formatTime(event.date, event.time)}</div>
								<div class="key-info-row"><span>Location</span> {event.location}</div>
							</div>
							<a class="cta" href={sessionPath(event.slug) || event.registrationLink || withBase('/contact')}
								>Session page -></a
							>
						</div>
					</article>
				{/each}
			</div>
		{:else}
			<div class="empty">No upcoming sessions scheduled yet.</div>
		{/if}
	</section>

	<section class="section container">
		<div class="section-head">
			<h2>Archive / Past Sessions</h2>
			<span class="archive-label">Archives</span>
		</div>

		{#if pastEvents.length > 0}
			<div class="cards" class:single={pastEvents.length === 1}>
				{#each pastEvents as event (event.id)}
					<article class="event-card muted">
						<div class="event-card-body">
							<div class="top-row">
								<span class="topic">{eventTagline(event.tags)}</span>
								<div class="date-block">
									<div>{formatDate(event.date)}</div>
									<div>{formatTime(event.date, event.time)}</div>
								</div>
							</div>

							<h3>{event.title}</h3>
							{#if event.subtitle}<p class="subtitle">{event.subtitle}</p>{/if}
							<p class="description">{event.description}</p>

							<div class="tag-row">
								{#each tagList(event.tags).slice(0, 4) as tag}
									<span>#{tag}</span>
								{/each}
							</div>
						</div>

						<div class="event-card-footer">
							<div class="speaker">
								<div class="avatar">{speakerInitials(event.speaker)}</div>
								<div>
									<div class="speaker-name">{event.speaker ?? 'Community Session'}</div>
									<div class="speaker-role">Past Session</div>
								</div>
							</div>
							<a class="cta" href={sessionPath(event.slug) || withBase('/resources')}>View materials -></a>
						</div>
					</article>
				{/each}
			</div>
		{:else}
			<div class="empty">No past sessions recorded.</div>
		{/if}
	</section>
</div>

<style>
	.page {
		min-height: 100%;
		background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 48%, #e2e8f0 100%);
		padding-bottom: 4rem;
	}

	.container {
		max-width: 80rem;
		margin: 0 auto;
		padding: 0 1rem;
	}

	.info {
		padding-top: 3.8rem;
		padding-bottom: 2.4rem;
	}

	.cafe-logo {
		display: block;
		margin: 1.25rem auto 0.8rem;
		height: auto;
		width: min(100%, 28rem);
		max-width: calc(100% - 2.5rem);
	}

	.info p {
		max-width: 44rem;
		margin: 0;
		font-size: 1.04rem;
		line-height: 1.65;
		color: #475569;
	}

	.section {
		padding-top: 1.3rem;
	}

	.section-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	h2 {
		margin: 0;
		font-size: clamp(1.45rem, 4vw, 2rem);
		color: #0f172a;
	}

	.live,
	.archive-label {
		font-size: 0.68rem;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #475569;
	}

	.live {
		color: #34d399;
	}

	.cards {
		display: grid;
		grid-template-columns: repeat(1, minmax(0, 1fr));
		gap: 1rem;
	}

	.cards.single {
		grid-template-columns: minmax(18rem, 24rem);
		justify-content: start;
	}

	.event-card {
		aspect-ratio: 1 / 1;
		display: flex;
		flex-direction: column;
		background: linear-gradient(160deg, #091710 0%, #020a07 100%);
		border: 1px solid #153329;
		border-radius: 1.25rem;
		overflow: hidden;
		box-shadow: 0 12px 30px rgb(0 0 0 / 0.35);
	}

	.event-card.muted {
		opacity: 0.82;
	}

	.event-card-body {
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
		flex: 1;
		min-height: 0;
	}

	.top-row {
		display: flex;
		justify-content: space-between;
		gap: 0.6rem;
	}

	.topic {
		padding: 0.3rem 0.58rem;
		border-radius: 999px;
		border: 1px solid rgb(245 158 11 / 0.35);
		background: rgb(245 158 11 / 0.12);
		color: #fbbf24;
		font-size: 0.64rem;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		height: fit-content;
	}

	.date-block {
		text-align: right;
		font-size: 0.7rem;
		line-height: 1.3;
		color: #9ca3af;
	}

	h3 {
		margin: 0;
		color: #fff;
		font-size: 1.32rem;
		line-height: 1.15;
	}

	.subtitle {
		margin: 0;
		color: #10b981;
		font-size: 0.9rem;
		font-weight: 800;
		text-transform: uppercase;
	}

	.description {
		margin: 0;
		color: #94a3b8;
		font-size: 0.88rem;
		line-height: 1.5;
		display: -webkit-box;
		line-clamp: 4;
		-webkit-line-clamp: 4;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.tag-row {
		display: flex;
		gap: 0.4rem;
		flex-wrap: wrap;
		margin-top: auto;
	}

	.tag-row span {
		padding: 0.24rem 0.5rem;
		border-radius: 0.45rem;
		border: 1px solid #1f2f2a;
		color: #64748b;
		font-size: 0.65rem;
		font-weight: 700;
	}

	.event-card-footer {
		padding: 0.8rem 1rem 1rem;
		border-top: 1px solid #152722;
		background: rgb(2 10 7 / 0.86);
		display: grid;
		gap: 0.6rem;
	}

	.speaker {
		display: flex;
		align-items: center;
		gap: 0.58rem;
	}

	.avatar {
		width: 2rem;
		height: 2rem;
		border-radius: 0.5rem;
		display: grid;
		place-items: center;
		font-size: 0.72rem;
		font-weight: 800;
		background: #1f2937;
		color: #e5e7eb;
	}

	.speaker-name {
		font-size: 0.84rem;
		font-weight: 700;
		color: #f8fafc;
	}

	.speaker-role {
		font-size: 0.69rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: #34d399;
	}

	.key-info {
		display: grid;
		gap: 0.3rem;
		padding: 0.55rem 0.65rem;
		border-radius: 0.65rem;
		border: 1px solid #205a49;
		background: rgb(16 185 129 / 0.08);
	}

	.key-info-row {
		color: #d1fae5;
		font-size: 0.87rem;
		font-weight: 700;
		line-height: 1.35;
	}

	.key-info-row span {
		color: #34d399;
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		font-weight: 800;
		margin-right: 0.35rem;
	}

	.cta {
		display: flex;
		justify-content: center;
		align-items: center;
		text-decoration: none;
		padding: 0.62rem 0.8rem;
		border-radius: 0.7rem;
		background: #10b981;
		color: #032016;
		font-size: 0.88rem;
		font-weight: 900;
		letter-spacing: 0.02em;
	}

	.cta:hover {
		background: #34d399;
	}

	.empty {
		padding: 2rem;
		border-radius: 1rem;
		border: 1px dashed #94a3b8;
		background: rgb(248 250 252 / 0.95);
		color: #334155;
	}

	@media (min-width: 700px) {
		.cards {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.cards.single {
			grid-template-columns: minmax(20rem, 24rem);
		}
	}

	@media (min-width: 1100px) {
		.container {
			padding: 0 1.5rem;
		}
		.cards {
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 1.2rem;
		}
	}
</style>
