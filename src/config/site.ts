function resolveSiteUrl(): string {
	const explicit = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");
	if (explicit) return explicit;

	const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
	if (vercel) return `https://${vercel.replace(/\/+$/, "")}`;

	return "https://anesis-dev.vercel.app";
}

export const site = {
	name: "Anesis",
	url: resolveSiteUrl(),
	title: "Anesis — template-first project scaffolding",
	description:
		"Anesis is a template-first CLI and web registry for scaffolding projects, publishing starters, and extending them with reusable, versioned addons.",
	twitter: "@anesis_dev",
} as const;

export function absoluteUrl(path: string): string {
	return new URL(path, site.url).toString();
}
