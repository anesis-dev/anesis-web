import type { Metadata } from "next";
import { HydrationBoundary } from "@tanstack/react-query";
import { AddonRegistryPage } from "@/components/addons/AddonRegistryPage";
import { catalogFiltersKey } from "@/services/catalog-filters";
import { fetchAddons } from "@/services/addon";
import { dehydrateQuery } from "@/lib/prefetch";

const PAGE_SIZE = 24;

export const metadata: Metadata = {
	title: "Addons",
	description:
		"Browse Anesis addons — reusable, versioned changes you can apply to a scaffolded project and revert just as easily.",
	alternates: { canonical: "/addons" },
};

export default async function AddonsPage() {
	const state = await dehydrateQuery({
		queryKey: ["addons", 1, PAGE_SIZE, "recent", catalogFiltersKey()],
		queryFn: () => fetchAddons({ page: 1, pageSize: PAGE_SIZE }, "recent"),
	});

	return (
		<HydrationBoundary state={state}>
			<AddonRegistryPage />
		</HydrationBoundary>
	);
}
