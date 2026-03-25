"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { ShieldOffIcon, LoaderIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IUser } from "@/types/user";

export function AdminGuard({ children }: { children: React.ReactNode }) {
	const { user, isLoading } = useAuth();

	if (isLoading) {
		return (
			<div className="flex h-dvh w-full items-center justify-center">
				<LoaderIcon className="size-6 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (!user || user.role !== "admin") {
		return (
			<div className="flex h-dvh w-full flex-col items-center justify-center gap-4 text-center">
				<ShieldOffIcon className="size-12 text-muted-foreground" />
				<div>
					<p className="text-lg font-semibold">Access Denied</p>
					<p className="mt-1 text-sm text-muted-foreground">
						You don&apos;t have permission to view this page.
					</p>
				</div>
				<Link href="/">
					<Button variant="outline">← Back to site</Button>
				</Link>
			</div>
		);
	}

	return <>{children}</>;
}
