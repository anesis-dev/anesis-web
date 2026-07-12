import { HydrationBoundary } from "@tanstack/react-query";
import { TemplatesRegistryPage } from "@/components/templates/TemplatesRegistryPage";
import { catalogFiltersKey } from "@/services/catalog-filters";
import { fetchTemplates } from "@/services/template";
import { dehydrateQuery } from "@/lib/prefetch";

const PAGE_SIZE = 24;

export default async function TemplatesPage() {
	const state = await dehydrateQuery({
		queryKey: ["templates", 1, PAGE_SIZE, catalogFiltersKey()],
		queryFn: () => fetchTemplates({ page: 1, pageSize: PAGE_SIZE }),
	});

	return (
		<HydrationBoundary state={state}>
			<TemplatesRegistryPage />
		</HydrationBoundary>
	);
}
