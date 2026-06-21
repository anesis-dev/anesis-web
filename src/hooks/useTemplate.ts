import { useQuery } from "@tanstack/react-query";
import { fetchTemplate } from "@/services/template";
import { ITemplate } from "@/types/template";

export function useTemplate(templateRef: string) {
	const {
		data: template,
		isLoading,
		isError,
	} = useQuery<ITemplate>({
		queryKey: ["template", templateRef],
		queryFn: () => fetchTemplate(templateRef),
		enabled: !!templateRef,
	});

	return { template, isLoading, isError };
}
