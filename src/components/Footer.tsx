
import Link from "next/link";
import Logo from "./Logo";

const footerDocLinks = [
	{ title: "Installation", href: "/docs/installation" },
	{ title: "CLI", href: "/docs/cli" },
	{ title: "Templates", href: "/docs/templates" },
	{ title: "Addons", href: "/docs/addons" },
];

const navItems = [
	{ title: "Docs", url: "docs" },
	{ title: "Templates", url: "templates" },
	{ title: "Addons", url: "addons" },
];

export default function Footer() {
	return (
		<footer className="border-t border-white/10 bg-black/20">
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-10 lg:flex-row lg:items-end lg:justify-between lg:px-8">
				<div className="space-y-3">
					<Logo variant="full" />
					<p className="max-w-md text-sm leading-6 text-muted-foreground">
						Rust CLI for repeatable project scaffolding, shared templates, and team workflow addons.
					</p>
				</div>

				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					<div>
						<p className="mb-2 text-xs font-medium uppercase text-primary">
							Product
						</p>
						<div className="flex flex-col gap-2">
							{navItems.map((item) => (
								<Link
									key={item.url}
									href={`/${item.url}`}
									className="text-sm text-muted-foreground transition-colors hover:text-primary"
								>
									{item.title}
								</Link>
							))}
						</div>
					</div>

					<div>
						<p className="mb-2 text-xs font-medium uppercase text-primary">
							Docs
						</p>
						<div className="flex flex-col gap-2">
							{footerDocLinks.map((item) => (
								<Link
									key={item.href}
									href={item.href}
									className="text-sm text-muted-foreground transition-colors hover:text-primary"
								>
									{item.title}
								</Link>
							))}
						</div>
					</div>

					<div>
						<p className="mb-2 text-xs font-medium uppercase text-primary">
							Links
						</p>
						<div className="flex flex-col gap-2">
							<Link
								href="https://github.com/anesis-dev/anesis-cli"
								target="_blank"
								rel="noopener noreferrer"
								className="text-sm text-muted-foreground transition-colors hover:text-primary"
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
