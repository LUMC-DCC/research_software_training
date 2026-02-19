<script lang="ts">
	import { base } from '$app/paths';

	let submitted = $state(false);

	const handleSubmit = (event: SubmitEvent) => {
		event.preventDefault();
		submitted = true;
	};

	const withBase = (path: string) => (path === '/' ? `${base}/` : `${base}${path}`);
</script>

<div class="wrap">
	<div class="container">
		<h1>Contact Us</h1>

		<div class="card">
			{#if submitted}
				<div class="sent">
					<div class="icon">✓</div>
					<h3>Message Sent</h3>
					<p>Thanks for reaching out. We will get back to you shortly.</p>
					<button type="button" onclick={() => (submitted = false)}>Send another message</button>
				</div>
			{:else}
				<form onsubmit={handleSubmit} class="form">
					<label for="name">Name</label>
					<input id="name" type="text" required />

					<label for="email">Email</label>
					<input id="email" type="email" required />

					<label for="subject">Subject</label>
					<select id="subject">
						<option>General Inquiry</option>
						<option>Training Request</option>
						<option>Coding Cafe Proposal</option>
						<option>Consultation Request</option>
					</select>

					<label for="message">Message</label>
					<textarea id="message" rows="4" required></textarea>

					<button type="submit" class="submit">Send Message</button>
				</form>
			{/if}
		</div>

		<div class="meta">
			<p>training@lumc.nl</p>
			<p>
				You can also join our <a href={withBase('/resources')}>Microsoft Teams Channel</a> for quick questions.
			</p>
		</div>
	</div>
</div>

<style>
	.wrap {
		min-height: 100%;
		background: #f8fafc;
		padding: 4rem 0;
	}
	.container {
		max-width: 42rem;
		margin: 0 auto;
		padding: 0 1rem;
	}
	h1 {
		margin: 0 0 1.6rem;
		font-size: 2rem;
		color: #0f172a;
		text-align: center;
	}
	.card {
		background: #fff;
		border: 1px solid #e2e8f0;
		border-radius: 0.8rem;
		padding: 1.5rem;
	}
	.form {
		display: grid;
		gap: 0.65rem;
	}
	label {
		font-size: 0.86rem;
		font-weight: 600;
		color: #334155;
	}
	input,
	select,
	textarea {
		border: 1px solid #cbd5e1;
		border-radius: 0.4rem;
		padding: 0.55rem 0.65rem;
		font: inherit;
	}
	.submit {
		margin-top: 0.5rem;
		border: 0;
		border-radius: 0.45rem;
		background: #0369a1;
		color: #fff;
		font-weight: 700;
		padding: 0.65rem 1rem;
	}
	.sent {
		text-align: center;
		padding: 1rem;
	}
	.icon {
		width: 3rem;
		height: 3rem;
		border-radius: 999px;
		display: grid;
		place-items: center;
		margin: 0 auto 0.8rem;
		background: #dcfce7;
		color: #15803d;
		font-size: 1.4rem;
		font-weight: 700;
	}
	h3 {
		margin: 0;
		font-size: 1.3rem;
		color: #0f172a;
	}
	.sent p {
		margin: 0.5rem 0;
		color: #475569;
	}
	.sent button {
		margin-top: 0.5rem;
		border: 0;
		background: transparent;
		color: #0369a1;
		font-weight: 600;
	}
	.meta {
		text-align: center;
		margin-top: 1.6rem;
		color: #475569;
	}
	.meta p {
		margin: 0.35rem 0;
	}
	.meta a {
		color: #0369a1;
		text-decoration: none;
	}
	@media (min-width: 768px) {
		.container {
			padding: 0 1.5rem;
		}
	}
</style>
