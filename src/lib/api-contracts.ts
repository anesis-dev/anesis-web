import {
    IAddon,
    IAddonConfig,
    IAddonUrlResponse,
    IStarResponse,
} from "@/types/addon";
import { IGitHubUser } from "@/types/github";
import { IPaginatedResponse } from "@/types/pagination";
import {
    ITemplate,
    ITemplateConfig,
    ITemplateUrlResponse,
} from "@/types/template";
import { IPublicUser, IUser } from "@/types/user";
import { IStack, IStackAddonRef, IStackConfig } from "@/types/stack";

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
    if (
        !Array.isArray(value) ||
        value.some((item) => typeof item !== "string")
    ) {
        throw new Error(
            `Invalid API response: ${path} must be a string array.`,
        );
    }

    return value;
}

function optionalStringArray(value: unknown, path: string): string[] {
    if (value === undefined || value === null) {
        return [];
    }

    return expectStringArray(value, path);
}

function expectStringFromKeys(
    record: Record<string, unknown>,
    keys: string[],
    path: string,
): string {
    for (const key of keys) {
        const value = record[key];
        if (value !== undefined && value !== null) {
            return expectString(value, `${path}.${key}`);
        }
    }

    throw new Error(
        `Invalid API response: ${path} must include one of ${keys
            .map((key) => `"${key}"`)
            .join(", ")}.`,
    );
}

function expectOptionalString(
    value: unknown,
    path: string,
): string | undefined {
    if (value === undefined || value === null) {
        return undefined;
    }

    return expectString(value, path);
}

function optionalNumber(value: unknown, path: string): number {
    if (value === undefined || value === null) return 0;
    return expectNumber(value, path);
}

function optionalBoolean(value: unknown): boolean | undefined {
    if (value === undefined || value === null) return undefined;
    if (typeof value !== "boolean") return undefined;
    return value;
}

function parseUser(value: unknown, path: string): IUser {
    const user = expectRecord(value, path);
    const role = expectString(user.role, `${path}.role`);

    if (role !== "admin" && role !== "user") {
        throw new Error(
            `Invalid API response: ${path}.role must be "admin" or "user".`,
        );
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

function parseAddonConfigAuthor(
    value: unknown,
    path: string,
): IAddonConfig["author"] {
    if (typeof value === "string") return value;

    const author = expectRecord(value, path);

    return {
        name: expectString(author.name, `${path}.name`),
        github: expectString(author.github, `${path}.github`),
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
        author: parseAddonConfigAuthor(config.author, `${path}.author`),
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
        anesisVersion: expectString(
            config.anesisVersion,
            `${path}.anesisVersion`,
        ),
        author: {
            name: expectString(author.name, `${path}.author.name`),
            github: expectString(author.github, `${path}.author.github`),
        },
        repository: {
            type: expectString(repository.type, `${path}.repository.type`),
            url: expectString(repository.url, `${path}.repository.url`),
            release: expectString(
                repository.release,
                `${path}.repository.release`,
            ),
        },
        specialization: expectString(
            config.specialization,
            `${path}.specialization`,
        ),
        scope: expectString(config.scope, `${path}.scope`),
        technologies: expectStringArray(
            config.technologies,
            `${path}.technologies`,
        ),
        languages: expectStringArray(config.languages, `${path}.languages`),
        type: expectString(config.type, `${path}.type`),
        metadata: {
            displayName: expectString(
                metadata.displayName,
                `${path}.metadata.displayName`,
            ),
            description: expectString(
                metadata.description,
                `${path}.metadata.description`,
            ),
            tags: optionalStringArray(metadata.tags, `${path}.metadata.tags`),
        },
    };
}

function parseLegacyTemplate(value: unknown, path: string): ITemplate {
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
        download_count: optionalNumber(
            template.download_count,
            `${path}.download_count`,
        ),
        unique_downloaders: optionalNumber(
            template.unique_downloaders,
            `${path}.unique_downloaders`,
        ),
        use_count: optionalNumber(template.use_count, `${path}.use_count`),
        star_count: optionalNumber(template.star_count, `${path}.star_count`),
        is_starred: optionalBoolean(template.is_starred),
        visibility: expectOptionalString(
            template.visibility,
            `${path}.visibility`,
        ),
    };
}

type ParsedTemplateInfo = {
    repoUrl: string;
    author: ITemplateConfig["author"];
    specialization: string;
    scope: string;
    technologies: string[];
    languages: string[];
    type: string;
    displayName: string;
    description: string;
    tags: string[];
};

function parseTemplateInfo(value: unknown, path: string): ParsedTemplateInfo {
    const info = expectRecord(value, path);
    const author = expectRecord(info.author, `${path}.author`);

    return {
        repoUrl: expectStringFromKeys(info, ["repo_url", "repoUrl"], path),
        author: {
            name: expectString(author.name, `${path}.author.name`),
            github: expectString(author.github, `${path}.author.github`),
        },
        specialization: expectString(
            info.specialization,
            `${path}.specialization`,
        ),
        scope: expectString(info.scope, `${path}.scope`),
        technologies: expectStringArray(
            info.technologies,
            `${path}.technologies`,
        ),
        languages: expectStringArray(info.languages, `${path}.languages`),
        type: expectStringFromKeys(info, ["type", "template_type"], path),
        displayName: expectStringFromKeys(
            info,
            ["displayName", "display_name"],
            path,
        ),
        description: expectString(info.description, `${path}.description`),
        tags: optionalStringArray(info.tags, `${path}.tags`),
    };
}

function buildTemplateConfig(
    name: string,
    version: string,
    info: ParsedTemplateInfo,
): ITemplateConfig {
    return {
        $schema: "",
        name,
        version,
        anesisVersion: "",
        author: info.author,
        repository: {
            type: "github",
            url: info.repoUrl,
            release: "",
        },
        specialization: info.specialization,
        scope: info.scope,
        technologies: info.technologies,
        languages: info.languages,
        type: info.type,
        metadata: {
            displayName: info.displayName,
            description: info.description,
            tags: info.tags,
        },
    };
}

function buildTemplateId(name: string, version: string): string {
    return `${name}@${version}`;
}

function parseCurrentTemplate(value: unknown, path: string): ITemplate {
    const template = expectRecord(value, path);
    const name = expectString(template.name, `${path}.name`);
    const version = expectStringFromKeys(
        template,
        ["version", "verison"],
        path,
    );
    const info = parseTemplateInfo(template.info, `${path}.info`);
    const createdAt = expectString(template.created_at, `${path}.created_at`);
    const id =
        template.id === undefined || template.id === null
            ? buildTemplateId(name, version)
            : expectString(template.id, `${path}.id`);

    return {
        id,
        owner_id: expectString(template.owner_id, `${path}.owner_id`),
        url: info.repoUrl,
        official: expectBoolean(template.official, `${path}.official`),
        commit_sha: "",
        version,
        created_at: createdAt,
        updated_at:
            expectOptionalString(template.updated_at, `${path}.updated_at`) ??
            createdAt,
        config: buildTemplateConfig(name, version, info),
        name,
        download_count: optionalNumber(
            template.download_count,
            `${path}.download_count`,
        ),
        unique_downloaders: optionalNumber(
            template.unique_downloaders,
            `${path}.unique_downloaders`,
        ),
        use_count: optionalNumber(template.use_count, `${path}.use_count`),
        star_count: optionalNumber(template.star_count, `${path}.star_count`),
        is_starred: optionalBoolean(template.is_starred),
        visibility: expectOptionalString(
            template.visibility,
            `${path}.visibility`,
        ),
    };
}

function parseTemplate(value: unknown, path: string): ITemplate {
    const template = expectRecord(value, path);

    if ("config" in template) {
        return parseLegacyTemplate(template, path);
    }

    if ("info" in template) {
        return parseCurrentTemplate(template, path);
    }

    throw new Error(
        `Invalid API response: ${path} must contain either legacy template fields or the current template info payload.`,
    );
}

function parseLatestTemplateGroup(value: unknown, path: string): ITemplate {
    const group = expectRecord(value, path);
    const latest = parseTemplate(group.latest, `${path}.latest`);
    const name = expectString(group.name, `${path}.name`);
    const versionCount = expectNumber(
        group.versionCount,
        `${path}.versionCount`,
    );

    return {
        ...latest,
        name,
        config: {
            ...latest.config,
            name,
            version: latest.version,
        },
        versionCount,
        download_count: optionalNumber(
            group.download_count,
            `${path}.download_count`,
        ),
        unique_downloaders: optionalNumber(
            group.unique_downloaders,
            `${path}.unique_downloaders`,
        ),
        use_count: optionalNumber(group.use_count, `${path}.use_count`),
        star_count: optionalNumber(group.star_count, `${path}.star_count`),
    };
}

function parseTemplateVersionsGroup(
    value: unknown,
    path: string,
    expectedTemplateName: string,
): ITemplate[] {
    const group = expectRecord(value, path);
    const name = expectString(group.name, `${path}.name`);
    const normalizedExpectedName = expectedTemplateName.trim().toLowerCase();

    if (name.toLowerCase() !== normalizedExpectedName) {
        return [];
    }

    const versionCount = expectNumber(
        group.versionCount,
        `${path}.versionCount`,
    );
    const versions = group.versions;

    if (!Array.isArray(versions)) {
        throw new Error(
            `Invalid API response: ${path}.versions must be an array.`,
        );
    }

    return versions.map((template, index) => ({
        ...parseTemplate(template, `${path}.versions[${index}]`),
        versionCount,
    }));
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
        download_count: optionalNumber(
            addon.download_count,
            `${path}.download_count`,
        ),
        unique_downloaders: optionalNumber(
            addon.unique_downloaders,
            `${path}.unique_downloaders`,
        ),
        star_count: optionalNumber(addon.star_count, `${path}.star_count`),
        is_starred: optionalBoolean(addon.is_starred),
        visibility: expectOptionalString(
            addon.visibility,
            `${path}.visibility`,
        ),
    };
}

function parseStackAuthor(
    value: unknown,
    path: string,
): IStackConfig["author"] {
    const author = expectRecord(value, path);

    return {
        name: expectString(author.name, `${path}.name`),
        github: expectString(author.github, `${path}.github`),
    };
}

function parseStackAddonRef(value: unknown, path: string): IStackAddonRef {
    const ref = expectRecord(value, path);
    const inputs = ref.inputs;

    return {
        id: expectString(ref.id, `${path}.id`),
        command: expectString(ref.command, `${path}.command`),
        inputs: isRecord(inputs)
            ? (inputs as Record<string, string>)
            : undefined,
    };
}

function parseStackConfig(value: unknown, path: string): IStackConfig {
    const config = expectRecord(value, path);
    const addons = config.addons;

    if (!Array.isArray(addons)) {
        throw new Error(
            `Invalid API response: ${path}.addons must be an array.`,
        );
    }

    return {
        schema_version: expectString(
            config.schema_version,
            `${path}.schema_version`,
        ),
        id: expectString(config.id, `${path}.id`),
        name: expectString(config.name, `${path}.name`),
        description: expectString(config.description, `${path}.description`),
        version: expectString(config.version, `${path}.version`),
        author: parseStackAuthor(config.author, `${path}.author`),
        template: expectString(config.template, `${path}.template`),
        addons: addons.map((addon, index) =>
            parseStackAddonRef(addon, `${path}.addons[${index}]`),
        ),
    };
}

function parseStack(value: unknown, path: string): IStack {
    const stack = expectRecord(value, path);

    return {
        id: expectString(stack.id, `${path}.id`),
        owner_id: expectString(stack.owner_id, `${path}.owner_id`),
        url: expectString(stack.url, `${path}.url`),
        stack_id: expectString(stack.stack_id, `${path}.stack_id`),
        name: expectString(stack.name, `${path}.name`),
        description: expectString(stack.description, `${path}.description`),
        commit_sha: expectString(stack.commit_sha, `${path}.commit_sha`),
        official: expectBoolean(stack.official, `${path}.official`),
        config: parseStackConfig(stack.config, `${path}.config`),
        version: expectString(stack.version, `${path}.version`),
        versionCount: optionalNumber(
            stack.versionCount,
            `${path}.versionCount`,
        ),
        created_at: expectString(stack.created_at, `${path}.created_at`),
        updated_at: expectString(stack.updated_at, `${path}.updated_at`),
        download_count: optionalNumber(
            stack.download_count,
            `${path}.download_count`,
        ),
        unique_downloaders: optionalNumber(
            stack.unique_downloaders,
            `${path}.unique_downloaders`,
        ),
        star_count: optionalNumber(stack.star_count, `${path}.star_count`),
        is_starred: optionalBoolean(stack.is_starred),
        visibility: expectOptionalString(
            stack.visibility,
            `${path}.visibility`,
        ),
    };
}

function parsePaginatedResponse<T>(
    value: unknown,
    path: string,
    parseItem: (value: unknown, path: string) => T,
): IPaginatedResponse<T> {
    const payload = expectRecord(value, path);
    const data = payload.data;

    if (!Array.isArray(data)) {
        throw new Error(`Invalid API response: ${path}.data must be an array.`);
    }

    return {
        data: data.map((item, index) =>
            parseItem(item, `${path}.data[${index}]`),
        ),
        total: expectNumber(payload.total, `${path}.total`),
        page: expectNumber(payload.page, `${path}.page`),
        pageSize: expectNumber(payload.page_size, `${path}.page_size`),
        totalPages: expectNumber(payload.total_pages, `${path}.total_pages`),
    };
}

export function parseMeResponse(value: unknown): IUser {
    return parseUser(value, "user");
}

export function parsePublicUserResponse(value: unknown): IPublicUser {
    const user = expectRecord(value, "user");

    return {
        id: expectString(user.id, "user.id"),
        login: expectString(user.login, "user.login"),
        avatar_url: expectString(user.avatar_url, "user.avatar_url"),
        created_at: expectOptionalString(user.created_at, "user.created_at"),
    };
}

export function parseUsersResponse(value: unknown): IUser[] {
    if (!Array.isArray(value)) {
        throw new Error(
            "Invalid API response: users payload must be an array.",
        );
    }

    return value.map((user, index) => parseUser(user, `users[${index}]`));
}

export function parseTemplatesResponse(value: unknown): ITemplate[] {
    if (!Array.isArray(value)) {
        throw new Error(
            "Invalid API response: templates payload must be an array.",
        );
    }

    return value.map((template, index) => {
        if (isRecord(template) && "latest" in template) {
            return parseLatestTemplateGroup(template, `templates[${index}]`);
        }

        return parseTemplate(template, `templates[${index}]`);
    });
}

export function parseTemplatesPageResponse(
    value: unknown,
): IPaginatedResponse<ITemplate> {
    return parsePaginatedResponse(value, "templates", (template, path) => {
        if (isRecord(template) && "latest" in template) {
            return parseLatestTemplateGroup(template, path);
        }

        return parseTemplate(template, path);
    });
}

export function parseTemplateResponse(value: unknown): ITemplate {
    return parseTemplate(value, "template");
}

export function parseTemplateVersionsResponse(
    value: unknown,
    templateName: string,
): ITemplate[] {
    if (Array.isArray(value)) {
        const normalizedName = templateName.trim().toLowerCase();
        const matchedGroup = value.find((group, index) => {
            const record = expectRecord(group, `templateVersions[${index}]`);
            return (
                expectString(
                    record.name,
                    `templateVersions[${index}].name`,
                ).toLowerCase() === normalizedName
            );
        });

        if (!matchedGroup) {
            return [];
        }

        return parseTemplateVersionsGroup(
            matchedGroup,
            "templateVersions[group]",
            templateName,
        );
    }

    if (!isRecord(value)) {
        throw new Error(
            "Invalid API response: template versions payload must be an object or array.",
        );
    }

    return parseTemplateVersionsGroup(value, "templateVersions", templateName);
}

export function parseAddonsResponse(value: unknown): IAddon[] {
    if (!Array.isArray(value)) {
        throw new Error(
            "Invalid API response: addons payload must be an array.",
        );
    }

    return value.map((addon, index) => parseAddon(addon, `addons[${index}]`));
}

export function parseAddonsPageResponse(
    value: unknown,
): IPaginatedResponse<IAddon> {
    return parsePaginatedResponse(value, "addons", parseAddon);
}

export function parseStacksPageResponse(
    value: unknown,
): IPaginatedResponse<IStack> {
    return parsePaginatedResponse(value, "stacks", parseStack);
}

export function parseStackResponse(value: unknown): IStack {
    return parseStack(value, "stack");
}

export function parsePublishTemplateResponse(value: unknown): {
    message: string;
    name: string;
} {
    const payload = expectRecord(value, "publishTemplate");

    return {
        message: expectString(payload.message, "publishTemplate.message"),
        name: expectString(payload.name, "publishTemplate.name"),
    };
}

export function parsePublishAddonResponse(value: unknown): {
    message: string;
    addon_id: string;
} {
    const payload = expectRecord(value, "publishAddon");

    return {
        message: expectString(payload.message, "publishAddon.message"),
        addon_id: expectString(payload.addon_id, "publishAddon.addon_id"),
    };
}

export function parseTemplateUrlResponse(value: unknown): ITemplateUrlResponse {
    const payload = expectRecord(value, "templateUrl");

    return {
        archive_url: expectString(
            payload.archive_url,
            "templateUrl.archive_url",
        ),
        commit_sha: expectString(payload.commit_sha, "templateUrl.commit_sha"),
        subdir: expectOptionalString(payload.subdir, "templateUrl.subdir"),
    };
}

export function parseAddonUrlResponse(value: unknown): IAddonUrlResponse {
    const payload = expectRecord(value, "addonUrl");

    return {
        archive_url: expectString(payload.archive_url, "addonUrl.archive_url"),
        commit_sha: expectString(payload.commit_sha, "addonUrl.commit_sha"),
    };
}

export function parseStarResponse(value: unknown): IStarResponse {
    const payload = expectRecord(value, "star");

    return {
        is_starred: expectBoolean(payload.is_starred, "star.is_starred"),
        star_count: expectNumber(payload.star_count, "star.star_count"),
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
            user.name === null
                ? null
                : expectString(user.name, "githubUser.name"),
        bio:
            user.bio === null ? null : expectString(user.bio, "githubUser.bio"),
        public_repos: expectNumber(
            user.public_repos,
            "githubUser.public_repos",
        ),
        followers: expectNumber(user.followers, "githubUser.followers"),
        following: expectNumber(user.following, "githubUser.following"),
        created_at: expectString(user.created_at, "githubUser.created_at"),
    };
}
