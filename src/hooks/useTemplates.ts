import { useQuery } from "@tanstack/react-query";
import { fetchTemplates } from "@/services/template";
import { ITemplate } from "@/types/template";

export function useTemplates() {
	const { data: templates = [], isLoading, isError } = useQuery<ITemplate[]>({
		queryKey: ["templates"],
		queryFn: fetchTemplates,
	});

	return { templates, isLoading, isError };
}
