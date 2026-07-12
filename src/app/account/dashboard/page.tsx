"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useMyAddons } from "@/hooks/useMyAddons";
import { useMyTemplates } from "@/hooks/useMyTemplates";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	BookOpenIcon,
	BoxesIcon,
	InfoIcon,
	KeyRoundIcon,
	PackageIcon,
	ShieldIcon,
	StarIcon,
} from "lucide-react";

function DashboardCard({
	title,
	description,
	value,
	icon: Icon,
}: {
	title: string;
	description: string;
	value: string | number;
	icon: React.ElementType;
}) {
	return (
		<Card className="gap-0 py-4">
			<CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0 px-4">
				<CardTitle className="text-sm font-medium text-muted-foreground">
					{title}
				</CardTitle>
				<Icon className="size-4 shrink-0 text-muted-foreground" />
			</CardHeader>
			<CardContent className="px-4 pt-2">
				<p className="text-3xl font-semibold tracking-tight">{value}</p>
				<CardDescription className="mt-1 text-xs">{description}</CardDescription>
			</CardContent>
		</Card>
	);
}

export default function DashboardPage() {
	const { user } = useAuth();
	const {
		templates: myTemplates,
		isLoading,
		pagination: templatePagination,
	} = useMyTemplates({ enabled: !!user, pageSize: 100 });
	const {
		addons: myAddons,
		isLoading: addonsLoading,
		pagination: addonPagination,
	} = useMyAddons({ enabled: !!user, pageSize: 100 });
	const officialTemplates = myTemplates.filter((template) => template.official);

	if (!user) {
		return (
			<div className="mx-auto flex min-h-[50vh] w-full max-w-5xl items-center justify-center px-4 py-10 sm:px-5">
				<Card className="w-full max-w-xl">
					<CardHeader>
						<CardTitle>Account dashboard</CardTitle>
						<CardDescription>
							Sign in with GitHub to view your templates and publishing
							activity.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Link href="/">
							<Button variant="outline">Back to home</Button>
						</Link>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:px-5 lg:px-8">
			<div className="space-y-1">
				<h1 className="text-2xl font-semibold tracking-tight">
					Account dashboard
				</h1>
				<p className="text-sm text-muted-foreground">
					Overview for @{user.login}. Publish is available from the templates
					page after you sign in.
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				<DashboardCard
					title="Your role"
					description="Access level for this account"
					value={user.role}
					icon={ShieldIcon}
				/>
				<DashboardCard
					title="Published templates"
					description="Templates connected to your GitHub account"
					value={isLoading ? "..." : (templatePagination?.total ?? myTemplates.length)}
					icon={PackageIcon}
				/>
				<DashboardCard
					title="Official templates"
					description="Templates marked as official"
					value={isLoading ? "..." : officialTemplates.length}
					icon={StarIcon}
				/>
				<DashboardCard
					title="Published addons"
					description="Addon registry entries linked to your account"
					value={addonsLoading ? "..." : (addonPagination?.total ?? myAddons.length)}
					icon={BoxesIcon}
				/>
			</div>

			<div className="grid gap-4 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Next actions</CardTitle>
						<CardDescription>
							Jump into the parts of the account area you will use most often.
						</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
						<Link href="/account/templates" className="w-full sm:w-auto">
							<Button className="w-full gap-2 sm:w-auto">
								<PackageIcon className="size-4" />
								Manage templates
							</Button>
						</Link>
						<Link href="/templates" className="w-full sm:w-auto">
							<Button variant="outline" className="w-full gap-2 sm:w-auto">
								<BookOpenIcon className="size-4" />
								Browse registry
							</Button>
						</Link>
						<Link href="/account/addons" className="w-full sm:w-auto">
							<Button variant="outline" className="w-full gap-2 sm:w-auto">
								<BoxesIcon className="size-4" />
								Manage addons
							</Button>
						</Link>
						<Link href="/account/tokens" className="w-full sm:w-auto">
							<Button variant="outline" className="w-full gap-2 sm:w-auto">
								<KeyRoundIcon className="size-4" />
								API tokens
							</Button>
						</Link>
						{user.role === "admin" && (
							<Link href="/admin" className="w-full sm:w-auto">
								<Button variant="outline" className="w-full gap-2 sm:w-auto">
									<ShieldIcon className="size-4" />
									Open admin panel
								</Button>
							</Link>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
						<div className="space-y-1.5">
							<CardTitle>Publishing reminder</CardTitle>
							<CardDescription>
								The current CLI uses authenticated template-download endpoints, so
								sign-in matters for install/new flows as well as publishing and
								registry management.
							</CardDescription>
						</div>
						<InfoIcon className="size-4 shrink-0 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<Link href="/docs">
							<Button variant="outline" size="sm" className="gap-2">
								<BookOpenIcon className="size-4" />
								Read the docs
							</Button>
						</Link>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
