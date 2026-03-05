<script lang="ts">
	import { base } from '$app/paths';
	import { trainings, type DifficultyLevel } from '$lib/data';

	let searchTerm = $state('');
	let selectedLevel = $state<'All' | DifficultyLevel>('All');
	const levels: Array<'All' | DifficultyLevel> = ['All', 'Beginner', 'Intermediate', 'Advanced'];

	const dateKeyFromDate = (date: Date) => {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	};

	const todayDateKey = $derived(dateKeyFromDate(new Date()));

	const isArchivedTraining = (training: (typeof trainings)[number], todayKey: string) => {
		if (training.sessions.length === 0) return false;

		const latestSessionDate = training.sessions
			.map((session) => session.date.slice(0, 10))
			.sort()
			.at(-1);

		return latestSessionDate !== undefined && latestSessionDate < todayKey;
	};

	const matchesFilters = (training: (typeof trainings)[number]) => {
		const term = searchTerm.toLowerCase();
		const matchesSearch =
			training.title.toLowerCase().includes(term) ||
			training.tags.some((tag) => tag.toLowerCase().includes(term));
		const matchesLevel = selectedLevel === 'All' || training.level === selectedLevel;
		return matchesSearch && matchesLevel;
	};

	const filteredCurrentTrainings = $derived(
		trainings.filter((training) => !isArchivedTraining(training, todayDateKey) && matchesFilters(training))
	);

	const filteredArchivedTrainings = $derived(
		trainings.filter((training) => isArchivedTraining(training, todayDateKey) && matchesFilters(training))
	);

	const badgeClass = (level: DifficultyLevel) => {
		if (level === 'Beginner') return 'badge beginner';
		if (level === 'Intermediate') return 'badge intermediate';
		return 'badge advanced';
	};

	const formatSessionDates = (dates: string[]) => {
		if (dates.length === 0) return 'TBD';

		return dates
			.map((date) =>
				new Date(`${date}T12:00:00`).toLocaleDateString('en-GB', {
					day: '2-digit',
					month: 'short',
					year: 'numeric'
				})
			)
			.join(', ');
	};

	const withBase = (path: string) => `${base}${path}`;
</script>

<div class="wrap">
	<div class="header">
		<div class="container">
			<h1>Training Catalogue</h1>
			<p>
				Check this page for internal and external training opportunities across the region, from basic
				scripting to advanced reproducible workflows.
			</p>
			<div class="external-events">
				<span>Looking for more events?</span>
				<div class="external-buttons">
					<a
						class="external-button"
						href="https://tess.elixir-europe.org/events"
						target="_blank"
						rel="noopener noreferrer"
					>
						<img src={withBase('/images/tess-logo.svg')} alt="TeSS logo" />
						<span class="external-copy">
							<strong>TeSS</strong>
							<small>ELIXIR's Europe-wide catalogue for training and events.</small>
						</span>
					</a>
					<a
						class="external-button"
						href="https://taxila.nl/events?per_page=50#home"
						target="_blank"
						rel="noopener noreferrer"
					>
						<img src={withBase('/images/taxila-logo.svg')} alt="Taxila logo" />
						<span class="external-copy">
							<strong>Taxila</strong>
							<small>Collection of trainers, events, and materials empowering research.</small>
						</span>
					</a>
				</div>
			</div>
		</div>
	</div>

	<div class="container section">
		<div class="layout">
			<aside class="sidebar">
				<div>
					<label for="search">Search</label>
					<input
						id="search"
						type="text"
						placeholder="Python, Git, Data..."
						bind:value={searchTerm}
					/>
				</div>

				<div>
					<div class="label">Level</div>
					<div class="levels">
						{#each levels as level}
							<label>
								<input
									type="radio"
									name="level"
									checked={selectedLevel === level}
									onchange={() => (selectedLevel = level)}
								/>
								<span>{level}</span>
							</label>
						{/each}
					</div>
				</div>
			</aside>

			<section class="results">
				<div class="count">
					Showing {filteredCurrentTrainings.length} current course{filteredCurrentTrainings.length !== 1
						? 's'
						: ''}
				</div>

				{#if filteredCurrentTrainings.length > 0}
					<div class="grid">
						{#each filteredCurrentTrainings as training (training.id)}
							<article class="card" id={training.id}>
								<div class="card-top"></div>
								<div class="content">
									<h3>{training.title}</h3>
									<div class="dates"><strong>Dates:</strong> {formatSessionDates(training.sessions.map((session) => session.date))}</div>
									<div class="meta-row">
										<span class={badgeClass(training.level)}>{training.level}</span>
										<span class="sep">•</span>
										<span>{training.duration}</span>
									</div>
									<div class="organizer"><strong>Organizer:</strong> {training.organizer}</div>
									<p>{training.description}</p>
									<div class="content-spacer"></div>
									{#if training.registrationLink}
										<a class="registration-button" href={training.registrationLink} target="_blank" rel="noreferrer">
											More info and registration
										</a>
									{:else}
										<div class="registration-unavailable">More info and registration not available yet.</div>
									{/if}
									<div class="audience"><strong>Target Audience:</strong> {training.audience.join(', ')}</div>
									<div class="details">
										<div><strong>Format:</strong> {training.format}</div>
										{#if training.materialsLink}
											<div>
												<a href={training.materialsLink} target="_blank" rel="noreferrer">Course materials</a>
											</div>
										{/if}
									</div>
								</div>
								<div class="card-footer">
									<div class="tags">
										{#each training.tags.slice(0, 3) as tag}
											<span>{tag}</span>
										{/each}
									</div>
								</div>
							</article>
						{/each}
					</div>
					{:else}
						<div class="empty">
							<h3>No courses found</h3>
							<p>Try adjusting your search or filters.</p>
						</div>
					{/if}

					{#if filteredArchivedTrainings.length > 0}
						<div class="archive-section">
							<h2 class="archive-heading">
								Archive ({filteredArchivedTrainings.length} training{filteredArchivedTrainings.length !== 1
									? 's'
									: ''})
							</h2>
							<div class="archive-grid">
								{#each filteredArchivedTrainings as training (training.id)}
									<article class="archive-card" id={training.id}>
										<h3>{training.title}</h3>
										<div class="archive-dates">
											<strong>Dates:</strong> {formatSessionDates(training.sessions.map((session) => session.date))}
										</div>
										<div class="archive-organizer"><strong>Organizer:</strong> {training.organizer}</div>
										{#if training.materialsLink}
											<a href={training.materialsLink} target="_blank" rel="noreferrer">Course materials</a>
										{/if}
									</article>
								{/each}
							</div>
						</div>
					{/if}
				</section>
			</div>
		</div>
</div>

<style>
	.wrap {
		background: #f8fafc;
		min-height: 100%;
		padding-bottom: 4rem;
	}
	.container {
		max-width: 80rem;
		margin: 0 auto;
		padding: 0 1rem;
	}
	.header {
		background: #fff;
		border-bottom: 1px solid #e2e8f0;
		padding: 3rem 0;
	}
	h1 {
		margin: 0 0 1rem;
		font-size: 2rem;
		color: #0f172a;
	}
	.header p {
		margin: 0;
		max-width: 42rem;
		color: #475569;
		font-size: 1.08rem;
	}
	.external-events {
		margin-top: 1rem;
		display: grid;
		gap: 0.65rem;
		font-size: 0.9rem;
		color: #334155;
	}
	.external-buttons {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}
	.external-button {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.8rem 1rem;
		border-radius: 0.7rem;
		border: 1px solid #bfdbfe;
		background: linear-gradient(135deg, #ffffff 0%, #eff6ff 100%);
		color: #0f172a;
		text-decoration: none;
		font-size: 0.86rem;
		font-weight: 700;
		box-shadow: 0 6px 14px rgb(15 23 42 / 0.08);
		min-width: 18rem;
	}
	.external-button img {
		width: 2.2rem;
		height: 2.2rem;
		object-fit: contain;
		flex-shrink: 0;
	}
	.external-copy {
		display: grid;
		line-height: 1.2;
	}
	.external-copy strong {
		font-size: 0.92rem;
		color: #0f172a;
	}
	.external-copy small {
		font-size: 0.72rem;
		color: #475569;
	}
	.external-button:hover {
		transform: translateY(-1px);
		box-shadow: 0 10px 20px rgb(15 23 42 / 0.12);
		border-color: #93c5fd;
	}
	.section {
		padding-top: 2rem;
	}
	.layout {
		display: grid;
		gap: 2rem;
	}
	.sidebar {
		display: grid;
		gap: 1.5rem;
	}
	label,
	.label {
		display: block;
		font-size: 0.86rem;
		font-weight: 700;
		color: #0f172a;
		margin-bottom: 0.45rem;
	}
	input[type='text'] {
		width: 100%;
		padding: 0.56rem 0.7rem;
		border: 1px solid #cbd5e1;
		border-radius: 0.4rem;
	}
	.levels {
		display: grid;
		gap: 0.45rem;
	}
	.levels label {
		margin: 0;
		font-weight: 500;
		display: flex;
		align-items: center;
		gap: 0.45rem;
		color: #334155;
	}
	.count {
		font-size: 0.86rem;
		color: #64748b;
		margin-bottom: 1rem;
	}
	.grid {
		display: grid;
		gap: 1rem;
		align-items: stretch;
	}
	.card {
		background: #fff;
		border: 1px solid #e2e8f0;
		border-radius: 0.65rem;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		height: 100%;
		transition:
			transform 180ms ease,
			box-shadow 220ms ease,
			border-color 220ms ease;
		will-change: transform;
	}
	.card-top {
		height: 0.36rem;
		background: #0369a1;
		transition: height 180ms ease;
	}
	.card:hover {
		transform: translateY(-4px);
		box-shadow: 0 14px 28px rgb(15 23 42 / 0.12);
		border-color: #bfdbfe;
	}
	.card:hover .card-top {
		height: 0.5rem;
	}
	.content {
		padding: 1.2rem;
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	h3 {
		margin: 0;
		color: #0f172a;
		font-size: 1.25rem;
	}
	.meta-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin: 0.7rem 0;
		font-size: 0.85rem;
		color: #64748b;
	}
	.dates {
		margin-top: 0.5rem;
		font-size: 0.82rem;
		color: #334155;
	}
	.registration-button {
		display: inline-block;
		margin: 0 0 0.85rem;
		padding: 0.48rem 0.78rem;
		border-radius: 0.45rem;
		border: 1px solid #0369a1;
		background: #0369a1;
		color: #fff;
		text-decoration: none;
		font-size: 0.78rem;
		font-weight: 700;
	}
	.registration-button:hover {
		background: #075985;
		border-color: #075985;
	}
	.registration-unavailable {
		margin: 0 0 0.85rem;
		font-size: 0.78rem;
		color: #64748b;
	}
	.content-spacer {
		flex: 1;
		min-height: 0.8rem;
	}
	.badge {
		padding: 0.15rem 0.5rem;
		border-radius: 999px;
		font-size: 0.72rem;
		font-weight: 700;
	}
	.beginner {
		background: #dcfce7;
		color: #166534;
	}
	.intermediate {
		background: #dbeafe;
		color: #1e40af;
	}
	.advanced {
		background: #ede9fe;
		color: #6d28d9;
	}
	.content p {
		margin: 0 0 0.8rem;
		color: #475569;
		line-height: 1.6;
	}
	.audience {
		font-size: 0.77rem;
		color: #64748b;
	}
	.organizer {
		font-size: 0.8rem;
		color: #334155;
		margin-bottom: 0.7rem;
	}
	.card-footer {
		padding: 0 1.2rem 0.9rem;
		background: #fff;
		display: flex;
		justify-content: flex-start;
		gap: 0.35rem;
		align-items: center;
	}
	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
	}
	.tags span {
		font-size: 0.7rem;
		padding: 0.2rem 0.45rem;
		background: #e5e7eb;
		color: #475569;
		border-radius: 0.3rem;
		transition: background-color 180ms ease;
	}
	.card:hover .tags span {
		background: #dbe3ec;
	}
	.details {
		margin-top: 0.75rem;
		display: grid;
		gap: 0.45rem;
		font-size: 0.82rem;
		color: #334155;
	}
	.details a {
		color: #0369a1;
		text-decoration: none;
		font-weight: 600;
	}
	.details a:hover {
		text-decoration: underline;
	}
	.empty {
		background: #fff;
		border: 1px dashed #cbd5e1;
		border-radius: 0.65rem;
		padding: 2rem;
		text-align: center;
	}
	.empty h3 {
		font-size: 1.1rem;
		margin-bottom: 0.3rem;
	}
	.empty p {
		margin: 0;
		color: #64748b;
	}
	.archive-section {
		margin-top: 1.6rem;
	}
	.archive-heading {
		font-size: 1rem;
		color: #334155;
		margin: 0 0 0.65rem;
	}
	.archive-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
		gap: 0.55rem;
	}
	.archive-card {
		background: #f1f5f9;
		border: 1px solid #cbd5e1;
		border-radius: 0.45rem;
		padding: 0.8rem 0.85rem;
		font-size: 0.82rem;
		color: #334155;
		line-height: 1.35;
	}
	.archive-card h3 {
		margin: 0 0 0.45rem;
		font-size: 0.95rem;
		color: #0f172a;
	}
	.archive-dates,
	.archive-organizer {
		margin-bottom: 0.35rem;
	}
	.archive-card a {
		display: inline-block;
		margin-top: 0.15rem;
		color: #0369a1;
		text-decoration: none;
		font-weight: 600;
	}
	.archive-card a:hover {
		text-decoration: underline;
	}
	@media (min-width: 1024px) {
		.layout {
			grid-template-columns: 16rem 1fr;
		}
		.container {
			padding: 0 1.5rem;
		}
		.grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
