<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import { base } from '$app/paths';

	let { children } = $props();
	let isMobileMenuOpen = $state(false);

	const navItems = [
		{ name: 'Home', path: '/' },
		{ name: 'Training', path: '/training' },
		{ name: 'Coding Cafe', path: '/cafe' },
		{ name: 'Coding Cafe Agenda', path: '/cafe-agenda' },
		{ name: 'Resources', path: '/resources' },
		{ name: 'Calendar', path: '/calendar' },
		{ name: 'About', path: '/about' },
		{ name: 'Contact', path: '/contact' }
	];

	const handbookUrl = 'https://lumc-dcc.github.io/research_software_handbook';

	const closeMobileMenu = () => {
		isMobileMenuOpen = false;
	};

	const withBase = (path: string) => (path === '/' ? `${base}/` : `${base}${path}`);
	const logoSrc = `${base}/images/research_training_logo.png`;
	const normalize = (path: string) => path.replace(/\/+$/, '') || '/';
	const isActive = (path: string) => normalize(page.url.pathname) === normalize(withBase(path));
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>LUMC Research Software Training</title>
</svelte:head>

<div class="site">
	<header class="topbar">
		<div class="nav-row container">
			<a href={withBase('/')} class="brand" onclick={closeMobileMenu}>
				<div class="logo-box">
					<img src={logoSrc} alt="LUMC Research Software Training logo" />
				</div>
				<div>
					<div class="brand-title">LUMC</div>
					<div class="brand-subtitle">Research Software Training</div>
				</div>
			</a>

			<nav class="nav desktop-nav">
				{#each navItems as item}
					<a href={withBase(item.path)} class:active={isActive(item.path)}>{item.name}</a>
				{/each}
				<a href={handbookUrl} target="_blank" rel="noopener noreferrer">Handbook</a>
			</nav>

			<button
				type="button"
				class="mobile-toggle"
				onclick={() => (isMobileMenuOpen = !isMobileMenuOpen)}
				aria-label="Toggle menu"
			>
				{isMobileMenuOpen ? 'Close' : 'Menu'}
			</button>
		</div>

		{#if isMobileMenuOpen}
			<nav class="mobile-nav">
				{#each navItems as item}
					<a
						href={withBase(item.path)}
						class:active={isActive(item.path)}
						onclick={closeMobileMenu}
					>
						{item.name}
					</a>
				{/each}
				<a href={handbookUrl} target="_blank" rel="noopener noreferrer" onclick={closeMobileMenu}>
					Handbook ↗
				</a>
			</nav>
		{/if}
	</header>

	<main class="page-content">
		{@render children()}
	</main>

	<footer class="footer">
		<div class="footer-shell container">
			<a href={withBase('/')} class="footer-logo-card" aria-label="LUMC Research Software Training home">
				<img src={logoSrc} alt="LUMC Research Software Training logo" />
			</a>

			<div class="footer-title-block">
				<p class="footer-kicker">LUMC Research Software Training</p>
			</div>

			<div class="footer-description">
				<p>
					Empowering researchers with the skills and tools to build high-quality, reproducible, and
					FAIR software for better science.
				</p>
			</div>

			<div class="footer-contact">
				<p class="footer-contact-title">Özgün Balaban</p>
				<div>
					<a href="mailto:o.balaban@lumc.nl">o.balaban@lumc.nl</a>
				</div>
			</div>
		</div>
	</footer>
</div>

<style>
	:global(body) {
		margin: 0;
		font-family:
			-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
		background: #f8fafc;
		color: #1e293b;
	}

	.site {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.page-content {
		flex: 1;
	}

	.container {
		max-width: 80rem;
		margin: 0 auto;
		padding: 0 1rem;
	}

	.topbar {
		position: sticky;
		top: 0;
		z-index: 30;
		background: #fff;
		border-bottom: 1px solid #e2e8f0;
		box-shadow: 0 1px 3px rgb(0 0 0 / 0.06);
	}

	.nav-row {
		min-height: 4rem;
		display: flex;
		gap: 1rem;
		align-items: center;
		justify-content: space-between;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		text-decoration: none;
	}

	.logo-box {
		display: grid;
		flex: 0 0 auto;
	}

	.logo-box img {
		block-size: 3rem;
		inline-size: auto;
		max-inline-size: min(42vw, 10rem);
		object-fit: contain;
		display: block;
	}

	.brand-title {
		font-weight: 700;
		color: #0c4a6e;
		line-height: 1;
	}

	.brand-subtitle {
		font-size: 0.75rem;
		color: #64748b;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		font-weight: 600;
	}

	.nav {
		display: flex;
		gap: 0.25rem;
	}

	.nav a,
	.mobile-nav a {
		text-decoration: none;
		color: #475569;
		font-size: 0.9rem;
		font-weight: 600;
		padding: 0.45rem 0.7rem;
		border-radius: 0.4rem;
	}

	.nav a {
		position: relative;
		border-radius: 0;
	}

	.nav a::after {
		content: '';
		position: absolute;
		left: 0.7rem;
		right: 0.7rem;
		bottom: 0.1rem;
		height: 2px;
		border-radius: 999px;
		background: #0c4a6e;
		transform: scaleX(0);
		transform-origin: center;
		transition: transform 0.2s ease;
	}

	.nav a:hover,
	.mobile-nav a:hover {
		color: #0369a1;
	}

	.nav a:hover {
		background: transparent;
	}


	.mobile-nav a:hover {
		background: #f1f5f9;
	}

	.mobile-nav a.active {
		background: #f0f9ff;
		color: #0369a1;
	}

	.nav a.active {
		background: transparent;
		color: #0c4a6e;
	}

	.nav a.active::after {
		transform: scaleX(1);
	}

	.mobile-nav a.active {
		color: #0369a1;
	}

	.desktop-nav {
		display: none;
	}

	.mobile-toggle {
		border: 1px solid #cbd5e1;
		background: #fff;
		color: #334155;
		border-radius: 0.4rem;
		padding: 0.4rem 0.65rem;
		font-size: 0.82rem;
		font-weight: 600;
	}

	.mobile-nav {
		display: grid;
		padding: 0.5rem 1rem 0.8rem;
		border-top: 1px solid #e2e8f0;
		background: #fff;
	}

	.footer {
		background: #0f172a;
		color: #cbd5e1;
		padding-top: 1.2rem;
		margin-top: 2rem;
		border-top: 1px solid rgb(148 163 184 / 0.16);
	}

	.footer-shell {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		align-items: flex-start;
		padding-top: 0.8rem;
		padding-bottom: 0.8rem;
	}

	.footer-title-block,
	.footer-description,
	.footer-contact {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.footer-kicker {
		margin: 0;
		font-size: 0.8rem;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0.16em;
		color: #fff;
	}

	.footer-description p,
	.footer-contact {
		margin: 0;
		color: #cbd5e1;
		line-height: 1.55;
		font-size: 0.92rem;
	}

	.footer-logo-card {
		display: inline-flex;
		width: fit-content;
		max-width: max-content;
		padding: 0.7rem 0.9rem;
		border-radius: 1rem;
		background: rgb(255 255 255 / 0.96);
		box-shadow: 0 14px 30px -18px rgb(255 255 255 / 0.35);
	}

	.footer-logo-card img {
		height: 2.3rem;
		width: auto;
		display: block;
	}

	.footer a {
		color: inherit;
		text-decoration: none;
	}

	.footer a:hover {
		color: #fff;
	}

	.footer-contact-title {
		margin: 0 0 0.35rem;
		font-size: 0.98rem;
		font-weight: 700;
		color: #fff;
	}

	@media (min-width: 768px) {
		.container {
			padding: 0 1.5rem;
		}

		.desktop-nav {
			display: flex;
		}

		.mobile-toggle,
		.mobile-nav {
			display: none;
		}

		.footer-shell {
			flex-direction: row;
			align-items: center;
			gap: 1.5rem;
		}
	}
</style>
