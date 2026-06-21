import { parseGitHubTreeUrl } from "@/lib/github-tree-url";

function isExternalUrl(value: string): boolean {
	return /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(value);
}

function splitSuffix(value: string) {
	const match = value.match(/^([^?#]*)(\?[^#]*)?(#.*)?$/);

	return {
		pathname: match?.[1] ?? value,
		search: match?.[2] ?? "",
		hash: match?.[3] ?? "",
	};
}

function normalizeSegments(segments: string[]): string[] {
	const normalized: string[] = [];

	for (const segment of segments) {
		if (!segment || segment === ".") {
			continue;
		}

		if (segment === "..") {
			normalized.pop();
			continue;
		}

		normalized.push(segment);
	}

	return normalized;
}

function resolveRepositoryPath(baseSegments: string[], target: string): string | null {
	const { pathname } = splitSuffix(target);

	if (!pathname || pathname === "." || pathname === "./") {
		return baseSegments.join("/");
	}

	const nextSegments = pathname.startsWith("/")
		? pathname.split("/").filter(Boolean)
		: [...baseSegments, ...pathname.split("/")];

	const resolved = normalizeSegments(nextSegments);

	return resolved.length > 0 ? resolved.join("/") : null;
}

export interface GitHubReadmeResolver {
	resolveLink: (target: string) => string;
	resolveImage: (target: string) => string;
}

export function createGitHubReadmeResolver(
	sourceUrl?: string,
	readmePath?: string,
): GitHubReadmeResolver | null {
	if (!sourceUrl) {
		return null;
	}

	try {
		const repository = parseGitHubTreeUrl(sourceUrl);

		if (!repository.branch) {
			return null;
		}

		const baseSegments = normalizeSegments(
			(readmePath ?? repository.path ?? "")
				.split("/")
				.filter(Boolean)
				.slice(0, -1),
		);

		return {
			resolveLink(target: string) {
				if (
					!target ||
					target.startsWith("#") ||
					target.startsWith("?") ||
					isExternalUrl(target)
				) {
					return target;
				}

				const { search, hash } = splitSuffix(target);
				const resolvedPath = resolveRepositoryPath(baseSegments, target);

				if (!resolvedPath) {
					return sourceUrl;
				}

				return `https://github.com/${repository.owner}/${repository.repo}/blob/${repository.branch}/${resolvedPath}${search}${hash}`;
			},
			resolveImage(target: string) {
				if (!target || isExternalUrl(target)) {
					return target;
				}

				const { search, hash } = splitSuffix(target);
				const resolvedPath = resolveRepositoryPath(baseSegments, target);

				if (!resolvedPath) {
					return target;
				}

				return `https://raw.githubusercontent.com/${repository.owner}/${repository.repo}/${repository.branch}/${resolvedPath}${search}${hash}`;
			},
		};
	} catch {
		return null;
	}
}
