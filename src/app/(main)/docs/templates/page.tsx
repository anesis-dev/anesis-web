import { DocsPagination } from "@/components/docs/DocsPagination";
import { CodeBlock } from "@/components/docs/CodeBlock";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

const folderExample = `my-template/
├── oxide.template.json
├── README.md
├── src/
├── Cargo.toml / pyproject.toml / go.mod / package.json
└── any other files your starter needs`;

const minimalTemplateConfig = `{
  "$schema": "https://your-api-host/schema/oxide.template.schema.json",
  "name": "react-swc-vite-ts",
  "version": "0.2.0",
  "oxideVersion": ">=0.2.0",
  "author": {
    "name": "Your Name",
    "github": "your-github-login"
  },
  "repository": {
    "type": "github",
    "url": "https://github.com/your-org/your-repo/tree/main/path/to/template",
    "release": "v0.1.0"
  },
  "specialization": "frontend",
  "scope": "web",
  "technologies": ["react"],
  "buildTool": "vite",
  "languages": ["typescript"],
  "official": false,
  "type": "base",
  "metadata": {
    "displayName": "React (SWC)",
    "description": "React template using SWC with Vite and TypeScript.",
    "tags": ["react", "vite", "swc", "typescript", "frontend", "web"]
  }
}`;

const publishCommand = `oxide publish-template https://github.com/owner/repo/tree/main/my-template`;

const checklist = [
	"`oxide.template.json` is at the root of the published folder",
	"`repository.url` points to the same `/tree/` directory",
	"`author.github` matches the GitHub account you want shown publicly",
	"metadata, tags, languages, technologies, scope, and build tool match the actual starter",
	"the folder contains a usable starter project, not only metadata files",
];

const fieldGuide = [
	{
		name: "name",
		description:
			"Machine-friendly unique template identifier. Keep it stable because users may reference it in CLI flows.",
	},
	{
		name: "version",
		description:
			"Your template version. Bump it when the template changes in a meaningful way.",
	},
	{
		name: "oxideVersion",
		description:
			"Version requirement for the Oxide CLI. Use it to signal which CLI versions can work with this template.",
	},
	{
		name: "author",
		description:
			"Public author attribution. `author.github` should point to the GitHub account users should see on the site.",
	},
	{
		name: "repository",
		description:
			"Source information for the template. `repository.url` should be the exact GitHub `/tree/` folder that contains `oxide.template.json`.",
	},
	{
		name: "scope / type / specialization",
		description:
			"High-level classification fields that help users understand where and why they would use the template.",
	},
	{
		name: "languages / technologies / buildTool",
		description:
			"Discovery metadata used in filters and cards. These should match the real stack, whether the template is for Rust, Python, Go, JavaScript, or something else.",
	},
	{
		name: "metadata",
		description:
			"`displayName`, `description`, and `tags` are the user-facing discovery layer. Write them for humans, not just for machines.",
	},
];

export default function DocsTemplatesPage() {
	return (
		<div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-5 py-10 lg:px-8">
			<section className="space-y-3">
				<p className="text-sm font-medium text-primary">Templates</p>
				<h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
					Create and publish Oxide templates
				</h1>
				<p className="max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
					Templates are normal starter folders plus an{" "}
					<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
						oxide.template.json
					</code>{" "}
					file that tells Oxide how to index and present them. The stack itself
					can be anything: Rust, Python, Go, JavaScript, TypeScript, or another
					ecosystem. The key contract is that the template folder contains a
					correctly structured metadata file.
				</p>
			</section>

			<div className="grid gap-6 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Recommended folder structure</CardTitle>
						<CardDescription>
							The folder you publish should contain the starter files and the
							template config at its root.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<CodeBlock code={folderExample} />
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Before you publish</CardTitle>
						<CardDescription>
							Validate the basics before sending the folder URL to Oxide.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ul className="space-y-3 text-sm text-muted-foreground">
							{checklist.map((item) => (
								<li key={item} className="flex gap-2">
									<span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
									<span>{item}</span>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Minimal `oxide.template.json`</CardTitle>
					<CardDescription>
						This file is the contract between your folder and the Oxide
						registry.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<CodeBlock code={minimalTemplateConfig} />
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>How to think about `oxide.template.json`</CardTitle>
					<CardDescription>
						This file is both registry metadata and the main discovery contract
						for users browsing templates.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-3">
					{fieldGuide.map((field) => (
						<div
							key={field.name}
							className="rounded-2xl border bg-muted/20 p-4"
						>
							<p className="font-mono text-sm font-medium">{field.name}</p>
							<p className="mt-2 text-sm text-muted-foreground">
								{field.description}
							</p>
						</div>
					))}
				</CardContent>
			</Card>

			<div className="grid gap-6 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Publish from the CLI</CardTitle>
						<CardDescription>
							Use a GitHub folder URL that points directly to the template
							directory. This is the flow where terminal publishing should
							require login.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4 text-sm text-muted-foreground">
						<CodeBlock code={publishCommand} />
						<p>
							Before running this, authenticate with{" "}
							<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
								oxide login
							</code>
							.
						</p>
						<p>
							The target folder must contain{" "}
							<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
								oxide.template.json
							</code>
							.
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Publish from the web app</CardTitle>
						<CardDescription>
							The Templates page exposes the same flow through a dialog UI.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3 text-sm text-muted-foreground">
						<p>1. Open the Templates page.</p>
						<p>
							2. Click <strong>Publish Template</strong>.
						</p>
						<p>3. Paste a GitHub `/tree/` URL for the template folder.</p>
						<p>4. Submit and wait for validation.</p>
					</CardContent>
				</Card>
			</div>

			<DocsPagination currentHref="/docs/templates" />
		</div>
	);
}
