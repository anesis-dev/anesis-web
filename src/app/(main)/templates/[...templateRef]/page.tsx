import type { Metadata } from "next";
import { cache } from "react";
import { HydrationBoundary } from "@tanstack/react-query";
import { TemplateDetailsClient } from "@/components/templates/TemplateDetailsClient";
import { getTemplateLatestHref } from "@/lib/template-ref";
import { registryMetadata, unresolvedMetadata } from "@/lib/registry-metadata";
import { fetchTemplate } from "@/services/template";
import { dehydrateQuery } from "@/lib/prefetch";
import { safeDecodeURIComponent } from "@/lib/safe-decode-uri";

// cache(): generateMetadata and the page share one backend request (apiFetch
// sets an AbortSignal, which opts out of Next's built-in fetch dedupe).
const getTemplate = cache(fetchTemplate);

function joinRef(segments: string[]): string {
	return segments.map((segment) => safeDecodeURIComponent(segment)).join("/");
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ templateRef: string[] }>;
}): Promise<Metadata> {
	const { templateRef } = await params;

	try {
		const template = await getTemplate(joinRef(templateRef));
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
	const ref = joinRef(templateRef);
	// Same key as useTemplate, so the client renders from SSR data immediately.
	const state = await dehydrateQuery({
		queryKey: ["template", ref],
		queryFn: () => getTemplate(ref),
	});
	return (
		<HydrationBoundary state={state}>
			<TemplateDetailsClient templateRef={templateRef} />
		</HydrationBoundary>
	);
}
