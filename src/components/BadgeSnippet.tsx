"use client";

import { env } from "@/config/env";
import { CommandCard } from "@/components/CommandCard";

/**
 * README badge snippet for a registry resource. The badge SVG is served by the
 * backend at `/badge/{type}/{id}` and reflects the live install count.
 */
export function BadgeSnippet({
	resourceType,
	id,
}: {
	resourceType: "template" | "addon" | "stack";
	id: string;
}) {
	const badgeUrl = `${env.apiUrl}/badge/${resourceType}/${encodeURIComponent(id)}`;
	const markdown = `![anesis ${resourceType}](${badgeUrl})`;

	return (
		<div className="space-y-3">
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img src={badgeUrl} alt={`anesis ${resourceType} badge`} height={20} />
			<CommandCard label="Markdown" command={markdown} copyLabel="badge markdown" />
		</div>
	);
}
