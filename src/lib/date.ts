/**
 * Date utility helpers.
 *
 * `getDateTimestamp` converts an ISO date string to a Unix millisecond
 * timestamp, returning `0` for null/undefined/invalid values. Used when
 * comparing dates for sorting without throwing on bad data.
 *
 * `formatDate` renders a date string as a human-readable short date
 * (e.g. "Jan 3, 2025"). Returns `fallback` (default "—") for invalid dates.
 */
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
