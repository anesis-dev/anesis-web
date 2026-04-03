import { NextRequest, NextResponse } from "next/server";
import { env } from "@/config/env";
import {
	getGitHubContentsApiUrl,
	parseGitHubTreeUrl,
} from "@/lib/github-tree-url";

interface GitHubContentEntry {
	name: string;
	path: string;
	download_url: string | null;
	type: string;
}

function isReadmeFile(entry: GitHubContentEntry): boolean {
	if (entry.type !== "file") {
		return false;
	}

	return /^readme(\.[^.]+)?$/i.test(entry.name);
}

export async function GET(request: NextRequest) {
	const repositoryUrl = request.nextUrl.searchParams.get("url");

	if (!repositoryUrl) {
		return NextResponse.json({ message: "Missing template URL." }, { status: 400 });
	}

	try {
		const repo = parseGitHubTreeUrl(repositoryUrl);
		const proxyUrl = new URL("/github/proxy", env.apiUrl);
		proxyUrl.searchParams.set("url", getGitHubContentsApiUrl(repo));

		const contentsResponse = await fetch(proxyUrl.toString(), {
			next: { revalidate: 60 * 5 },
		});

		if (!contentsResponse.ok) {
			return NextResponse.json(
				{ message: "Failed to load template contents from GitHub." },
				{ status: contentsResponse.status },
			);
		}

		const payload = (await contentsResponse.json()) as GitHubContentEntry[] | GitHubContentEntry;
		const entries = Array.isArray(payload) ? payload : [payload];
		const readme = entries.find(isReadmeFile);

		if (!readme?.download_url) {
			return NextResponse.json({ content: null }, { status: 200 });
		}

		const readmeResponse = await fetch(readme.download_url, {
			next: { revalidate: 60 * 5 },
		});

		if (!readmeResponse.ok) {
			return NextResponse.json(
				{ message: "Failed to load README from GitHub." },
				{ status: readmeResponse.status },
			);
		}

		const content = await readmeResponse.text();

		return NextResponse.json({
			content,
			fileName: readme.name,
			path: readme.path,
		});
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to load template README.";

		return NextResponse.json({ message }, { status: 400 });
	}
}
