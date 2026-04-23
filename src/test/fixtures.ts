import { IAddon } from "@/types/addon";
import { IGitHubUser } from "@/types/github";
import { ITemplate } from "@/types/template";
import { IUser } from "@/types/user";

export const mockTemplate: ITemplate = {
	id: "11111111-1111-1111-1111-111111111111",
	owner_id: "22222222-2222-2222-2222-222222222222",
	url: "https://github.com/demo-owner/demo-repo/tree/main/template",
	official: true,
	commit_sha: "abcdef1234567890abcdef1234567890abcdef12",
	version: "0.1.0",
	created_at: "2026-04-01T10:00:00Z",
	updated_at: "2026-04-03T10:00:00Z",
	config: {
		$schema: "http://localhost:4000/schema/oxide.template.schema.json",
		name: "demo-repo",
		version: "0.1.0",
		oxideVersion: ">=0.2.0",
		author: {
			name: "Demo Owner",
			github: "octocat",
		},
		repository: {
			type: "github",
			url: "https://github.com/demo-owner/demo-repo/tree/main/template",
			release: "v0.1.0",
		},
		specialization: "frontend",
		scope: "web",
		technologies: ["react", "nextjs"],
		languages: ["typescript"],
		type: "base",
		metadata: {
			displayName: "Demo Next Template",
			description: "Template used for UI verification.",
			tags: ["demo", "next", "responsive"],
		},
	},
	name: "demo-repo",
};

export const mockUser: IUser = {
	id: "22222222-2222-2222-2222-222222222222",
	login: "octocat",
	github_id: 583231,
	avatar_url: "https://avatars.githubusercontent.com/u/583231?v=4",
	role: "admin",
	created_at: "2026-03-20T08:30:00Z",
};

export const mockAddon: IAddon = {
	id: "33333333-3333-3333-3333-333333333333",
	owner_id: "22222222-2222-2222-2222-222222222222",
	url: "https://github.com/oxide-addons/drizzle/tree/main",
	addon_id: "drizzle",
	name: "Drizzle ORM",
	version: "1.0.0",
	commit_sha: "fedcba0987654321fedcba0987654321fedcba09",
	official: false,
	config: {
		schema_version: "1.0",
		id: "drizzle",
		name: "Drizzle ORM",
		version: "1.0.0",
		description: "Adds Drizzle ORM scaffolding helpers.",
		author: "oxide-addons",
	},
	created_at: "2026-04-05T10:00:00Z",
	updated_at: "2026-04-06T10:00:00Z",
};

export const mockGitHubUser: IGitHubUser = {
	login: "octocat",
	id: 583231,
	avatar_url: "https://avatars.githubusercontent.com/u/583231?v=4",
	html_url: "https://github.com/octocat",
	name: "The Octocat",
	bio: "GitHub mascot used for local smoke testing.",
	public_repos: 8,
	followers: 100,
	following: 0,
	created_at: "2011-01-25T18:44:36Z",
};

type TemplateOverrides = Partial<ITemplate> & {
	config?: Partial<ITemplate["config"]> & {
		author?: Partial<ITemplate["config"]["author"]>;
		repository?: Partial<ITemplate["config"]["repository"]>;
		metadata?: Partial<ITemplate["config"]["metadata"]>;
	};
};

type AddonOverrides = Partial<IAddon> & {
	config?: Partial<IAddon["config"]>;
};

export function createTemplate(overrides: TemplateOverrides = {}): ITemplate {
	const name = overrides.name ?? overrides.config?.name ?? mockTemplate.name;
	const version =
		overrides.version ?? overrides.config?.version ?? mockTemplate.version;
	const official = overrides.official ?? mockTemplate.official;
	const repositoryUrl =
		overrides.url ??
		overrides.config?.repository?.url ??
		mockTemplate.config.repository.url;

	return {
		...mockTemplate,
		...overrides,
		name,
		version,
		official,
		url: repositoryUrl,
		config: {
			...mockTemplate.config,
			...overrides.config,
			name,
			version,
			author: {
				...mockTemplate.config.author,
				...overrides.config?.author,
			},
			repository: {
				...mockTemplate.config.repository,
				...overrides.config?.repository,
				url: repositoryUrl,
			},
			metadata: {
				...mockTemplate.config.metadata,
				...overrides.config?.metadata,
			},
			technologies:
				overrides.config?.technologies ?? mockTemplate.config.technologies,
			languages: overrides.config?.languages ?? mockTemplate.config.languages,
		},
	};
}

export function createAddon(overrides: AddonOverrides = {}): IAddon {
	const addonId =
		overrides.addon_id ?? overrides.config?.id ?? mockAddon.addon_id;
	const name = overrides.name ?? overrides.config?.name ?? mockAddon.name;
	const version =
		overrides.version ?? overrides.config?.version ?? mockAddon.version;

	return {
		...mockAddon,
		...overrides,
		addon_id: addonId,
		name,
		version,
		config: {
			...mockAddon.config,
			...overrides.config,
			id: addonId,
			name,
			version,
		},
	};
}

export function createUser(overrides: Partial<IUser> = {}): IUser {
	return {
		...mockUser,
		...overrides,
	};
}

export function createGitHubUser(
	overrides: Partial<IGitHubUser> = {},
): IGitHubUser {
	return {
		...mockGitHubUser,
		...overrides,
	};
}
