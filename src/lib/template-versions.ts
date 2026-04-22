import { ITemplate } from "@/types/template";

export interface TemplateVersionGroup {
	name: string;
	latest: ITemplate;
	versions: ITemplate[];
}

function parseSemver(version: string): [number, number, number] | null {
	const match = version.trim().match(/^(\d+)\.(\d+)\.(\d+)$/);
	if (!match) return null;

	return [Number(match[1]), Number(match[2]), Number(match[3])];
}

export function compareTemplateVersionsDesc(
	a: Pick<ITemplate, "version" | "updated_at">,
	b: Pick<ITemplate, "version" | "updated_at">,
): number {
	const aParts = parseSemver(a.version);
	const bParts = parseSemver(b.version);

	if (aParts && bParts) {
		for (let i = 0; i < 3; i += 1) {
			if (aParts[i] !== bParts[i]) {
				return bParts[i] - aParts[i];
			}
		}
	} else if (a.version !== b.version) {
		return b.version.localeCompare(a.version, undefined, { numeric: true });
	}

	return b.updated_at.localeCompare(a.updated_at);
}

export function sortTemplateVersions(templates: ITemplate[]): ITemplate[] {
	return [...templates].sort(compareTemplateVersionsDesc);
}

export function groupTemplatesByName(
	templates: ITemplate[],
): TemplateVersionGroup[] {
	const groups = new Map<string, ITemplate[]>();

	for (const template of templates) {
		const name = template.name || template.config.name;
		groups.set(name, [...(groups.get(name) ?? []), template]);
	}

	return Array.from(groups.entries()).map(([name, versions]) => {
		const sortedVersions = sortTemplateVersions(versions);
		return {
			name,
			latest: sortedVersions[0],
			versions: sortedVersions,
		};
	});
}

export function getLatestTemplates(templates: ITemplate[]): ITemplate[] {
	return groupTemplatesByName(templates).map((group) => group.latest);
}

export function getTemplateVersionGroup(
	templates: ITemplate[],
	name: string,
): TemplateVersionGroup | undefined {
	return groupTemplatesByName(templates).find((group) => group.name === name);
}
