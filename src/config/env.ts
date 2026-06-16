/**
 * Runtime environment configuration for the web app.
 *
 * The only value needed by the frontend is the backend API URL. It is read
 * from the `NEXT_PUBLIC_API_URL` environment variable (which must be a
 * NEXT_PUBLIC_ variable so it is inlined at build time). When the variable
 * is absent the app falls back to localhost:4000 for local development.
 *
 * A relative path like `/api` is also accepted, which is useful when the
 * frontend and backend are served from the same origin via a reverse proxy.
 */
const DEFAULT_LOCAL_API_URL = "http://localhost:4000";

function normalizeUrl(value: string): string {
	return value.replace(/\/+$/, "");
}

function normalizePath(value: string): string {
	return value.replace(/\/+$/, "");
}

/**
 * Resolves the backend API URL from the environment variable.
 * Accepts a full URL or a path-relative value (e.g. `/api`).
 * Always strips trailing slashes so callers can safely append paths.
 */
function getApiUrl(): string {
	const value = process.env.NEXT_PUBLIC_API_URL;

	if (!value) {
		return DEFAULT_LOCAL_API_URL;
	}

	if (value.startsWith("/") && !value.startsWith("//")) {
		return normalizePath(value);
	}

	try {
		return normalizeUrl(new URL(value).toString());
	} catch {
		return DEFAULT_LOCAL_API_URL;
	}
}

export const env = {
	apiUrl: getApiUrl(),
} as const;
