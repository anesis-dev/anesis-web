/**
 * Hook — fetches all published versions of a template by name.
 *
 * Endpoint: GET /template/:name/versions
 * Cache key: ["template-versions", templateName]
 *
 * Versions are sorted via `sortTemplateVersions` (descending semver) using
 * the TanStack Query `select` option so the raw API response is never
 * stored unsorted in the cache.
 */
import { useQuery } from "@tanstack/react-query";
import { sortTemplateVersions } from "@/lib/template-versions";
import { fetchTemplateVersions } from "@/services/template";
import { ITemplate } from "@/types/template";

export function useTemplateVersions(templateName: string) {
	const {
		data: versions = [],
		isLoading,
		isError,
	} = useQuery<ITemplate[]>({
		queryKey: ["template-versions", templateName],
		queryFn: () => fetchTemplateVersions(templateName),
		enabled: !!templateName,
		select: sortTemplateVersions,
	});

	return { versions, isLoading, isError };
}
