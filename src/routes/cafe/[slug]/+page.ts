import { events, type EventItem } from '$lib/data';
import { parseFrontmatter, renderMarkdownToHtml, type SessionMetadata } from '$lib/markdown-utils';

const sessionModules = import.meta.glob('/src/lib/content/cafe-sessions/*.md', {
	query: '?raw',
	import: 'default'
});

export async function load({ params }) {
	const event = events.find(
		(item): item is EventItem => item.type === 'cafe' && item.slug === params.slug
	);

	if (!event) {
		const placeholderEvent: EventItem = {
			id: params.slug || 'upcoming-session',
			type: 'cafe',
			title: 'Session materials',
			date: new Date().toISOString(),
			location: 'LUMC Coding Cafe',
			description: 'The materials for this session will be updated soon.',
			slug: params.slug || undefined
		};

		return {
			event: placeholderEvent,
			content: null,
			metadata: {
				title: 'Session materials',
				summary: 'The materials for this session will be updated soon.'
			},
			isPlaceholder: true
		};
	}

	const modulePath = `/src/lib/content/cafe-sessions/${params.slug}.md`;
	const moduleLoader = sessionModules[modulePath];

	let content = '';
	let metadata: SessionMetadata = {};

	if (moduleLoader) {
		const rawMarkdown = (await moduleLoader()) as string;
		const parsed = parseFrontmatter(rawMarkdown);
		content = renderMarkdownToHtml(parsed.body);
		metadata = parsed.metadata;
	}

	return {
		event,
		content,
		metadata,
		isPlaceholder: false
	};
}
