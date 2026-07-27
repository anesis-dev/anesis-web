import type { Metadata } from "next";
import Link from "next/link";
import {
	LegalList,
	LegalPage,
	LegalSection,
} from "@/components/legal/LegalPage";

export const metadata: Metadata = {
	title: "Privacy Policy",
	description:
		"What data Anesis collects, why, and how to access or delete it.",
	alternates: { canonical: "/privacy" },
};

const LAST_UPDATED = "24 July 2026";

export default function PrivacyPage() {
	return (
		<LegalPage
			title="Privacy Policy"
			lastUpdated={LAST_UPDATED}
			intro="This policy explains what data Anesis collects when you use the website, the API, or the CLI, why we collect it, and what control you have over it."
		>
			<LegalSection heading="1. What we collect">
				<p>
					<strong className="text-foreground">Account data.</strong> When you
					sign in with GitHub we receive and store your GitHub user ID, your
					login (username), and your avatar URL. We do not receive your GitHub
					password, and we do not request access to your private repositories.
				</p>
				<p>
					<strong className="text-foreground">API tokens.</strong> Personal
					access tokens you create are stored only as a SHA-256 hash, together
					with the name you gave them, when they were created, when they were
					last used, and when they expire. The token itself is shown once and
					never stored.
				</p>
				<p>
					<strong className="text-foreground">Published content.</strong> The
					repository URL, manifest, and version metadata for every template,
					addon, or stack you publish, plus which account published it.
				</p>
				<p>
					<strong className="text-foreground">Usage events.</strong> When a
					template, addon, or stack is installed, we record that it was
					installed, by which account (when authenticated), and when. This drives
					the download counts and the &ldquo;trending&rdquo; ordering in the
					registry. The CLI reports this on{" "}
					<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
						anesis new
					</code>{" "}
					and on addon commands.
				</p>
				<p>
					<strong className="text-foreground">Operational logs.</strong> Requests
					to the API produce a log line containing the method, path, status,
					latency, and a request identifier. Errors may be sent to Sentry for
					diagnosis.
				</p>
			</LegalSection>

			<LegalSection heading="2. Why we use it">
				<LegalList
					items={[
						"To authenticate you and authorise access to your own resources.",
						"To operate the public registry — showing who published what, and at which version.",
						"To show download and popularity counts.",
						"To detect abuse, apply rate limits, and diagnose failures.",
					]}
				/>
				<p>
					We do not sell your data, and we do not use it for advertising or
					behavioural profiling.
				</p>
			</LegalSection>

			<LegalSection heading="3. What is public">
				<p>
					Your GitHub login and avatar, and everything you publish to the public
					registry (including its metadata and aggregate download counts), are
					visible to anyone. Resources you mark as private are not listed
					publicly. Your API tokens, and the list of what you have installed, are
					never public.
				</p>
			</LegalSection>

			<LegalSection heading="4. Third parties">
				<LegalList
					items={[
						<>
							<strong className="text-foreground">GitHub</strong> — identity
							provider for sign-in, and the source of every published
							repository.
						</>,
						<>
							<strong className="text-foreground">Vercel</strong> — hosts the
							website.
						</>,
						<>
							<strong className="text-foreground">Render</strong> — hosts the
							API and its PostgreSQL database.
						</>,
						<>
							<strong className="text-foreground">Sentry</strong> — receives
							error reports, which may include a request path and stack trace.
						</>,
					]}
				/>
			</LegalSection>

			<LegalSection heading="5. Cookies">
				<p>
					We use cookies strictly to keep you signed in: a session cookie holding
					your authentication token, per-account session cookies when you add
					more than one GitHub account, and a short-lived CSRF nonce during the
					OAuth flow. All are <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">HttpOnly</code>. There
					are no advertising or analytics cookies.
				</p>
			</LegalSection>

			<LegalSection heading="6. Retention">
				<p>
					Account data is kept while your account exists. Revoked API tokens are
					deleted immediately. Usage events are currently retained indefinitely
					in aggregate form to keep historical download counts accurate.
				</p>
			</LegalSection>

			<LegalSection heading="7. Your rights">
				<p>
					You can view and revoke your API tokens at{" "}
					<Link
						href="/account/tokens"
						className="text-primary underline-offset-4 hover:underline"
					>
						/account/tokens
					</Link>
					, and unpublish resources you own from your account pages. To request
					access to, correction of, or deletion of your data, open an issue or
					contact us at the link below. Depending on where you live you may have
					additional rights under the GDPR or similar laws; we will honour them.
				</p>
			</LegalSection>

			<LegalSection heading="8. Changes">
				<p>
					We may update this policy. Material changes will be reflected in the
					&ldquo;last updated&rdquo; date above.
				</p>
			</LegalSection>

			<LegalSection heading="9. Contact">
				<p>
					Privacy questions or requests: open an issue at{" "}
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
