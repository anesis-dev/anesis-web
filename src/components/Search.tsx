"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
import { nav } from "@/constants/nav";
import { accountMenu } from "@/constants/accountMenu";
import { docsNav } from "@/constants/docsNav";
import { cn } from "@/lib/utils";

export function Search({
	className,
	variant = "full",
}: {
	className?: string;
	variant?: "full" | "icon";
}) {
	const [open, setOpen] = React.useState(false);
	const router = useRouter();

	React.useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((prev) => !prev);
			}
		};
		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	function handleSelect(url: string) {
		router.push(url.startsWith("/") ? url : `/${url}`);
		setOpen(false);
	}

	return (
		<>
			{variant === "icon" ? (
				<Button
					onClick={() => setOpen(true)}
					className={className}
					variant="outline"
					size="icon"
					aria-label="Open site search"
				>
					<SearchIcon className="size-4" />
				</Button>
			) : (
				<Button
					onClick={() => setOpen(true)}
					className={cn(
						"min-w-0 justify-between gap-3 px-3 sm:gap-6",
						className,
					)}
					variant="outline"
					aria-label="Open site search"
				>
					<span className="text-muted-foreground">Search...</span>
					<kbd className="hidden text-xs tracking-widest text-muted-foreground sm:inline-flex">
						⌘K
					</kbd>
				</Button>
			)}

			<CommandDialog open={open} onOpenChange={setOpen}>
				<CommandInput placeholder="Search pages..." />
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>

					<CommandGroup heading="Navigation">
						{nav.map((item) => (
							<CommandItem
								key={item.url}
								value={item.title}
								onSelect={() => handleSelect(item.url)}
								className="cursor-pointer"
							>
								{item.title}
							</CommandItem>
						))}
					</CommandGroup>

					<CommandSeparator />

					<CommandGroup heading="Documentation">
						{docsNav.map((item) => (
							<CommandItem
								key={item.href}
								value={`docs ${item.title}`}
								onSelect={() => handleSelect(item.href)}
								className="cursor-pointer"
							>
								{item.title}
							</CommandItem>
						))}
					</CommandGroup>

					<CommandSeparator />

					<CommandGroup heading="Account">
						{accountMenu.map((item) => (
							<CommandItem
								key={item.url}
								value={item.title}
								onSelect={() => handleSelect(item.url)}
								className="cursor-pointer"
							>
								{item.title}
							</CommandItem>
						))}
					</CommandGroup>
				</CommandList>
			</CommandDialog>
		</>
	);
}
