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
