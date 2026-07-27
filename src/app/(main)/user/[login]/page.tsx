import type { Metadata } from "next";
import { UserProfileClient } from "@/components/user/UserProfileClient";
import { registryMetadata, unresolvedMetadata } from "@/lib/registry-metadata";
import { fetchGitHubUser } from "@/services/github";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ login: string }>;
}): Promise<Metadata> {
	const { login } = await params;
	const decoded = decodeURIComponent(login);

	try {
		const user = await fetchGitHubUser(decoded);
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
	return <UserProfileClient login={login} />;
}
