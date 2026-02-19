import { mdsvex } from 'mdsvex';
import adapterAuto from '@sveltejs/adapter-auto';

const isGitHubActions = Boolean(process.env.GITHUB_ACTIONS);
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'coding_cafe';
let adapter = adapterAuto();

if (isGitHubActions) {
	const { default: adapterStatic } = await import('@sveltejs/adapter-static');
	adapter = adapterStatic({
		pages: 'build',
		assets: 'build',
		fallback: undefined,
		precompress: false,
		strict: true
	});
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter,
		paths: {
			base: isGitHubActions ? `/${repoName}` : ''
		},
		prerender: {
			entries: ['*']
		}
	},
	preprocess: [mdsvex()],
	extensions: ['.svelte', '.svx']
};

export default config;
