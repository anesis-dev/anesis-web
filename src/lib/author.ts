export function authorLogin(
	author: { name?: string; github?: string } | string | null | undefined,
): string | null {
	if (!author) return null;
	if (typeof author === "string") return author.trim() || null;
	return author.github?.trim() || null;
}

export function authorName(
	author: { name?: string; github?: string } | string | null | undefined,
): string | null {
	if (!author) return null;
	if (typeof author === "string") return author.trim() || null;
	return author.name?.trim() || authorLogin(author);
}

export function authorHref(
	author: { name?: string; github?: string } | string | null | undefined,
): string | null {
	const login = authorLogin(author);
	return login ? `/user/${encodeURIComponent(login)}` : null;
}
