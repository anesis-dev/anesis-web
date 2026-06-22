import Link from "next/link";
import { TerminalIcon } from "lucide-react";
import { DocsPagination } from "@/components/docs/DocsPagination";
import { DocsHero } from "@/components/docs/DocsHero";
import { Callout } from "@/components/docs/Callout";
import { CommandRef, type CommandRefData } from "@/components/docs/CommandRef";

const publishFlags = [
	{
		name: "--visibility <V>",
		description:
			"public, private, or org-private. Defaults to public when omitted.",
	},
	{
		name: "--credential-id <UUID>",
		description:
			"Credential ID used to read a private GitHub repository during publish.",
	},
	{
		name: "--org-id <UUID>",
		description:
			"Legacy organization target. Organizations were removed from the platform, so this is kept only for backwards compatibility.",
	},
];

const projectCommands: CommandRefData[] = [
	{
		id: "new",
		command: "anesis new",
		aliases: ["anesis n"],
		summary:
			"Create a new project directory from a registry template. Renders every .tera file with your project name and copies everything else verbatim.",
		usage: "anesis new <name> <template_name>",
		args: [
			{
				name: "<name>",
				description:
					'Project directory to create. Use "." to scaffold into the current directory.',
			},
			{
				name: "<template_name>",
				description: "Template to use, e.g. react-vite-ts.",
			},
		],
		example: `# New project in ./my-app
anesis new my-app react-vite-ts

# Scaffold into the current directory
anesis new . react-vite-ts`,
	},
	{
		id: "use",
		command: "anesis use",
		summary:
			"Run a command exposed by an installed addon inside the current project. Anesis detects the project variant, prompts for inputs, applies the steps, and records the run in anesis.lock.",
		usage: "anesis use <addon_id> <command>",
		args: [
			{
				name: "<addon_id>",
				description: "Identifier of an installed addon, e.g. nest-drizzle.",
			},
			{
				name: "<command>",
				description: "Addon command to execute, e.g. install.",
			},
		],
		example: `# Apply the addon's "install" command to this project
anesis use nest-drizzle install`,
	},
];

const templateCommands: CommandRefData[] = [
	{
		id: "template-install",
		command: "anesis template install",
		aliases: ["anesis t i"],
		summary:
			"Download a template from the registry and cache it under ~/.anesis/cache/templates. Skips the download when the cached commit SHA already matches the registry.",
		usage: "anesis template install <template_name>",
		args: [{ name: "<template_name>", description: "Template to download." }],
		example: `anesis template install react-vite-ts`,
	},
	{
		id: "template-list",
		command: "anesis template list",
		aliases: ["anesis t l"],
		summary: "List every template currently cached on this machine.",
		usage: "anesis template list",
		example: `anesis template list`,
	},
	{
		id: "template-remove",
		command: "anesis template remove",
		aliases: ["anesis t r"],
		summary:
			"Delete a template from the local cache and drop its entry from the cache index. It can be re-installed at any time.",
		usage: "anesis template remove <template_name>",
		args: [{ name: "<template_name>", description: "Cached template to remove." }],
		example: `anesis template remove react-vite-ts`,
	},
	{
		id: "template-publish",
		command: "anesis template publish",
		aliases: ["anesis t p"],
		summary:
			"Publish a GitHub repository as a registry template. The backend fetches the tree, validates anesis.template.json, and stores the entry with its commit SHA.",
		usage: "anesis template publish <template_url> [flags]",
		args: [
			{
				name: "<template_url>",
				description:
					"GitHub URL, e.g. https://github.com/owner/repo (subpaths like /tree/main/templates/x are supported).",
			},
		],
		flags: publishFlags,
		example: `anesis template publish https://github.com/owner/repo

# Private repo with a stored credential
anesis template publish https://github.com/owner/repo \\
  --visibility private --credential-id <uuid>`,
	},
	{
		id: "template-update",
		command: "anesis template update",
		aliases: ["anesis t u"],
		summary:
			"Re-fetch a previously published template and refresh its stored commit SHA. Use the same URL you published with.",
		usage: "anesis template update <template_url> [flags]",
		args: [
			{ name: "<template_url>", description: "GitHub URL used at publish time." },
		],
		flags: publishFlags,
		example: `anesis template update https://github.com/owner/repo`,
	},
];

const addonCommands: CommandRefData[] = [
	{
		id: "addon-install",
		command: "anesis addon install",
		aliases: ["anesis a i"],
		summary:
			"Pre-download an addon into the local cache. Optional — running an addon command auto-installs it when missing.",
		usage: "anesis addon install <addon_id>",
		args: [{ name: "<addon_id>", description: "Addon to download." }],
		example: `anesis addon install nest-drizzle`,
	},
	{
		id: "addon-list",
		command: "anesis addon list",
		aliases: ["anesis a l"],
		summary: "List every addon currently cached on this machine.",
		usage: "anesis addon list",
		example: `anesis addon list`,
	},
	{
		id: "addon-remove",
		command: "anesis addon remove",
		aliases: ["anesis a r"],
		summary: "Delete a cached addon and remove its entry from the addon index.",
		usage: "anesis addon remove <addon_id>",
		args: [{ name: "<addon_id>", description: "Cached addon to remove." }],
		example: `anesis addon remove nest-drizzle`,
	},
	{
		id: "addon-publish",
		command: "anesis addon publish",
		aliases: ["anesis a p"],
		summary:
			"Publish a GitHub repository as a registry addon. The backend fetches the tree, validates anesis.addon.json, and stores the entry with its commit SHA.",
		usage: "anesis addon publish <addon_url> [flags]",
		args: [
			{ name: "<addon_url>", description: "GitHub URL of the addon repository." },
		],
		flags: publishFlags,
		example: `anesis addon publish https://github.com/owner/repo`,
	},
	{
		id: "addon-update",
		command: "anesis addon update",
		aliases: ["anesis a u"],
		summary:
			"Re-fetch a previously published addon and refresh its stored commit SHA.",
		usage: "anesis addon update <addon_url> [flags]",
		args: [
			{ name: "<addon_url>", description: "GitHub URL used at publish time." },
		],
		flags: publishFlags,
		example: `anesis addon update https://github.com/owner/repo`,
	},
];

const accountCommands: CommandRefData[] = [
	{
		id: "login",
		command: "anesis login",
		aliases: ["anesis in"],
		summary:
			"Open the browser to authenticate with GitHub, then save the session to ~/.anesis/auth.json. Required before publishing or downloading uncached registry content.",
		usage: "anesis login",
		example: `anesis login`,
	},
	{
		id: "account",
		command: "anesis account",
		summary:
			"Show the currently logged-in account by fetching the user from the backend.",
		usage: "anesis account",
		example: `anesis account`,
	},
	{
		id: "logout",
		command: "anesis logout",
		aliases: ["anesis out"],
		summary: "Remove the saved local session in ~/.anesis/auth.json.",
		usage: "anesis logout",
		example: `anesis logout`,
	},
];

const maintenanceCommands: CommandRefData[] = [
	{
		id: "upgrade",
		command: "anesis upgrade",
		summary:
			"Download and install the latest Anesis release, replacing the current binary in place.",
		usage: "anesis upgrade",
		example: `anesis upgrade`,
	},
	{
		id: "completions",
		command: "anesis completions",
		summary:
			"Print or install shell tab-completion for anesis. Supports bash, zsh, fish, and powershell.",
		usage: "anesis completions <shell>",
		args: [
			{
				name: "<shell>",
				description: "One of: bash, zsh, fish, powershell.",
			},
		],
		example: `anesis completions zsh`,
	},
];

const sections = [
	{
		id: "projects",
		title: "Projects",
		description: "Create projects and apply addons to them.",
		commands: projectCommands,
	},
	{
		id: "templates",
		title: "Templates",
		description: "Install, inspect, and publish project starters.",
		commands: templateCommands,
	},
	{
		id: "addons",
		title: "Addons",
		description: "Install, inspect, and publish declarative code-mod packages.",
		commands: addonCommands,
	},
	{
		id: "account",
		title: "Account & session",
		description: "Sign in, inspect, and sign out of your Anesis account.",
		commands: accountCommands,
	},
	{
		id: "maintenance",
		title: "Maintenance",
		description: "Keep the CLI up to date and wire up your shell.",
		commands: maintenanceCommands,
	},
];

export default function DocsCommandsPage() {
	return (
		<div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-5 py-10 lg:px-8">
			<DocsHero
				eyebrow="Reference / CLI Commands"
				eyebrowIcon={TerminalIcon}
				title="Every Anesis command in one place"
				description="A complete, copy-pasteable reference for the CLI. Each command lists its short alias, usage signature, arguments, flags, and a runnable example. Jump straight to what you need from the index below."
				chips={[
					"Aliases included",
					"Usage signatures",
					"Runnable examples",
				]}
			/>

			<nav
				aria-label="Command index"
				className="rounded-2xl border bg-card/60 p-5"
			>
				<p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
					On this page
				</p>
				<div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
					{sections.map((section) => (
						<a
							key={section.id}
							href={`#${section.id}`}
							className="text-sm font-medium text-foreground transition-colors hover:text-primary"
						>
							{section.title}
						</a>
					))}
				</div>
			</nav>

			<Callout variant="tip" title="Reading the signatures">
				<p>
					Tokens in <code>&lt;angle brackets&gt;</code> are required positional
					arguments. Tokens marked <code>[flags]</code> are optional. Most
					command groups also accept a single-letter alias, e.g.{" "}
					<code>anesis t i react-vite-ts</code> is the same as{" "}
					<code>anesis template install react-vite-ts</code>.
				</p>
			</Callout>

			{sections.map((section) => (
				<section
					key={section.id}
					id={section.id}
					className="scroll-mt-24 space-y-5"
				>
					<div className="space-y-1">
						<h2 className="text-2xl font-bold tracking-tight">{section.title}</h2>
						<p className="text-sm text-muted-foreground">
							{section.description}
						</p>
					</div>
					<div className="grid gap-4">
						{section.commands.map((command) => (
							<CommandRef key={command.id} data={command} />
						))}
					</div>
				</section>
			))}

			<Callout variant="note" title="Authentication">
				<p>
					Publishing, updating, <code>anesis account</code>, and any download of
					uncached registry content require a saved session. Run{" "}
					<Link
						href="/docs/authentication"
						className="text-primary hover:underline"
					>
						anesis login
					</Link>{" "}
					first. Purely local commands such as <code>template list</code>,{" "}
					<code>addon remove</code>, and re-running a cached addon work offline.
				</p>
			</Callout>

			<DocsPagination currentHref="/docs/reference/commands" />
		</div>
	);
}
