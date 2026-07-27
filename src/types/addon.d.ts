
export interface IAddonConfig {
	schema_version: string;
	id: string;
	name: string;
	version: string;
	description: string;
	/**
	 * Object form from 1.0 onwards, matching templates and stacks. The bare
	 * string is still produced by addons published before that; use
	 * `authorName`/`authorLogin` from `@/lib/author` rather than reading it raw.
	 */
	author: string | { name: string; github: string };
}

export interface IAddon {
	id: string;
	owner_id: string;
	url: string;
	addon_id: string;
	name: string;
	version: string;
	commit_sha: string;
	official: boolean;
	config: IAddonConfig;
	created_at: string;
	updated_at: string;
	download_count?: number;
	unique_downloaders?: number;
	star_count?: number;
	is_starred?: boolean;
	visibility?: string;
}

export interface IStarResponse {
	is_starred: boolean;
	star_count: number;
}

export interface IAddonUrlResponse {
	archive_url: string;
	commit_sha: string;
}
