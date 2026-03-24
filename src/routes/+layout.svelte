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
		{ name: 'Resources', path: '/resources' },
		{ name: 'Calendar', path: '/calendar' },
		{ name: 'About', path: '/about' },
		{ name: 'Contact', path: '/contact' }
	];

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
			</nav>
		{/if}
	</header>

	<main class="page-content">
		{@render children()}
	</main>

	<footer class="footer">
		<div class="footer-grid container">
			<div class="footer-main">
				<h3>LUMC Research Software</h3>
				<p>
					Empowering researchers with the skills and tools to build high-quality, reproducible, and
					FAIR software for better science.
				</p>
			</div>
			<div>
				<h4>Quick Links</h4>
				<ul>
					<li><a href={withBase('/training')}>Training Catalogue</a></li>
					<li><a href={withBase('/cafe')}>Coding Cafe</a></li>
					<li><a href={withBase('/resources')}>Resources</a></li>
				</ul>
			</div>
			<div>
				<h4>Contact</h4>
				<p><a href="mailto:o.balaban@lumc.nl">o.balaban@lumc.nl</a></p>
			</div>
		</div>
		<div class="footer-bottom">
			&copy; {new Date().getFullYear()} Leiden University Medical Center. All rights reserved.
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

	.nav a:hover,
	.mobile-nav a:hover {
		background: #f1f5f9;
		color: #0369a1;
	}

	.nav a.active,
	.mobile-nav a.active {
		background: #f0f9ff;
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
		padding-top: 3rem;
		margin-top: 2rem;
	}

	.footer-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2rem;
	}

	.footer-main h3,
	h4 {
		margin: 0 0 0.85rem;
		color: #fff;
	}

	.footer-main p,
	.footer p {
		margin: 0;
		color: #cbd5e1;
		line-height: 1.6;
		max-width: 26rem;
	}

	.footer ul {
		padding: 0;
		margin: 0;
		list-style: none;
		display: grid;
		gap: 0.45rem;
	}

	.footer a {
		color: inherit;
		text-decoration: none;
	}

	.footer a:hover {
		color: #fff;
	}

	.footer-bottom {
		margin-top: 3rem;
		padding: 1.2rem 1rem;
		border-top: 1px solid #334155;
		text-align: center;
		font-size: 0.78rem;
		color: #94a3b8;
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

		.footer-grid {
			grid-template-columns: 2fr 1fr 1fr;
		}
	}
</style>
