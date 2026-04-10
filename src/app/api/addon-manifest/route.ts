import { NextRequest, NextResponse } from "next/server";
import { env } from "@/config/env";
import {
  getGitHubContentsApiUrl,
  parseGitHubTreeUrl,
} from "@/lib/github-tree-url";
import { parseAddonManifest } from "@/services/addon-catalog";

interface GitHubContentEntry {
  name: string;
  path: string;
  download_url: string | null;
  type: string;
}

export async function GET(request: NextRequest) {
	const repositoryUrl = request.nextUrl.searchParams.get("url");
	const cookie = request.headers.get("cookie");

  if (!repositoryUrl) {
    return NextResponse.json(
      { message: "Missing addon URL." },
      { status: 400 },
    );
  }

  try {
    const repo = parseGitHubTreeUrl(repositoryUrl);
    const proxyUrl = new URL("/github/proxy", env.apiUrl);
    proxyUrl.searchParams.set(
      "url",
      getGitHubContentsApiUrl({
        ...repo,
        path: repo.path ? `${repo.path}/oxide.addon.json` : "oxide.addon.json",
      }),
    );

		const manifestEntryResponse = await fetch(proxyUrl.toString(), {
			headers: cookie ? { cookie } : undefined,
			next: { revalidate: 60 * 5 },
		});

    if (!manifestEntryResponse.ok) {
      return NextResponse.json(
        { message: "Failed to load addon manifest from GitHub." },
        { status: manifestEntryResponse.status },
      );
    }

    const manifestEntry =
      (await manifestEntryResponse.json()) as GitHubContentEntry;

    if (manifestEntry.type !== "file" || !manifestEntry.download_url) {
      return NextResponse.json(
        { message: "Addon manifest file is missing." },
        { status: 404 },
      );
    }

    const manifestResponse = await fetch(manifestEntry.download_url, {
      next: { revalidate: 60 * 5 },
    });

    if (!manifestResponse.ok) {
      return NextResponse.json(
        { message: "Failed to download addon manifest." },
        { status: manifestResponse.status },
      );
    }

    const rawManifest = await manifestResponse.text();
    const manifest = parseAddonManifest(
      JSON.parse(rawManifest) as unknown,
      "addonManifest",
    );

    return NextResponse.json(manifest);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load addon manifest.";

    return NextResponse.json({ message }, { status: 400 });
  }
}
