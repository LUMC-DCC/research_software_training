<script lang="ts">
	import { resources, type Resource } from '$lib/data';

	// Groups are ordered by first appearance of each theme in resources.json
	const groups: Array<{ title: string; items: Resource[] }> = [];
	const seen = new Map<string, Resource[]>();
	for (const resource of resources) {
		if (!seen.has(resource.theme)) {
			const items: Resource[] = [];
			seen.set(resource.theme, items);
			groups.push({ title: resource.theme, items });
		}
		seen.get(resource.theme)!.push(resource);
	}
</script>

<div class="wrap">
	<section class="hero">
		<div class="container">
			<h1>Resource Library</h1>
			<p>Curated guides, policies, and tutorials to level up your research software.</p>
		</div>
	</section>

	<div class="wide">
		{#each groups as group}
			<section class="group">
				<div class="group-head">
					<h2>{group.title}</h2>
				</div>
				<div class="cards">
					{#each group.items as resource (resource.id)}
						<article class="card">
							<div class={resource.source === 'LUMC' ? 'poster internal' : 'poster external'}>
								<div class="poster-meta">
									<span>{resource.source}</span>
									<span>{resource.type}</span>
								</div>
								<h3>{resource.title}</h3>
							</div>
							<div class="content">
								<p>{resource.abstract}</p>
								<div class="tags">
									{#each resource.tags.slice(0, 3) as tag}
										<span>{tag}</span>
									{/each}
								</div>
								<div class="footer">
									<span>{resource.access}</span>
									<a href={resource.url} target="_blank" rel="noopener noreferrer">Open</a>
								</div>
							</div>
						</article>
					{/each}
				</div>
			</section>
		{/each}
	</div>
</div>

<style>
	.wrap {
		min-height: 100%;
		background: #f8fafc;
		padding-bottom: 4rem;
	}
	.container {
		max-width: 80rem;
		margin: 0 auto;
		padding: 0 1rem;
	}
	.wide {
		max-width: 100rem;
		margin: 0 auto;
	}
	.hero {
		background: #0f172a;
		color: #fff;
		padding: 4rem 0;
		margin-bottom: 2rem;
	}
	h1 {
		margin: 0 0 0.9rem;
		font-size: 2.4rem;
	}
	.hero p {
		margin: 0;
		font-size: 1.15rem;
		color: #cbd5e1;
		max-width: 48rem;
	}
	.group {
		margin-bottom: 2rem;
	}
	.group-head {
		padding: 0 1rem;
		margin-bottom: 0.8rem;
	}
	h2 {
		margin: 0;
		font-size: 1.5rem;
		color: #0f172a;
	}
	.cards {
		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: minmax(16rem, 18rem);
		gap: 1rem;
		overflow-x: auto;
		padding: 0.45rem 1rem 0.8rem;
		margin-top: -0.45rem;
		scroll-snap-type: x mandatory;
	}
	.card {
		scroll-snap-align: start;
		background: #fff;
		border: 1px solid #e2e8f0;
		border-radius: 0.7rem;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		position: relative;
		z-index: 0;
		transition:
			transform 180ms ease,
			box-shadow 220ms ease,
			border-color 220ms ease;
		will-change: transform;
	}
	.card:hover {
		transform: translateY(-4px);
		box-shadow: 0 14px 24px rgb(15 23 42 / 0.1);
		border-color: #bfdbfe;
		z-index: 3;
	}
	.poster {
		padding: 1rem;
		color: #fff;
		min-height: 6.6rem;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		border-bottom: 1px solid rgb(255 255 255 / 0.14);
	}
	.internal {
		background: linear-gradient(135deg, #0369a1, #0c4a6e);
	}
	.external {
		background: linear-gradient(135deg, #334155, #0f172a);
	}
	.poster-meta {
		display: flex;
		justify-content: space-between;
		font-size: 0.62rem;
		text-transform: uppercase;
		font-weight: 700;
		opacity: 0.9;
	}
	h3 {
		margin: 0.55rem 0 0;
		font-size: 1.05rem;
		line-height: 1.25;
	}
	.content {
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		flex: 1;
	}
	.content p {
		margin: 0;
		color: #475569;
		line-height: 1.55;
		font-size: 0.86rem;
	}
	.tags {
		display: flex;
		gap: 0.35rem;
		flex-wrap: wrap;
	}
	.tags span {
		font-size: 0.64rem;
		padding: 0.2rem 0.45rem;
		border-radius: 0.3rem;
		background: #e2e8f0;
		color: #475569;
	}
	.footer {
		margin-top: auto;
		padding-top: 0.8rem;
		border-top: 1px solid #f1f5f9;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.8rem;
	}
	.footer span {
		font-size: 0.72rem;
		font-weight: 700;
		color: #0369a1;
	}
	.footer a {
		text-decoration: none;
		font-size: 0.76rem;
		font-weight: 700;
		color: #334155;
		border: 1px solid #cbd5e1;
		padding: 0.3rem 0.5rem;
		border-radius: 0.35rem;
		transition:
			background-color 180ms ease,
			border-color 180ms ease,
			color 180ms ease;
	}
	.card:hover .footer a {
		background: #eff6ff;
		border-color: #93c5fd;
		color: #1e3a8a;
	}
	@media (min-width: 768px) {
		.container,
		.group-head,
		.cards {
			padding-left: 1.5rem;
			padding-right: 1.5rem;
		}
		.cards {
			grid-auto-columns: minmax(18rem, 20rem);
		}
	}
</style>
