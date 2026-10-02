"use client";

import {
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

export function SearchDialog({
	open,
	onOpenChange,
	onSelect,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSelect: (url: string) => void;
}) {
	return (
		<CommandDialog open={open} onOpenChange={onOpenChange}>
			<CommandInput placeholder="Search pages..." />
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>

				<CommandGroup heading="Navigation">
					{nav.map((item) => (
						<CommandItem
							key={item.url}
							value={item.title}
							onSelect={() => onSelect(item.url)}
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
							onSelect={() => onSelect(item.href)}
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
							onSelect={() => onSelect(item.url)}
							className="cursor-pointer"
						>
							{item.title}
						</CommandItem>
					))}
				</CommandGroup>
			</CommandList>
		</CommandDialog>
	);
}
