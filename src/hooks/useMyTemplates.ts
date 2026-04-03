import { useQuery } from "@tanstack/react-query";
import { fetchMyTemplates } from "@/services/template";
import { ITemplate } from "@/types/template";

export function useMyTemplates(enabled = true) {
	const {
		data: templates = [],
		isLoading,
		isError,
	} = useQuery<ITemplate[]>({
		queryKey: ["my-templates"],
		queryFn: fetchMyTemplates,
		enabled,
	});

	return { templates, isLoading, isError };
}
