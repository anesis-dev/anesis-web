import Link from "next/link";
import { nav } from "@/constants/nav";

const footerLinks = [
	{ title: "Installation", href: "/docs/installation" },
	{ title: "CLI", href: "/docs/cli" },
	{ title: "Templates", href: "/docs/templates" },
	{ title: "Addons", href: "/docs/addons" },
	{
		title: "GitHub",
		href: "https://github.com/oxide-cli/oxide",
		external: true,
	},
];

export default function Footer() {
	return (
		<footer className="border-t bg-card/40">
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 py-8 lg:flex-row lg:items-end lg:justify-between lg:px-8">
				<div className="space-y-2">
					<p className="font-mono text-lg font-extrabold">Oxide</p>
					<p className="max-w-md text-sm leading-6 text-muted-foreground">
						Rust CLI for project scaffolding and template-driven setup.
					</p>
				</div>

				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					<div>
						<p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
							Product
						</p>
						<div className="flex flex-col gap-2">
							{nav.map((item) => (
								<Link
									key={item.url}
									href={`/${item.url}`}
									className="text-sm text-muted-foreground transition-colors hover:text-foreground"
								>
									{item.title}
								</Link>
							))}
						</div>
					</div>

					<div>
						<p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
							Docs
						</p>
						<div className="flex flex-col gap-2">
							{footerLinks
								.filter((item) => !item.external)
								.map((item) => (
									<Link
										key={item.href}
										href={item.href}
										className="text-sm text-muted-foreground transition-colors hover:text-foreground"
									>
										{item.title}
									</Link>
								))}
						</div>
					</div>

					<div>
						<p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
							Links
						</p>
						<div className="flex flex-col gap-2">
							<Link
								href="https://github.com/oxide-cli/oxide"
								target="_blank"
								rel="noopener noreferrer"
								className="text-sm text-muted-foreground transition-colors hover:text-foreground"
							>
								GitHub
							</Link>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
