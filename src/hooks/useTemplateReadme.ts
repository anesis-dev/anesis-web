import { useQuery } from "@tanstack/react-query";
import { fetchTemplateReadme, TemplateReadmePayload } from "@/services/github";

export function useTemplateReadme(templateUrl?: string) {
	const {
		data,
		isLoading,
		isError,
		error,
	} = useQuery<TemplateReadmePayload>({
		queryKey: ["template-readme", templateUrl],
		queryFn: () => fetchTemplateReadme(templateUrl as string),
		enabled: !!templateUrl,
	});

	return {
		readme: data?.content ?? null,
		fileName: data?.fileName,
		path: data?.path,
		isLoading,
		isError,
		error,
	};
}
