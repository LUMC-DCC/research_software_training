<script lang="ts">
	import { NWO_FUNDING_LINE } from '$lib/links';
	import { base } from '$app/paths';
	import { onMount } from 'svelte';

	type Screen = { id: string; label: string; title: string };

	const withBase = (path: string) => (path === '/' ? `${base}/` : `${base}${path}`);

	const screens: Screen[] = [
		{ id: 'identity', label: 'Intro', title: 'LUMC FAIR Research Software Training' },
		{ id: 'fair', label: 'FAIR', title: 'What is FAIR4RS' },
		{ id: 'community', label: 'Community', title: 'A growing community of researchers' },
		{ id: 'resources', label: 'Resources', title: 'Resources for research coding' }
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
		<section id="identity" class:active={activeScreen === 'identity'} class="screen" use:registerScreen={0}>
			<div class="screen-inner">
				<div class="slide-frame identity-frame">
					<div class="screen-copy">
						<h1>LUMC FAIR Research Software Training</h1>
						<p class="quote">“Better Software,<br />Better Research.”</p>
						<p class="body">
							“Welcome to the LUMC Research Software Training hub. We help researchers and support
							staff build coding skills for FAIR, reproducible, and impactful science.”
						</p>
						<div class="actions">
							<a class="btn btn-primary" href={withBase('/training')}>Explore trainings ↓</a>
							<a class="btn btn-secondary" href={withBase('/cafe')}>Join Coding Cafe</a>
							<a class="btn btn-secondary" href={withBase('/stay-informed')}>Stay informed</a>
						</div>
						<p class="funding">{NWO_FUNDING_LINE}</p>
					</div>
				</div>
			</div>
		</section>

		<section id="fair" class:active={activeScreen === 'fair'} class="screen" use:registerScreen={1}>
			<div class="screen-inner">
				<div class="slide-frame stack-frame">
					<div class="screen-copy">
						<h2>What is FAIR4RS?</h2>
						<p class="body body-large">
							FAIR means research outputs should be <strong>Findable, Accessible, Interoperable,</strong>
							and <strong>Reusable</strong>.
						</p>
						<p class="body">
							For research software, that means writing code others can discover, understand, run,
							and build on. Good software practices make better science easier to share and trust.
						</p>
					</div>
					<p class="support-line">
						Check out <a href="https://fair-software.nl/" target="_blank" rel="noopener noreferrer">fair-software.nl</a>
						for detailed information.
					</p>
				</div>
			</div>
		</section>

		<section id="community" class:active={activeScreen === 'community'} class="screen" use:registerScreen={2}>
			<div class="screen-inner">
				<div class="slide-frame stack-frame">
					<div class="screen-copy">
						<h2>A growing community of researchers</h2>
						<div class="bullet-list">
							{#each communityItems as item}
								<div class="bullet-item">{item}</div>
							{/each}
						</div>
						<p class="support-line">
							Microsoft Teams Community is in development. Follow this page for announcements.
						</p>
					</div>
				</div>
			</div>
		</section>

		<section id="resources" class:active={activeScreen === 'resources'} class="screen" use:registerScreen={3}>
			<div class="screen-inner">
				<div class="slide-frame stack-frame">
					<div class="screen-copy">
						<div class="eyebrow">Go deeper</div>
						<h2>Resources for research coding</h2>
						<p class="body">Everything you need to keep learning between sessions.</p>
					</div>

					<div class="card-grid resources-grid">
						{#each resourceCards as card}
							<article class="info-card">
								<h3>{card.title}</h3>
								<p class="body">{card.body}</p>
							</article>
						{/each}
					</div>

					<div class="actions">
						<a class="btn btn-primary" href={withBase('/resources')}>Explore resources →</a>
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
		padding: 0;
	}

	.slide-frame {
		position: relative;
		overflow: hidden;
		width: 100%;
		min-height: 100%;
		background: transparent;
		padding: clamp(1.2rem, 3vw, 2.4rem);
	}

	.identity-frame,
	.stack-frame {
		display: grid;
		gap: 1.4rem;
		align-items: center;
	}

	.screen-copy,
	.card-grid,
	.actions {
		opacity: 0;
		transform: translateY(42px);
		transition: opacity 0.55s ease, transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
	}

	.screen.active .screen-copy,
	.screen.active .card-grid,
	.screen.active .actions {
		opacity: 1;
		transform: translateY(0);
	}

	.screen.active .card-grid {
		transition-delay: 0.12s;
	}

	.screen-copy {
		max-width: 43rem;
	}

	.eyebrow {
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
		font-size: clamp(2.35rem, 5vw, 4.2rem);
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
		margin: 1.3rem 0 0;
		font-size: clamp(2.8rem, 6vw, 5.1rem);
		font-weight: 800;
		line-height: 0.87;
		letter-spacing: -0.05em;
		color: var(--text-strong);
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

	.btn:hover {
		transform: translateY(-1px);
	}

	.funding {
		margin: 1.4rem 0 0;
		font-size: 0.82rem;
		line-height: 1.5;
		color: #64748b;
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

	.support-line a {
		color: var(--blue-700);
		font-weight: 700;
		text-decoration: none;
	}

	.info-card {
		border-radius: 1.7rem;
		border: 1px solid rgb(148 163 184 / 0.18);
		background: linear-gradient(180deg, rgb(255 255 255 / 0.68), rgb(240 249 255 / 0.56));
		box-shadow: 0 20px 60px rgb(15 23 42 / 0.08);
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

	.card-grid {
		display: grid;
		gap: 1rem;
		grid-template-columns: 1fr;
	}

	.info-card {
		padding: 1.35rem;
		transition:
			transform 0.22s ease,
			box-shadow 0.22s ease,
			border-color 0.22s ease,
			background 0.22s ease;
	}

	.info-card:hover {
		transform: translateY(-4px);
		border-color: rgb(14 165 233 / 0.28);
		background: linear-gradient(180deg, rgb(255 255 255 / 0.82), rgb(240 249 255 / 0.68));
		box-shadow: 0 24px 60px rgb(15 23 42 / 0.12);
	}

	@media (min-width: 820px) {
		.story-nav { display: flex; }
		.screen { padding: 0 1.5rem; }
		.identity-frame { grid-template-columns: minmax(0, 1fr); }
		.resources-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
	}

	@media (max-width: 819px) {
		.screen { padding: 0; }
		.slide-frame { padding: 1rem; }
	}
</style>
