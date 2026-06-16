/**
 * Addon domain types.
 *
 * `IAddonConfig` — the embedded `anesis.addon.json` config stored in the DB.
 * `IAddon` — full addon registry row including stats and star state.
 * `IStarResponse` — returned by the star/unstar mutation endpoints.
 * `IAddonUrlResponse` — returned by `GET /addon/:ref/url`, used by the CLI.
 */
export interface IAddonConfig {
	schema_version: string;
	id: string;
	name: string;
	version: string;
	description: string;
	author: string;
}

export interface IAddon {
	id: string;
	owner_id: string;
	organization_id?: string;
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
