    import { render, screen } from "@testing-library/react";

    vi.mock("@/services/schema", () => ({
    	fetchTemplateSchema: vi.fn(),
    }));

    vi.mock("@/config/env", () => ({
    	env: {
    		apiUrl: "http://api.example.test",
    	},
    }));

    import DocsReferencePage from "@/app/(main)/docs/reference/page";
    import { fetchTemplateSchema } from "@/services/schema";

    describe("DocsReferencePage", () => {
    	it("renders the schema preview and current local path reference", async () => {
    		vi.mocked(fetchTemplateSchema).mockResolvedValueOnce(`{\n  "title": "oxide"\n}`);

    		render(await DocsReferencePage());

    		expect(
    			screen.getByRole("heading", { name: /supported stacks and local paths/i }),
    		).toBeInTheDocument();
    		expect(screen.getByText('{ "title": "oxide" }', { exact: false })).toBeInTheDocument();
    		expect(screen.getByText(/oxide\.lock/i)).toBeInTheDocument();
    		expect(screen.getByRole("link", { name: /view raw schema/i })).toHaveAttribute(
    			"href",
    			"http://api.example.test/schema/oxide.template.schema.json",
    		);
    	});

    	it("falls back when the schema preview cannot be loaded", async () => {
    		vi.mocked(fetchTemplateSchema).mockRejectedValueOnce(new Error("boom"));

    		render(await DocsReferencePage());

    		expect(
    			screen.getByText(/schema preview is unavailable right now/i),
    		).toBeInTheDocument();
    	});
    });
