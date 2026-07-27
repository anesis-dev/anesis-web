import type { Metadata } from "next";
import { site } from "@/config/site";

export function registryMetadata({
	title,
	description,
	canonicalPath,
	keywords,
}: {
	title: string;
	description: string;
	canonicalPath: string;
	keywords?: string[];
}): Metadata {
	const trimmed =
		description.length > 200 ? `${description.slice(0, 197)}…` : description;

	return {
		title,
		description: trimmed,
		keywords,
		alternates: { canonical: canonicalPath },
		openGraph: {
			type: "website",
			siteName: site.name,
			url: canonicalPath,
			title,
			description: trimmed,
		},
		twitter: {
			card: "summary_large_image",
			title,
			description: trimmed,
		},
	};
}

export function unresolvedMetadata(kind: string): Metadata {
	return {
		title: `${kind} not found`,
		description: `This ${kind.toLowerCase()} is not available in the Anesis registry.`,
		robots: { index: false, follow: true },
	};
}
