import {
	BotIcon,
	BoxesIcon,
	DatabaseIcon,
	DownloadIcon,
	HomeIcon,
	LayersIcon,
	LayoutTemplateIcon,
	PencilRulerIcon,
	ShieldCheckIcon,
	TerminalIcon,
	UploadIcon,
	type LucideIcon,
} from "lucide-react";

export interface DocsNavItem {
	title: string;
	href: string;
	icon: LucideIcon;
}

export interface DocsNavSection {
	label: string;
	items: DocsNavItem[];
}


export const docsNavSections: DocsNavSection[] = [
	{
		label: "Getting Started",
		items: [
			{ title: "Overview", href: "/docs", icon: HomeIcon },
			{ title: "Installation", href: "/docs/installation", icon: DownloadIcon },
			{
				title: "Authentication",
				href: "/docs/authentication",
				icon: ShieldCheckIcon,
			},
		],
	},
	{
		label: "Templates",
		items: [
			{
				title: "Using Templates",
				href: "/docs/templates",
				icon: LayoutTemplateIcon,
			},
			{
				title: "Creating Templates",
				href: "/docs/templates/creating",
				icon: PencilRulerIcon,
			},
			{
				title: "Publishing Templates",
				href: "/docs/templates/publishing",
				icon: UploadIcon,
			},
		],
	},
	{
		label: "Addons",
		items: [
			{ title: "Using Addons", href: "/docs/addons", icon: BoxesIcon },
			{
				title: "Creating Addons",
				href: "/docs/addons/creating",
				icon: PencilRulerIcon,
			},
			{
				title: "Publishing Addons",
				href: "/docs/addons/publishing",
				icon: UploadIcon,
			},
		],
	},
	{
		label: "Stacks",
		items: [
			{ title: "Using Stacks", href: "/docs/stacks", icon: LayersIcon },
			{
				title: "Creating Stacks",
				href: "/docs/stacks/creating",
				icon: PencilRulerIcon,
			},
		],
	},
	{
		label: "Reference",
		items: [
			{
				title: "Local State & Schema",
				href: "/docs/reference",
				icon: DatabaseIcon,
			},
			{
				title: "CLI Commands",
				href: "/docs/reference/commands",
				icon: TerminalIcon,
			},
			{
				title: "AI Agents & MCP",
				href: "/docs/ai-agents",
				icon: BotIcon,
			},
		],
	},
];


export const docsNav: DocsNavItem[] = docsNavSections.flatMap(
	(section) => section.items,
);
