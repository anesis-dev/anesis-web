import { ITemplate } from "@/types/template";

export function getTemplateRef(template: Pick<ITemplate, "name" | "version">): string {
	return `${template.name}@${template.version}`;
}

export function getTemplateHref(template: Pick<ITemplate, "name" | "version">): string {
	const [owner, repo] = template.name.split("/");

	if (!owner || !repo) {
		return "/templates";
	}

	return `/templates/${owner}/${repo}@${template.version}`;
}
