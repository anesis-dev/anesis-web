const DEFAULT_LOCAL_API_URL = "http://localhost:4000";

function normalizeUrl(value: string): string {
	return value.replace(/\/+$/, "");
}

function normalizePath(value: string): string {
	return value.replace(/\/+$/, "");
}

function fallbackApiUrl(reason: string): string {
	if (process.env.NODE_ENV === "production") {
		throw new Error(
			`NEXT_PUBLIC_API_URL ${reason}. Set it to the backend origin (or a same-origin path such as "/api/backend") in the deployment environment.`,
		);
	}
	return DEFAULT_LOCAL_API_URL;
}

function getApiUrl(): string {
	const value = process.env.NEXT_PUBLIC_API_URL;

	if (!value) {
		return fallbackApiUrl("is not set");
	}

	if (value.startsWith("/") && !value.startsWith("//")) {
		return normalizePath(value);
	}

	try {
		return normalizeUrl(new URL(value).toString());
	} catch {
		return fallbackApiUrl(`is not a valid URL (got "${value}")`);
	}
}

export const env = {
	apiUrl: getApiUrl(),
} as const;
