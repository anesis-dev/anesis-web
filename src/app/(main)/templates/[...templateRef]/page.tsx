import type { Metadata } from "next";
import { TemplateDetailsClient } from "@/components/templates/TemplateDetailsClient";
import { getTemplateLatestHref } from "@/lib/template-ref";
import { registryMetadata, unresolvedMetadata } from "@/lib/registry-metadata";
import { fetchTemplate } from "@/services/template";

function joinRef(segments: string[]): string {
	return segments.map((segment) => decodeURIComponent(segment)).join("/");
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ templateRef: string[] }>;
}): Promise<Metadata> {
	const { templateRef } = await params;

	try {
		const template = await fetchTemplate(joinRef(templateRef));
		const { metadata, technologies, languages } = template.config;
		return registryMetadata({
			title: `${metadata.displayName} — Anesis template`,
			description:
				metadata.description ||
				`${metadata.displayName} is a project template on the Anesis registry. Scaffold it with: anesis new my-app ${template.name}`,
			canonicalPath: getTemplateLatestHref(template.name),
			keywords: [
				template.name,
				metadata.displayName,
				"project template",
				"starter",
				...(technologies ?? []),
				...(languages ?? []),
			],
		});
	} catch {
		return unresolvedMetadata("Template");
	}
}

export default async function TemplateDetailsPage({
	params,
}: {
	params: Promise<{ templateRef: string[] }>;
}) {
	const { templateRef } = await params;
	return <TemplateDetailsClient templateRef={templateRef} />;
}
