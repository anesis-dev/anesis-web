/**
 * Template version utilities.
 *
 * `compareTemplateVersionsDesc` — comparator for descending semver order.
 * Falls back to `localeCompare` for non-semver strings, and then to
 * timestamp comparison when versions are equal.
 *
 * `sortTemplateVersions` — sorts a template array newest-first without
 * mutating the original.
 *
 * `groupTemplatesByName` — groups flat template records into version groups,
 * each containing the `latest` record and the full sorted `versions` array.
 * Useful when the API returns a flat list and the UI needs to show the latest
 * per template name.
 *
 * `getLatestTemplates` — convenience wrapper that returns only the latest
 * version from each group.
 */
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
	a: Pick<ITemplate, "version" | "created_at" | "updated_at">,
	b: Pick<ITemplate, "version" | "created_at" | "updated_at">,
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

	const aTimestamp = a.updated_at ?? a.created_at ?? "";
	const bTimestamp = b.updated_at ?? b.created_at ?? "";

	return bTimestamp.localeCompare(aTimestamp);
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
