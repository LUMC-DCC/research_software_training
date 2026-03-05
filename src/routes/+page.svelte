<script lang="ts">
	import { events, trainings } from '$lib/data';
	import { base } from '$app/paths';

	type ActivityEvent = {
		id: string;
		type: 'training' | 'cafe';
		title: string;
		date: string;
		time?: string;
		location: string;
	};

	const now = new Date();
	const trainingTitleById = new Map(trainings.map((training) => [training.id, training.title]));

	const upcomingTrainingById = new Map<string, ActivityEvent>();
	events
		.filter((event) => event.type === 'training' && event.relatedTrainingId && new Date(event.date) > now)
		.forEach((event) => {
			const trainingId = event.relatedTrainingId as string;
			const existing = upcomingTrainingById.get(trainingId);
			if (!existing || new Date(event.date) < new Date(existing.date)) {
				upcomingTrainingById.set(trainingId, {
					id: `training-${trainingId}`,
					type: 'training',
					title: trainingTitleById.get(trainingId) || event.title,
					date: event.date,
					time: event.time,
					location: event.location
				});
			}
		});

	const upcomingCafeEvents: ActivityEvent[] = events
		.filter((event) => event.type === 'cafe' && new Date(event.date) > now)
		.map((event) => ({
			id: event.id,
			type: 'cafe',
			title: event.title,
			date: event.date,
			time: event.time,
			location: event.location
		}));

	const upcomingEvents: ActivityEvent[] = [...Array.from(upcomingTrainingById.values()), ...upcomingCafeEvents]
		.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
		.slice(0, 3);

	const formatMonth = (date: string) => new Date(date).toLocaleDateString('en-US', { month: 'short' });
	const formatDay = (date: string) => new Date(date).getDate();
	const formatTime = (time: string) => time;

	const withBase = (path: string) => (path === '/' ? `${base}/` : `${base}${path}`);
</script>

<section class="hero">
	<div class="container">
		<div class="hero-content">
			<h1>Better Software,<br />Better Research.</h1>
			<p>
				Welcome to the LUMC Research Software Training hub. We help researchers and support staff
				develop the coding skills needed for FAIR, reproducible, and impactful science.
			</p>
			<div class="button-row">
				<a class="btn btn-white" href={withBase('/training')}>Browse Training Catalogue</a>
				<a class="btn btn-cafe" href={withBase('/cafe')}>Join the Coding Cafe</a>
			</div>
		</div>
	</div>
</section>

<section class="section container">
	<div class="section-head">
		<h2>Start Your Journey</h2>
		<p>
			Whether you are just starting with a script or managing a complex pipeline, we have resources for
			you.
		</p>
	</div>

	<div class="cards two-col">
		<article class="card">
			<div class="icon icon-blue"></div>
			<h3>For Researchers and PhDs</h3>
			<p>
				Learn practical skills to analyze data, visualize results, and automate your workflow. Start
				with "Introduction to R" or "Python for Research".
			</p>
			<a class="btn btn-outline" href={withBase('/training')}>Find a Course</a>
		</article>

		<article class="card">
			<div class="icon icon-green"></div>
			<h3>For Data Stewards and Support</h3>
			<p>
				Deepen your knowledge of FAIR principles, software management plans, containerization, and
				reproducibility to support your department.
			</p>
			<a class="btn btn-outline" href={withBase('/resources')}>View Resources</a>
		</article>
	</div>
</section>

<section class="events-wrap">
	<div class="container">
		<div class="events-head">
			<div>
				<h2>Upcoming Activities</h2>
				<p>Don't miss our next workshops and meetups.</p>
			</div>
			<a class="events-link" href={withBase('/calendar')}>View Full Calendar</a>
		</div>

		<div class="events-list">
			{#if upcomingEvents.length > 0}
				{#each upcomingEvents as event (event.id)}
					<div class="event-item">
						<div class="date-box">
							<span>{formatMonth(event.date)}</span>
							<strong>{formatDay(event.date)}</strong>
						</div>
						<div class="event-main">
							<div class="event-meta">
								<span class:event-cafe={event.type === 'cafe'} class="type-tag">
									{event.type === 'cafe' ? 'Coding Cafe' : 'Training'}
								</span>
								{#if event.time}
									<span>{formatTime(event.time)}</span>
								{/if}
							</div>
							<h4>{event.title}</h4>
							<p>{event.location}</p>
						</div>
						<a class="btn btn-outline desktop-only" href={event.type === 'cafe' ? withBase('/cafe') : withBase('/calendar')}
							>Details</a
						>
					</div>
				{/each}
			{:else}
				<p class="empty">No upcoming events scheduled at the moment.</p>
			{/if}
		</div>
	</div>
</section>

<section class="cta container">
	<h2>Need specific help?</h2>
	<p>
		The research software team offers 1:1 consultations for project setup, code review, and software
		management plans.
	</p>
	<div class="button-row center">
		<a class="btn btn-primary" href={withBase('/contact')}>Contact Us</a>
		<a class="btn btn-outline" href={withBase('/about')}>Meet the Team</a>
	</div>
</section>

<style>
	.container {
		max-width: 80rem;
		margin: 0 auto;
		padding: 0 1rem;
	}

	.hero {
		background: linear-gradient(135deg, #075985, #0c4a6e);
		color: white;
		padding: 5rem 0;
	}

	.hero-content {
		max-width: 46rem;
	}

	h1 {
		font-size: clamp(2.2rem, 6vw, 3.1rem);
		line-height: 1.1;
		margin: 0 0 1.5rem;
		letter-spacing: -0.01em;
	}

	.hero p {
		font-size: 1.14rem;
		line-height: 1.7;
		color: #dbeafe;
		margin-bottom: 2rem;
	}

	.button-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.8rem;
	}

	.btn {
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.62rem 1rem;
		border-radius: 0.4rem;
		font-size: 0.9rem;
		font-weight: 600;
		border: 1px solid transparent;
		transition: all 0.2s ease;
	}

	.btn-primary {
		background: #0369a1;
		color: #fff;
	}

	.btn-primary:hover {
		background: #075985;
	}

	.btn-white {
		background: #fff;
		color: #0c4a6e;
	}

	.btn-white:hover {
		background: #f1f5f9;
	}

	.btn-cafe {
		background: #15803d;
		color: #fff;
	}

	.btn-cafe:hover {
		background: #166534;
	}

	.btn-outline {
		border-color: #cbd5e1;
		background: #fff;
		color: #334155;
	}

	.btn-outline:hover {
		background: #f8fafc;
	}

	.section {
		padding: 4rem 1rem;
	}

	.section-head {
		text-align: center;
		max-width: 46rem;
		margin: 0 auto 3rem;
	}

	h2 {
		font-size: clamp(1.7rem, 4vw, 2rem);
		margin: 0 0 0.7rem;
		color: #0f172a;
	}

	.section-head p,
	.events-head p,
	.cta p {
		color: #475569;
	}

	.cards {
		display: grid;
		gap: 1.25rem;
	}

	.two-col {
		grid-template-columns: 1fr;
	}

	.card {
		background: #fff;
		border-radius: 0.85rem;
		border: 1px solid #e2e8f0;
		padding: 2rem;
		box-shadow: 0 1px 2px rgb(0 0 0 / 0.04);
	}

	.icon {
		inline-size: 3rem;
		block-size: 3rem;
		border-radius: 0.6rem;
		margin-bottom: 1.2rem;
	}

	.icon-blue {
		background: #e0f2fe;
	}

	.icon-green {
		background: #dcfce7;
	}

	h3 {
		margin: 0 0 0.7rem;
		font-size: 1.3rem;
		color: #0f172a;
	}

	.card p {
		color: #475569;
		line-height: 1.7;
		margin: 0 0 1.3rem;
	}

	.events-wrap {
		background: #f8fafc;
		padding: 4rem 0;
		border-top: 1px solid #e2e8f0;
		border-bottom: 1px solid #e2e8f0;
	}

	.events-head {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.8rem;
		margin-bottom: 1.5rem;
	}

	.events-link {
		text-decoration: none;
		color: #0369a1;
		font-weight: 600;
	}

	.events-list {
		display: grid;
		gap: 0.8rem;
	}

	.event-item {
		background: #fff;
		border: 1px solid #e2e8f0;
		border-radius: 0.75rem;
		padding: 1rem;
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 1rem;
		align-items: start;
	}

	.date-box {
		inline-size: 3.4rem;
		block-size: 3.4rem;
		background: #f1f5f9;
		border-radius: 0.55rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		color: #334155;
	}

	.date-box span {
		font-size: 0.63rem;
		font-weight: 700;
		text-transform: uppercase;
	}

	.date-box strong {
		font-size: 1.2rem;
	}

	.event-main h4 {
		margin: 0.2rem 0 0;
		font-size: 1.1rem;
		color: #0f172a;
	}

	.event-main p {
		margin: 0.35rem 0 0;
		color: #64748b;
		font-size: 0.92rem;
	}

	.event-meta {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		color: #64748b;
		font-size: 0.8rem;
	}

	.type-tag {
		border-radius: 999px;
		padding: 0.1rem 0.55rem;
		font-size: 0.67rem;
		font-weight: 700;
		text-transform: uppercase;
		background: #e0f2fe;
		color: #0369a1;
	}

	.event-cafe {
		background: #f0fdf4;
		color: #15803d;
	}

	.empty {
		color: #64748b;
		font-style: italic;
	}

	.desktop-only {
		display: none;
	}

	.cta {
		padding: 5rem 1rem;
		max-width: 60rem;
		text-align: center;
	}

	.cta p {
		font-size: 1.1rem;
		margin: 0 auto 1.6rem;
		max-width: 45rem;
		line-height: 1.7;
	}

	.center {
		justify-content: center;
	}

	@media (min-width: 768px) {
		.container {
			padding: 0 1.5rem;
		}

		.two-col {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.events-head {
			flex-direction: row;
			align-items: end;
			justify-content: space-between;
		}

		.event-item {
			grid-template-columns: auto 1fr auto;
			align-items: center;
		}

		.desktop-only {
			display: inline-flex;
		}
	}
</style>
