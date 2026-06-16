/**
 * Publish URL validators for templates and addons.
 *
 * Validates that a user-pasted URL is a GitHub `/tree/` URL pointing to a
 * specific directory (not just the repo root). The expected format is:
 *   `https://github.com/<owner>/<repo>/tree/<branch>/<dir>`
 *
 * Returns `null` on success, or a human-readable error string on failure.
 * These strings are displayed inline in the publish dialogs.
 */
const GITHUB_HOSTS = new Set(["github.com", "www.github.com"]);

function validateGitHubTreeUrl(input: string, target: string): string | null {
	const value = input.trim();

	if (!value) {
		return "GitHub URL is required.";
	}

	let url: URL;

	try {
		url = new URL(value);
	} catch {
		return "Enter a valid absolute URL.";
	}

	if (!GITHUB_HOSTS.has(url.hostname.toLowerCase())) {
		return "Only GitHub repository URLs are supported.";
	}

	const parts = url.pathname.split("/").filter(Boolean);

	if (parts.length < 5 || parts[2] !== "tree") {
		return `Use a GitHub /tree/ URL that points to the ${target} directory.`;
	}

	if (!parts[0] || !parts[1] || !parts[3] || !parts.slice(4).join("/")) {
		return `The URL must include owner, repo, branch and ${target} directory.`;
	}

	return null;
}

export function validateTemplatePublishUrl(input: string): string | null {
	return validateGitHubTreeUrl(input, "template");
}

export function validateAddonPublishUrl(input: string): string | null {
	return validateGitHubTreeUrl(input, "addon");
}
