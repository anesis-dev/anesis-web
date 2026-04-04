import { Suspense } from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import TemplateDetailsPage from "@/app/(main)/templates/[...templateRef]/page";
import { mockTemplate } from "@/test/fixtures";

vi.mock("@/hooks/useTemplate", () => ({
	useTemplate: vi.fn(),
}));

vi.mock("@/hooks/useTemplateReadme", () => ({
	useTemplateReadme: vi.fn(),
}));

vi.mock("@/components/templates/TemplateReadme", () => ({
	TemplateReadme: ({
		fileName,
		content,
	}: {
		fileName?: string;
		content?: string | null;
	}) => <div>{fileName ? `${fileName}:${content}` : "README unavailable"}</div>,
}));

vi.mock("@/components/templates/TemplateApiUrlButton", () => ({
	TemplateApiUrlButton: ({ templateRef }: { templateRef: string }) => (
		<button type="button">Copy {templateRef}</button>
	),
}));

import { useTemplate } from "@/hooks/useTemplate";
import { useTemplateReadme } from "@/hooks/useTemplateReadme";

describe("TemplateDetailsPage", () => {
	it("shows a not found state when the template cannot be loaded", async () => {
		vi.mocked(useTemplate).mockReturnValue({
			template: undefined,
			isLoading: false,
			isError: true,
		});
		vi.mocked(useTemplateReadme).mockReturnValue({
			readme: null,
			fileName: undefined,
			path: undefined,
			isLoading: false,
			isError: false,
			error: null,
		});

		await act(async () => {
			render(
				<Suspense fallback={null}>
					<TemplateDetailsPage
						params={Promise.resolve({
							templateRef: ["missing-repo%400.1.0"],
						})}
					/>
				</Suspense>,
			);
		});

		expect(await screen.findByText("Template not found")).toBeInTheDocument();
		expect(
			screen.getByText("missing-repo@0.1.0", { exact: false }),
		).toBeInTheDocument();
		expect(useTemplate).toHaveBeenCalledWith("missing-repo@0.1.0");
	});

	it("renders a package-style template page with quick start and readme content", async () => {
		vi.mocked(useTemplate).mockReturnValue({
			template: mockTemplate,
			isLoading: false,
			isError: false,
		});
		vi.mocked(useTemplateReadme).mockReturnValue({
			readme: "# Demo",
			fileName: "README.md",
			path: "template/README.md",
			isLoading: false,
			isError: false,
			error: null,
		});

		await act(async () => {
			render(
				<Suspense fallback={null}>
					<TemplateDetailsPage
						params={Promise.resolve({
							templateRef: ["demo-repo%400.1.0"],
						})}
					/>
				</Suspense>,
			);
		});

		expect(
			await screen.findByRole("heading", { name: "Demo Next Template" }),
		).toBeInTheDocument();
		expect(screen.getByText("Quick Start")).toBeInTheDocument();
		expect(
			screen.getByText("oxide new my-app demo-repo", { exact: false }),
		).toBeInTheDocument();
		expect(
			screen.getByText("oxide install-template demo-repo", { exact: false }),
		).toBeInTheDocument();
		expect(screen.getByText("Package Snapshot")).toBeInTheDocument();
		expect(screen.getByText("Package Metadata")).toBeInTheDocument();
		expect(screen.getByText("README.md:# Demo")).toBeInTheDocument();
		expect(
			screen.getAllByText("demo-repo@0.1.0", { exact: false }).length,
		).toBeGreaterThan(0);
		expect(screen.getByRole("button", { name: /copy demo-repo@0.1.0/i })).toBeInTheDocument();

		await waitFor(() =>
			expect(useTemplateReadme).toHaveBeenCalledWith(
				mockTemplate.config.repository.url,
			),
		);
	});
});
