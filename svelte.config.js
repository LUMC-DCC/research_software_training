import { mdsvex } from 'mdsvex';
import adapterAuto from '@sveltejs/adapter-auto';

const isGitHubPagesBuild = process.env.GITHUB_PAGES === 'true';
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'coding_cafe';
let adapter = adapterAuto();

if (isGitHubPagesBuild) {
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
			base: isGitHubPagesBuild ? `/${repoName}` : ''
		},
		prerender: {
			entries: ['*']
		}
	},
	preprocess: [mdsvex()],
	extensions: ['.svelte', '.svx', '.md']
};

export default config;
