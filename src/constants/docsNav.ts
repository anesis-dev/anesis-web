export interface DocsNavItem {
	title: string;
	href: string;
	indent?: boolean;
}

export const docsNav: DocsNavItem[] = [
	{
		title: "Overview",
		href: "/docs",
	},
	{
		title: "Installation",
		href: "/docs/installation",
	},
	{
		title: "Authentication",
		href: "/docs/authentication",
	},
	{
		title: "Templates",
		href: "/docs/templates",
	},
	{
		title: "Creating Templates",
		href: "/docs/templates/creating",
		indent: true,
	},
	{
		title: "Publishing Templates",
		href: "/docs/templates/publishing",
		indent: true,
	},
	{
		title: "Addons",
		href: "/docs/addons",
	},
	{
		title: "Creating Addons",
		href: "/docs/addons/creating",
		indent: true,
	},
	{
		title: "Publishing Addons",
		href: "/docs/addons/publishing",
		indent: true,
	},
	{
		title: "Reference",
		href: "/docs/reference",
	},
];
