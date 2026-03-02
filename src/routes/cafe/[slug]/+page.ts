import { error } from '@sveltejs/kit';
import { events, type EventItem } from '$lib/data';

const sessionModules = import.meta.glob('/src/lib/content/cafe-sessions/*.md');

type MdModule = {
	default: unknown;
	metadata?: {
		title?: string;
		summary?: string;
	};
};

export async function load({ params }) {
	const event = events.find(
		(item): item is EventItem => item.type === 'cafe' && item.slug === params.slug
	);

	if (!event) {
		throw error(404, 'Session not found');
	}

	const modulePath = `/src/lib/content/cafe-sessions/${params.slug}.md`;
	const moduleLoader = sessionModules[modulePath];

	let content: unknown = null;
	let metadata: MdModule['metadata'] = {};

	if (moduleLoader) {
		const module = (await moduleLoader()) as MdModule;
		content = module.default;
		metadata = module.metadata ?? {};
	}

	return {
		event,
		content,
		metadata
	};
}
