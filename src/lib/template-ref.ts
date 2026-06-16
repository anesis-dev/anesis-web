/**
 * Template reference / URL helpers.
 *
 * A "template ref" is the canonical identifier used in API paths and
 * displayed in the URL: `"<name>@<version>"` (e.g. `"react-ts@1.0.0"`).
 *
 * `getTemplateHref` builds the exact-version URL (`/templates/react-ts@1.0.0`).
 * `getTemplateLatestHref` builds the name-only URL (`/templates/react-ts`)
 *   which the server resolves to the latest published version.
 */
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
