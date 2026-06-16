/**
 * Template domain types.
 *
 * `ITemplate` — full template registry row including embedded config, stats,
 * and star state.
 * `ITemplateConfig` — the `anesis.template.json` payload stored in the DB,
 * describing the template's author, repo, metadata, and target technologies.
 * `ITemplateUrlResponse` — returned by `GET /template/:ref/url`, used by the
 * CLI to download the template archive.
 */
export interface IAuthor {
  name: string;
  github: string;
}

export interface IRepository {
  type: string;
  url: string;
  release: string;
}

export interface IMetadata {
  displayName: string;
  description: string;
  tags: string[];
}

export interface ITemplateConfig {
  $schema: string;
  name: string;
  version: string;
  anesisVersion: string;
  author: IAuthor;
  repository: IRepository;
  specialization: string;
  scope: string;
  technologies: string[];
  languages: string[];
  type: string;
  metadata: IMetadata;
}

export interface ITemplate {
  id: string;
  owner_id: string;
  organization_id?: string | null;
  url: string;
  official: boolean;
  commit_sha?: string;
  version: string;
  created_at: string;
  updated_at?: string;
  config: ITemplateConfig;
  name: string;
  versionCount?: number;
  download_count?: number;
  unique_downloaders?: number;
  use_count?: number;
  star_count?: number;
  is_starred?: boolean;
  visibility?: string;
}

export interface ITemplateUrlResponse {
  archive_url: string;
  commit_sha: string;
  subdir?: string;
}
