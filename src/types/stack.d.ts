/**
 * Stack domain types.
 *
 * A stack = a template plus an ordered list of addons (with pinned inputs).
 * `IStackConfig` is the embedded `anesis.stack.json` manifest stored in the DB.
 */
export interface IStackAddonRef {
	id: string;
	command: string;
	inputs?: Record<string, string>;
}

export interface IStackConfig {
	schema_version: string;
	id: string;
	name: string;
	description: string;
	template: string;
	addons: IStackAddonRef[];
}

export interface IStack {
	id: string;
	owner_id: string;
	url: string;
	stack_id: string;
	name: string;
	description: string;
	commit_sha: string;
	official: boolean;
	config: IStackConfig;
	created_at: string;
	updated_at: string;
	download_count?: number;
	unique_downloaders?: number;
	star_count?: number;
	is_starred?: boolean;
	visibility?: string;
}
