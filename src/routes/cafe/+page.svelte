<script lang="ts">
	import { events } from '$lib/data';
	import { base } from '$app/paths';
	import { onMount } from 'svelte';

	type Screen = { id: string; label: string; title: string };

	const withBase = (path: string) => (path === '/' ? `${base}/` : `${base}${path}`);
	const cafeLogoSrc = withBase('/images/Logo_transparent_bg.png');

	const screens: Screen[] = [
		{ id: 'cafe', label: 'Cafe', title: 'Coding Cafe' },
		{ id: 'structure', label: 'How', title: 'What happens at a session?' },
		{ id: 'not-course', label: 'Clear', title: 'This is not a course.' },
		{ id: 'events', label: 'Next', title: 'Next Coding Cafe' }
	];

	const structureCards = [
		{
			label: 'PART 1 · 30 - 45 MIN',
			title: 'Short introduction',
			body: 'A 30-45-minute talk introducing a tool, concept, or workflow relevant to research coding.'
		},
		{
			label: 'PART 2 · 45 - 60 MIN',
			title: 'Coding session',
			body: 'Work on your own code, try things out, or help others with their problems.'
		}
	];

	const notCourseItems = [
		"You don't need to be an expert",
		'You can bring your own problem',
		'You can just come and observe',
		'You can leave anytime'
	];

	const now = new Date();
	const nextCafeEvent =
		events
			.filter((event) => event.type === 'cafe' && new Date(event.date) >= now)
			.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0] ??
		events
			.filter((event) => event.type === 'cafe')
			.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

	const formatEventMonth = (date: string) =>
		new Date(date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase();

	const formatEventDate = (date: string) =>
		new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });

	let activeScreen = $state('cafe');
	let screenElements: HTMLElement[] = [];
	let storyElement = $state<HTMLElement | null>(null);
	let isTransitioning = false;

	const registerScreen = (element: HTMLElement, index: number) => {
		screenElements[index] = element;
		return {
			destroy() {
				screenElements = screenElements.filter((item) => item !== element);
			}
		};
	};

	const scrollToScreen = (id: string) => {
		const target = screenElements.find((element) => element?.id === id);
		target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	};

	const moveScreen = (direction: 1 | -1) => {
		if (isTransitioning) return;
		const currentIndex = screens.findIndex((screen) => screen.id === activeScreen);
		if (currentIndex === -1) return;
		const nextIndex = Math.min(Math.max(currentIndex + direction, 0), screens.length - 1);
		if (nextIndex === currentIndex) return;
		isTransitioning = true;
		scrollToScreen(screens[nextIndex].id);
		window.setTimeout(() => {
			isTransitioning = false;
		}, 850);
	};

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries
					.filter((entry) => entry.isIntersecting)
					.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

				if (visible?.target instanceof HTMLElement) activeScreen = visible.target.id;
			},
			{ threshold: [0.4, 0.65, 0.85] }
		);

		screenElements.forEach((element) => {
			if (element) observer.observe(element);
		});

		const handleWheel = (event: WheelEvent) => {
			if (!storyElement) return;
			if (Math.abs(event.deltaY) < 12) return;
			event.preventDefault();
			moveScreen(event.deltaY > 0 ? 1 : -1);
		};

		const handleKeydown = (event: KeyboardEvent) => {
			if (
				event.key === 'ArrowDown' ||
				event.key === 'PageDown' ||
				(event.key === ' ' && !event.shiftKey)
			) {
				event.preventDefault();
				moveScreen(1);
			}
			if (
				event.key === 'ArrowUp' ||
				event.key === 'PageUp' ||
				(event.key === ' ' && event.shiftKey)
			) {
				event.preventDefault();
				moveScreen(-1);
			}
		};

		storyElement?.addEventListener('wheel', handleWheel, { passive: false });
		window.addEventListener('keydown', handleKeydown);

		return () => {
			observer.disconnect();
			storyElement?.removeEventListener('wheel', handleWheel);
			window.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

<svelte:head>
	<title>LUMC Coding Cafe</title>
</svelte:head>

<div class="story-shell">
	<nav class="story-nav" aria-label="Coding Cafe sections">
		{#each screens as screen}
			<button
				type="button"
				class:active={activeScreen === screen.id}
				onclick={() => scrollToScreen(screen.id)}
				aria-label={screen.title}
			>
				<span>{screen.label}</span>
			</button>
		{/each}
	</nav>

	<div class="story" id="top" bind:this={storyElement}>
		<section id="cafe" class:active={activeScreen === 'cafe'} class="screen" use:registerScreen={0}>
			<div class="screen-inner">
				<div class="slide-frame split-frame">
					<div class="screen-copy cafe-intro">
						<img class="cafe-logo" src={cafeLogoSrc} alt="LUMC Coding Cafe" />
						<h1>Coding Cafe</h1>
						<p class="body body-large">
							A monthly meetup where we talk about research software, discuss questions and solve problems together.
						</p>
						<div class="actions">
							<a class="btn btn-primary" href={withBase('/cafe-agenda')}>Explore sessions ↓</a>
							<a class="btn btn-secondary" href="#structure">How it works</a>
						</div>
					</div>

					<div class="placeholder-panel" aria-hidden="true"></div>
				</div>
			</div>
		</section>

		<section id="structure" class:active={activeScreen === 'structure'} class="screen" use:registerScreen={1}>
			<div class="screen-inner">
				<div class="slide-frame stack-frame">
					<div class="screen-copy">
						<h2>What happens at a session?</h2>
					</div>

					<div class="card-grid two-up">
						{#each structureCards as card}
							<article class="info-card">
								<div class="card-label">{card.label}</div>
								<h3>{card.title}</h3>
								<p class="body">{card.body}</p>
							</article>
						{/each}
					</div>

					<p class="support-line">☕ Bring your laptop. Work on real problems.</p>
				</div>
			</div>
		</section>

		<section id="not-course" class:active={activeScreen === 'not-course'} class="screen" use:registerScreen={2}>
			<div class="screen-inner">
				<div class="slide-frame stack-frame">
					<div class="screen-copy narrow">
						<div class="eyebrow">Let's be clear</div>
						<h2>This is not a course / training / workshop. It is a community meetup!</h2>
					</div>

					<div class="check-grid">
						{#each notCourseItems as item}
							<div class="check-item">
								<span class="check-mark"></span>
								<span>{item}</span>
							</div>
						{/each}
					</div>

					<p class="support-line">Everyone is welcome. Every level.</p>
				</div>
			</div>
		</section>

		<section id="events" class:active={activeScreen === 'events'} class="screen" use:registerScreen={3}>
			<div class="screen-inner">
				<div class="slide-frame split-frame">
					<div class="screen-copy">
						<div class="eyebrow">Upcoming</div>
						<h2>Next Coding Cafe</h2>
						<p class="body">Join even if the topic is new to you.</p>
						<div class="actions">
							<a class="btn btn-primary" href={withBase('/cafe-agenda')}>Join the next session</a>
							<a class="btn btn-secondary" href={withBase('/stay-informed')}>Stay informed</a>
						</div>
					</div>

					{#if nextCafeEvent}
						<article class="event-card">
							<div class="card-label event-month">{formatEventMonth(nextCafeEvent.date)}</div>
							<div class="event-kicker">Monthly session</div>
							<div class="event-date">{formatEventDate(nextCafeEvent.date)}</div>
							<h3>{nextCafeEvent.title}</h3>
							<div class="event-meta">
								<div><span>Location</span>{nextCafeEvent.location}</div>
								{#if nextCafeEvent.time}
									<div><span>Time</span>{nextCafeEvent.time}</div>
								{/if}
								{#if nextCafeEvent.speaker}
									<div><span>Speaker</span>{nextCafeEvent.speaker}</div>
								{/if}
							</div>
						</article>
					{:else}
						<article class="event-card">
							<div class="card-label event-month">UPCOMING</div>
							<div class="event-kicker">Monthly session</div>
							<div class="event-date">To be announced</div>
							<h3>Next Coding Cafe</h3>
						</article>
					{/if}
				</div>
			</div>
		</section>
	</div>
</div>

<style>
	:global(.page-content) {
		flex: 0 0 auto;
		background: transparent;
	}

	:root {
		--text-strong: #0f172a;
		--text-body: #475569;
		--text-soft: #64748b;
		--blue-700: #075985;
		--blue-600: #0369a1;
		--blue-500: #0284c7;
		--blue-100: #e0f2fe;
	}

	.story-shell {
		position: relative;
		height: min(46rem, calc(100svh - 11rem));
		overflow: hidden;
		background: transparent;
	}

	.story-nav {
		position: fixed;
		right: 1.1rem;
		top: 50%;
		transform: translateY(-50%);
		z-index: 10;
		display: none;
		gap: 0.55rem;
		flex-direction: column;
	}

	.story-nav button {
		width: 0.42rem;
		height: 1.5rem;
		border-radius: 999px;
		border: 0;
		background: rgb(100 116 139 / 0.25);
		padding: 0;
		cursor: pointer;
		transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
	}

	.story-nav button span {
		position: absolute;
		inline-size: 1px;
		block-size: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		clip-path: inset(50%);
		white-space: nowrap;
	}

	.story-nav button.active {
		background: var(--blue-600);
		transform: scaleY(1.08);
		box-shadow: 0 0 0 0.28rem rgb(14 165 233 / 0.12);
	}

	.story {
		height: 100%;
		overflow-y: auto;
		overflow-x: hidden;
		scrollbar-width: none;
		overscroll-behavior: contain;
		scroll-snap-type: y mandatory;
	}

	.story::-webkit-scrollbar {
		display: none;
	}

	.screen {
		height: 100%;
		scroll-snap-align: start;
		scroll-snap-stop: always;
		padding: 0 1rem;
		display: flex;
		align-items: stretch;
	}

	.screen-inner {
		width: 100%;
		max-width: 80rem;
		margin: 0 auto;
		display: grid;
		align-items: center;
	}

	.slide-frame {
		width: 100%;
		min-height: 100%;
		background: transparent;
		padding: clamp(1.2rem, 3vw, 2.4rem);
	}

	.split-frame,
	.stack-frame {
		display: grid;
		gap: 1.4rem;
		align-items: center;
	}

	.screen-copy,
	.placeholder-panel,
	.card-grid,
	.check-grid,
	.event-card {
		opacity: 0;
		transform: translateY(42px);
		transition: opacity 0.55s ease, transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
	}

	.screen.active .screen-copy,
	.screen.active .placeholder-panel,
	.screen.active .card-grid,
	.screen.active .check-grid,
	.screen.active .event-card {
		opacity: 1;
		transform: translateY(0);
	}

	.screen.active .placeholder-panel,
	.screen.active .card-grid,
	.screen.active .check-grid,
	.screen.active .event-card {
		transition-delay: 0.12s;
	}

	.screen-copy {
		max-width: 43rem;
	}

	.screen-copy.narrow {
		max-width: 28rem;
	}

	.cafe-intro h1 {
		font-size: clamp(2.2rem, 5vw, 4rem);
		max-width: 10ch;
	}

	.eyebrow,
	.card-label {
		display: inline-flex;
		width: fit-content;
		padding: 0.42rem 0.8rem;
		border-radius: 999px;
		font-size: 0.72rem;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		background: var(--blue-100);
		color: var(--blue-700);
	}

	h1,
	h2 {
		margin: 0.95rem 0 0;
		max-width: 13ch;
		font-size: clamp(2.5rem, 6vw, 4.8rem);
		line-height: 0.94;
		letter-spacing: -0.05em;
		color: var(--text-strong);
	}

	h2 {
		font-size: clamp(2.2rem, 5vw, 4rem);
	}

	h3 {
		margin: 0.55rem 0 0;
		font-size: clamp(1.3rem, 2vw, 1.7rem);
		line-height: 1.05;
		color: var(--text-strong);
	}

	.tagline,
	.event-kicker {
		margin: 1.2rem 0 0;
		font-size: 0.88rem;
		font-weight: 800;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--blue-600);
	}

	.body {
		margin: 1rem 0 0;
		font-size: 1rem;
		line-height: 1.75;
		color: var(--text-body);
		max-width: 38rem;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.9rem;
		margin-top: 1.8rem;
	}

	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.9rem 1.2rem;
		border-radius: 999px;
		border: 1px solid transparent;
		text-decoration: none;
		font-size: 0.94rem;
		font-weight: 700;
		transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
	}

	.btn:hover { transform: translateY(-1px); }
	.btn-primary { background: var(--blue-600); color: #fff; }
	.btn-primary:hover { background: var(--blue-700); }
	.btn-secondary { background: rgb(255 255 255 / 0.84); border-color: #cbd5e1; color: var(--text-strong); }

	.placeholder-panel {
		display: grid;
		align-content: center;
		justify-items: center;
		min-height: 18rem;
	}

	.cafe-logo,
	.info-card,
	.check-item,
	.event-card {
		border-radius: 1.4rem;
		border: 1px solid rgb(148 163 184 / 0.18);
		background: linear-gradient(180deg, rgb(255 255 255 / 0.68), rgb(240 249 255 / 0.56));
		box-shadow: 0 20px 60px rgb(15 23 42 / 0.08);
	}

	.cafe-logo {
		display: block;
		width: min(100%, 20rem);
		height: auto;
		margin-bottom: 0.8rem;
		filter: drop-shadow(0 18px 40px rgb(14 165 233 / 0.15));
	}

	.card-grid,
	.check-grid {
		display: grid;
		gap: 1rem;
		grid-template-columns: 1fr;
	}

	.info-card,
	.check-item,
	.event-card {
		padding: 1.35rem;
	}

	.check-item {
		display: flex;
		align-items: center;
		gap: 0.9rem;
		font-weight: 600;
		color: var(--text-strong);
	}

	.check-mark {
		width: 1rem;
		height: 1rem;
		border-radius: 999px;
		background: linear-gradient(135deg, #0369a1, #0ea5e9);
		box-shadow: 0 0 0 0.35rem rgb(14 165 233 / 0.12);
		flex-shrink: 0;
	}

	.support-line {
		margin: 0;
		font-size: 1rem;
		font-weight: 700;
		color: var(--blue-700);
	}

	.event-month { background: #dbeafe; color: #1d4ed8; }
	.event-date {
		margin-top: 0.95rem;
		font-size: clamp(2rem, 4vw, 3rem);
		font-weight: 900;
		letter-spacing: -0.05em;
		color: var(--text-strong);
	}

	.event-meta {
		display: grid;
		gap: 0.7rem;
		margin-top: 1.2rem;
	}

	.event-meta div {
		padding: 0.85rem 0.95rem;
		border-radius: 1rem;
		background: rgb(240 249 255 / 0.7);
		color: var(--text-strong);
		font-weight: 700;
	}

	.event-meta span {
		display: block;
		margin-bottom: 0.2rem;
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--blue-500);
	}

	@media (min-width: 820px) {
		.story-nav { display: flex; }
		.screen { padding: 0 1.5rem; }
		.split-frame { grid-template-columns: minmax(0, 1.1fr) minmax(18rem, 0.9fr); }
		.two-up, .check-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
	}

	@media (max-width: 819px) {
		.screen { padding: 0; }
		.slide-frame { padding: 1rem; }
	}
</style>
