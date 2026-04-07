import { env } from "@/config/env";

class ApiError extends Error {
	constructor(
		public readonly status: number,
		message: string,
	) {
		super(message);
		this.name = "ApiError";
	}
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
	const res = await fetch(`${env.apiUrl}${path}`, {
		credentials: "include",
		...options,
		headers: {
			"Content-Type": "application/json",
			...options?.headers,
		},
	});

	if (!res.ok) {
		const text = await res.text();
		let message = `${res.status} ${res.statusText}`;
		try {
			const json = JSON.parse(text);
			if (json.message) message = json.message;
		} catch {}
		throw new ApiError(res.status, message);
	}

	// Handle empty responses (e.g. 204 No Content)
	const text = await res.text();
	if (!text) return undefined as T;
	try {
		return JSON.parse(text) as T;
	} catch {
		throw new ApiError(res.status, "Server returned an unexpected non-JSON response.");
	}
}

export const api = {
	get: <T>(path: string, options?: RequestInit) =>
		apiFetch<T>(path, { method: "GET", ...options }),

	post: <T>(path: string, body?: unknown, options?: RequestInit) =>
		apiFetch<T>(path, {
			method: "POST",
			body: body !== undefined ? JSON.stringify(body) : undefined,
			...options,
		}),

	put: <T>(path: string, body?: unknown, options?: RequestInit) =>
		apiFetch<T>(path, {
			method: "PUT",
			body: body !== undefined ? JSON.stringify(body) : undefined,
			...options,
		}),

	patch: <T>(path: string, body?: unknown, options?: RequestInit) =>
		apiFetch<T>(path, {
			method: "PATCH",
			body: body !== undefined ? JSON.stringify(body) : undefined,
			...options,
		}),

	delete: <T>(path: string, options?: RequestInit) =>
		apiFetch<T>(path, { method: "DELETE", ...options }),
};

export { ApiError };
