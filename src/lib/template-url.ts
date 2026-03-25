const GITHUB_HOSTS = new Set(["github.com", "www.github.com"]);

export function validateTemplatePublishUrl(input: string): string | null {
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
		return "Use a GitHub /tree/ URL that points to the template directory.";
	}

	if (!parts[0] || !parts[1] || !parts[3] || !parts.slice(4).join("/")) {
		return "The URL must include owner, repo, branch and template directory.";
	}

	return null;
}
