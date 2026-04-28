import { DownloadIcon, PackageIcon, TerminalSquareIcon } from "lucide-react";
import { DocsPagination } from "@/components/docs/DocsPagination";
import { CodeBlock } from "@/components/docs/CodeBlock";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

const installUnix = `curl -sSL https://raw.githubusercontent.com/anesis-dev/anesis/main/install.sh | bash`;

const installWindows = `irm https://raw.githubusercontent.com/anesis-dev/anesis/main/install.ps1 | iex`;

const installNpm = `npm install -g @anesis-cli/anesis`;

const installCargo = `cargo install anesis-cli`;

const verifyInstall = `anesis --version`;

const upgradeCommand = `anesis upgrade`;

const completionsCommand = `# Example for zsh
anesis completions zsh

# Supported shells:
# bash, zsh, fish, powershell`;

const pathBash = `echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc`;

const pathZsh = `echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc`;

const manualInstall = `# Linux x86_64
https://github.com/anesis-dev/anesis/releases/latest/download/anesis-linux-x86_64.tar.gz

# Linux ARM64
https://github.com/anesis-dev/anesis/releases/latest/download/anesis-linux-aarch64.tar.gz

# macOS Apple Silicon
https://github.com/anesis-dev/anesis/releases/latest/download/anesis-macos-aarch64.tar.gz

# Windows x86_64
https://github.com/anesis-dev/anesis/releases/latest/download/anesis-windows-x86_64.zip`;

export default function DocsInstallationPage() {
	return (
		<div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-10 lg:px-8">
			<section className="relative overflow-hidden rounded-[2rem] border bg-card px-6 py-8 shadow-sm sm:px-8">
				<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(181,111,43,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(112,73,35,0.12),transparent_30%)]" />
				<div className="relative space-y-5">
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<DownloadIcon className="size-4" />
						Installation
					</div>
					<div className="max-w-3xl space-y-3">
						<h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Install Anesis from scripts, npm, cargo, or release artifacts
						</h1>
						<p className="text-sm leading-6 text-muted-foreground sm:text-base">
							The repository currently exposes four practical installation paths:
							the Unix shell installer, the PowerShell installer, the npm wrapper
							package <code>@anesis-cli/anesis</code>, and a direct cargo install for
							Rust users.
						</p>
					</div>
					<div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
						<span className="rounded-full border bg-background/80 px-3 py-1">
							Scripts install to `~/.local/bin`
						</span>
						<span className="rounded-full border bg-background/80 px-3 py-1">
							Cargo installs to `~/.cargo/bin`
						</span>
						<span className="rounded-full border bg-background/80 px-3 py-1">
							NPM wrapper downloads the platform binary in `postinstall`
						</span>
					</div>
				</div>
			</section>

			<div className="grid gap-6 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Linux and macOS</CardTitle>
						<CardDescription>
							The official shell installer fetches the latest release binary.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<CodeBlock code={installUnix} />
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Windows PowerShell</CardTitle>
						<CardDescription>
							Use the PowerShell installer when working on Windows.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<CodeBlock code={installWindows} />
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				<Card>
					<CardHeader className="gap-3">
						<div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
							<PackageIcon className="size-5" />
						</div>
						<div>
							<CardTitle>Install with npm</CardTitle>
							<CardDescription>
								The npm wrapper package defined in the repository is
								<code className="mx-1 rounded bg-muted px-1 py-0.5 font-mono text-xs">
									@anesis-cli/anesis
								</code>
								.
							</CardDescription>
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						<CodeBlock code={installNpm} />
						<p className="text-sm text-muted-foreground">
							The package downloads the matching Anesis binary during
							<code className="mx-1 rounded bg-muted px-1 py-0.5 font-mono text-xs">
								postinstall
							</code>
							and then exposes the <code>anesis</code> executable.
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="gap-3">
						<div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
							<TerminalSquareIcon className="size-5" />
						</div>
						<div>
							<CardTitle>Install with cargo</CardTitle>
							<CardDescription>
								Use cargo when you already have the Rust toolchain and want the CLI
								directly from crates.io.
							</CardDescription>
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						<CodeBlock code={installCargo} />
						<p className="text-sm text-muted-foreground">
							Cargo places the binary into
							<code className="mx-1 rounded bg-muted px-1 py-0.5 font-mono text-xs">
								~/.cargo/bin
							</code>
							, so make sure your shell loads that directory.
						</p>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Upgrade Anesis</CardTitle>
						<CardDescription>
							Update the installed CLI binary from the latest GitHub Release.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<CodeBlock code={upgradeCommand} />
						<p className="text-sm text-muted-foreground">
							After most commands, Anesis checks for a newer CLI release in the
							background and prints a short notice when an update is available.
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Shell completions</CardTitle>
						<CardDescription>
							Install tab completion for bash, zsh, fish, or PowerShell.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<CodeBlock code={completionsCommand} />
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>PATH setup and verification</CardTitle>
						<CardDescription>
							The Unix installers write the binary to
							<code className="mx-1 rounded bg-muted px-1 py-0.5 font-mono text-xs">
								~/.local/bin
							</code>
							.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<p className="text-sm font-medium">Bash</p>
							<CodeBlock code={pathBash} />
						</div>
						<div className="space-y-2">
							<p className="text-sm font-medium">Zsh</p>
							<CodeBlock code={pathZsh} />
						</div>
						<div className="space-y-2">
							<p className="text-sm font-medium">Verify</p>
							<CodeBlock code={verifyInstall} />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Manual release artifacts</CardTitle>
						<CardDescription>
							If you prefer to place the binary yourself, download the archive for
							your platform from GitHub Releases.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<CodeBlock code={manualInstall} />
					</CardContent>
				</Card>
			</div>

			<DocsPagination currentHref="/docs/installation" />
		</div>
	);
}
