/**
 * Mobile header menu — Client Component.
 *
 * Hamburger-triggered Dialog providing mobile-friendly access to navigation,
 * account details, multi-session management, and logout. Rendered in the
 * header at small breakpoints. Uses `useAuth` for user state and `useSessions`
 * for multi-account sessions. Switching accounts triggers a full page reload
 * to flush server-state.
 */
"use client";

import Link from "next/link";
import { useState } from "react";
import {
	CheckIcon,
	LayoutDashboardIcon,
	LogOutIcon,
	MenuIcon,
	PlusIcon,
	Trash2Icon,
	UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { accountMenu } from "@/constants/accountMenu";
import { useAuth } from "@/hooks/useAuth";
import { useSessions } from "@/hooks/useSessions";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAddAccountUrl } from "@/services/auth";

const navItems = [
	{ title: "Docs", url: "docs" },
	{ title: "Templates", url: "templates" },
	{ title: "Addons", url: "addons" },
];

export function MobileHeaderMenu() {
	const [open, setOpen] = useState(false);
	const { user, isLoading, login, logout } = useAuth();
	const { sessions, switchAccount, removeSession } = useSessions();
	const otherSessions = sessions.filter((s) => !s.is_current);

	function closeMenu() {
		setOpen(false);
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" size="icon" aria-label="Open navigation menu">
					<MenuIcon className="size-4" />
				</Button>
			</DialogTrigger>

			<DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto p-5 sm:max-w-sm">
				<DialogHeader>
					<DialogTitle>Menu</DialogTitle>
					<DialogDescription>
						Open pages and account actions from one place.
					</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col gap-5">
					<div className="flex flex-col gap-2">
						<p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
							Navigation
						</p>
						{navItems.map((item) => (
							<Link
								key={item.url}
								href={`/${item.url}`}
								onClick={closeMenu}
								className="flex items-center rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
							>
								{item.title}
							</Link>
						))}
					</div>

					<div className="border-t" />

					{isLoading ? (
						<div className="h-24 animate-pulse rounded-xl bg-muted" />
					) : user ? (
						<>
							<div className="flex items-center gap-3 rounded-xl border bg-card px-3 py-3">
								<div className="flex size-9 items-center justify-center rounded-full border border-primary/25 bg-primary/10">
									<UserIcon className="size-4 text-primary" />
								</div>
								<div className="min-w-0">
									<p className="truncate text-sm font-medium">@{user.login}</p>
									<p className="text-xs text-muted-foreground capitalize">
										{user.role}
									</p>
								</div>
							</div>

							<div className="flex flex-col gap-2">
								<p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
									Account
								</p>
								{accountMenu.map((item) => (
									<Link
										key={item.url}
										href={item.url}
										onClick={closeMenu}
										className="flex items-center rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
									>
										{item.title}
									</Link>
								))}

								{user.role === "admin" && (
									<Link
										href="/admin"
										onClick={closeMenu}
										className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
									>
										<LayoutDashboardIcon className="size-4" />
										Admin panel
									</Link>
								)}
							</div>

							<div className="flex flex-col gap-2">
								<p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
									Accounts
								</p>
								<div className="flex items-center gap-3 rounded-md border bg-card px-3 py-2">
									<Avatar className="size-6 shrink-0">
										<AvatarImage src={user.avatar_url} alt={user.login} />
										<AvatarFallback className="text-[10px]">
											{user.login.slice(0, 2).toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<span className="truncate text-sm font-medium">@{user.login}</span>
									<CheckIcon className="ml-auto size-3.5 shrink-0 text-primary" />
								</div>
								{otherSessions.map((s) => (
									<div key={s.login} className="flex items-center gap-2">
										<button
											className="flex flex-1 min-w-0 items-center gap-3 rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
											onClick={() => {
												closeMenu();
												switchAccount(s.login);
											}}
										>
											<Avatar className="size-6 shrink-0">
												<AvatarImage src={s.avatar_url} alt={s.login} />
												<AvatarFallback className="text-[10px]">
													{s.login.slice(0, 2).toUpperCase()}
												</AvatarFallback>
											</Avatar>
											<span className="truncate">@{s.login}</span>
										</button>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											className="shrink-0 text-muted-foreground hover:text-destructive"
											onClick={() => removeSession(s.login)}
											aria-label={`Remove session: ${s.login}`}
										>
											<Trash2Icon className="size-4" />
										</Button>
									</div>
								))}
								<Button
									type="button"
									variant="outline"
									className="w-full justify-start"
									onClick={() => {
										closeMenu();
										window.location.href = getAddAccountUrl();
									}}
								>
									<PlusIcon className="size-4" />
									Add account
								</Button>
							</div>

							<div className="flex flex-col gap-2 border-t pt-4">
								<Button asChild type="button" variant="outline" className="w-full justify-start">
									<Link
										href={`https://github.com/${user.login}`}
										target="_blank"
										rel="noopener noreferrer"
										onClick={closeMenu}
									>
										<GitHubIcon className="size-4" />
										View GitHub profile
									</Link>
								</Button>
								<Button
									type="button"
									variant="ghost"
									className="w-full justify-start text-destructive hover:text-destructive"
									onClick={async () => {
										closeMenu();
										await logout();
									}}
								>
									<LogOutIcon className="size-4" />
									Log out
								</Button>
							</div>
						</>
					) : (
						<div className="flex flex-col gap-3 border-t pt-4">
							<p className="text-sm text-muted-foreground">
								Sign in with GitHub to publish templates and use the account area.
							</p>
							<Button
								type="button"
								className="w-full"
								onClick={() => {
									closeMenu();
									login();
								}}
							>
								<GitHubIcon className="size-4" />
								Login with GitHub
							</Button>
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
