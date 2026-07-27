
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
	version: string;
	author: { name: string; github: string };
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
	version: string;
	versionCount?: number;
	created_at: string;
	updated_at: string;
	download_count?: number;
	unique_downloaders?: number;
	star_count?: number;
	is_starred?: boolean;
	visibility?: string;
}
