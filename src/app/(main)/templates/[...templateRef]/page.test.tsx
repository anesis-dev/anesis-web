import { Suspense } from "react";
import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import TemplateDetailsPage from "@/app/(main)/templates/[...templateRef]/page";
import { createTemplate, mockTemplate } from "@/test/fixtures";
import { renderWithQueryClient } from "@/test/render";

vi.mock("@/hooks/useAuth", () => ({
	useAuth: vi.fn(),
}));

vi.mock("@/hooks/useTemplate", () => ({
	useTemplate: vi.fn(),
}));

vi.mock("@/hooks/useTemplateVersions", () => ({
	useTemplateVersions: vi.fn(),
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

vi.mock("@/services/template", async () => {
	const actual = await vi.importActual<typeof import("@/services/template")>(
		"@/services/template",
	);

	return {
		...actual,
		updateTemplateOfficialStatus: vi.fn(),
	};
});

import { useAuth } from "@/hooks/useAuth";
import { useTemplate } from "@/hooks/useTemplate";
import { useTemplateVersions } from "@/hooks/useTemplateVersions";
import { useTemplateReadme } from "@/hooks/useTemplateReadme";
import { updateTemplateOfficialStatus } from "@/services/template";

describe("TemplateDetailsPage", () => {
	beforeEach(() => {
		vi.mocked(useAuth).mockReturnValue({
			user: null,
			isLoading: false,
			login: vi.fn(),
			logout: vi.fn(),
		});
	});

	it("shows a not found state when the template cannot be loaded", async () => {
		vi.mocked(useTemplate).mockReturnValue({
			template: undefined,
			isLoading: false,
			isError: true,
		});
		vi.mocked(useTemplateVersions).mockReturnValue({
			versions: [],
			isLoading: false,
			isError: false,
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
			renderWithQueryClient(
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
		vi.mocked(useTemplateVersions).mockReturnValue({
			versions: [
				mockTemplate,
				createTemplate({
					id: "older-template-version",
					name: "demo-repo",
					version: "0.0.9",
				}),
			],
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
			renderWithQueryClient(
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
			screen.getByText("anesis new my-app demo-repo", { exact: false }),
		).toBeInTheDocument();
		expect(
			screen.getByText("anesis template install demo-repo", { exact: false }),
		).toBeInTheDocument();
		expect(screen.getByText("Package Snapshot")).toBeInTheDocument();
		expect(screen.getByText("Package Metadata")).toBeInTheDocument();
		expect(screen.getByText("Versions")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /v0\.1\.0/i })).toBeInTheDocument();
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

	it("lets an admin mark the current version as official", async () => {
		const template = createTemplate({
			id: "uuid-template-version",
			official: false,
			version: "0.1.0",
		});

		vi.mocked(useAuth).mockReturnValue({
			user: {
				id: "admin-id",
				login: "admin",
				github_id: 1,
				avatar_url: "https://example.com/avatar.png",
				role: "admin",
				created_at: "2026-01-01T00:00:00Z",
			},
			isLoading: false,
			login: vi.fn(),
			logout: vi.fn(),
		});
		vi.mocked(useTemplate).mockReturnValue({
			template,
			isLoading: false,
			isError: false,
		});
		vi.mocked(useTemplateVersions).mockReturnValue({
			versions: [template],
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
		vi.mocked(updateTemplateOfficialStatus).mockResolvedValueOnce(undefined);

		let queryClient!: ReturnType<typeof renderWithQueryClient>["queryClient"];

		await act(async () => {
			({ queryClient } = renderWithQueryClient(
				<Suspense fallback={null}>
					<TemplateDetailsPage
						params={Promise.resolve({
							templateRef: ["demo-repo%400.1.0"],
						})}
					/>
				</Suspense>,
			));
		});

		const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

		fireEvent.click(
			await screen.findByRole("button", { name: /mark version 0\.1\.0 as official/i }),
		);

		await waitFor(() =>
			expect(updateTemplateOfficialStatus).toHaveBeenCalledWith(
				"uuid-template-version",
				true,
			),
		);
		expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["templates"] });
		expect(
			screen.getByText(/version 0\.1\.0 is now marked as official/i),
		).toBeInTheDocument();
	});
});
