/**
 * Slug integrity tests
 *
 * These tests verify that the three slug-bearing systems stay in sync:
 *   1. coding-cafe-events.json  — structured event metadata
 *   2. src/lib/content/cafe-sessions/*.md  — optional session notes
 *   3. static/events/<slug>/   — optional slide decks
 *
 * Markdown files and static event directories are optional (not every event
 * needs them), but when they exist their filename/dirname MUST match a slug
 * present in the JSON so the dynamic route /cafe/[slug] can resolve them.
 */

import { describe, it, expect } from 'vitest';
import { readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { events } from './data.js';

const PROJECT_ROOT = new URL('../..', import.meta.url).pathname;
const SESSIONS_DIR = join(PROJECT_ROOT, 'src/lib/content/cafe-sessions');
const STATIC_EVENTS_DIR = join(PROJECT_ROOT, 'static/events');

const cafeEventSlugs = new Set(
	events.filter((e) => e.type === 'cafe' && e.slug).map((e) => e.slug as string)
);

describe('markdown session files', () => {
	it('every .md file maps to a known cafe event slug', () => {
		const files = readdirSync(SESSIONS_DIR).filter((f) => f.endsWith('.md'));
		expect(files.length).toBeGreaterThan(0);

		for (const file of files) {
			const slug = file.replace(/\.md$/, '');
			expect(
				cafeEventSlugs.has(slug),
				`"${file}" has no matching slug in coding-cafe-events.json`
			).toBe(true);
		}
	});

	it('markdown filenames follow the YYYY-MM-DD-kebab-case convention', () => {
		const slugPattern = /^\d{4}-\d{2}-\d{2}-[a-z0-9-]+\.md$/;
		const files = readdirSync(SESSIONS_DIR).filter((f) => f.endsWith('.md'));

		for (const file of files) {
			expect(file, `"${file}" does not follow naming convention`).toMatch(slugPattern);
		}
	});
});

describe('static event directories', () => {
	it('every static/events/<slug> directory maps to a known cafe event slug', () => {
		if (!existsSync(STATIC_EVENTS_DIR)) return; // optional directory

		const dirs = readdirSync(STATIC_EVENTS_DIR, { withFileTypes: true })
			.filter((d) => d.isDirectory())
			.map((d) => d.name);

		for (const dir of dirs) {
			expect(
				cafeEventSlugs.has(dir),
				`static/events/${dir}/ has no matching slug in coding-cafe-events.json`
			).toBe(true);
		}
	});
});
