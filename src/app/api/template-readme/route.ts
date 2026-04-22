import { NextRequest, NextResponse } from "next/server";
import {
	getGitHubContentsApiUrl,
	parseGitHubTreeUrl,
} from "@/lib/github-tree-url";

interface GitHubContentEntry {
	name: string;
	path: string;
	download_url: string | null;
	type: string;
	url?: string;
}

interface GitHubFileContent {
	content?: string;
	download_url?: string | null;
	encoding?: string;
	name?: string;
	path?: string;
	type?: string;
}

function getReadmePriority(entry: GitHubContentEntry): number {
	if (entry.type !== "file") {
		return Number.POSITIVE_INFINITY;
	}

	const normalizedName = entry.name.toLowerCase();

	switch (normalizedName) {
		case "readme.md":
			return 0;
		case "readme.md.tera":
			return 1;
		case "readme":
			return 2;
		case "readme.tera":
			return 3;
		default:
			return /^readme(?:\.[^.]+)?(?:\.tera)?$/i.test(entry.name)
				? 4
				: Number.POSITIVE_INFINITY;
	}
}

function findReadmeFile(entries: GitHubContentEntry[]): GitHubContentEntry | undefined {
	return entries.reduce<GitHubContentEntry | undefined>((best, entry) => {
		const priority = getReadmePriority(entry);

		if (!Number.isFinite(priority)) {
			return best;
		}

		if (!best || priority < getReadmePriority(best)) {
			return entry;
		}

		return best;
	}, undefined);
}

function decodeGitHubFileContent(payload: GitHubFileContent): string | null {
	if (typeof payload.content !== "string") {
		return null;
	}

	const encoding = payload.encoding?.toLowerCase();

	if (encoding === "base64") {
		return Buffer.from(payload.content.replace(/\s/g, ""), "base64").toString(
			"utf8",
		);
	}

	if (!encoding || encoding === "utf-8" || encoding === "utf8") {
		return payload.content;
	}

	return null;
}

async function fetchGitHubJson(url: string) {
	return fetch(url, {
		headers: {
			Accept: "application/vnd.github+json",
			"User-Agent": "oxide-web",
		},
		next: { revalidate: 60 * 5 },
	});
}

async function loadReadmeContent(readme: GitHubContentEntry) {
	let lastStatus = 502;

	if (readme.url) {
		const readmeApiResponse = await fetchGitHubJson(readme.url);
		lastStatus = readmeApiResponse.status;

		if (readmeApiResponse.ok) {
			const payload = (await readmeApiResponse.json()) as GitHubFileContent;
			const decoded = decodeGitHubFileContent(payload);

			if (decoded !== null) {
				return { content: decoded, status: 200 };
			}
		}
	}

	if (readme.download_url) {
		const readmeResponse = await fetch(readme.download_url, {
			next: { revalidate: 60 * 5 },
		});
		lastStatus = readmeResponse.status;

		if (readmeResponse.ok) {
			return { content: await readmeResponse.text(), status: 200 };
		}
	}

	return { content: null, status: lastStatus };
}

export async function GET(request: NextRequest) {
	const repositoryUrl = request.nextUrl.searchParams.get("url");

	if (!repositoryUrl) {
		return NextResponse.json({ message: "Missing template URL." }, { status: 400 });
	}

	try {
		const repo = parseGitHubTreeUrl(repositoryUrl);

		const contentsResponse = await fetchGitHubJson(getGitHubContentsApiUrl(repo));

		if (!contentsResponse.ok) {
			return NextResponse.json(
				{ message: "Failed to load template contents from GitHub." },
				{ status: contentsResponse.status },
			);
		}

		const payload = (await contentsResponse.json()) as GitHubContentEntry[] | GitHubContentEntry;
		const entries = Array.isArray(payload) ? payload : [payload];
		const readme = findReadmeFile(entries);

		if (!readme?.download_url) {
			return NextResponse.json({ content: null }, { status: 200 });
		}

		const readmeContent = await loadReadmeContent(readme);

		if (readmeContent.content === null) {
			return NextResponse.json(
				{ message: "Failed to load README from GitHub." },
				{ status: readmeContent.status },
			);
		}

		return NextResponse.json({
			content: readmeContent.content,
			fileName: readme.name,
			path: readme.path,
		});
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to load template README.";

		return NextResponse.json({ message }, { status: 400 });
	}
}
