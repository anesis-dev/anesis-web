"use client";

import { env } from "@/config/env";
import { CommandCard } from "@/components/CommandCard";


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
			{}
			<img src={badgeUrl} alt={`anesis ${resourceType} badge`} height={20} />
			<CommandCard label="Markdown" command={markdown} copyLabel="badge markdown" />
		</div>
	);
}
