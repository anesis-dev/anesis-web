import { HydrationBoundary } from "@tanstack/react-query";
import { StacksRegistryPage } from "@/components/stacks/StacksRegistryPage";
import { catalogFiltersKey } from "@/services/catalog-filters";
import { fetchStacks } from "@/services/stack";
import { dehydrateQuery } from "@/lib/prefetch";

const PAGE_SIZE = 24;

export default async function StacksPage() {
	const state = await dehydrateQuery({
		queryKey: ["stacks", 1, PAGE_SIZE, catalogFiltersKey()],
		queryFn: () => fetchStacks({ page: 1, pageSize: PAGE_SIZE }),
	});

	return (
		<HydrationBoundary state={state}>
			<StacksRegistryPage />
		</HydrationBoundary>
	);
}
