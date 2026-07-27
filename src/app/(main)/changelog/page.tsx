import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Changelog",
	description:
		"Release notes for the Anesis CLI, registry, and web application.",
	alternates: { canonical: "/changelog" },
};

type Release = {
	version: string;
	date: string;
	summary: string;
	sections: { heading: string; items: string[] }[];
};

const releases: Release[] = [
	{
		version: "1.0.0",
		date: "2026",
		summary:
			"Anesis's first stable release. The CLI, the registry manifest format, and the templates, addons and stacks it scaffolds are now covered by a compatibility policy.",
		sections: [
			{
				heading: "Added",
				items: [
					"anesis new — scaffold a project from a remote template, optionally combined with a stack (--stack) that installs a template plus a curated set of addons.",
					"anesis template / addon / stack — install, list, inspect, remove, publish, and update registry entries.",
					"Stacks are multi-versioned and carry a structured author (name + github), mirroring templates and addons.",
					"anesis use / anesis undo — run and revert addon commands against a scaffolded project.",
					"anesis outdated / anesis update — check for and apply addon updates.",
					"anesis search — search templates, addons, and stacks.",
					"anesis login / logout / account — GitHub-backed authentication.",
					"anesis mcp — run an MCP stdio server exposing Anesis to AI agents.",
					"anesis completions — shell completions for bash, zsh, fish, and PowerShell.",
					"anesis info / anesis status — inspect CLI and project state.",
					"Release archives are published with a SHA256SUMS file, and every installer (install.sh, install.ps1, npm, anesis upgrade) verifies the download against it before installing.",
					"Prebuilt binaries for Linux x86_64/ARM64, macOS Apple Silicon and Intel, and Windows x86_64.",
					"API tokens can be given an expiry date, and expired tokens stop authenticating.",
				],
			},
			{
				heading: "Fixed",
				items: [
					"Deleting a stack removed every published version of it instead of the requested one.",
					"Addon run steps failed on Windows because they always invoked sh -c; package-manager steps could not resolve npm/bun/pnpm/yarn shims.",
					"The nest-saas stack referenced three addon ids that did not exist or had been renamed.",
					"The README quick start referenced a nonexistent drizzle addon.",
				],
			},
		],
	},
];

export default function ChangelogPage() {
	return (
		<article className="mx-auto w-full max-w-3xl px-5 py-14 lg:px-8">
			<h1 className="text-3xl font-bold tracking-tight">Changelog</h1>
			<p className="mt-3 text-sm leading-7 text-muted-foreground">
				Notable changes to Anesis. This project follows{" "}
				<Link
					href="https://semver.org/spec/v2.0.0.html"
					target="_blank"
					rel="noopener noreferrer"
					className="text-primary underline-offset-4 hover:underline"
				>
					Semantic Versioning
				</Link>
				. Versions before 1.0.0 are not listed here — see the{" "}
				<Link
					href="https://github.com/anesis-dev/anesis-cli/releases"
					target="_blank"
					rel="noopener noreferrer"
					className="text-primary underline-offset-4 hover:underline"
				>
					GitHub releases
				</Link>{" "}
				for that history.
			</p>

			<div className="mt-12 flex flex-col gap-14">
				{releases.map((release) => (
					<article key={release.version} className="space-y-5">
						<div className="flex flex-wrap items-baseline gap-3 border-b pb-3">
							<h2
								id={`v${release.version}`}
								className="scroll-mt-24 text-2xl font-semibold tracking-tight"
							>
								{release.version}
							</h2>
							<span className="text-sm text-muted-foreground">
								{release.date}
							</span>
						</div>

						<p className="text-sm leading-7 text-muted-foreground">
							{release.summary}
						</p>

						{release.sections.map((section) => (
							<section key={section.heading} className="space-y-3">
								<h3 className="text-sm font-semibold uppercase tracking-wide text-primary">
									{section.heading}
								</h3>
								<ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-muted-foreground">
									{section.items.map((item) => (
										<li key={item}>{item}</li>
									))}
								</ul>
							</section>
						))}
					</article>
				))}
			</div>
		</article>
	);
}
