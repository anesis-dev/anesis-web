import { useQuery } from "@tanstack/react-query";
import { fetchTemplateAccess } from "@/services/access-control";
import { ITemplateAccess } from "@/types/access-control";

export function useTemplateAccess(templateId: string | null) {
	const { data: accessList = [], isLoading, isError } = useQuery<ITemplateAccess[]>({
		queryKey: ["template-access", templateId],
		queryFn: () => fetchTemplateAccess(templateId!),
		enabled: templateId !== null,
	});

	return { accessList, isLoading, isError };
}
