import type { Metadata } from "next";
import Link from "next/link";
import { BoxesIcon } from "lucide-react";
import { DocsPagination } from "@/components/docs/DocsPagination";
import { DocsHero } from "@/components/docs/DocsHero";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { DocsSection, DocsList, Markup } from "@/components/docs/prose";

const publishExample = `# Publish an addon whose manifest is at the repo root
anesis addon publish https://github.com/owner/repo

# Publish an addon in a subdirectory
anesis addon publish https://github.com/owner/repo/tree/main/addons/nest-prisma-v7`;

const updateExample = `# Update an existing registry entry with the latest commit
anesis addon republish https://github.com/owner/repo/tree/main/addons/nest-prisma-v7`;

const urlRules = [
	"The host must be `github.com` — other Git hosts are not supported.",
	"The path must contain at least `owner/repo`.",
	"Use the GitHub `/tree/<branch>/<path>` URL format to point at a subdirectory.",
	"Both the repository root and subdirectory URLs are valid.",
];

const publishFlagsExample = `# Publish a private repo, referencing a stored GitHub credential
anesis addon publish https://github.com/owner/repo \\
  --visibility private --credential-id <uuid>`;

const publishFlags = [
	"`--visibility <public|private|org-private>` — defaults to public when omitted.",
	"`--credential-id <uuid>` — required to read a private GitHub repository during publish.",
	"`--org-id <uuid>` — legacy organization target, kept only for backwards compatibility.",
];

const publishSteps = [
	{
		title: "Validate the URL locally",
		body: "The CLI checks that the URL is a valid github.com URL with at least an owner/repo path before contacting the server.",
	},
	{
		title: "Send to the backend",
		body: "The CLI sends the URL to the backend as JSON. Your auth token is included with the request.",
	},
	{
		title: "Backend fetches the tree",
		body: "The backend fetches the GitHub directory tree, reads `anesis.addon.json` from the published path, and validates the manifest.",
	},
	{
		title: "Registry entry is created",
		body: "The addon is stored in the registry with its current commit SHA. The CLI uses the commit SHA to avoid redundant re-downloads.",
	},
];

export const metadata: Metadata = {
	title: "Publishing addons",
	description:
		"Publish an addon to the Anesis registry and release new versions of it.",
	alternates: { canonical: "/docs/addons/publishing" },
};

export default function DocsAddonsPublishingPage() {
	return (
		<div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-5 py-10 lg:px-8">
			<DocsHero
				eyebrow="Addons / Publishing Addons"
				eyebrowIcon={BoxesIcon}
				title="Publish your addon to the registry"
				description="Publishing makes your addon available to anyone with access to the Anesis registry. Point the CLI at a GitHub URL, and the backend fetches the directory, reads your manifest, and creates the registry entry."
				chips={["Requires anesis login", "GitHub URL", "Commit SHA tracking"]}
			/>

			<div className="flex flex-col gap-10">
				<DocsSection
					id="auth"
					title="Authentication required"
					lead="Both anesis addon publish and anesis addon republish require a saved login session."
				>
					<p>
						Run <code>anesis login</code> before publishing. The CLI sends your
						auth token with the request so the backend can associate the addon
						with your account. See the{" "}
						<Link
							href="/docs/authentication"
							className="font-medium text-primary hover:underline"
						>
							Authentication
						</Link>{" "}
						page for the full login flow.
					</p>
				</DocsSection>

				<DocsSection
					id="publish"
					title="Publishing an addon"
					lead="Pass the GitHub URL of your addon directory. Both repo root and subdirectory URLs are accepted."
				>
					<CodeBlock code={publishExample} />
				</DocsSection>

				<DocsSection
					id="visibility"
					title="Visibility and private repositories"
					lead="Publish and update both accept the same visibility flags."
				>
					<DocsList items={publishFlags} />
					<CodeBlock code={publishFlagsExample} />
				</DocsSection>

				<DocsSection
					id="update"
					title="Updating an addon"
					lead="When you push changes to your GitHub repo, run update to sync the registry with the latest commit."
				>
					<CodeBlock code={updateExample} />
					<p>
						Use the same URL that was passed to <code>anesis addon publish</code>.
						The backend re-fetches the tree, re-reads the manifest, and updates
						the stored commit SHA. Users will get the new version on their next
						install or update.
					</p>
				</DocsSection>

				<DocsSection
					id="flow"
					title="What happens when you publish"
					lead="The CLI and backend work together to register your addon."
				>
					<ol className="space-y-3 pl-5 list-decimal marker:text-muted-foreground/60">
						{publishSteps.map((item) => (
							<li key={item.title} className="pl-1">
								<span className="font-medium text-foreground">{item.title}.</span>{" "}
								<Markup>{item.body}</Markup>
							</li>
						))}
					</ol>
				</DocsSection>

				<DocsSection
					id="url-rules"
					title="GitHub URL rules"
					lead="The CLI validates the URL locally before sending it to the backend."
				>
					<DocsList items={urlRules} />
				</DocsSection>
			</div>

			<DocsPagination currentHref="/docs/addons/publishing" />
		</div>
	);
}
