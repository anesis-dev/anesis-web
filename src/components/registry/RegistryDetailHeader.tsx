import Link from "next/link";
import { ReactNode } from "react";
import { ArrowLeftIcon, ShieldCheckIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface RegistryDetailHeaderMeta {
	icon?: ReactNode;
	label: ReactNode;
	className?: string;
}

export interface RegistryDetailHeaderOwner {
	label: string;
	href: string;
}

export interface RegistryDetailHeaderProps {
	backHref: string;
	backLabel: string;
	icon: ReactNode;
	owner?: RegistryDetailHeaderOwner | null;
	identifier: string;
	official: boolean;
	title: string;
	description?: string;
	meta?: RegistryDetailHeaderMeta[];
	actions?: ReactNode;
	tabs?: ReactNode;
}

export function RegistryDetailHeader({
	backHref,
	backLabel,
	icon,
	owner,
	identifier,
	official,
	title,
	description,
	meta,
	actions,
	tabs,
}: RegistryDetailHeaderProps) {
	return (
		<>
			<Link
				href={backHref}
				className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
			>
				<ArrowLeftIcon className="size-4" />
				{backLabel}
			</Link>

			<header className="flex flex-col gap-5">
				<div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
					<div className="min-w-0 space-y-3">
						<div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xl font-semibold">
							{icon}
							{owner ? (
								<>
									<Link
										href={owner.href}
										className="text-primary transition-colors hover:underline"
									>
										{owner.label}
									</Link>
									<span className="text-muted-foreground">/</span>
								</>
							) : null}
							<span className="break-all text-foreground">{identifier}</span>
							<span className="ml-1">
								{official ? (
									<Badge variant="pill">
										<ShieldCheckIcon className="mr-1 size-3.5" />
										Official
									</Badge>
								) : (
									<Badge variant="pill">Community</Badge>
								)}
							</span>
						</div>

						<h1 className="break-words text-2xl font-bold tracking-tight sm:text-3xl">
							{title}
						</h1>

						{description ? (
							<p className="max-w-2xl break-words text-sm leading-7 text-muted-foreground">
								{description}
							</p>
						) : null}

						{meta && meta.length > 0 ? (
							<div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
								{meta.map((item, index) => (
									<span
										key={index}
										className={`inline-flex items-center gap-1.5 rounded-full border bg-background/80 px-2.5 py-1 ${item.className ?? ""}`}
									>
										{item.icon}
										{item.label}
									</span>
								))}
							</div>
						) : null}
					</div>

					{actions ? (
						<div className="flex flex-wrap items-center gap-2 lg:justify-end">{actions}</div>
					) : null}
				</div>

				{tabs}
			</header>
		</>
	);
}
