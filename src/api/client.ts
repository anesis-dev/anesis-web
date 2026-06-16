/**
 * Thin HTTP client for communicating with the Anesis backend API.
 *
 * All requests are sent to the URL configured in `env.apiUrl` and include
 * cookies automatically (`credentials: "include"`), which is how the
 * session JWT is forwarded on every call.
 *
 * Usage:
 *   import { api } from "@/api/client";
 *   const data = await api.get<MyType>("/some/endpoint");
 */
import { env } from "@/config/env";

/**
 * Thrown whenever the server returns a non-2xx response.
 * `status` carries the HTTP status code so callers can distinguish 401/403
 * (not authenticated / forbidden) from 5xx (server errors).
 */
class ApiError extends Error {
	constructor(
		public readonly status: number,
		message: string,
	) {
		super(message);
		this.name = "ApiError";
	}
}

/**
 * Core fetch wrapper. Prepends `env.apiUrl`, sets JSON headers, and throws
 * `ApiError` on non-OK responses. Handles empty 204 responses gracefully.
 */
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
			if (typeof json.message === "string") message = json.message;
			else if (typeof json.error === "string") message = json.error;
		} catch {
			// body is not JSON — keep the default `{status} {statusText}` message
		}
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

/** Convenience methods that mirror HTTP verbs. Body is JSON-serialized automatically. */
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
