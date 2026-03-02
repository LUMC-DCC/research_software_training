import rawCodingCafeEvents from '$lib/content/coding-cafe-events.json';
import rawTrainings from '$lib/content/trainings.json';
import rawResources from '$lib/content/resources.json';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type TrainingSession = {
	id: string;
	title?: string;
	date: string;
	time?: string;
	location: string;
	description?: string;
	registrationLink?: string;
};

export type Training = {
	id: string;
	title: string;
	description: string;
	level: DifficultyLevel;
	audience: string[];
	duration: string;
	format: 'Online' | 'In-person' | 'Hybrid';
	learningOutcomes: string[];
	materialsLink?: string;
	tags: string[];
	sessions: TrainingSession[];
};

export type EventItem = {
	id: string;
	type: 'training' | 'cafe';
	title: string;
	subtitle?: string;
	date: string;
	time?: string;
	location: string;
	speaker?: string;
	speakerLink?: string;
	speakerImage?: string;
	description: string;
	tags?: string[];
	slug?: string;
	slides?: string;
	poster?: string;
	repo?: string;
	zenodo?: string;
	calendar?: string;
	image?: string;
	registrationLink?: string;
	relatedTrainingId?: string;
};

export type Resource = {
	id: string;
	title: string;
	abstract: string;
	type: 'Tutorial' | 'Guide' | 'Tool' | 'Policy';
	tags: string[];
	url: string;
	source: 'Internal (LUMC)' | 'External';
};

export type TeamMember = {
	name: string;
	role: string;
	image?: string;
};

type RawCodingCafeEvent = {
	title: string;
	subtitle?: string;
	date: string;
	time?: string;
	location: string;
	speaker?: string;
	speaker_link?: string;
	speakerImage?: string;
	description?: string;
	slug?: string;
	tags?: string[];
	slides?: string;
	poster?: string;
	repo?: string;
	zenodo?: string;
	calendar?: string;
	image?: string;
	registrationLink?: string;
};

type RawTraining = {
	id: string;
	title: string;
	description: string;
	level: DifficultyLevel;
	audience: string[];
	duration: string;
	format: 'Online' | 'In-person' | 'Hybrid';
	learningOutcomes: string[];
	materialsLink?: string;
	tags: string[];
	sessions?: TrainingSession[];
};

type RawResource = {
	id: string;
	title: string;
	abstract: string;
	type: 'Tutorial' | 'Guide' | 'Tool' | 'Policy';
	tags: string[];
	url: string;
	source: 'Internal (LUMC)' | 'External';
};

const startTimeToIso = (date: string, time?: string) => {
	if (date.includes('T')) {
		return date;
	}

	const start = time?.split('-')[0]?.trim();
	const match = start?.match(/^(\d{1,2}):(\d{2})$/);

	if (!match) {
		return `${date}T16:00:00`;
	}

	const [_, hh, mm] = match;
	return `${date}T${hh.padStart(2, '0')}:${mm}:00`;
};

const codingCafeEvents: EventItem[] = (rawCodingCafeEvents as RawCodingCafeEvent[]).map((event, index) => {
	if (!event.title || !event.date || !event.location) {
		throw new Error(`Invalid coding-cafe-events.json entry at index ${index}`);
	}

	return {
		id: event.slug || `cafe-${event.date}-${index}`,
		type: 'cafe',
		title: event.title,
		subtitle: event.subtitle || undefined,
		date: startTimeToIso(event.date, event.time),
		time: event.time || undefined,
		location: event.location,
		speaker: event.speaker || undefined,
		speakerLink: event.speaker_link || undefined,
		speakerImage: event.speakerImage || undefined,
		description: event.description || event.subtitle || event.title,
		tags: event.tags || undefined,
		slug: event.slug || undefined,
		slides: event.slides || undefined,
		poster: event.poster || undefined,
		repo: event.repo || undefined,
		zenodo: event.zenodo || undefined,
		calendar: event.calendar || undefined,
		image: event.image || undefined,
		registrationLink: event.registrationLink || undefined
	};
});

export const trainings: Training[] = (rawTrainings as RawTraining[]).map((training, index) => {
	if (
		!training.id ||
		!training.title ||
		!training.description ||
		!training.level ||
		!training.duration ||
		!training.format ||
		!Array.isArray(training.audience) ||
		!Array.isArray(training.learningOutcomes) ||
		!Array.isArray(training.tags) ||
		(training.sessions !== undefined && !Array.isArray(training.sessions))
	) {
		throw new Error(`Invalid trainings.json entry at index ${index}`);
	}

	return {
		id: training.id,
		title: training.title,
		description: training.description,
		level: training.level,
		audience: training.audience,
		duration: training.duration,
		format: training.format,
		learningOutcomes: training.learningOutcomes,
		tags: training.tags,
		materialsLink: training.materialsLink || undefined,
		sessions: training.sessions || []
	};
});

const trainingEvents: EventItem[] = trainings.flatMap((training) =>
	training.sessions.map((session, index) => {
		if (!session.id || !session.date || !session.location) {
			throw new Error(`Invalid session in trainings.json for training ${training.id} at index ${index}`);
		}

		return {
			id: session.id,
			type: 'training',
			title: session.title || training.title,
			date: startTimeToIso(session.date, session.time),
			time: session.time || undefined,
			location: session.location,
			description: session.description || training.description,
			registrationLink: session.registrationLink || undefined,
			relatedTrainingId: training.id
		};
	})
);

export const events: EventItem[] = [...trainingEvents, ...codingCafeEvents];

export const resources: Resource[] = (rawResources as RawResource[]).map((resource, index) => {
	if (
		!resource.id ||
		!resource.title ||
		!resource.abstract ||
		!resource.type ||
		!resource.source ||
		!resource.url ||
		!Array.isArray(resource.tags)
	) {
		throw new Error(`Invalid resources.json entry at index ${index}`);
	}

	return {
		id: resource.id,
		title: resource.title,
		abstract: resource.abstract,
		type: resource.type,
		source: resource.source,
		tags: resource.tags,
		url: resource.url
	};
});

export const team: TeamMember[] = [
	{
		name: 'dr. Anna Niehues',
		role: 'Senior Data Steward',
		image: '/images/team/anna-placeholder.svg'
	},
	{
		name: 'dr. ir. Özgün Balaban',
		role: 'Research Software Trainer',
		image: '/images/team/ozgun-placeholder.svg'
	}
];
