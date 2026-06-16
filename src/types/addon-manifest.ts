/**
 * Addon manifest types (`anesis.addon.json`).
 *
 * Represents the full schema for a published addon's manifest file. Used by
 * the `/api/addon-manifest` route handler and the addon detail page to display
 * commands, inputs, detect rules, and variants.
 *
 * `LocalAddonCatalogEntry` extends the manifest with pre-computed index fields
 * used internally by the CLI's local addon catalog.
 */
export type AddonInputType = "text" | "boolean" | "select";

export interface AddonManifestInput {
	name: string;
	type: AddonInputType;
	description: string;
	default?: string;
	required: boolean;
	options: string[];
}

export type AddonDetectRuleType =
	| "file_exists"
	| "file_contains"
	| "json_contains"
	| "toml_contains"
	| "yaml_contains";

export interface AddonManifestDetectRule {
	type: AddonDetectRuleType;
	file: string;
	contains?: string;
	key_path?: string;
	value?: string;
	negate: boolean;
}

export interface AddonManifestDetectBlock {
	id: string;
	match: "any" | "all";
	rules: AddonManifestDetectRule[];
}

export interface AddonManifestStep {
	type: string;
}

export interface AddonManifestCommand {
	name: string;
	description: string;
	once: boolean;
	requires_commands: string[];
	inputs: AddonManifestInput[];
	steps: AddonManifestStep[];
}

export interface AddonManifestVariant {
	when: string | null;
	commands: AddonManifestCommand[];
}

export interface AddonManifest {
	$schema?: string;
	schema_version: string;
	id: string;
	name: string;
	version: string;
	description: string;
	author: string;
	requires: string[];
	inputs: AddonManifestInput[];
	detect: AddonManifestDetectBlock[];
	variants: AddonManifestVariant[];
}

export interface LocalAddonCatalogEntry extends AddonManifest {
	manifestPath: string;
	rawManifest: string;
	commandNames: string[];
	stepTypes: string[];
	inputNames: string[];
}
