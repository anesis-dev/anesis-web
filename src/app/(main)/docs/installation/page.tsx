import { DownloadIcon } from "lucide-react";
import { DocsPagination } from "@/components/docs/DocsPagination";
import { DocsHero } from "@/components/docs/DocsHero";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { DocsSection, DocsSubheading } from "@/components/docs/prose";

const installUnix = `curl -sSL https://raw.githubusercontent.com/anesis-dev/anesis-cli/main/install.sh | bash`;

const installWindows = `irm https://raw.githubusercontent.com/anesis-dev/anesis-cli/main/install.ps1 | iex`;

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
https://github.com/anesis-dev/anesis-cli/releases/latest/download/anesis-linux-x86_64.tar.gz

# Linux ARM64
https://github.com/anesis-dev/anesis-cli/releases/latest/download/anesis-linux-aarch64.tar.gz

# macOS Apple Silicon
https://github.com/anesis-dev/anesis-cli/releases/latest/download/anesis-macos-aarch64.tar.gz

# Windows x86_64
https://github.com/anesis-dev/anesis-cli/releases/latest/download/anesis-windows-x86_64.zip`;

export default function DocsInstallationPage() {
	return (
		<div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-5 py-10 lg:px-8">
			<DocsHero
				eyebrow="Installation"
				eyebrowIcon={DownloadIcon}
				title="Install Anesis from scripts, npm, cargo, or release artifacts"
				description={
					<>
						The repository currently exposes four practical installation paths:
						the Unix shell installer, the PowerShell installer, the npm wrapper
						package <code>@anesis-cli/anesis</code>, and a direct cargo install
						for Rust users.
					</>
				}
				chips={[
					"Scripts install to ~/.local/bin",
					"Cargo installs to ~/.cargo/bin",
					"NPM wrapper downloads the platform binary in postinstall",
				]}
			/>

			<div className="flex flex-col gap-10">
				<DocsSection
					id="shell-installers"
					title="Shell installers"
					lead="The official installers fetch the latest release binary and drop it on your PATH. This is the recommended path for most users."
				>
					<DocsSubheading id="linux-macos">Linux and macOS</DocsSubheading>
					<CodeBlock code={installUnix} />

					<DocsSubheading id="windows">Windows PowerShell</DocsSubheading>
					<CodeBlock code={installWindows} />
				</DocsSection>

				<DocsSection
					id="npm"
					title="Install with npm"
					lead={
						<>
							The npm wrapper package defined in the repository is{" "}
							<code>@anesis-cli/anesis</code>.
						</>
					}
				>
					<CodeBlock code={installNpm} />
					<p>
						The package downloads the matching Anesis binary during{" "}
						<code>postinstall</code> and then exposes the <code>anesis</code>{" "}
						executable.
					</p>
				</DocsSection>

				<DocsSection
					id="cargo"
					title="Install with cargo"
					lead="Use cargo when you already have the Rust toolchain and want the CLI directly from crates.io."
				>
					<CodeBlock code={installCargo} />
					<p>
						Cargo places the binary into <code>~/.cargo/bin</code>, so make sure
						your shell loads that directory.
					</p>
				</DocsSection>

				<DocsSection
					id="path-and-verify"
					title="PATH setup and verification"
					lead={
						<>
							The Unix installers write the binary to <code>~/.local/bin</code>.
							If <code>anesis</code> is not found after install, add that
							directory to your PATH.
						</>
					}
				>
					<DocsSubheading id="path-bash">Bash</DocsSubheading>
					<CodeBlock code={pathBash} />

					<DocsSubheading id="path-zsh">Zsh</DocsSubheading>
					<CodeBlock code={pathZsh} />

					<DocsSubheading id="verify">Verify the install</DocsSubheading>
					<CodeBlock code={verifyInstall} />
				</DocsSection>

				<DocsSection
					id="upgrade"
					title="Upgrade Anesis"
					lead="Update the installed CLI binary from the latest GitHub Release."
				>
					<CodeBlock code={upgradeCommand} />
					<p>
						After most commands, Anesis checks for a newer CLI release in the
						background and prints a short notice when an update is available.
					</p>
				</DocsSection>

				<DocsSection
					id="completions"
					title="Shell completions"
					lead="Install tab completion for bash, zsh, fish, or PowerShell."
				>
					<CodeBlock code={completionsCommand} />
				</DocsSection>

				<DocsSection
					id="manual"
					title="Manual release artifacts"
					lead="If you prefer to place the binary yourself, download the archive for your platform from GitHub Releases."
				>
					<CodeBlock code={manualInstall} />
				</DocsSection>
			</div>

			<DocsPagination currentHref="/docs/installation" />
		</div>
	);
}
