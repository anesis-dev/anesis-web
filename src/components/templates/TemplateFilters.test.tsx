import { fireEvent, render, screen } from "@testing-library/react";
import { TemplateFilters } from "@/components/templates/TemplateFilters";
import { createTemplate } from "@/test/fixtures";

const templates = [
	createTemplate(),
	createTemplate({
		id: "template-2",
		name: "demo-owner/backend-starter",
		config: {
			specialization: "backend",
			technologies: ["nestjs", "fastify"],
			languages: ["typescript", "rust"],
			metadata: {
				displayName: "Backend Starter",
				description: "Backend-focused starter template.",
				tags: ["api", "server"],
			},
		},
	}),
];

describe("TemplateFilters", () => {
	it("emits changes for search and official filters", async () => {
		const onChange = vi.fn();

		render(
			<TemplateFilters
				templates={templates}
				filters={{
					search: "",
					official: false,
					specialization: null,
					languages: [],
					technologies: [],
				}}
				onChange={onChange}
			/>,
		);

		fireEvent.change(
			screen.getByPlaceholderText(/search by name, description or tag/i),
			{ target: { value: "demo" } },
		);
		expect(onChange).toHaveBeenCalledWith(
			expect.objectContaining({ search: "demo" }),
		);

		fireEvent.click(screen.getByRole("button", { name: /official only/i }));
		expect(onChange).toHaveBeenCalledWith(
			expect.objectContaining({ official: true }),
		);
	});

	it("renders derived pills and allows specialization selection", async () => {
		const onChange = vi.fn();

		render(
			<TemplateFilters
				templates={templates}
				filters={{
					search: "",
					official: false,
					specialization: null,
					languages: [],
					technologies: [],
				}}
				onChange={onChange}
			/>,
		);

		expect(screen.getByRole("button", { name: "frontend" })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "backend" })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "nextjs" })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "rust" })).toBeInTheDocument();

		fireEvent.click(screen.getByRole("button", { name: "backend" }));
		expect(onChange).toHaveBeenCalledWith(
			expect.objectContaining({ specialization: "backend" }),
		);
	});

	it("clears dirty filters back to defaults", async () => {
		const onChange = vi.fn();

		render(
			<TemplateFilters
				templates={templates}
				filters={{
					search: "backend",
					official: true,
					specialization: "backend",
					languages: ["rust"],
					technologies: ["nestjs"],
				}}
				onChange={onChange}
			/>,
		);

		fireEvent.click(screen.getByRole("button", { name: /clear/i }));

		expect(onChange).toHaveBeenCalledWith({
			search: "",
			official: false,
			specialization: null,
			languages: [],
			technologies: [],
		});
	});
});
