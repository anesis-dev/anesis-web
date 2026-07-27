"use client";

import Link from "next/link";
import {
	PROFILE_PREVIEW_LIMIT,
	ProfileUser,
	UserProfilePageContent,
} from "@/components/profile/UserProfilePageContent";
import { authorLogin } from "@/lib/author";
import { useAllAddons } from "@/hooks/useAllAddons";
import { useAllTemplates } from "@/hooks/useAllTemplates";
import { useAuth } from "@/hooks/useAuth";
import { useGitHubUser } from "@/hooks/useGitHubUser";
import { useMyAddons } from "@/hooks/useMyAddons";
import { useMyTemplates } from "@/hooks/useMyTemplates";
import { useUserByLogin } from "@/hooks/useUserByLogin";
import { parseGitHubTreeUrl } from "@/lib/github-tree-url";
import { IAddon } from "@/types/addon";
import { ITemplate } from "@/types/template";
import { UserIcon } from "lucide-react";

function loginMatches(value: string | undefined, normalizedLogin: string): boolean {
	return value?.trim().toLowerCase() === normalizedLogin;
}

function githubUrlOwnerMatches(
	url: string | undefined,
	normalizedLogin: string,
): boolean {
	if (!url) {
		return false;
	}

	try {
		return parseGitHubTreeUrl(url).owner.toLowerCase() === normalizedLogin;
	} catch {
		return false;
	}
}

function templateBelongsToProfile(
	template: ITemplate,
	normalizedLogin: string,
	profileUserId?: string,
): boolean {
	return (
		template.owner_id === profileUserId ||
		loginMatches(authorLogin(template.config?.author) ?? "", normalizedLogin) ||
		githubUrlOwnerMatches(template.url, normalizedLogin) ||
		githubUrlOwnerMatches(template.config.repository.url, normalizedLogin)
	);
}

function addonBelongsToProfile(
	addon: IAddon,
	normalizedLogin: string,
	profileUserId?: string,
): boolean {
	return (
		addon.owner_id === profileUserId ||
		loginMatches(authorLogin(addon.config?.author) ?? "", normalizedLogin) ||
		githubUrlOwnerMatches(addon.url, normalizedLogin)
	);
}

export function UserProfileClient({ login }: { login: string }) {
	const normalizedLogin = login.toLowerCase();
	const { user: currentUser, isLoading: authLoading, logout } = useAuth();
	const isOwnProfile =
		!!currentUser && currentUser.login.toLowerCase() === normalizedLogin;
	const {
		githubUser,
		isLoading: userLoading,
		isError: userError,
	} = useGitHubUser(login);
	const { user: profileUser, isLoading: profileUserLoading } = useUserByLogin(login, {
		enabled: !authLoading && !isOwnProfile,
	});
	const {
		templates: publicTemplates,
		isLoading: publicTemplatesLoading,
	} = useAllTemplates({
		enabled: !authLoading && !isOwnProfile,
	});
	const { addons: publicAddons, isLoading: publicAddonsLoading } = useAllAddons({
		enabled: !authLoading && !isOwnProfile,
	});
	const {
		templates: myTemplates,
		isLoading: myTemplatesLoading,
		pagination: myTemplatePagination,
	} = useMyTemplates({
		enabled: !authLoading && isOwnProfile,
		pageSize: PROFILE_PREVIEW_LIMIT,
	});
	const {
		addons: myAddons,
		isLoading: myAddonsLoading,
		pagination: myAddonPagination,
	} = useMyAddons({
		enabled: !authLoading && isOwnProfile,
		pageSize: PROFILE_PREVIEW_LIMIT,
	});

	const userTemplates: ITemplate[] = isOwnProfile
		? myTemplates
		: publicTemplates.filter((template) =>
				templateBelongsToProfile(template, normalizedLogin, profileUser?.id),
			);
	const userAddons: IAddon[] = isOwnProfile
		? myAddons
		: publicAddons.filter((addon) =>
				addonBelongsToProfile(addon, normalizedLogin, profileUser?.id),
			);
	const templatesLoading = authLoading
		? true
		: isOwnProfile
			? myTemplatesLoading
			: publicTemplatesLoading || profileUserLoading;
	const addonsLoading = authLoading
		? true
		: isOwnProfile
			? myAddonsLoading
			: publicAddonsLoading || profileUserLoading;
	const templateTotal = isOwnProfile
		? (myTemplatePagination?.total ?? userTemplates.length)
		: userTemplates.length;
	const addonTotal = isOwnProfile
		? (myAddonPagination?.total ?? userAddons.length)
		: userAddons.length;

	if (userError) {
		return (
			<div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-4 px-4 py-20 text-center sm:px-5">
				<UserIcon className="size-12 text-primary drop-shadow-[0_0_18px_rgba(45,106,79,0.40)]" />
				<div>
					<p className="font-semibold text-lg">User not found</p>
					<p className="mt-1 text-sm text-muted-foreground">
						No GitHub user with the login{" "}
						<span className="font-mono text-foreground">@{login}</span> exists.
					</p>
				</div>
				<Link
					href="/templates"
					className="text-sm text-muted-foreground underline-offset-4 hover:underline"
				>
					← Back to templates
				</Link>
			</div>
		);
	}

	const profile: ProfileUser | undefined = githubUser
		? {
				login: githubUser.login,
				avatarUrl: githubUser.avatar_url,
				githubUrl: githubUser.html_url,
				name: githubUser.name,
				bio: githubUser.bio,
				followers: githubUser.followers,
				following: githubUser.following,
			}
		: undefined;

	return (
		<UserProfilePageContent
			profile={profile}
			profileLoading={userLoading}
			templates={userTemplates}
			addons={userAddons}
			templatesLoading={templatesLoading}
			addonsLoading={addonsLoading}
			templateTotal={templateTotal}
			addonTotal={addonTotal}
			templateTitle={isOwnProfile ? "My Templates" : "Templates"}
			addonTitle={isOwnProfile ? "My Addons" : "Addons"}
			emptyTemplatesDescription={
				isOwnProfile
					? "You haven't published any templates."
					: "This user hasn't published any templates."
			}
			emptyAddonsDescription={
				isOwnProfile
					? "You haven't published any addons."
					: "This user hasn't published any addons."
			}
			viewAllTemplatesHref={isOwnProfile ? "/account/templates" : undefined}
			viewAllAddonsHref={isOwnProfile ? "/account/addons" : undefined}
			showAdminPanel={isOwnProfile && currentUser?.role === "admin"}
			onLogout={isOwnProfile ? logout : undefined}
		/>
	);
}
