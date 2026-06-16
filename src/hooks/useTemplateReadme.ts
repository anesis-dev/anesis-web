/**
 * Hook — fetches the README content for a template from GitHub via the
 * Next.js proxy route `/api/template-readme`.
 *
 * Cache key: ["template-readme", templateUrl]
 *
 * `templateUrl` is the GitHub tree URL stored on the template record.
 * The query is disabled when `templateUrl` is undefined/empty.
 */
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
