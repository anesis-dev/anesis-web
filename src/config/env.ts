const DEFAULT_LOCAL_API_URL = "http://localhost:4000";

function normalizeUrl(value: string): string {
	return value.replace(/\/+$/, "");
}

function getApiUrl(): string {
	const value = process.env.NEXT_PUBLIC_API_URL;

	if (!value) {
		return DEFAULT_LOCAL_API_URL;
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
