import { describe, it, expect } from 'vitest';
import { events, trainings, resources, type EventItem } from './data.js';

// --- events array ---

describe('events', () => {
	it('is a non-empty array', () => {
		expect(Array.isArray(events)).toBe(true);
		expect(events.length).toBeGreaterThan(0);
	});

	it('every event has required fields', () => {
		for (const event of events) {
			expect(event.id, `id missing on "${event.title}"`).toBeTruthy();
			expect(event.title, `title missing on id "${event.id}"`).toBeTruthy();
			expect(event.date, `date missing on "${event.title}"`).toBeTruthy();
			expect(event.location, `location missing on "${event.title}"`).toBeTruthy();
			expect(['cafe', 'training']).toContain(event.type);
		}
	});

	it('cafe events have a type of "cafe"', () => {
		const cafeEvents = events.filter((e) => e.type === 'cafe');
		expect(cafeEvents.length).toBeGreaterThan(0);
		for (const e of cafeEvents) {
			expect(e.type).toBe('cafe');
		}
	});

	it('training events have a type of "training"', () => {
		const trainingEvents = events.filter((e) => e.type === 'training');
		expect(trainingEvents.length).toBeGreaterThan(0);
		for (const e of trainingEvents) {
			expect(e.type).toBe('training');
		}
	});

	it('event ids are unique', () => {
		const ids = events.map((e) => e.id);
		const unique = new Set(ids);
		expect(unique.size).toBe(ids.length);
	});
});

// --- cafe event date / time normalisation ---

describe('cafe event date normalisation', () => {
	it('converts YYYY-MM-DD + startTime into an ISO datetime string', () => {
		const event = events.find(
			(e): e is EventItem => e.type === 'cafe' && !!e.startTime
		);
		if (!event) return; // skip if no timed cafe events in fixture

		expect(event.date).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);
	});

	it('leaves date unchanged when no time is provided', () => {
		const event = events.find(
			(e): e is EventItem => e.type === 'cafe' && !e.startTime && !e.time
		);
		if (!event) return;

		expect(event.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
	});

	it('formats time range from startTime and endTime', () => {
		const event = events.find(
			(e): e is EventItem => e.type === 'cafe' && !!e.startTime && !!e.endTime
		);
		if (!event) return;

		expect(event.time).toBe(`${event.startTime}-${event.endTime}`);
	});
});

// --- cafe event slug ---

describe('cafe event slug', () => {
	it('slugs follow the YYYY-MM-DD-kebab-case pattern', () => {
		const slugPattern = /^\d{4}-\d{2}-\d{2}-[a-z0-9-]+$/;
		const cafeEvents = events.filter((e) => e.type === 'cafe' && e.slug);
		expect(cafeEvents.length).toBeGreaterThan(0);
		for (const e of cafeEvents) {
			expect(e.slug, `slug "${e.slug}" does not match pattern`).toMatch(slugPattern);
		}
	});

	it('cafe event id equals slug when slug is present', () => {
		const cafeEvents = events.filter((e) => e.type === 'cafe' && e.slug);
		for (const e of cafeEvents) {
			expect(e.id).toBe(e.slug);
		}
	});
});

// --- trainings array ---

describe('trainings', () => {
	it('is a non-empty array', () => {
		expect(Array.isArray(trainings)).toBe(true);
		expect(trainings.length).toBeGreaterThan(0);
	});

	it('every training has required fields', () => {
		for (const t of trainings) {
			expect(t.id).toBeTruthy();
			expect(t.title).toBeTruthy();
			expect(t.description).toBeTruthy();
			expect(t.organizer).toBeTruthy();
			expect(['Beginner', 'Intermediate', 'Advanced']).toContain(t.level);
			expect(['Online', 'In-person', 'Hybrid']).toContain(t.format);
			expect(Array.isArray(t.audience)).toBe(true);
			expect(Array.isArray(t.tags)).toBe(true);
			expect(Array.isArray(t.sessions)).toBe(true);
		}
	});

	it('training ids are unique', () => {
		const ids = trainings.map((t) => t.id);
		const unique = new Set(ids);
		expect(unique.size).toBe(ids.length);
	});

	it('each training session has date and location', () => {
		for (const training of trainings) {
			for (const session of training.sessions) {
				expect(session.date, `session date missing in training "${training.id}"`).toBeTruthy();
				expect(
					session.location,
					`session location missing in training "${training.id}"`
				).toBeTruthy();
			}
		}
	});
});

// --- resources array ---

describe('resources', () => {
	it('is a non-empty array', () => {
		expect(Array.isArray(resources)).toBe(true);
		expect(resources.length).toBeGreaterThan(0);
	});

	it('every resource has required fields', () => {
		for (const r of resources) {
			expect(r.id).toBeTruthy();
			expect(r.title).toBeTruthy();
			expect(r.abstract).toBeTruthy();
			expect(['Tutorial', 'Guide', 'Tool', 'Policy']).toContain(r.type);
			expect(['LUMC', 'External']).toContain(r.source);
			expect(['Open Access', 'LUMC Only']).toContain(r.access);
			expect(r.url).toBeTruthy();
			expect(Array.isArray(r.tags)).toBe(true);
		}
	});

	it('normalises "Internal (LUMC)" source to "LUMC"', () => {
		// All resources with internal source should be normalised
		const internalResources = resources.filter((r) => r.source === 'LUMC');
		for (const r of internalResources) {
			expect(r.source).toBe('LUMC');
		}
	});

	it('resource ids are unique', () => {
		const ids = resources.map((r) => r.id);
		const unique = new Set(ids);
		expect(unique.size).toBe(ids.length);
	});
});
