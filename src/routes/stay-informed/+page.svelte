<script lang="ts">
	import { SIGNUP_FORM_URL } from '$lib/links';
	import { base } from '$app/paths';

	// Paste the Microsoft Forms links here once the group forms exist
	// (Forms → Collect responses → Copy link). While a link is empty, its
	// button shows "opens soon" instead of linking anywhere.
	const UNSUBSCRIBE_FORM_URL = '';

	const withBase = (path: string) => (path === '/' ? `${base}/` : `${base}${path}`);
	const rstLogoSrc = withBase('/images/research_software_training_lockup_transparent.png');
	const cafeLogoSrc = withBase('/images/Logo_transparent_bg.png');

	type Card = { tag: string; title: string; body: string; icon: string };

	const topics: Card[] = [
		{
			tag: 'Courses & workshops',
			title: 'Learn a skill, properly',
			body: 'Hands-on courses on Linux, Git, Python, scripting and more. Hear about new dates before they fill up.',
			icon: 'course'
		},
		{
			tag: 'Coding Café',
			title: 'The monthly meetup',
			body: 'A short talk, then coding together. Bring your own problem, or just come and listen.',
			icon: 'cup'
		}
	];

	const channels: Card[] = [
		{
			tag: 'Mailing list',
			title: 'An e-mail per announcement',
			body: 'Only for what you picked: the topic, date, room and how to register. Nothing else.',
			icon: 'mail'
		},
		{
			tag: 'Teams community',
			title: 'Materials and discussion',
			body: 'Slides, code and links from each session, and a place to ask questions afterwards.',
			icon: 'chat'
		},
		{
			tag: 'Both',
			title: 'The full picture',
			body: 'The e-mails and the Teams community. Most people pick this one.',
			icon: 'both'
		}
	];

	const steps = [
		{ n: '1', title: 'Two-minute form', body: 'Name, e-mail, and what you want to hear about, and how.' },
		{
			n: '2',
			title: 'Welcome e-mail',
			body: 'Arrives within minutes. LUMC colleagues are added to Teams straight away.'
		},
		{
			n: '3',
			title: 'See you there',
			body: 'Colleagues outside LUMC get a Teams guest invitation within a week.'
		}
	];
</script>

<svelte:head>
	<title>Stay informed · LUMC Research Software Training</title>
	<meta
		name="description"
		content="Hear about LUMC research software courses, workshops and the Coding Café, by e-mail, in Teams, or both."
	/>
</svelte:head>

{#snippet card(item: Card, featured: boolean)}
	<article class="option" class:featured>
		<div class="option-icon" aria-hidden="true">
			{#if item.icon === 'mail'}
				<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
			{:else if item.icon === 'chat'}
				<svg viewBox="0 0 24 24"><path d="M4 5h16v10H9l-5 4z" /><path d="M8 9h8M8 12h5" /></svg>
			{:else if item.icon === 'course'}
				<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /><path d="m9 8-2 2 2 2M15 8l2 2-2 2" /></svg>
			{:else if item.icon === 'cup'}
				<svg viewBox="0 0 24 24"><path d="M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z" /><path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17" /><path d="M8 3c-1 1.5 1 2.5 0 4M12 3c-1 1.5 1 2.5 0 4" /></svg>
			{:else}
				<svg viewBox="0 0 24 24"><rect x="2.5" y="6" width="11" height="9" rx="1.5" /><path d="m2.5 7.5 5.5 4 5.5-4" /><path d="M16 9h5.5v7H19l-3 2.5z" /></svg>
			{/if}
		</div>
		<div class="option-tag">{item.tag}</div>
		<h3>{item.title}</h3>
		<p>{item.body}</p>
	</article>
{/snippet}

<div class="page">
	<section class="hero">
		<div class="hero-copy">
			<p class="ask">Never miss a session.</p>
			<h1>Stay informed</h1>
			<p class="lede">
				The LUMC Data Competence Center runs courses and workshops on research coding, and the
				Coding Café, a monthly meetup on open research software. Pick what you'd like to hear about,
				and how. Colleagues outside LUMC are welcome too.
			</p>
			<div class="actions">
				{#if SIGNUP_FORM_URL}
					<a class="btn btn-primary" href={SIGNUP_FORM_URL} target="_blank" rel="noopener noreferrer">
						Sign up — 2 minutes →
					</a>
				{:else}
					<span class="btn btn-primary is-disabled" aria-disabled="true">Sign-up opens soon</span>
				{/if}
				<a class="btn btn-secondary" href={withBase('/calendar')}>See what's coming</a>
			</div>
		</div>
		<div class="hero-art" aria-hidden="true">
			<img class="rst-logo" src={rstLogoSrc} alt="" />
			<img class="cafe-logo" src={cafeLogoSrc} alt="" />
		</div>
	</section>

	<section class="options" aria-labelledby="topics-title">
		<h2 id="topics-title" class="eyebrow">1 · What you'll hear about</h2>
		<div class="option-grid two">
			{#each topics as item}
				{@render card(item, false)}
			{/each}
		</div>
	</section>

	<section class="options" aria-labelledby="channels-title">
		<h2 id="channels-title" class="eyebrow">2 · How it reaches you</h2>
		<div class="option-grid">
			{#each channels as item, i}
				{@render card(item, i === 2)}
			{/each}
		</div>
	</section>

	<section class="steps" aria-labelledby="steps-title">
		<h2 id="steps-title" class="eyebrow">What happens next</h2>
		<ol class="step-list">
			{#each steps as step}
				<li>
					<span class="step-n">{step.n}</span>
					<div>
						<h3>{step.title}</h3>
						<p>{step.body}</p>
					</div>
				</li>
			{/each}
		</ol>
	</section>

	<section class="privacy">
		<div>
			<h2>Your details stay with us</h2>
			<p>
				We keep your name, e-mail address and organisation in LUMC's Microsoft 365, only to tell you
				about research software courses, workshops and Coding Cafés. We don't share them, and we delete them
				when you leave. In the Teams community, other members can see your name.
			</p>
		</div>
		<div class="privacy-action">
			{#if UNSUBSCRIBE_FORM_URL}
				<a href={UNSUBSCRIBE_FORM_URL} target="_blank" rel="noopener noreferrer">Unsubscribe</a>
			{:else}
				<span>Unsubscribe: reply “unsubscribe” to any of our e-mails</span>
			{/if}
		</div>
	</section>
</div>

<style>
	.options + .options {
		margin-top: calc(-1 * clamp(1rem, 3vw, 2rem));
	}

	.page {
		--cream: #f5f1ea;
		--cream-line: #e4ddcf;
		--ink: #1d1d1d;
		--ink-soft: #5b5b5b;
		--lumc: #003c7d;
		--lumc-light: #cde8f1;
		--brace: #0a7bc4;
		max-width: 72rem;
		margin: 0 auto;
		padding: clamp(1.25rem, 4vw, 3rem) 1rem 4rem;
		display: grid;
		gap: clamp(2.5rem, 6vw, 4.5rem);
		color: var(--ink);
	}

	.hero {
		position: relative;
		overflow: hidden;
		display: grid;
		grid-template-columns: 1fr;
		gap: 2rem;
		align-items: center;
		background:
			radial-gradient(40rem 26rem at 88% 30%, rgb(205 232 241 / 0.75), transparent 65%),
			var(--cream);
		border: 1px solid var(--cream-line);
		border-radius: 1.5rem;
		padding: clamp(1.75rem, 5vw, 3.5rem);
		box-shadow: 0 1px 0 rgb(0 0 0 / 0.02), 0 24px 48px -32px rgb(0 60 125 / 0.35);
	}

	.hero::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 8px;
		background: var(--lumc);
	}

	.ask {
		margin: 0;
		font-family: Georgia, 'Times New Roman', serif;
		font-style: italic;
		font-size: clamp(1.3rem, 2.6vw, 1.8rem);
		color: #2d2d2d;
	}

	h1 {
		margin: 0.35rem 0 0;
		font-family: Georgia, 'Times New Roman', serif;
		font-weight: 700;
		font-size: clamp(2.6rem, 7vw, 4.6rem);
		line-height: 1;
		letter-spacing: -0.02em;
	}

	.lede {
		margin: 1.25rem 0 0;
		max-width: 36rem;
		font-size: 1.08rem;
		line-height: 1.65;
		color: var(--ink-soft);
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin-top: 1.75rem;
	}

	.btn {
		display: inline-flex;
		align-items: center;
		min-height: 3rem;
		padding: 0 1.4rem;
		border-radius: 999px;
		font-weight: 700;
		text-decoration: none;
		transition:
			transform 0.15s ease,
			box-shadow 0.15s ease,
			background 0.15s ease;
	}

	.btn-primary {
		background: var(--lumc);
		color: #fff;
		box-shadow: 0 10px 24px -12px rgb(0 60 125 / 0.7);
	}

	.btn-primary:hover {
		transform: translateY(-1px);
		box-shadow: 0 14px 28px -12px rgb(0 60 125 / 0.75);
	}

	.btn-primary.is-disabled {
		background: #8a9bb3;
		box-shadow: none;
		cursor: default;
		transform: none;
	}

	.btn-secondary {
		background: #fff;
		color: var(--lumc);
		border: 2px solid var(--lumc-light);
	}

	.btn-secondary:hover {
		border-color: var(--lumc);
	}

	.btn:focus-visible,
	.privacy-action a:focus-visible {
		outline: 3px solid var(--brace);
		outline-offset: 3px;
	}

	.hero-art {
		display: grid;
		justify-items: center;
		gap: 1.5rem;
	}

	.hero-art img {
		display: block;
		width: 100%;
	}

	.rst-logo {
		max-width: 24rem;
	}

	.cafe-logo {
		max-width: 13rem;
	}

	.eyebrow {
		margin: 0 0 1.25rem;
		font-size: 0.75rem;
		font-weight: 800;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--lumc);
	}

	.option-grid {
		display: grid;
		gap: 1rem;
	}

	.option {
		position: relative;
		background: #fff;
		border: 1px solid #e2e8f0;
		border-radius: 1.25rem;
		padding: 1.5rem;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
	}

	.option:hover {
		transform: translateY(-3px);
		box-shadow: 0 18px 36px -24px rgb(0 60 125 / 0.45);
	}

	.option.featured {
		background: var(--lumc);
		border-color: var(--lumc);
		color: #fff;
	}

	.option-icon {
		width: 2.75rem;
		height: 2.75rem;
		display: grid;
		place-items: center;
		border-radius: 0.85rem;
		background: var(--lumc-light);
	}

	.option.featured .option-icon {
		background: rgb(255 255 255 / 0.14);
	}

	.option-icon svg {
		width: 1.5rem;
		height: 1.5rem;
		fill: none;
		stroke: var(--lumc);
		stroke-width: 1.8;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.option.featured .option-icon svg {
		stroke: #fff;
	}

	.option-tag {
		margin-top: 1.1rem;
		font-size: 0.75rem;
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--brace);
	}

	.option.featured .option-tag {
		color: var(--lumc-light);
	}

	.option h3 {
		margin: 0.35rem 0 0;
		font-family: Georgia, 'Times New Roman', serif;
		font-size: 1.45rem;
	}

	.option p {
		margin: 0.6rem 0 0;
		line-height: 1.6;
		color: var(--ink-soft);
	}

	.option.featured p {
		color: rgb(255 255 255 / 0.85);
	}

	.step-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 1rem;
	}

	.step-list li {
		display: flex;
		gap: 1rem;
		align-items: flex-start;
	}

	.step-n {
		flex: none;
		width: 2.5rem;
		height: 2.5rem;
		display: grid;
		place-items: center;
		border-radius: 999px;
		background: var(--cream);
		border: 1px solid var(--cream-line);
		font-family: Georgia, serif;
		font-weight: 700;
		color: var(--lumc);
	}

	.step-list h3 {
		margin: 0.35rem 0 0;
		font-size: 1.05rem;
	}

	.step-list p {
		margin: 0.3rem 0 0;
		color: var(--ink-soft);
		line-height: 1.55;
	}

	.privacy {
		display: grid;
		gap: 1rem;
		padding: 1.5rem;
		border-radius: 1.25rem;
		background: #eef6fa;
		border: 1px solid var(--lumc-light);
	}

	.privacy h2 {
		margin: 0;
		font-size: 1.1rem;
		color: var(--lumc);
	}

	.privacy p {
		margin: 0.5rem 0 0;
		line-height: 1.6;
		color: var(--ink-soft);
		max-width: 48rem;
	}

	.privacy-action {
		align-self: center;
		font-size: 0.95rem;
		color: var(--ink-soft);
	}

	.privacy-action a {
		color: var(--lumc);
		font-weight: 700;
	}

	@media (min-width: 48rem) {
		.hero {
			grid-template-columns: 1.15fr 0.85fr;
		}

		.option-grid {
			grid-template-columns: repeat(3, 1fr);
		}

		.option-grid.two {
			grid-template-columns: repeat(2, 1fr);
		}

		.step-list {
			grid-template-columns: repeat(3, 1fr);
			gap: 1.5rem;
		}

		.privacy {
			grid-template-columns: 1fr auto;
			padding: 1.75rem 2rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.btn,
		.option {
			transition: none;
		}
	}
</style>
