import { ITemplate } from "@/types/template";

export function getTemplateRef(template: Pick<ITemplate, "name" | "version">): string {
	return `${template.name}@${template.version}`;
}

export function getTemplateHref(template: Pick<ITemplate, "name" | "version">): string {
	const name = template.name.trim();
	const version = template.version.trim();

	if (!name || !version) {
		return "/templates";
	}

	return `/templates/${encodeURIComponent(getTemplateRef({ name, version }))}`;
}

export function getTemplateLatestHref(name: string): string {
	const normalizedName = name.trim();

	if (!normalizedName) {
		return "/templates";
	}

	return `/templates/${encodeURIComponent(normalizedName)}`;
}
