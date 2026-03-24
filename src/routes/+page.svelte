<script lang="ts">
	import { base } from '$app/paths';
	import { onMount } from 'svelte';

	type Screen = {
		id: string;
		label: string;
		title: string;
	};

	const withBase = (path: string) => (path === '/' ? `${base}/` : `${base}${path}`);

	const screens: Screen[] = [
		{ id: 'identity', label: 'Intro', title: 'LUMC FAIR Research Software Training' },
		{ id: 'cafe', label: 'Coding Cafe', title: 'Coding Cafe' },
		{ id: 'structure', label: 'How it works', title: 'What happens at a session?' },
		{ id: 'not-course', label: 'Not a course', title: 'This is not a course.' },
		{ id: 'events', label: 'Upcoming', title: 'Next Coding Cafe' },
		{ id: 'community', label: 'Community', title: 'A growing community of researchers' },
		{ id: 'resources', label: 'Resources', title: 'Resources for research coding' }
	];

	const structureCards = [
		{
			label: 'PART 1 · 15 MIN',
			title: 'Short introduction',
			body: 'A 15-minute talk introducing a tool, concept, or workflow relevant to research coding.'
		},
		{
			label: 'PART 2 · 60 MIN',
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

	const communityItems = ['Learn from others', 'Share your work', 'Ask questions freely'];

	const resourceCards = [
		{ title: 'Guides', body: 'Step-by-step walkthroughs for common tasks' },
		{ title: 'Tools', body: 'Curated tools for researchers who code' },
		{ title: 'Tutorials', body: 'Self-paced learning for all levels' },
		{ title: 'Best Practices', body: 'Clean, reproducible, shareable code' }
	];

	let activeScreen = $state('identity');
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

				if (visible?.target instanceof HTMLElement) {
					activeScreen = visible.target.id;
				}
			},
			{
				root: null,
				threshold: [0.4, 0.65, 0.85]
			}
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
	<title>LUMC FAIR Research Software Training</title>
</svelte:head>

<div class="story-shell">
	<nav class="story-nav" aria-label="Homepage sections">
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
		<section
			id="identity"
			class:active={activeScreen === 'identity'}
			class="screen screen-identity"
			use:registerScreen={0}
		>
			<div class="screen-inner">
				<div class="slide-frame intro-frame">
					<div class="screen-copy">
						<div class="eyebrow">LUMC FAIR Research Software Training</div>
						<h1>LUMC FAIR Research Software Training</h1>
						<p class="body body-large">
							A place where researchers learn, experiment, and solve coding problems together.
						</p>
						<p class="quote">“Better Software,<br />Better Research.”</p>
						<p class="body">
							“Welcome to the LUMC Research Software Training hub. We help researchers and support
							staff build coding skills for FAIR, reproducible, and impactful science.”
						</p>
						<div class="actions">
							<a class="btn btn-primary" href={withBase('/training')}>Explore trainings ↓</a>
							<a class="btn btn-secondary" href={withBase('/cafe')}>Join Coding Cafe</a>
						</div>
					</div>

					<div class="visual-panel halo-panel">
						<div class="hero-orbit">
							<div class="orbit-ring ring-a"></div>
							<div class="orbit-ring ring-b"></div>
							<div class="orbit-core">FAIR</div>
						</div>
						<a class="scroll-prompt" href="#cafe">Scroll ↓</a>
					</div>
				</div>
			</div>
		</section>

		<section
			id="cafe"
			class:active={activeScreen === 'cafe'}
			class="screen screen-cafe"
			use:registerScreen={1}
		>
			<div class="screen-inner">
				<div class="slide-frame split-frame">
					<div class="screen-copy">
						<div class="eyebrow">Coding Cafe</div>
						<h2>A place where researchers learn, experiment, and solve coding problems together.</h2>
						<p class="tagline">SHORT TALKS · HANDS-ON CODING · PEER SUPPORT</p>
						<div class="actions">
							<a class="btn btn-primary" href={withBase('/cafe/agenda')}>Explore sessions ↓</a>
							<a class="btn btn-secondary" href="#structure">How it works</a>
						</div>
					</div>

					<div class="visual-stack">
						<div class="mini-card float-a">Short talks</div>
						<div class="mini-card float-b">Hands-on coding</div>
						<div class="mini-card float-c">Peer support</div>
					</div>
				</div>
			</div>
		</section>

		<section
			id="structure"
			class:active={activeScreen === 'structure'}
			class="screen screen-structure"
			use:registerScreen={2}
		>
			<div class="screen-inner">
				<div class="slide-frame stack-frame">
					<div class="screen-copy">
						<div class="eyebrow">How it works</div>
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

		<section
			id="not-course"
			class:active={activeScreen === 'not-course'}
			class="screen screen-not-course"
			use:registerScreen={3}
		>
			<div class="screen-inner">
				<div class="slide-frame stack-frame">
					<div class="screen-copy narrow">
						<div class="eyebrow">Let's be clear</div>
						<h2>This is not a course.</h2>
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

		<section
			id="events"
			class:active={activeScreen === 'events'}
			class="screen screen-events"
			use:registerScreen={4}
		>
			<div class="screen-inner">
				<div class="slide-frame split-frame">
					<div class="screen-copy">
						<div class="eyebrow">Upcoming</div>
						<h2>Next Coding Cafe</h2>
						<p class="body">Join even if the topic is new to you.</p>
						<div class="actions">
							<a class="btn btn-primary" href={withBase('/cafe/agenda')}>Join the next session</a>
							<a class="btn btn-secondary" href={withBase('/cafe/agenda')}>See all events</a>
						</div>
					</div>

					<article class="event-card">
						<div class="card-label event-month">APRIL 2025</div>
						<div class="event-kicker">Monthly session</div>
						<div class="event-date">18 April</div>
						<h3>AI tools for research coding</h3>
						<div class="event-meta">
							<div><span>Location</span>Atlas Building</div>
							<div><span>Time</span>16:00 – 17:30</div>
						</div>
					</article>
				</div>
			</div>
		</section>

		<section
			id="community"
			class:active={activeScreen === 'community'}
			class="screen screen-community"
			use:registerScreen={5}
		>
			<div class="screen-inner">
				<div class="slide-frame split-frame">
					<div class="screen-copy">
						<div class="eyebrow">Community</div>
						<h2>A growing community of researchers</h2>
						<div class="bullet-list">
							{#each communityItems as item}
								<div class="bullet-item">{item}</div>
							{/each}
						</div>
						<div class="actions">
							<a class="btn btn-primary" href={withBase('/contact')}>Join the community ↗</a>
						</div>
						<div class="sub-label">via Microsoft Teams</div>
					</div>

					<div class="visual-panel network-panel">
						<div class="network-node node-a"></div>
						<div class="network-node node-b"></div>
						<div class="network-node node-c"></div>
						<div class="network-link link-a"></div>
						<div class="network-link link-b"></div>
						<div class="network-link link-c"></div>
					</div>
				</div>
			</div>
		</section>

		<section
			id="resources"
			class:active={activeScreen === 'resources'}
			class="screen screen-resources"
			use:registerScreen={6}
		>
			<div class="screen-inner">
				<div class="slide-frame stack-frame">
					<div class="screen-copy">
						<div class="eyebrow">Go deeper</div>
						<h2>Resources for research coding</h2>
						<p class="body">Everything you need to keep learning between sessions.</p>
					</div>

					<div class="card-grid resources-grid">
						{#each resourceCards as card}
							<article class="info-card resource-card">
								<div class="resource-mark">{card.title}</div>
								<h3>{card.title}</h3>
								<p class="body">{card.body}</p>
							</article>
						{/each}
					</div>

					<div class="actions">
						<a class="btn btn-primary" href={withBase('/resources')}>Explore resources →</a>
						<a class="btn btn-secondary" href="#top">Back to top ↑</a>
					</div>
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
		--blue-50: #f0f9ff;
		--green-600: #15803d;
		--green-100: #dcfce7;
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
		width: 0.75rem;
		height: 0.75rem;
		border-radius: 999px;
		border: 0;
		background: rgb(100 116 139 / 0.25);
		padding: 0;
		cursor: pointer;
		transition:
			transform 0.2s ease,
			background 0.2s ease,
			box-shadow 0.2s ease;
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
		transform: scale(1.15);
		box-shadow: 0 0 0 0.35rem rgb(14 165 233 / 0.14);
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
		position: relative;
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
		padding: 0;
	}

	.slide-frame {
		position: relative;
		overflow: hidden;
		width: 100%;
		min-height: 100%;
		border-radius: 0;
		border: 0;
		background: transparent;
		box-shadow: none;
		backdrop-filter: none;
		padding: clamp(1.5rem, 3vw, 3rem);
	}

	.slide-frame::before {
		content: '';
		position: absolute;
		inset: 0;
		background: none;
		pointer-events: none;
	}

	.intro-frame,
	.split-frame {
		display: grid;
		gap: 1.6rem;
		align-items: center;
	}

	.stack-frame {
		display: grid;
		align-content: center;
		gap: 1.4rem;
	}

	.screen-copy,
	.visual-panel,
	.visual-stack,
	.card-grid,
	.check-grid,
	.event-card,
	.actions,
	.support-line {
		position: relative;
		z-index: 1;
	}

	.screen-copy,
	.visual-panel,
	.visual-stack,
	.card-grid,
	.check-grid,
	.event-card {
		opacity: 0;
		transform: translateY(42px);
		transition:
			opacity 0.55s ease,
			transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
	}

	.screen.active .screen-copy,
	.screen.active .visual-panel,
	.screen.active .visual-stack,
	.screen.active .card-grid,
	.screen.active .check-grid,
	.screen.active .event-card {
		opacity: 1;
		transform: translateY(0);
	}

	.screen.active .visual-panel,
	.screen.active .visual-stack,
	.screen.active .event-card {
		transition-delay: 0.12s;
	}

	.screen.active .card-grid,
	.screen.active .check-grid {
		transition-delay: 0.08s;
	}

	.screen-copy {
		max-width: 43rem;
		align-self: center;
	}

	.screen-copy.narrow {
		max-width: 28rem;
	}

	.eyebrow,
	.card-label,
	.sub-label,
	.resource-mark {
		display: inline-flex;
		width: fit-content;
		padding: 0.42rem 0.8rem;
		border-radius: 999px;
		font-size: 0.72rem;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	.eyebrow,
	.card-label,
	.resource-mark {
		background: var(--blue-100);
		color: var(--blue-700);
	}

	h1,
	h2 {
		margin: 0.95rem 0 0;
		max-width: 13ch;
		font-size: clamp(2.7rem, 6vw, 5.6rem);
		line-height: 0.94;
		letter-spacing: -0.05em;
		color: var(--text-strong);
	}

	h2 {
		font-size: clamp(2.2rem, 5vw, 4.4rem);
	}

	h3 {
		margin: 0.55rem 0 0;
		font-size: clamp(1.3rem, 2vw, 1.7rem);
		line-height: 1.05;
		color: var(--text-strong);
	}

	.body {
		margin: 1rem 0 0;
		max-width: 38rem;
		font-size: 1rem;
		line-height: 1.75;
		color: var(--text-body);
	}

	.body-large {
		font-size: 1.12rem;
	}

	.quote {
		margin: 1.1rem 0 0;
		font-size: clamp(2rem, 4vw, 3.5rem);
		font-weight: 800;
		line-height: 0.95;
		letter-spacing: -0.05em;
		color: var(--blue-700);
	}

	.tagline {
		margin: 1.25rem 0 0;
		font-size: 0.88rem;
		font-weight: 800;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--blue-600);
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
		transition:
			transform 0.2s ease,
			background 0.2s ease,
			border-color 0.2s ease,
			color 0.2s ease;
	}

	.btn:hover {
		transform: translateY(-1px);
	}

	.btn-primary {
		background: var(--blue-600);
		color: #fff;
	}

	.btn-primary:hover {
		background: var(--blue-700);
	}

	.btn-secondary {
		background: rgb(255 255 255 / 0.84);
		border-color: #cbd5e1;
		color: var(--text-strong);
	}

	.btn-secondary:hover {
		background: #fff;
	}

	.visual-panel,
	.event-card {
		min-height: 18rem;
		border-radius: 1.7rem;
		border: 1px solid rgb(148 163 184 / 0.2);
		background: linear-gradient(180deg, rgb(255 255 255 / 0.72), rgb(240 249 255 / 0.58));
		box-shadow: 0 20px 60px rgb(15 23 42 / 0.08);
	}

	.halo-panel {
		display: grid;
		align-content: center;
		justify-items: center;
		padding: 1.5rem;
	}

	.hero-orbit {
		position: relative;
		width: min(66vw, 20rem);
		aspect-ratio: 1;
		display: grid;
		place-items: center;
	}

	.orbit-ring {
		position: absolute;
		inset: 0;
		border-radius: 999px;
		border: 1px solid rgb(14 165 233 / 0.26);
		animation: spin 18s linear infinite;
	}

	.ring-b {
		inset: 12%;
		border-color: rgb(21 128 61 / 0.22);
		animation-direction: reverse;
		animation-duration: 14s;
	}

	.orbit-core {
		width: 6.5rem;
		height: 6.5rem;
		display: grid;
		place-items: center;
		border-radius: 999px;
		background: linear-gradient(135deg, #0369a1, #0ea5e9);
		color: #fff;
		font-size: 1.2rem;
		font-weight: 900;
		letter-spacing: 0.1em;
		box-shadow: 0 18px 50px rgb(14 165 233 / 0.26);
		animation: pulse 3.8s ease-in-out infinite;
	}

	.scroll-prompt {
		margin-top: 1.25rem;
		text-decoration: none;
		color: var(--blue-600);
		font-weight: 700;
	}

	.visual-stack {
		display: grid;
		gap: 1rem;
		align-content: center;
	}

	.mini-card {
		padding: 1rem 1.15rem;
		border-radius: 1.1rem;
		background: linear-gradient(180deg, #fff, #f8fafc);
		border: 1px solid rgb(148 163 184 / 0.22);
		box-shadow: 0 12px 40px rgb(15 23 42 / 0.08);
		font-size: 1.05rem;
		font-weight: 700;
		color: var(--text-strong);
	}

	.float-a,
	.float-b,
	.float-c {
		animation: drift 5s ease-in-out infinite;
	}

	.float-b {
		animation-delay: 0.6s;
	}

	.float-c {
		animation-delay: 1.2s;
	}

	.card-grid {
		display: grid;
		gap: 1rem;
	}

	.two-up,
	.resources-grid,
	.check-grid {
		grid-template-columns: 1fr;
	}

	.info-card,
	.check-item {
		padding: 1.35rem;
		border-radius: 1.3rem;
		border: 1px solid rgb(148 163 184 / 0.18);
		background: linear-gradient(180deg, rgb(255 255 255 / 0.68), rgb(248 250 252 / 0.56));
		box-shadow: 0 14px 40px rgb(15 23 42 / 0.07);
	}

	.support-line {
		margin: 0;
		font-size: 1rem;
		font-weight: 700;
		color: var(--blue-700);
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

	.event-card {
		padding: 1.45rem;
		align-self: center;
	}

	.event-month {
		background: #dbeafe;
		color: #1d4ed8;
	}

	.event-kicker {
		margin-top: 1rem;
		font-size: 0.82rem;
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-soft);
	}

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
		background: var(--blue-50);
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

	.bullet-list {
		display: grid;
		gap: 0.8rem;
		margin-top: 1.3rem;
	}

	.bullet-item {
		position: relative;
		padding-left: 1.25rem;
		font-size: 1rem;
		font-weight: 600;
		color: var(--text-strong);
	}

	.bullet-item::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.55rem;
		width: 0.42rem;
		height: 0.42rem;
		border-radius: 999px;
		background: var(--blue-500);
	}

	.sub-label {
		margin-top: 1rem;
		background: #ecfeff;
		color: #0f766e;
	}

	.network-panel {
		position: relative;
		overflow: hidden;
	}

	.network-node {
		position: absolute;
		width: 1.25rem;
		height: 1.25rem;
		border-radius: 999px;
		background: var(--blue-600);
		box-shadow: 0 0 0 0.55rem rgb(14 165 233 / 0.12);
		animation: pulse 4s ease-in-out infinite;
	}

	.node-a {
		top: 24%;
		left: 24%;
	}

	.node-b {
		top: 56%;
		left: 50%;
	}

	.node-c {
		top: 30%;
		right: 20%;
		background: var(--green-600);
		box-shadow: 0 0 0 0.55rem rgb(21 128 61 / 0.12);
		animation-delay: 0.8s;
	}

	.network-link {
		position: absolute;
		height: 2px;
		background: linear-gradient(90deg, rgb(14 165 233 / 0.7), rgb(21 128 61 / 0.5));
		transform-origin: left center;
	}

	.link-a {
		top: 28%;
		left: 28%;
		width: 34%;
		transform: rotate(7deg);
	}

	.link-b {
		top: 41%;
		left: 31%;
		width: 23%;
		transform: rotate(48deg);
	}

	.link-c {
		top: 45%;
		left: 51%;
		width: 22%;
		transform: rotate(-42deg);
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	@keyframes pulse {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.06);
		}
	}

	@keyframes drift {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-6px);
		}
	}

	@media (min-width: 820px) {
		.story-nav {
			display: flex;
		}

		.screen {
			padding: 0 1.5rem;
		}

		.intro-frame,
		.split-frame {
			grid-template-columns: minmax(0, 1.1fr) minmax(18rem, 0.9fr);
		}

		.two-up,
		.check-grid,
		.resources-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 819px) {
		.screen {
			height: 100%;
			padding: 0;
		}

		.slide-frame {
			min-height: 100%;
			padding: 1rem;
		}

		h1,
		h2 {
			max-width: 12ch;
		}
	}
</style>
