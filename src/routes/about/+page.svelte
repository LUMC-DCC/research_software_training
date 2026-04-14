<script lang="ts">
	import { team } from '$lib/data';
	import { base } from '$app/paths';

	const withBase = (path: string) => (path.startsWith('http') ? path : `${base}${path}`);
</script>

<div class="wrap">
	<div class="container prose">
		<h1>About the Program</h1>

		<p class="lead">
			The LUMC Research Software Training program is dedicated to improving the quality,
			reproducibility, and reusability of software produced for medical research.
		</p>

		<h2>Why it matters</h2>
		<p>
			Research software is a fundamental component of modern science. However, unlike lab protocols,
			software development practices are often self-taught. By professionalizing how we write code, we
			ensure:
		</p>
		<ul>
			<li><strong>Reliability:</strong> Reducing bugs in analysis.</li>
			<li><strong>Reproducibility:</strong> Ensuring other researchers can run your code.</li>
			<li><strong>Efficiency:</strong> Spending less time fixing code and more time interpreting results.</li>
		</ul>

		<h2>FAIR for Research Software</h2>
		<p>
			We align our training with the FAIR4RS principles (Findable, Accessible, Interoperable,
			Reusable). Our goal is to make software a first-class citizen in the research output ecosystem.
		</p>

		<h2>Meet the Team</h2>
		<div class="team">
			{#each team as member (member.name)}
				<div class="member">
					<div class="photo-wrap">
						{#if member.image}
							<img
								src={withBase(member.image)}
								alt={`Portrait of ${member.name}`}
							/>
						{:else}
							<div class="avatar">{member.name.charAt(0)}</div>
						{/if}
					</div>
					<div class="member-info">
						<div class="name">{member.name}</div>
						<div class="role">{member.role}</div>
					</div>
				</div>
			{/each}
		</div>

		<h2>Contact</h2>
		<p>
			Questions, suggestions, or just want to get in touch? Reach out by email or find us in person.
		</p>
		<div class="contact-card">
			<p><a href="mailto:o.balaban@lumc.nl">o.balaban@lumc.nl</a></p>
			<p class="meta">Physical location: S07-16</p>
			<p class="meta">Microsoft Teams channel coming soon.</p>
		</div>
	</div>
</div>

<style>
	.wrap {
		background: #fff;
		min-height: 100%;
		padding: 4rem 0;
	}
	.container {
		max-width: 52rem;
		margin: 0 auto;
		padding: 0 1rem;
	}
	h1 {
		margin: 0 0 2rem;
		font-size: 2.4rem;
		color: #0f172a;
	}
	.lead {
		font-size: 1.1rem;
		color: #475569;
		line-height: 1.75;
		margin-bottom: 2rem;
	}
	h2 {
		margin: 2.2rem 0 0.6rem;
		font-size: 1.65rem;
		color: #1e293b;
	}
	p,
	li {
		color: #475569;
		line-height: 1.7;
	}
	ul {
		padding-left: 1.2rem;
	}
	.team {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 1.2rem;
		margin-top: 1rem;
	}
	.member {
		background: #f8fafc;
		border: 1px solid #e2e8f0;
		border-radius: 0.75rem;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		width: 11rem;
	}
	.photo-wrap {
		width: 100%;
		aspect-ratio: 3 / 4;
		overflow: hidden;
		background: #e2e8f0;
	}
	.photo-wrap img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: top;
		display: block;
	}
	.avatar {
		width: 100%;
		height: 100%;
		display: grid;
		place-items: center;
		font-size: 3rem;
		background: #bae6fd;
		color: #0c4a6e;
		font-weight: 700;
	}
	.member-info {
		padding: 0.75rem 0.9rem;
	}
	.name {
		font-weight: 700;
		font-size: 0.95rem;
		color: #0f172a;
		line-height: 1.3;
	}
	.role {
		font-size: 0.8rem;
		color: #64748b;
		margin-top: 0.2rem;
	}
	.contact-card {
		margin-top: 0.8rem;
		padding: 1.2rem 1.4rem;
		background: #f8fafc;
		border: 1px solid #e2e8f0;
		border-radius: 0.55rem;
	}
	.contact-card p {
		margin: 0 0 0.4rem;
	}
	.contact-card a {
		color: #0369a1;
		font-weight: 600;
		text-decoration: none;
	}
	.meta {
		font-size: 0.9rem;
		color: #64748b !important;
	}
	@media (min-width: 768px) {
		.container {
			padding: 0 1.5rem;
		}
	}
</style>
