"use client";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/useAuth";
import { AvatarButton } from "./AvatarButton";
import { GitHubIcon } from "./icons/GitHubIcon";

export default function AuthButton() {
	const { user, isLoading, login, logout } = useAuth();

	if (isLoading) {
		return <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />;
	}

	if (user) {
		return <AvatarButton user={user} logout={logout} />;
	}

	return (
		<Button type="button" onClick={login}>
			<GitHubIcon />
			Login with GitHub
		</Button>
	);
}
