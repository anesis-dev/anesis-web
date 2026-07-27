import { render, screen, within } from "@testing-library/react";
import Footer from "@/components/Footer";

function column(heading: string) {
	const label = screen
		.getAllByText(heading)
		.find((element) => element.tagName === "P");
	if (!label) throw new Error(`no footer column headed "${heading}"`);
	return within(label.parentElement!);
}

describe("Footer", () => {
	beforeEach(() => {
		render(<Footer />);
	});

	it("links every product section", () => {
		const product = column("Product");

		for (const [name, href] of [
			["Docs", "/docs"],
			["Templates", "/templates"],
			["Addons", "/addons"],
			["Stacks", "/stacks"],
		] as const) {
			expect(product.getByRole("link", { name })).toHaveAttribute("href", href);
		}
	});

	it("links the docs pages that actually exist", () => {
		const docs = column("Docs");

		expect(docs.getByRole("link", { name: "Installation" })).toHaveAttribute(
			"href",
			"/docs/installation",
		);
		expect(docs.getByRole("link", { name: "CLI reference" })).toHaveAttribute(
			"href",
			"/docs/reference/commands",
		);
		expect(docs.getByRole("link", { name: "Templates" })).toHaveAttribute(
			"href",
			"/docs/templates",
		);
	});

	it("never links to the removed /docs/cli route", () => {
		const hrefs = screen
			.getAllByRole("link")
			.map((link) => link.getAttribute("href"));

		expect(hrefs).not.toContain("/docs/cli");
	});

	it("links the legal pages", () => {
		const legal = column("Legal");

		for (const [name, href] of [
			["Terms of Service", "/terms"],
			["Privacy Policy", "/privacy"],
			["Changelog", "/changelog"],
		] as const) {
			expect(legal.getByRole("link", { name })).toHaveAttribute("href", href);
		}
	});

	it("opens external links safely", () => {
		for (const name of ["GitHub", "PolyForm Noncommercial License 1.0.0"]) {
			const link = screen.getByRole("link", { name });
			expect(link).toHaveAttribute("target", "_blank");
			expect(link.getAttribute("rel")).toContain("noopener");
			expect(link.getAttribute("rel")).toContain("noreferrer");
		}
	});

	it("states the license and the current year", () => {
		expect(screen.getByText(/no commercial use/i)).toBeInTheDocument();
		expect(
			screen.getByText(`© ${new Date().getFullYear()} Anesis`),
		).toBeInTheDocument();
	});

	it("uses a contentinfo landmark", () => {
		expect(screen.getByRole("contentinfo")).toBeInTheDocument();
	});
});
