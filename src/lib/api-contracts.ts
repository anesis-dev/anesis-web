import { IAddon, IAddonConfig, IAddonUrlResponse } from "@/types/addon";
import { IGitHubUser } from "@/types/github";
import { ITemplate, ITemplateConfig } from "@/types/template";
import { IUser } from "@/types/user";

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null;
}

function expectRecord(value: unknown, path: string): Record<string, unknown> {
	if (!isRecord(value)) {
		throw new Error(`Invalid API response: ${path} must be an object.`);
	}

	return value;
}

function expectString(value: unknown, path: string): string {
	if (typeof value !== "string") {
		throw new Error(`Invalid API response: ${path} must be a string.`);
	}

	return value;
}

function expectNumber(value: unknown, path: string): number {
	if (typeof value !== "number" || Number.isNaN(value)) {
		throw new Error(`Invalid API response: ${path} must be a number.`);
	}

	return value;
}

function expectBoolean(value: unknown, path: string): boolean {
	if (typeof value !== "boolean") {
		throw new Error(`Invalid API response: ${path} must be a boolean.`);
	}

	return value;
}

function expectStringArray(value: unknown, path: string): string[] {
	if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
		throw new Error(`Invalid API response: ${path} must be a string array.`);
	}

	return value;
}

function expectOptionalString(value: unknown, path: string): string | undefined {
	if (value === undefined || value === null) {
		return undefined;
	}

	return expectString(value, path);
}

function parseUser(value: unknown, path: string): IUser {
	const user = expectRecord(value, path);
	const role = expectString(user.role, `${path}.role`);

	if (role !== "admin" && role !== "user") {
		throw new Error(`Invalid API response: ${path}.role must be "admin" or "user".`);
	}

	return {
		id: expectString(user.id, `${path}.id`),
		login: expectString(user.login, `${path}.login`),
		github_id: expectNumber(user.github_id, `${path}.github_id`),
		avatar_url: expectString(user.avatar_url, `${path}.avatar_url`),
		role,
		created_at: expectOptionalString(user.created_at, `${path}.created_at`),
	};
}

function parseAddonConfig(value: unknown, path: string): IAddonConfig {
	const config = expectRecord(value, path);

	return {
		schema_version: expectString(
			config.schema_version,
			`${path}.schema_version`,
		),
		id: expectString(config.id, `${path}.id`),
		name: expectString(config.name, `${path}.name`),
		version: expectString(config.version, `${path}.version`),
		description: expectString(config.description, `${path}.description`),
		author: expectString(config.author, `${path}.author`),
	};
}

function parseTemplateConfig(value: unknown, path: string): ITemplateConfig {
	const config = expectRecord(value, path);
	const author = expectRecord(config.author, `${path}.author`);
	const repository = expectRecord(config.repository, `${path}.repository`);
	const metadata = expectRecord(config.metadata, `${path}.metadata`);

	return {
		$schema: expectString(config.$schema, `${path}.$schema`),
		name: expectString(config.name, `${path}.name`),
		version: expectString(config.version, `${path}.version`),
		oxideVersion: expectString(config.oxideVersion, `${path}.oxideVersion`),
		author: {
			name: expectString(author.name, `${path}.author.name`),
			github: expectString(author.github, `${path}.author.github`),
		},
		repository: {
			type: expectString(repository.type, `${path}.repository.type`),
			url: expectString(repository.url, `${path}.repository.url`),
			release: expectString(repository.release, `${path}.repository.release`),
		},
		specialization: expectString(config.specialization, `${path}.specialization`),
		scope: expectString(config.scope, `${path}.scope`),
		technologies: expectStringArray(
			config.technologies,
			`${path}.technologies`,
		),
		languages: expectStringArray(config.languages, `${path}.languages`),
		official: expectBoolean(config.official, `${path}.official`),
		type: expectString(config.type, `${path}.type`),
		metadata: {
			displayName: expectString(metadata.displayName, `${path}.metadata.displayName`),
			description: expectString(metadata.description, `${path}.metadata.description`),
			tags: expectStringArray(metadata.tags, `${path}.metadata.tags`),
		},
	};
}

function parseTemplate(value: unknown, path: string): ITemplate {
	const template = expectRecord(value, path);

	return {
		id: expectString(template.id, `${path}.id`),
		owner_id: expectString(template.owner_id, `${path}.owner_id`),
		url: expectString(template.url, `${path}.url`),
		official: expectBoolean(template.official, `${path}.official`),
		commit_sha: expectString(template.commit_sha, `${path}.commit_sha`),
		version: expectString(template.version, `${path}.version`),
		created_at: expectString(template.created_at, `${path}.created_at`),
		updated_at: expectString(template.updated_at, `${path}.updated_at`),
		config: parseTemplateConfig(template.config, `${path}.config`),
		name: expectString(template.name, `${path}.name`),
	};
}

function parseAddon(value: unknown, path: string): IAddon {
	const addon = expectRecord(value, path);

	return {
		id: expectString(addon.id, `${path}.id`),
		owner_id: expectString(addon.owner_id, `${path}.owner_id`),
		url: expectString(addon.url, `${path}.url`),
		addon_id: expectString(addon.addon_id, `${path}.addon_id`),
		name: expectString(addon.name, `${path}.name`),
		version: expectString(addon.version, `${path}.version`),
		commit_sha: expectString(addon.commit_sha, `${path}.commit_sha`),
		official: expectBoolean(addon.official, `${path}.official`),
		config: parseAddonConfig(addon.config, `${path}.config`),
		created_at: expectString(addon.created_at, `${path}.created_at`),
		updated_at: expectString(addon.updated_at, `${path}.updated_at`),
	};
}

export function parseMeResponse(value: unknown): IUser {
	return parseUser(value, "user");
}

export function parseUsersResponse(value: unknown): IUser[] {
	if (!Array.isArray(value)) {
		throw new Error("Invalid API response: users payload must be an array.");
	}

	return value.map((user, index) => parseUser(user, `users[${index}]`));
}

export function parseTemplatesResponse(value: unknown): ITemplate[] {
	if (!Array.isArray(value)) {
		throw new Error("Invalid API response: templates payload must be an array.");
	}

	return value.map((template, index) =>
		parseTemplate(template, `templates[${index}]`),
	);
}

export function parseTemplateResponse(value: unknown): ITemplate {
	return parseTemplate(value, "template");
}

export function parseAddonsResponse(value: unknown): IAddon[] {
	if (!Array.isArray(value)) {
		throw new Error("Invalid API response: addons payload must be an array.");
	}

	return value.map((addon, index) => parseAddon(addon, `addons[${index}]`));
}

export function parsePublishTemplateResponse(
	value: unknown,
): { message: string; name: string } {
	const payload = expectRecord(value, "publishTemplate");

	return {
		message: expectString(payload.message, "publishTemplate.message"),
		name: expectString(payload.name, "publishTemplate.name"),
	};
}

export function parsePublishAddonResponse(
	value: unknown,
): { message: string; addon_id: string } {
	const payload = expectRecord(value, "publishAddon");

	return {
		message: expectString(payload.message, "publishAddon.message"),
		addon_id: expectString(payload.addon_id, "publishAddon.addon_id"),
	};
}

export function parseTemplateUrlResponse(value: unknown): { url: string } {
	const payload = expectRecord(value, "templateUrl");

	return {
		url: expectString(payload.url, "templateUrl.url"),
	};
}

export function parseAddonUrlResponse(value: unknown): IAddonUrlResponse {
	const payload = expectRecord(value, "addonUrl");

	return {
		archive_url: expectString(payload.archive_url, "addonUrl.archive_url"),
		commit_sha: expectString(payload.commit_sha, "addonUrl.commit_sha"),
	};
}

export function parseGitHubUserResponse(value: unknown): IGitHubUser {
	const user = expectRecord(value, "githubUser");

	return {
		login: expectString(user.login, "githubUser.login"),
		id: expectNumber(user.id, "githubUser.id"),
		avatar_url: expectString(user.avatar_url, "githubUser.avatar_url"),
		html_url: expectString(user.html_url, "githubUser.html_url"),
		name:
			user.name === null ? null : expectString(user.name, "githubUser.name"),
		bio: user.bio === null ? null : expectString(user.bio, "githubUser.bio"),
		public_repos: expectNumber(user.public_repos, "githubUser.public_repos"),
		followers: expectNumber(user.followers, "githubUser.followers"),
		following: expectNumber(user.following, "githubUser.following"),
		created_at: expectString(user.created_at, "githubUser.created_at"),
	};
}
