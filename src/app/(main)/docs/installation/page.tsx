import { DocsPagination } from "@/components/docs/DocsPagination";
import { CodeBlock } from "@/components/docs/CodeBlock";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

const installUnix = `curl -sSL https://raw.githubusercontent.com/oxide-cli/oxide/main/install.sh | bash`;

const installWindows = `irm https://raw.githubusercontent.com/oxide-cli/oxide/main/install.ps1 | iex`;

const pathBash = `echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc`;

const pathZsh = `echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc`;

const manualInstall = `# Linux x86_64
https://github.com/oxide-cli/oxide/releases/latest/download/oxide-linux-x86_64.tar.gz

# macOS Apple Silicon
https://github.com/oxide-cli/oxide/releases/latest/download/oxide-macos-aarch64.tar.gz

# Windows
https://github.com/oxide-cli/oxide/releases/latest/download/oxide-windows-x86_64.zip`;

const verifyInstall = `oxide --version`;

export default function DocsInstallationPage() {
	return (
		<div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-5 py-10 lg:px-8">
			<section className="space-y-3">
				<p className="text-sm font-medium text-primary">Installation</p>
				<h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
					Install the Oxide CLI
				</h1>
				<p className="max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
					The recommended setup path is the release installer. It downloads the
					latest binary for your platform and places it in a local bin directory.
				</p>
			</section>

			<div className="grid gap-6 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Linux / macOS</CardTitle>
						<CardDescription>
							Use the official install script to fetch the latest release.
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
							Use the PowerShell installer on Windows.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<CodeBlock code={installWindows} />
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Update your PATH</CardTitle>
						<CardDescription>
							On Unix-like systems the binary is installed into{" "}
							<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
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
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Manual install</CardTitle>
						<CardDescription>
							If you prefer, download the release archive and place the binary
							where you keep user-level tools.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<CodeBlock code={manualInstall} />
						<div className="space-y-2">
							<p className="text-sm font-medium">Verify the install</p>
							<CodeBlock code={verifyInstall} />
						</div>
					</CardContent>
				</Card>
			</div>

			<DocsPagination currentHref="/docs/installation" />
		</div>
	);
}
