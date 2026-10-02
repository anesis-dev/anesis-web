import type { Metadata } from "next";
import { cache } from "react";
import { HydrationBoundary } from "@tanstack/react-query";
import { AddonDetailsClient } from "@/components/addons/AddonDetailsClient";
import { getAddonHref } from "@/lib/addon-ref";
import { registryMetadata, unresolvedMetadata } from "@/lib/registry-metadata";
import { fetchAddon } from "@/services/addon";
import { dehydrateQuery } from "@/lib/prefetch";
import { safeDecodeURIComponent } from "@/lib/safe-decode-uri";

// cache(): generateMetadata and the page share one backend request (apiFetch
// sets an AbortSignal, which opts out of Next's built-in fetch dedupe).
const getAddon = cache(fetchAddon);

export async function generateMetadata({
	params,
}: {
	params: Promise<{ addonRef: string }>;
}): Promise<Metadata> {
	const { addonRef } = await params;

	try {
		const addon = await getAddon(safeDecodeURIComponent(addonRef));
		const description = addon.config.description;
		return registryMetadata({
			title: `${addon.name} — Anesis addon`,
			description:
				description ||
				`${addon.name} is an Anesis addon: a reusable, versioned change you can apply to a scaffolded project with anesis use ${addon.addon_id}.`,
			canonicalPath: getAddonHref(addon),
			keywords: [
				addon.addon_id,
				addon.name,
				"anesis addon",
				"code generator",
				"project addon",
			],
		});
	} catch {
		return unresolvedMetadata("Addon");
	}
}

export default async function AddonDetailsPage({
	params,
}: {
	params: Promise<{ addonRef: string }>;
}) {
	const { addonRef } = await params;
	const ref = safeDecodeURIComponent(addonRef);
	// Same key as useAddon, so the client renders from SSR data immediately.
	const state = await dehydrateQuery({
		queryKey: ["addon", ref],
		queryFn: () => getAddon(ref),
	});
	return (
		<HydrationBoundary state={state}>
			<AddonDetailsClient addonRef={addonRef} />
		</HydrationBoundary>
	);
}
