import { saveContactSubmission, validateContactPayload } from '../../lib/contact';

interface Env {
	DATABASE_URL: string;
}

const JSON_HEADERS = {
	'Content-Type': 'application/json',
} as const;

export const onRequestPost: PagesFunction<Env> = async (context) => {
	const contentType = context.request.headers.get('content-type') ?? '';
	if (!contentType.includes('application/json')) {
		return new Response(JSON.stringify({ error: 'Expected JSON body.' }), {
			status: 415,
			headers: JSON_HEADERS,
		});
	}

	let body: unknown;
	try {
		body = await context.request.json();
	} catch {
		return new Response(JSON.stringify({ error: 'Invalid JSON.' }), {
			status: 400,
			headers: JSON_HEADERS,
		});
	}

	const result = validateContactPayload(body);
	if (!result.ok) {
		return new Response(JSON.stringify({ error: result.error }), {
			status: 400,
			headers: JSON_HEADERS,
		});
	}

	if (result.data.website) {
		return new Response(JSON.stringify({ success: true }), {
			status: 200,
			headers: JSON_HEADERS,
		});
	}

	const databaseUrl = context.env.DATABASE_URL;
	if (!databaseUrl) {
		return new Response(
			JSON.stringify({ error: 'Contact form is not configured yet.' }),
			{
				status: 503,
				headers: JSON_HEADERS,
			},
		);
	}

	try {
		await saveContactSubmission(databaseUrl, result.data);
		return new Response(JSON.stringify({ success: true }), {
			status: 200,
			headers: JSON_HEADERS,
		});
	} catch (error) {
		console.error('Contact submission failed:', error);
		return new Response(
			JSON.stringify({ error: 'Unable to save your message. Please try again later.' }),
			{
				status: 500,
				headers: JSON_HEADERS,
			},
		);
	}
};
