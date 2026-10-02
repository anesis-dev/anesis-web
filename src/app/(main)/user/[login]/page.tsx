import type { Metadata } from "next";
import { cache } from "react";
import { HydrationBoundary } from "@tanstack/react-query";
import { UserProfileClient } from "@/components/user/UserProfileClient";
import { registryMetadata, unresolvedMetadata } from "@/lib/registry-metadata";
import { safeDecodeURIComponent } from "@/lib/safe-decode-uri";
import { fetchGitHubUser } from "@/services/github";
import { dehydrateQuery } from "@/lib/prefetch";

// cache(): generateMetadata and the page share one backend request (apiFetch
// sets an AbortSignal, which opts out of Next's built-in fetch dedupe).
const getGitHubUser = cache(fetchGitHubUser);

export async function generateMetadata({
	params,
}: {
	params: Promise<{ login: string }>;
}): Promise<Metadata> {
	const { login } = await params;

	try {
		const user = await getGitHubUser(safeDecodeURIComponent(login));
		const displayName = user.name || user.login;
		return registryMetadata({
			title: `${displayName} (@${user.login}) — Anesis`,
			description:
				user.bio ||
				`Templates, addons, and stacks published to the Anesis registry by @${user.login}.`,
			canonicalPath: `/user/${encodeURIComponent(user.login)}`,
			keywords: [user.login, displayName, "anesis", "publisher", "templates"],
		});
	} catch {
		return unresolvedMetadata("Profile");
	}
}

export default async function UserProfilePage({
	params,
}: {
	params: Promise<{ login: string }>;
}) {
	const { login } = await params;
	// Key matches useGitHubUser(login) in UserProfileClient (raw param).
	const state = await dehydrateQuery({
		queryKey: ["github-user", login],
		queryFn: () => getGitHubUser(safeDecodeURIComponent(login)),
	});
	return (
		<HydrationBoundary state={state}>
			<UserProfileClient login={login} />
		</HydrationBoundary>
	);
}
