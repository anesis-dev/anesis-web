import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";
import { docsNavSections } from "@/constants/docsNav";
import { fetchAllAddons } from "@/services/addon";
import { fetchAllStacks } from "@/services/stack";
import { fetchAllTemplates } from "@/services/template";
import { getAddonHref } from "@/lib/addon-ref";
import { getTemplateLatestHref } from "@/lib/template-ref";

export const revalidate = 3600;

const staticRoutes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] =
	[
		{ path: "/", priority: 1, changeFrequency: "weekly" },
		{ path: "/templates", priority: 0.9, changeFrequency: "daily" },
		{ path: "/addons", priority: 0.9, changeFrequency: "daily" },
		{ path: "/stacks", priority: 0.9, changeFrequency: "daily" },
		{ path: "/builder", priority: 0.6, changeFrequency: "monthly" },
		{ path: "/changelog", priority: 0.5, changeFrequency: "monthly" },
		{ path: "/terms", priority: 0.3, changeFrequency: "yearly" },
		{ path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
	];

async function safely<T>(label: string, load: () => Promise<T[]>): Promise<T[]> {
	try {
		return await load();
	} catch (error) {
		console.error(`sitemap: failed to list ${label}`, error);
		return [];
	}
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const now = new Date();

	const entries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
		url: absoluteUrl(route.path),
		lastModified: now,
		changeFrequency: route.changeFrequency,
		priority: route.priority,
	}));

	for (const section of docsNavSections) {
		for (const item of section.items) {
			entries.push({
				url: absoluteUrl(item.href),
				lastModified: now,
				changeFrequency: "monthly",
				priority: 0.7,
			});
		}
	}

	const [templates, addons, stacks] = await Promise.all([
		safely("templates", fetchAllTemplates),
		safely("addons", fetchAllAddons),
		safely("stacks", fetchAllStacks),
	]);

	for (const template of templates) {
		entries.push({
			url: absoluteUrl(getTemplateLatestHref(template.name)),
			lastModified: new Date(template.created_at),
			changeFrequency: "weekly",
			priority: 0.8,
		});
	}

	for (const addon of addons) {
		entries.push({
			url: absoluteUrl(getAddonHref(addon)),
			lastModified: new Date(addon.created_at),
			changeFrequency: "weekly",
			priority: 0.8,
		});
	}

	for (const stack of stacks) {
		entries.push({
			url: absoluteUrl(`/stacks/${encodeURIComponent(stack.stack_id)}`),
			lastModified: new Date(stack.created_at),
			changeFrequency: "weekly",
			priority: 0.8,
		});
	}

	const logins = new Set<string>();
	for (const template of templates) {
		const login = template.config?.author?.github;
		if (login) logins.add(login);
	}
	for (const stack of stacks) {
		const login = stack.config?.author?.github;
		if (login) logins.add(login);
	}
	for (const login of logins) {
		entries.push({
			url: absoluteUrl(`/user/${encodeURIComponent(login)}`),
			lastModified: now,
			changeFrequency: "weekly",
			priority: 0.5,
		});
	}

	return entries;
}
