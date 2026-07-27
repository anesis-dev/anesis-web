import type { Metadata } from "next";
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
			"Create a new project directory from a registry template, or from a stack (template + ordered addons). Renders every .tera file through the project name and any declared inputs; copies everything else verbatim.",
		usage: "anesis new <name> [template_name] [flags]",
		args: [
			{
				name: "<name>",
				description:
					'Project directory to create. Use "." to scaffold into the current directory.',
			},
			{
				name: "[template_name]",
				description:
					"Template to use, e.g. react-vite-ts. Omit to pick interactively; ignored when --stack is given.",
			},
		],
		flags: [
			{
				name: "--stack <path-or-id>",
				description:
					"Scaffold from a stack manifest (anesis.stack.json) instead of a bare template: renders the stack's template, then applies its ordered addons.",
			},
			{
				name: "-i, --installed",
				description: "Only offer templates already downloaded to the local cache.",
			},
			{
				name: "-y, --yes",
				description: "Accept all defaults and skip confirmation prompts.",
			},
			{
				name: "--input <NAME=VALUE>",
				description:
					"Provide an input value non-interactively. Repeatable for multiple inputs.",
			},
		],
		example: `# New project in ./my-app
anesis new my-app react-vite-ts

# Scaffold into the current directory
anesis new . react-vite-ts

# Scaffold a template + a pinned set of addons
anesis new my-app --stack nest-saas

# Fully non-interactive
anesis new my-app react-vite-ts --yes --input use_ssl=true`,
	},
	{
		id: "use",
		command: "anesis use",
		summary:
			"Run a command exposed by an installed addon inside the current project. Anesis detects the project variant, prompts for inputs, applies the steps, and records the run in anesis.lock.",
		usage: "anesis use [addon_id] [command] [flags]",
		args: [
			{
				name: "[addon_id]",
				description:
					"Identifier of an installed addon, e.g. nest-prisma-v7. Omit to pick interactively.",
			},
			{
				name: "[command]",
				description:
					"Addon command to execute, e.g. install. Omit to list the addon's available commands.",
			},
		],
		flags: [
			{
				name: "-i, --installed",
				description: "Only offer addons already downloaded to the local cache.",
			},
			{
				name: "-y, --yes",
				description: "Accept all defaults and skip confirmation prompts.",
			},
			{
				name: "--input <NAME=VALUE>",
				description:
					"Provide an input value non-interactively. Repeatable for multiple inputs.",
			},
			{
				name: "--dry-run",
				description:
					"Show the plan — variant, inputs, steps — without changing any files.",
			},
		],
		example: `# Apply the addon's "install" command to this project
anesis use nest-prisma-v7 install

# See what it would do first
anesis use nest-prisma-v7 install --dry-run

# List the commands an addon exposes
anesis use nest-prisma-v7`,
	},
	{
		id: "undo",
		command: "anesis undo",
		summary:
			"Revert an applied addon's changes in the current project by replaying its rollback journal (from anesis.lock) in reverse order.",
		usage: "anesis undo <addon_id> [flags]",
		args: [
			{ name: "<addon_id>", description: "Addon to revert, as recorded in anesis.lock." },
		],
		flags: [
			{ name: "-y, --yes", description: "Skip the confirmation prompt." },
		],
		example: `anesis undo nest-prisma-v7`,
	},
	{
		id: "outdated",
		command: "anesis outdated",
		summary:
			"List applied addons (from anesis.lock) that have a newer version available in the registry.",
		usage: "anesis outdated [flags]",
		flags: [
			{
				name: "--json",
				description:
					"Output as JSON: one entry per applied addon with its current and latest version, plus an error field when the registry could not be reached.",
			},
		],
		example: `anesis outdated --json`,
	},
	{
		id: "project-update",
		command: "anesis update",
		summary:
			"Upgrade an applied addon to the registry's latest version in this project: undoes the old version, installs the new one, then replays every command that had already run, with the same inputs. Distinct from `anesis addon republish <url>`, which refreshes a registry entry instead.",
		usage: "anesis update <addon_id> [flags]",
		args: [{ name: "<addon_id>", description: "Applied addon to upgrade." }],
		flags: [
			{
				name: "-y, --yes",
				description: "Accept all defaults, skip confirmation prompts.",
			},
		],
		example: `anesis update nest-prisma-v7`,
	},
	{
		id: "search",
		command: "anesis search",
		summary:
			"Interactively search the registry across templates, addons, and stacks in one picker.",
		usage: "anesis search [query] [flags]",
		args: [
			{
				name: "[query]",
				description: "Pre-fill the filter; you can also type in the picker.",
			},
		],
		flags: [
			{
				name: "--json",
				description:
					"Print matching results as JSON (kind, id, name, description) instead of opening the picker.",
			},
		],
		example: `anesis search prisma
anesis search prisma --json`,
	},
	{
		id: "info",
		command: "anesis info",
		aliases: ["anesis doctor"],
		summary: "Show the CLI version, local data paths, and login status.",
		usage: "anesis info [flags]",
		flags: [{ name: "--json", description: "Output as JSON." }],
		example: `anesis info`,
	},
	{
		id: "status",
		command: "anesis status",
		summary:
			"Show the current project's template and the addons applied to it, read from anesis.json and anesis.lock.",
		usage: "anesis status [flags]",
		flags: [{ name: "--json", description: "Output as JSON." }],
		example: `anesis status`,
	},
];

const templateCommands: CommandRefData[] = [
	{
		id: "template-install",
		command: "anesis template install",
		aliases: ["anesis t i"],
		summary:
			"Download a template from the registry and cache it under ~/.anesis/cache/templates. Skips the download when the cached commit SHA already matches the registry.",
		usage: "anesis template install [template_name]",
		args: [
			{
				name: "[template_name]",
				description: "Template to download. Omit to pick interactively.",
			},
		],
		example: `anesis template install react-vite-ts`,
	},
	{
		id: "template-link",
		command: "anesis template link",
		summary:
			"Validate a local directory's anesis.template.json and cache it under its manifest name, for local testing without publishing.",
		usage: "anesis template link [path] [flags]",
		args: [
			{
				name: "[path]",
				description: "Directory to validate. Defaults to the current directory.",
			},
		],
		flags: [
			{
				name: "-f, --force",
				description: "Overwrite an existing cached template of the same name without asking.",
			},
		],
		example: `anesis template link ./my-template --force`,
	},
	{
		id: "template-list",
		command: "anesis template list",
		aliases: ["anesis t l"],
		summary: "List every template currently cached on this machine.",
		usage: "anesis template list [flags]",
		flags: [{ name: "--json", description: "Output as JSON." }],
		example: `anesis template list`,
	},
	{
		id: "template-info",
		command: "anesis template info",
		summary: "Show a template's manifest: description, version, and repository.",
		usage: "anesis template info <template_name> [flags]",
		args: [{ name: "<template_name>", description: "Template to inspect." }],
		flags: [{ name: "--json", description: "Output as JSON." }],
		example: `anesis template info react-vite-ts`,
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
		id: "template-republish",
		command: "anesis template republish",
		aliases: ["anesis t rp", "anesis template update (deprecated)"],
		summary:
			"Re-fetch a previously published template and refresh its stored commit SHA. Use the same URL you published with.",
		usage: "anesis template republish <template_url> [flags]",
		args: [
			{ name: "<template_url>", description: "GitHub URL used at publish time." },
		],
		flags: publishFlags,
		example: `anesis template republish https://github.com/owner/repo`,
	},
];

const addonCommands: CommandRefData[] = [
	{
		id: "addon-install",
		command: "anesis addon install",
		aliases: ["anesis a i"],
		summary:
			"Pre-download an addon into the local cache. Optional — running an addon command auto-installs it when missing.",
		usage: "anesis addon install [addon_id]",
		args: [
			{
				name: "[addon_id]",
				description: "Addon to download. Omit to pick interactively.",
			},
		],
		example: `anesis addon install nest-prisma-v7`,
	},
	{
		id: "addon-link",
		command: "anesis addon link",
		summary:
			"Validate a local directory's anesis.addon.json and cache it under its manifest id, for local testing without publishing.",
		usage: "anesis addon link [path] [flags]",
		args: [
			{
				name: "[path]",
				description: "Directory to validate. Defaults to the current directory.",
			},
		],
		flags: [
			{
				name: "-f, --force",
				description: "Overwrite an existing cached addon with the same id without asking.",
			},
		],
		example: `anesis addon link ./my-addon --force`,
	},
	{
		id: "addon-list",
		command: "anesis addon list",
		aliases: ["anesis a l"],
		summary: "List every addon currently cached on this machine.",
		usage: "anesis addon list [flags]",
		flags: [{ name: "--json", description: "Output as JSON." }],
		example: `anesis addon list`,
	},
	{
		id: "addon-info",
		command: "anesis addon info",
		summary:
			"Show an addon's manifest: description, version, variants, commands, inputs, and steps.",
		usage: "anesis addon info <addon_id> [flags]",
		args: [{ name: "<addon_id>", description: "Addon to inspect." }],
		flags: [{ name: "--json", description: "Output as JSON." }],
		example: `anesis addon info nest-prisma-v7`,
	},
	{
		id: "addon-test",
		command: "anesis addon test",
		summary:
			"Dry-run an addon command on a throwaway copy of a project and show the resulting diff — the addon author's test loop.",
		usage: "anesis addon test <addon_id> <command> [flags]",
		args: [
			{ name: "<addon_id>", description: "Addon to test." },
			{ name: "<command>", description: "Command to run." },
		],
		flags: [
			{
				name: "--project <path>",
				description:
					"Fixture project to test on. Defaults to the addon's bundled test-fixture/ directory.",
			},
		],
		example: `anesis addon test nest-prisma-v7 install
anesis addon test nest-prisma-v7 install --project ./fixtures/fastify-app`,
	},
	{
		id: "addon-remove",
		command: "anesis addon remove",
		aliases: ["anesis a r"],
		summary: "Delete a cached addon and remove its entry from the addon index.",
		usage: "anesis addon remove <addon_id>",
		args: [{ name: "<addon_id>", description: "Cached addon to remove." }],
		example: `anesis addon remove nest-prisma-v7`,
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
		id: "addon-republish",
		command: "anesis addon republish",
		aliases: ["anesis a rp", "anesis addon update (deprecated)"],
		summary:
			"Re-fetch a previously published addon and refresh its stored commit SHA.",
		usage: "anesis addon republish <addon_url> [flags]",
		args: [
			{ name: "<addon_url>", description: "GitHub URL used at publish time." },
		],
		flags: publishFlags,
		example: `anesis addon republish https://github.com/owner/repo`,
	},
];

const stackCommands: CommandRefData[] = [
	{
		id: "stack-install",
		command: "anesis stack install",
		aliases: ["anesis s i"],
		summary:
			"Download a stack manifest from the registry and cache it under ~/.anesis/cache/stacks. Optional — anesis new --stack auto-installs it when missing.",
		usage: "anesis stack install <stack_id>",
		args: [{ name: "<stack_id>", description: "Stack to download." }],
		example: `anesis stack install nest-saas`,
	},
	{
		id: "stack-link",
		command: "anesis stack link",
		summary:
			"Validate a local anesis.stack.json and cache it under its manifest id, so it can be scaffolded with anesis new --stack before it is published.",
		usage: "anesis stack link [path] [flags]",
		args: [
			{
				name: "[path]",
				description:
					"Directory or manifest to validate. Defaults to the current directory.",
			},
		],
		flags: [
			{
				name: "--force",
				description: "Overwrite an existing cached stack without asking.",
			},
		],
		example: `anesis stack link ./my-stack`,
	},
	{
		id: "stack-list",
		command: "anesis stack list",
		aliases: ["anesis s l"],
		summary: "List every stack currently cached on this machine.",
		usage: "anesis stack list [flags]",
		flags: [{ name: "--json", description: "Output as JSON." }],
		example: `anesis stack list`,
	},
	{
		id: "stack-info",
		command: "anesis stack info",
		summary:
			"Show a stack's composition: its template and its ordered list of addons with their commands.",
		usage: "anesis stack info <stack_id> [flags]",
		args: [{ name: "<stack_id>", description: "Stack to inspect." }],
		flags: [{ name: "--json", description: "Output as JSON." }],
		example: `anesis stack info nest-saas`,
	},
	{
		id: "stack-remove",
		command: "anesis stack remove",
		aliases: ["anesis s r"],
		summary: "Delete a locally cached stack manifest.",
		usage: "anesis stack remove <stack_id>",
		args: [{ name: "<stack_id>", description: "Cached stack to remove." }],
		example: `anesis stack remove nest-saas`,
	},
	{
		id: "stack-publish",
		command: "anesis stack publish",
		aliases: ["anesis s p"],
		summary:
			"Publish a GitHub repository as a registry stack. The backend fetches the tree, validates anesis.stack.json, and stores the entry.",
		usage: "anesis stack publish <stack_url> [flags]",
		args: [{ name: "<stack_url>", description: "GitHub URL of the stack repository." }],
		flags: publishFlags,
		example: `anesis stack publish https://github.com/owner/repo`,
	},
	{
		id: "stack-republish",
		command: "anesis stack republish",
		aliases: ["anesis s rp", "anesis stack update (deprecated)"],
		summary: "Republish a stack from its GitHub repository, refreshing the registry entry.",
		usage: "anesis stack republish <stack_url> [flags]",
		args: [{ name: "<stack_url>", description: "GitHub URL used at publish time." }],
		flags: publishFlags,
		example: `anesis stack republish https://github.com/owner/repo`,
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
		usage: "anesis account [flags]",
		flags: [{ name: "--json", description: "Output as JSON." }],
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
	{
		id: "mcp",
		command: "anesis mcp",
		summary:
			"Run a Model Context Protocol stdio server so AI agents can search the registry, scaffold projects, and apply addons or stacks.",
		usage: "anesis mcp",
		example: `anesis mcp`,
	},
];

const sections = [
	{
		id: "projects",
		title: "Projects",
		description:
			"Create projects, apply addons to them, and inspect or roll back what's been applied.",
		commands: projectCommands,
	},
	{
		id: "templates",
		title: "Templates",
		description: "Install, link, inspect, and publish project starters.",
		commands: templateCommands,
	},
	{
		id: "addons",
		title: "Addons",
		description: "Install, link, test, inspect, and publish declarative code-mod packages.",
		commands: addonCommands,
	},
	{
		id: "stacks",
		title: "Stacks",
		description: "Install, inspect, and publish template + ordered-addon bundles.",
		commands: stackCommands,
	},
	{
		id: "account",
		title: "Account & session",
		description: "Sign in, inspect, and sign out of your Anesis account.",
		commands: accountCommands,
	},
	{
		id: "maintenance",
		title: "Maintenance & agents",
		description: "Keep the CLI up to date, wire up your shell, and serve AI agents.",
		commands: maintenanceCommands,
	},
];

export const metadata: Metadata = {
	title: "CLI commands",
	description:
		"Full command reference for the Anesis CLI: new, template, addon, stack, use, undo, outdated, update, search, login, mcp, and more.",
	alternates: { canonical: "/docs/reference/commands" },
};

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
					arguments, <code>[square brackets]</code> are optional positional
					arguments (often resolved via an interactive picker when omitted).
					Tokens marked <code>[flags]</code> are optional. Most command groups
					also accept a single-letter alias, e.g.{" "}
					<code>anesis t i react-vite-ts</code> is the same as{" "}
					<code>anesis template install react-vite-ts</code>.
				</p>
			</Callout>

			<Callout variant="note" title="The three update verbs">
				<p>
					<code>anesis update &lt;addon-id&gt;</code> upgrades an addon already
					applied in the current project.{" "}
					<code>anesis upgrade</code> (alias <code>self-update</code>) replaces
					the anesis binary itself.{" "}
					<code>anesis addon republish &lt;url&gt;</code> (and its
					template/stack equivalents) refreshes a registry entry from its source
					repository.
				</p>
				<p>
					<code>republish</code> was called <code>update</code> before 1.0.0.
					The old spelling still works as a hidden alias, so existing scripts
					keep running.
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
					first — or set <code>ANESIS_TOKEN</code> for CI and agents. Purely
					local commands such as <code>template list</code>,{" "}
					<code>addon remove</code>, <code>template/addon link</code>,{" "}
					<code>status</code>, and re-running a cached addon work offline.
				</p>
			</Callout>

			<DocsPagination currentHref="/docs/reference/commands" />
		</div>
	);
}
