<script lang="ts">
	import { team } from '$lib/data';
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
					{#if member.image}
						<img class="avatar-image" src={member.image} alt={`${member.name} placeholder portrait`} />
					{:else}
						<div class="avatar">{member.name.charAt(0)}</div>
					{/if}
					<div>
						<div class="name">{member.name}</div>
						<div class="role">{member.role}</div>
					</div>
				</div>
			{/each}
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
		display: grid;
		gap: 0.9rem;
		margin-top: 1rem;
	}
	.member {
		display: flex;
		align-items: center;
		gap: 0.8rem;
		padding: 0.8rem;
		background: #f8fafc;
		border: 1px solid #e2e8f0;
		border-radius: 0.55rem;
	}
	.avatar {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 999px;
		display: grid;
		place-items: center;
		background: #bae6fd;
		color: #0c4a6e;
		font-weight: 700;
	}
	.avatar-image {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 999px;
		object-fit: cover;
		border: 1px solid #cbd5e1;
		background: #fff;
	}
	.name {
		font-weight: 700;
		color: #0f172a;
	}
	.role {
		font-size: 0.84rem;
		color: #64748b;
	}
	@media (min-width: 768px) {
		.container {
			padding: 0 1.5rem;
		}
		.team {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
