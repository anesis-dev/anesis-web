import Link from "next/link";
import { LayoutTemplateIcon } from "lucide-react";
import { DocsPagination } from "@/components/docs/DocsPagination";
import { DocsHero } from "@/components/docs/DocsHero";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { DocsSection, DocsList, Markup } from "@/components/docs/prose";

const publishExamples = `# Publish a template whose manifest is at the repo root
anesis template publish https://github.com/owner/repo

# Publish a template in a subdirectory
anesis template publish https://github.com/owner/repo/tree/main/templates/react-vite-ts`;

const updateExample = `# Update an existing registry entry
anesis template update https://github.com/owner/repo/tree/main/templates/react-vite-ts`;

const urlRules = [
	"The host must be `github.com` — other Git hosts are not supported.",
	"The path must contain at least `owner/repo`.",
	"To point at a subdirectory, use the GitHub `/tree/<branch>/<path>` URL format — the same URL shown in your browser when you navigate into a folder.",
	"Both the repository root URL and subdirectory URLs are valid.",
];

const publishSteps = [
	{
		title: "Validate the URL locally",
		body: "The CLI checks that the URL is a valid github.com URL with at least an owner/repo path before sending anything to the server.",
	},
	{
		title: "Send to the backend",
		body: "The CLI sends the URL to the backend as JSON. Your auth token is included in the request.",
	},
	{
		title: "Backend fetches the tree",
		body: "The backend fetches the GitHub directory tree, reads `anesis.template.json` from the published path, and validates the manifest.",
	},
	{
		title: "Registry entry is created",
		body: "The template is stored in the registry with its current commit SHA. The commit SHA is used by the CLI to skip re-downloads when nothing has changed.",
	},
];

const updateNotes = [
	"Use the same URL that was passed to `anesis template publish`.",
	"The backend re-fetches the tree, re-reads the manifest, and updates the stored commit SHA.",
	"Users who already have the old version cached will get the new version on their next `anesis template install` or `anesis template update`.",
];

export default function DocsTemplatesPublishingPage() {
	return (
		<div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-5 py-10 lg:px-8">
			<DocsHero
				eyebrow="Templates / Publishing Templates"
				eyebrowIcon={LayoutTemplateIcon}
				title="Publish your template to the registry"
				description="Publishing makes your template available to anyone with access to the Anesis registry. You point the CLI at a GitHub URL, and the backend does the rest — it fetches the directory tree, reads your manifest, and creates the registry entry."
				chips={["Requires anesis login", "GitHub URL", "Commit SHA tracking"]}
			/>

			<div className="flex flex-col gap-10">
				<DocsSection
					id="auth"
					title="Authentication required"
					lead="Both anesis template publish and anesis template update require a saved login session."
				>
					<p>
						Run <code>anesis login</code> before publishing. The CLI sends your
						auth token with the request so the backend can associate the template
						with your account. See the{" "}
						<Link
							href="/docs/authentication"
							className="font-medium text-primary hover:underline"
						>
							Authentication
						</Link>{" "}
						page for details on the login flow.
					</p>
				</DocsSection>

				<DocsSection
					id="publish"
					title="Publishing a template"
					lead="Pass the GitHub URL of your template directory. Both repo root and subdirectory URLs are accepted."
				>
					<CodeBlock code={publishExamples} />
				</DocsSection>

				<DocsSection
					id="update"
					title="Updating a template"
					lead="When you push new changes to your GitHub repo, run update to sync the registry entry with the latest commit."
				>
					<CodeBlock code={updateExample} />
					<DocsList items={updateNotes} />
				</DocsSection>

				<DocsSection
					id="flow"
					title="What happens when you publish"
					lead="The CLI and backend work together to register your template."
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

			<DocsPagination currentHref="/docs/templates/publishing" />
		</div>
	);
}
