import { neon } from '@neondatabase/serverless';

export interface ContactPayload {
	name: string;
	email: string;
	subject?: string;
	message: string;
	website?: string;
	source?: string;
}

type ValidationSuccess = { ok: true; data: ContactPayload };
type ValidationFailure = { ok: false; error: string };

const MAX_NAME = 120;
const MAX_EMAIL = 254;
const MAX_SUBJECT = 200;
const MAX_MESSAGE = 5000;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactPayload(body: unknown): ValidationSuccess | ValidationFailure {
	if (!body || typeof body !== 'object') {
		return { ok: false, error: 'Invalid request body.' };
	}

	const record = body as Record<string, unknown>;
	const website = typeof record.website === 'string' ? record.website.trim() : '';

	if (website) {
		return {
			ok: true,
			data: { name: '', email: '', message: '', website: 'spam' },
		};
	}

	const name = typeof record.name === 'string' ? record.name.trim() : '';
	const email = typeof record.email === 'string' ? record.email.trim() : '';
	const subject = typeof record.subject === 'string' ? record.subject.trim() : undefined;
	const message = typeof record.message === 'string' ? record.message.trim() : '';
	const source = typeof record.source === 'string' ? record.source.trim() : 'website';

	if (!name || name.length > MAX_NAME) {
		return { ok: false, error: 'Please enter a valid name.' };
	}

	if (!email || email.length > MAX_EMAIL || !EMAIL_PATTERN.test(email)) {
		return { ok: false, error: 'Please enter a valid email address.' };
	}

	if (subject && subject.length > MAX_SUBJECT) {
		return { ok: false, error: 'Subject is too long.' };
	}

	if (!message || message.length < 10 || message.length > MAX_MESSAGE) {
		return { ok: false, error: 'Message must be between 10 and 5000 characters.' };
	}

	return {
		ok: true,
		data: { name, email, subject, message, source },
	};
}

export async function saveContactSubmission(
	databaseUrl: string,
	data: ContactPayload,
): Promise<{ id: string }> {
	if (data.website) {
		return { id: 'ok' };
	}

	const sql = neon(databaseUrl);
	const rows = await sql`
		INSERT INTO contact_submissions (name, email, subject, message, source)
		VALUES (
			${data.name},
			${data.email},
			${data.subject ?? null},
			${data.message},
			${data.source ?? 'website'}
		)
		RETURNING id::text AS id
	`;

	const row = rows[0] as { id: string } | undefined;
	if (!row?.id) {
		throw new Error('Insert did not return an id.');
	}

	return row;
}
