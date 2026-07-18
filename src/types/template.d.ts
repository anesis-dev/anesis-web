
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
