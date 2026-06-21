import { NextRequest, NextResponse } from "next/server";
import {
  getGitHubContentsApiUrl,
  parseGitHubTreeUrl,
} from "@/lib/github-tree-url";
import { parseAddonManifest } from "@/services/addon-catalog";

interface GitHubFileContent {
  type: string;
  content?: string;
  encoding?: string;
  download_url: string | null;
}

async function fetchGitHubJson(url: string) {
  return fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "anesis-web",
    },
    next: { revalidate: 60 * 5 },
  });
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

export async function GET(request: NextRequest) {
  const repositoryUrl = request.nextUrl.searchParams.get("url");

  if (!repositoryUrl) {
    return NextResponse.json(
      { message: "Missing addon URL." },
      { status: 400 },
    );
  }

  try {
    const repo = parseGitHubTreeUrl(repositoryUrl);
    const manifestPath = repo.path
      ? `${repo.path}/anesis.addon.json`
      : "anesis.addon.json";

    const contentsResponse = await fetchGitHubJson(
      getGitHubContentsApiUrl({ ...repo, path: manifestPath }),
    );

    if (!contentsResponse.ok) {
      return NextResponse.json(
        { message: "Failed to load addon manifest from GitHub." },
        { status: contentsResponse.status },
      );
    }

    const entry = (await contentsResponse.json()) as GitHubFileContent;

    if (entry.type !== "file") {
      return NextResponse.json(
        { message: "Addon manifest file is missing." },
        { status: 404 },
      );
    }

    let rawManifest = decodeGitHubFileContent(entry);

    if (rawManifest === null) {
      if (!entry.download_url) {
        return NextResponse.json(
          { message: "Addon manifest file is missing." },
          { status: 404 },
        );
      }

      const downloadResponse = await fetch(entry.download_url, {
        next: { revalidate: 60 * 5 },
      });

      if (!downloadResponse.ok) {
        return NextResponse.json(
          { message: "Failed to download addon manifest." },
          { status: downloadResponse.status },
        );
      }

      rawManifest = await downloadResponse.text();
    }

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
