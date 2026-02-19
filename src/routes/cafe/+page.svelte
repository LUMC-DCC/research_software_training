<script lang="ts">
	import { events } from '$lib/data';
	import { base } from '$app/paths';

	const cafeEvents = events
		.filter((e) => e.type === 'cafe')
		.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

	const now = new Date();
	const nextEvent = cafeEvents.find((e) => new Date(e.date) > now);
	const pastEvents = cafeEvents.filter((e) => new Date(e.date) <= now).reverse();
	const withBase = (path: string) => (path === '/' ? `${base}/` : `${base}${path}`);
</script>

<div class="wrap">
	<div class="hero">
		<div class="container hero-grid">
			<div>
				<div class="pill">Community Meetup</div>
				<h1>LUMC Coding Cafe</h1>
				<p>
					A monthly informal gathering for anyone who writes code for research. Share knowledge,
					troubleshoot bugs, and meet your peers.
				</p>
			</div>
			<div class="coffee">Cafe</div>
		</div>
	</div>

	<div class="container content">
		{#if nextEvent}
			<section class="next-card">
				<div class="bar"></div>
				<div>
					<div class="next-label">Next Session</div>
					<h2>{nextEvent.title}</h2>
					<p class="desc">{nextEvent.description}</p>
					<div class="meta">
						<span>{new Date(nextEvent.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</span>
						<span>{nextEvent.location}</span>
						{#if nextEvent.speaker}<span>{nextEvent.speaker}</span>{/if}
					</div>
					<a href={withBase('/contact')} class="btn">Register Now</a>
				</div>
			</section>
		{:else}
			<section class="empty-card">
				<h2>No upcoming sessions scheduled</h2>
				<p>Check back soon for new dates.</p>
			</section>
		{/if}

		<div class="layout">
			<div class="main-col">
				<section>
					<h3>What to expect</h3>
					<div class="steps">
						<div class="step">
							<div class="bubble">1</div>
							<h4>Lightning Talks</h4>
							<p>First 30 minutes: a short demo or presentation on a tool, library, or case study.</p>
						</div>
						<div class="step">
							<div class="bubble green">2</div>
							<h4>Co-working and Help</h4>
							<p>Last 60 minutes: bring your laptop and work on your code with peers and mentors.</p>
						</div>
					</div>
				</section>

				<section>
					<h3>Archive</h3>
					<div class="archive">
						{#if pastEvents.length > 0}
							{#each pastEvents as event (event.id)}
								<div class="archive-item">
									<div>
										<h4>{event.title}</h4>
										<p>{new Date(event.date).toLocaleDateString()} • {event.speaker ?? 'Community Session'}</p>
									</div>
									<a href={withBase('/resources')}>View Materials</a>
								</div>
							{/each}
						{:else}
							<div class="archive-item"><p>No past events recorded.</p></div>
						{/if}
					</div>
				</section>
			</div>

			<aside class="side-col">
				<div class="topic-card">
					<h3>Have a topic?</h3>
					<p>
						We are always looking for speakers. If you have a tool you love or a problem you solved,
						share it at the next Cafe.
					</p>
					<button type="button">Propose a Topic</button>
				</div>

				<div class="faq-card">
					<h3>FAQ</h3>
					<div>
						<h5>Do I need to be an expert?</h5>
						<p>Not at all. Beginners are very welcome.</p>
					</div>
					<div>
						<h5>Is lunch provided?</h5>
						<p>Usually we provide coffee, tea and snacks.</p>
					</div>
				</div>
			</aside>
		</div>
	</div>
</div>

<style>
	.wrap {
		min-height: 100%;
		background: #f8fafc;
	}
	.container {
		max-width: 80rem;
		margin: 0 auto;
		padding: 0 1rem;
	}
	.hero {
		background: #15803d;
		color: #fff;
		padding: 4rem 0;
	}
	.hero-grid {
		display: grid;
		gap: 2rem;
		align-items: center;
	}
	.pill {
		display: inline-block;
		border: 1px solid rgb(255 255 255 / 0.35);
		background: rgb(22 101 52 / 0.5);
		padding: 0.35rem 0.6rem;
		border-radius: 999px;
		font-size: 0.78rem;
		font-weight: 700;
		margin-bottom: 1rem;
	}
	h1 {
		margin: 0 0 1rem;
		font-size: clamp(2.1rem, 6vw, 3.2rem);
	}
	.hero p {
		margin: 0;
		color: #dcfce7;
		max-width: 40rem;
		font-size: 1.1rem;
		line-height: 1.7;
	}
	.coffee {
		display: none;
		font-size: 5rem;
		font-weight: 800;
		opacity: 0.2;
		text-align: right;
	}
	.content {
		margin-top: -1.5rem;
		padding-bottom: 4rem;
	}
	.next-card {
		position: relative;
		background: #fff;
		border: 1px solid #e2e8f0;
		border-radius: 0.85rem;
		box-shadow: 0 8px 24px rgb(15 23 42 / 0.08);
		padding: 1.5rem;
		margin-bottom: 2.5rem;
	}
	.bar {
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 0.35rem;
		background: #22c55e;
		border-top-left-radius: 0.85rem;
		border-bottom-left-radius: 0.85rem;
	}
	.next-label {
		font-size: 0.78rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.03em;
		color: #15803d;
	}
	h2 {
		margin: 0.5rem 0 0.8rem;
		font-size: 2rem;
		color: #0f172a;
	}
	.desc {
		margin: 0 0 1rem;
		color: #475569;
		line-height: 1.65;
	}
	.meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.8rem;
		color: #334155;
		margin-bottom: 1.2rem;
		font-weight: 600;
	}
	.btn {
		display: inline-block;
		text-decoration: none;
		background: #15803d;
		color: #fff;
		padding: 0.7rem 1.2rem;
		border-radius: 0.45rem;
		font-weight: 700;
	}
	.layout {
		display: grid;
		gap: 2rem;
	}
	.main-col {
		display: grid;
		gap: 2rem;
	}
	h3 {
		margin: 0 0 1rem;
		font-size: 1.55rem;
		color: #0f172a;
	}
	.steps {
		display: grid;
		gap: 1rem;
	}
	.step {
		background: #fff;
		border: 1px solid #e2e8f0;
		border-radius: 0.7rem;
		padding: 1.2rem;
	}
	.bubble {
		width: 2rem;
		height: 2rem;
		border-radius: 999px;
		display: grid;
		place-items: center;
		font-weight: 700;
		background: #dbeafe;
		color: #1d4ed8;
		margin-bottom: 0.6rem;
	}
	.bubble.green {
		background: #dcfce7;
		color: #166534;
	}
	h4 {
		margin: 0 0 0.5rem;
		font-size: 1.05rem;
		color: #0f172a;
	}
	.step p {
		margin: 0;
		font-size: 0.9rem;
		color: #475569;
		line-height: 1.55;
	}
	.archive {
		background: #fff;
		border: 1px solid #e2e8f0;
		border-radius: 0.7rem;
		overflow: hidden;
	}
	.archive-item {
		padding: 0.95rem 1rem;
		display: flex;
		gap: 0.75rem;
		align-items: center;
		justify-content: space-between;
		border-top: 1px solid #f1f5f9;
	}
	.archive-item:first-child {
		border-top: 0;
	}
	.archive-item h4 {
		margin: 0;
	}
	.archive-item p {
		margin: 0.2rem 0 0;
		color: #64748b;
		font-size: 0.83rem;
	}
	.archive-item a {
		text-decoration: none;
		font-size: 0.85rem;
		font-weight: 700;
		color: #15803d;
	}
	.side-col {
		display: grid;
		gap: 1rem;
		height: fit-content;
	}
	.topic-card {
		background: #0f172a;
		color: #cbd5e1;
		border-radius: 0.8rem;
		padding: 1.2rem;
	}
	.topic-card h3 {
		color: #fff;
		font-size: 1.2rem;
		margin-bottom: 0.6rem;
	}
	.topic-card p {
		margin: 0 0 0.9rem;
		font-size: 0.88rem;
		line-height: 1.6;
	}
	.topic-card button {
		width: 100%;
		border: 1px solid #475569;
		background: transparent;
		color: #fff;
		padding: 0.55rem 0.7rem;
		border-radius: 0.45rem;
		font-weight: 600;
	}
	.faq-card {
		background: #fff;
		border: 1px solid #e2e8f0;
		border-radius: 0.8rem;
		padding: 1.2rem;
		display: grid;
		gap: 0.8rem;
	}
	.faq-card h3 {
		font-size: 1.2rem;
		margin-bottom: 0.2rem;
	}
	.faq-card h5 {
		margin: 0;
		font-size: 0.83rem;
		color: #0f172a;
	}
	.faq-card p {
		margin: 0.2rem 0 0;
		font-size: 0.8rem;
		color: #64748b;
	}
	@media (min-width: 768px) {
		.container {
			padding: 0 1.5rem;
		}
		.steps {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.coffee {
			display: block;
		}
	}
	@media (min-width: 1024px) {
		.hero-grid,
		.layout {
			grid-template-columns: 1fr 17rem;
		}
		.hero-grid > div:first-child {
			grid-column: 1;
		}
		.hero-grid > .coffee {
			grid-column: 2;
		}
		.main-col {
			grid-column: 1;
		}
		.side-col {
			grid-column: 2;
		}
	}
</style>
