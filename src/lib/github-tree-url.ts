/**
 * GitHub URL parsing utilities used by the server-side route handlers.
 *
 * `parseGitHubTreeUrl` deconstructs a GitHub URL into its constituent parts
 * (owner, repo, branch, path). Supports:
 *   - Root repo URLs: `https://github.com/owner/repo`
 *   - Tree URLs:      `https://github.com/owner/repo/tree/branch/path/to/dir`
 *
 * `getGitHubContentsApiUrl` converts a `GitHubRepoPath` into the GitHub
 * Contents API URL (`https://api.github.com/repos/.../contents/...`).
 */
export interface GitHubRepoPath {
	owner: string;
	repo: string;
	branch?: string;
	path?: string;
}

export function parseGitHubTreeUrl(input: string): GitHubRepoPath {
	let url: URL;

	try {
		url = new URL(input);
	} catch {
		throw new Error("Invalid GitHub URL.");
	}

	if (!["github.com", "www.github.com"].includes(url.hostname.toLowerCase())) {
		throw new Error("Not a GitHub repository URL.");
	}

	const segments = url.pathname.split("/").filter(Boolean);

	if (segments.length < 2) {
		throw new Error("Invalid GitHub repository URL.");
	}

	const [owner, repo] = segments;

	if (!owner || !repo) {
		throw new Error("Invalid GitHub repository URL.");
	}

	if (segments.length === 2) {
		return { owner, repo };
	}

	if (segments.length >= 4 && segments[2] === "tree") {
		return {
			owner,
			repo,
			branch: segments[3],
			path: segments.length > 4 ? segments.slice(4).join("/") : undefined,
		};
	}

	throw new Error("Unsupported GitHub URL format.");
}

export function getGitHubContentsApiUrl(repo: GitHubRepoPath): string {
	const path = repo.path ? `/${repo.path}` : "";
	const url = new URL(
		`https://api.github.com/repos/${repo.owner}/${repo.repo}/contents${path}`,
	);

	if (repo.branch) {
		url.searchParams.set("ref", repo.branch);
	}

	return url.toString();
}
