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
  oxideVersion: string;
  author: IAuthor;
  repository: IRepository;
  specialization: string;
  scope: string;
  technologies: string[];
  languages: string[];
  official: boolean;
  type: string;
  metadata: IMetadata;
}

export interface ITemplate {
  id: string;
  owner_id: string;
  url: string;
  official: boolean;
  created_at: string;
  updated_at: string;
  config: ITemplateConfig;
  name: string;
}
