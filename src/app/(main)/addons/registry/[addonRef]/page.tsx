import type { Metadata } from "next";
import { AddonDetailsClient } from "@/components/addons/AddonDetailsClient";
import { getAddonHref } from "@/lib/addon-ref";
import { registryMetadata, unresolvedMetadata } from "@/lib/registry-metadata";
import { fetchAddon } from "@/services/addon";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ addonRef: string }>;
}): Promise<Metadata> {
	const { addonRef } = await params;

	try {
		const addon = await fetchAddon(decodeURIComponent(addonRef));
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
	return <AddonDetailsClient addonRef={addonRef} />;
}
