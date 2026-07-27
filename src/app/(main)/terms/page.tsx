import type { Metadata } from "next";
import Link from "next/link";
import {
	LegalList,
	LegalPage,
	LegalSection,
} from "@/components/legal/LegalPage";

export const metadata: Metadata = {
	title: "Terms of Service",
	description:
		"The terms that govern use of the Anesis website, registry, and CLI.",
	alternates: { canonical: "/terms" },
};

const LAST_UPDATED = "24 July 2026";

export default function TermsPage() {
	return (
		<LegalPage
			title="Terms of Service"
			lastUpdated={LAST_UPDATED}
			intro="These terms govern your use of the Anesis website, the public registry of templates, addons and stacks, and the Anesis CLI. By signing in with GitHub or publishing to the registry, you agree to them."
		>
			<LegalSection heading="1. The service">
				<p>
					Anesis is a registry and command-line tool for scaffolding projects
					from templates and extending them with addons. The website, the API,
					and the CLI are provided together as &ldquo;the Service&rdquo;.
				</p>
				<p>
					The Service is currently offered free of charge and without a service
					level commitment. It may change, be interrupted, or be discontinued at
					any time.
				</p>
			</LegalSection>

			<LegalSection heading="2. Accounts">
				<p>
					Accounts are created by signing in with GitHub. You are responsible for
					activity carried out under your account and for keeping your API tokens
					secret. An API token carries the full authority of your account — treat
					it like a password, and revoke it from{" "}
					<Link href="/account/tokens" className="text-primary underline-offset-4 hover:underline">
						your token settings
					</Link>{" "}
					if it may have been exposed.
				</p>
				<p>
					You must be able to form a binding contract in your jurisdiction to use
					the Service.
				</p>
			</LegalSection>

			<LegalSection heading="3. Your content">
				<p>
					When you publish a template, addon, or stack you keep ownership of it.
					You grant us the right to host, store, index, and display that content
					and its metadata so the Service can function — that is, to show it in
					the public registry and serve it to anyone who installs it.
				</p>
				<p>You confirm that, for anything you publish:</p>
				<LegalList
					items={[
						"you have the right to publish it and to grant the licence above;",
						"it does not infringe anyone else's intellectual property or other rights;",
						"it does not contain secrets, credentials, or personal data of others;",
						"it does not contain malware or code designed to damage a user's system.",
					]}
				/>
				<p>
					The source repository you point a manifest at remains yours and is
					governed by whatever licence you put on it.
				</p>
			</LegalSection>

			<LegalSection heading="4. Acceptable use">
				<p>You agree not to:</p>
				<LegalList
					items={[
						"use the Service to distribute malware, or to attack, probe, or disrupt it or its users;",
						"attempt to access accounts, tokens, or private resources that are not yours;",
						"scrape or automate against the API in a way that degrades it for others, or evade rate limits;",
						"publish unlawful content, or content you were asked to remove and have no right to republish.",
					]}
				/>
				<p>
					We may remove content and suspend accounts that breach these terms.
				</p>
			</LegalSection>

			<LegalSection heading="5. Third-party content and code execution">
				<p>
					The registry hosts content published by other users. We do not review
					or endorse it. Applying an addon can execute commands from that
					addon&apos;s manifest on your machine — review an addon before applying
					it, especially when running non-interactively with{" "}
					<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
						--yes
					</code>
					, a stack, or an AI agent.
				</p>
			</LegalSection>

			<LegalSection heading="6. Our software licence">
				<p>
					The Anesis CLI and server are source-available under the{" "}
					<Link
						href="https://github.com/anesis-dev/anesis-cli/blob/main/LICENSE.md"
						target="_blank"
						rel="noopener noreferrer"
						className="text-primary underline-offset-4 hover:underline"
					>
						PolyForm Noncommercial License 1.0.0
					</Link>
					. That licence covers Anesis itself and does not restrict what you
					build with projects scaffolded from it — templates and addons in the
					official registry carry their own permissive licence.
				</p>
			</LegalSection>

			<LegalSection heading="7. Disclaimer and liability">
				<p>
					The Service is provided &ldquo;as is&rdquo;, without warranties of any
					kind, express or implied, including fitness for a particular purpose
					and non-infringement.
				</p>
				<p>
					To the fullest extent permitted by law, we are not liable for any
					indirect, incidental, or consequential damages, or for loss of data,
					profits, or business, arising from your use of the Service.
				</p>
			</LegalSection>

			<LegalSection heading="8. Termination">
				<p>
					You may stop using the Service at any time and delete your account. We
					may suspend or terminate access if these terms are breached. Content
					you published may remain available to users who already installed it.
				</p>
			</LegalSection>

			<LegalSection heading="9. Changes">
				<p>
					We may update these terms. Material changes will be reflected in the
					&ldquo;last updated&rdquo; date above. Continuing to use the Service
					after a change means you accept the updated terms.
				</p>
			</LegalSection>

			<LegalSection heading="10. Contact">
				<p>
					Questions about these terms: open an issue at{" "}
					<Link
						href="https://github.com/anesis-dev/anesis-cli/issues"
						target="_blank"
						rel="noopener noreferrer"
						className="text-primary underline-offset-4 hover:underline"
					>
						github.com/anesis-dev/anesis-cli
					</Link>
					.
				</p>
			</LegalSection>
		</LegalPage>
	);
}
