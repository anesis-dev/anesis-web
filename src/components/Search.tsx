"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
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

export function Search() {
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
			<Button
				onClick={() => setOpen(true)}
				className="min-w-50 flex justify-between gap-6"
				variant="outline"
				aria-label="Open site search"
			>
				<span className="text-muted-foreground">Search...</span>
				<kbd className="text-xs text-muted-foreground tracking-widest">⌘K</kbd>
			</Button>

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
