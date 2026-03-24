<script lang="ts">
	import { base } from '$app/paths';

	const withBase = (path: string) => (path === '/' ? `${base}/` : `${base}${path}`);
	const cafeLogoSrc = withBase('/images/Logo_transparent_bg.png');
</script>

<section class="hero">
	<div class="container hero-grid">
		<div class="hero-copy">
			<div class="eyebrow">LUMC Coding Cafe</div>
			<h1>A sharper front door for the Coding Cafe.</h1>
			<p>
				This page is now reserved for a dedicated hero experience. The full session overview and archive
				live on the agenda page.
			</p>
			<div class="actions">
				<a class="btn btn-primary" href={withBase('/cafe/agenda')}>Open the Agenda</a>
				<a class="btn btn-secondary" href={withBase('/contact')}>Contact the Team</a>
			</div>
		</div>

		<div class="hero-panel">
			<img class="cafe-logo" src={cafeLogoSrc} alt="LUMC Coding Cafe" />
			<div class="panel-card">
				<div class="panel-label">Next step</div>
				<p>
					Use the agenda page to browse upcoming sessions, revisit past talks, and jump into individual
					session pages.
				</p>
				<a class="panel-link" href={withBase('/cafe/agenda')}>Go to agenda -></a>
			</div>
		</div>
	</div>
</section>

<style>
	.hero {
		min-height: calc(100vh - 4rem);
		display: flex;
		align-items: center;
		background:
			radial-gradient(circle at top left, rgb(14 165 233 / 0.18), transparent 30rem),
			linear-gradient(180deg, #f8fafc 0%, #e0f2fe 50%, #f8fafc 100%);
	}

	.container {
		max-width: 80rem;
		margin: 0 auto;
		padding: 0 1rem;
	}

	.hero-grid {
		display: grid;
		gap: 2rem;
		padding-top: 4rem;
		padding-bottom: 4rem;
	}

	.hero-copy {
		max-width: 38rem;
	}

	.eyebrow {
		display: inline-flex;
		align-items: center;
		padding: 0.45rem 0.8rem;
		border-radius: 999px;
		background: #e0f2fe;
		color: #075985;
		font-size: 0.72rem;
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	h1 {
		margin: 1rem 0 1rem;
		font-size: clamp(2.6rem, 6vw, 4.8rem);
		line-height: 0.95;
		letter-spacing: -0.04em;
		color: #0f172a;
	}

	p {
		margin: 0;
		font-size: 1.05rem;
		line-height: 1.75;
		color: #475569;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.9rem;
		margin-top: 2rem;
	}

	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		text-decoration: none;
		padding: 0.85rem 1.2rem;
		border-radius: 999px;
		font-size: 0.92rem;
		font-weight: 700;
		transition:
			transform 0.2s ease,
			background 0.2s ease,
			color 0.2s ease,
			border-color 0.2s ease;
	}

	.btn:hover {
		transform: translateY(-1px);
	}

	.btn-primary {
		background: #0369a1;
		color: #fff;
	}

	.btn-primary:hover {
		background: #075985;
	}

	.btn-secondary {
		border: 1px solid #cbd5e1;
		background: rgb(255 255 255 / 0.75);
		color: #0f172a;
	}

	.btn-secondary:hover {
		background: #fff;
	}

	.hero-panel {
		display: grid;
		gap: 1.25rem;
		align-content: center;
	}

	.cafe-logo {
		width: min(100%, 25rem);
		height: auto;
		justify-self: center;
		filter: drop-shadow(0 24px 50px rgb(14 165 233 / 0.18));
	}

	.panel-card {
		padding: 1.35rem;
		border-radius: 1.4rem;
		background: rgb(255 255 255 / 0.9);
		border: 1px solid rgb(148 163 184 / 0.25);
		box-shadow: 0 24px 80px rgb(15 23 42 / 0.08);
		max-width: 26rem;
		justify-self: center;
	}

	.panel-label {
		font-size: 0.74rem;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #0284c7;
		margin-bottom: 0.6rem;
	}

	.panel-card p {
		font-size: 0.97rem;
	}

	.panel-link {
		display: inline-flex;
		margin-top: 1rem;
		text-decoration: none;
		font-weight: 700;
		color: #0369a1;
	}

	@media (min-width: 900px) {
		.container {
			padding: 0 1.5rem;
		}

		.hero-grid {
			grid-template-columns: minmax(0, 1.15fr) minmax(18rem, 0.85fr);
			align-items: center;
			gap: 3rem;
		}
	}
</style>
