"use client";

import Link from "next/link";
import { useState } from "react";
import {
	LayoutDashboardIcon,
	LogOutIcon,
	MenuIcon,
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
import { nav } from "@/constants/nav";
import { accountMenu } from "@/constants/accountMenu";
import { useAuth } from "@/hooks/useAuth";
import { GitHubIcon } from "@/components/icons/GitHubIcon";

export function MobileHeaderMenu() {
	const [open, setOpen] = useState(false);
	const { user, isLoading, login, logout } = useAuth();

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
						{nav.map((item) => (
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
								<div className="flex size-9 items-center justify-center rounded-full bg-muted">
									<UserIcon className="size-4 text-muted-foreground" />
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
								Sign in with GitHub to publish templates and use the account
								area.
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
