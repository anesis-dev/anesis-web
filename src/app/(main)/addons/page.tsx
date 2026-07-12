import { HydrationBoundary } from "@tanstack/react-query";
import { AddonRegistryPage } from "@/components/addons/AddonRegistryPage";
import { catalogFiltersKey } from "@/services/catalog-filters";
import { fetchAddons } from "@/services/addon";
import { dehydrateQuery } from "@/lib/prefetch";

const PAGE_SIZE = 24;

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
