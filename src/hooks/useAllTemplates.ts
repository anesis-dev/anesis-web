import { useQuery } from "@tanstack/react-query";
import { fetchAllTemplates } from "@/services/template";
import { ITemplate } from "@/types/template";

type EnabledQueryOptions = {
	enabled?: boolean;
};

export function useAllTemplates(options: EnabledQueryOptions | boolean = {}) {
	const enabled = typeof options === "boolean" ? options : (options.enabled ?? true);
	const {
		data: templates = [],
		isLoading,
		isError,
	} = useQuery<ITemplate[]>({
		queryKey: ["templates", "all-pages"],
		queryFn: () => fetchAllTemplates(),
		enabled,
	});

	return {
		templates,
		isLoading,
		isError,
	};
}
