import { fireEvent, render, screen } from "@testing-library/react";
import { RegistryCard } from "@/components/registry/RegistryCard";

function renderCard(props: Partial<React.ComponentProps<typeof RegistryCard>> = {}) {
	const onToggleStar = vi.fn();
	render(
		<RegistryCard
			href="/templates/nest-express"
			title="NestJS + Express"
			description="A NestJS API on Express."
			isStarred={false}
			starCount={3}
			onToggleStar={onToggleStar}
			{...props}
		/>,
	);
	return { onToggleStar };
}

describe("RegistryCard", () => {
	it("renders the title, description and a link covering the card", () => {
		renderCard();

		expect(screen.getByText("NestJS + Express")).toBeInTheDocument();
		expect(screen.getByText("A NestJS API on Express.")).toBeInTheDocument();
		expect(
			screen.getByRole("link", { name: "NestJS + Express" }),
		).toHaveAttribute("href", "/templates/nest-express");
	});

	it("falls back to a placeholder when there is no description", () => {
		renderCard({ description: undefined });

		expect(screen.getByText("No description.")).toBeInTheDocument();
	});

	it("shows the official and private badges only when asked", () => {
		renderCard();
		expect(screen.queryByText(/official/i)).not.toBeInTheDocument();
		expect(screen.queryByText(/private/i)).not.toBeInTheDocument();

		renderCard({ official: true, isPrivate: true });
		expect(screen.getByText(/official/i)).toBeInTheDocument();
		expect(screen.getByText(/private/i)).toBeInTheDocument();
	});

	it("links the owner to their profile", () => {
		renderCard({
			owner: { label: "@anesis-dev", href: "/user/anesis-dev" },
		});

		expect(screen.getByRole("link", { name: "@anesis-dev" })).toHaveAttribute(
			"href",
			"/user/anesis-dev",
		);
	});

	it("shows at most four tags and collapses the rest into a counter", () => {
		renderCard({ tags: ["ts", "nest", "api", "docker", "prisma", "jwt"] });

		for (const tag of ["ts", "nest", "api", "docker"]) {
			expect(screen.getByText(tag)).toBeInTheDocument();
		}
		expect(screen.queryByText("prisma")).not.toBeInTheDocument();
		expect(screen.getByText("+2")).toBeInTheDocument();
	});

	it("does not render a counter when the tags fit", () => {
		renderCard({ tags: ["ts", "nest"] });

		expect(screen.queryByText(/^\+\d+$/)).not.toBeInTheDocument();
	});

	it("renders meta items", () => {
		renderCard({
			meta: [{ label: "1.2k downloads" }, { label: "updated today" }],
		});

		expect(screen.getByText("1.2k downloads")).toBeInTheDocument();
		expect(screen.getByText("updated today")).toBeInTheDocument();
	});

	it("shows the version, and the version count only when there is more than one", () => {
		renderCard({ version: "1.0.0", versionCount: 1 });
		expect(screen.getByText(/v1\.0\.0/)).toBeInTheDocument();
		expect(screen.queryByText("(1)")).not.toBeInTheDocument();

		renderCard({ version: "1.0.0", versionCount: 3 });
		expect(screen.getByText("(3)")).toBeInTheDocument();
	});

	it("forwards a star toggle to its handler", () => {
		const { onToggleStar } = renderCard();

		fireEvent.click(screen.getByRole("button", { name: /star/i }));

		expect(onToggleStar).toHaveBeenCalledTimes(1);
	});

	it("does not toggle when starring is disabled", () => {
		const { onToggleStar } = renderCard({ starDisabled: true });

		const button = screen.getByRole("button", { name: /star/i });
		expect(button).toBeDisabled();
		fireEvent.click(button);
		expect(onToggleStar).not.toHaveBeenCalled();
	});
});
