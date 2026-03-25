"use client";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/useAuth";
import { AvatarButton } from "./AvatarButton";
import { GitHubIcon } from "./icons/GitHubIcon";

export default function AuthButton() {
	const { user, isLoading, login, logout } = useAuth();

	if (isLoading) {
		return (
			<div className="h-9 w-full animate-pulse rounded-md bg-muted sm:w-9 sm:rounded-full" />
		);
	}

	if (user) {
		return (
			<div className="flex w-full justify-end sm:w-auto">
				<AvatarButton user={user} logout={logout} />
			</div>
		);
	}

	return (
		<Button type="button" onClick={login} className="w-full sm:w-auto xl:px-4">
			<GitHubIcon />
			<span>Sign in with GitHub</span>
		</Button>
	);
}
