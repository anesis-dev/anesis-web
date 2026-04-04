export function getDateTimestamp(value: string | null | undefined): number {
	if (!value) {
		return 0;
	}

	const timestamp = new Date(value).getTime();

	return Number.isNaN(timestamp) ? 0 : timestamp;
}

export function formatDate(
	value: string | null | undefined,
	fallback = "—",
): string {
	const timestamp = getDateTimestamp(value);

	if (!timestamp) {
		return fallback;
	}

	return new Date(timestamp).toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
}
