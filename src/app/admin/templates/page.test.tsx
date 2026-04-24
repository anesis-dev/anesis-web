import { fireEvent, screen, waitFor } from "@testing-library/react";
import AdminTemplatesPage from "@/app/admin/templates/page";
import { renderWithQueryClient } from "@/test/render";
import { createTemplate } from "@/test/fixtures";

vi.mock("@/hooks/useTemplates", () => ({
	useTemplates: vi.fn(),
}));

vi.mock("@/hooks/useTemplateVersions", () => ({
	useTemplateVersions: vi.fn(),
}));

vi.mock("@/hooks/useAuth", () => ({
	useAuth: vi.fn(),
}));

vi.mock("@/services/template", () => ({
	deleteTemplate: vi.fn(),
	updateTemplateAsOfficial: vi.fn(),
	updateTemplateOfficialStatus: vi.fn(),
}));

import { useAuth } from "@/hooks/useAuth";
import { useTemplates } from "@/hooks/useTemplates";
import { useTemplateVersions } from "@/hooks/useTemplateVersions";
import {
	deleteTemplate,
	updateTemplateAsOfficial,
	updateTemplateOfficialStatus,
} from "@/services/template";

describe("AdminTemplatesPage", () => {
	beforeEach(() => {
		vi.mocked(useAuth).mockReturnValue({
			user: {
				id: "admin-user-id",
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
		vi.mocked(useTemplateVersions).mockReturnValue({
			versions: [],
			isLoading: false,
			isError: false,
		});
	});

	it("renders moderation controls and filters templates", async () => {
		const templates = Array.from({ length: 11 }, (_, index) =>
			createTemplate({
				id: `admin-template-${index + 1}`,
				owner_id: index < 5 ? "admin-user-id" : "other-user-id",
				name: `template-${index + 1}`,
				config: {
					specialization: index < 5 ? "backend" : "frontend",
					metadata: {
						displayName: `Admin Template ${index + 1}`,
						description: `Description ${index + 1}`,
						tags: [`tag-${index + 1}`],
					},
					author: {
						github: index < 5 ? "api-dev" : "ui-dev",
					},
				},
			}),
		);
		vi.mocked(useTemplates).mockReturnValue({
			templates,
			isLoading: false,
			isError: false,
		});
		renderWithQueryClient(<AdminTemplatesPage />);

		expect(
			screen.getByText(/template moderation actions/i),
		).toBeInTheDocument();
		expect(screen.getByText("11 total")).toBeInTheDocument();

		fireEvent.change(
			screen.getByPlaceholderText(/search by name, author or specialization/i),
			{ target: { value: "backend" } },
		);

		await waitFor(() =>
			expect(screen.getByText("5 / 11")).toBeInTheDocument(),
		);
		expect(screen.getByText("Admin Template 1")).toBeInTheDocument();
		expect(screen.queryByText("Admin Template 11")).not.toBeInTheDocument();
	});

	it("marks a community template as official through the version-status admin action", async () => {
		const template = createTemplate({
			id: "template-1",
			official: false,
			url: "https://github.com/demo-owner/community-template/tree/main/template",
			owner_id: "other-user-id",
			config: {
				metadata: {
					displayName: "Admin Template 1",
				},
			},
		});
		vi.mocked(useTemplates).mockReturnValue({
			templates: [template],
			isLoading: false,
			isError: false,
		});
		vi.mocked(updateTemplateOfficialStatus).mockResolvedValueOnce(undefined);

		const { queryClient } = renderWithQueryClient(<AdminTemplatesPage />);
		const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

		fireEvent.click(
			screen.getByRole("button", {
				name: /mark admin template 1 as official/i,
			}),
		);

		await waitFor(() =>
			expect(updateTemplateOfficialStatus).toHaveBeenCalledWith(
				"template-1",
				true,
			),
		);
		expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["templates"] });
		expect(
			screen.getByText(/admin template 1 v0\.1\.0 is now marked as official/i),
		).toBeInTheDocument();
	});

	it("refreshes a template through the admin official endpoint", async () => {
		const template = createTemplate({
			id: "template-3",
			url: "https://github.com/demo-owner/demo-repo/tree/main/template",
			official: true,
			owner_id: "admin-user-id",
			config: {
				metadata: {
					displayName: "Official Template",
				},
			},
		});
		vi.mocked(useTemplates).mockReturnValue({
			templates: [template],
			isLoading: false,
			isError: false,
		});
		vi.mocked(updateTemplateAsOfficial).mockResolvedValueOnce(undefined);

		const { queryClient } = renderWithQueryClient(<AdminTemplatesPage />);
		const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

		fireEvent.click(
			screen.getByRole("button", {
				name: /refresh official metadata for official template/i,
			}),
		);

		await waitFor(() =>
			expect(updateTemplateAsOfficial).toHaveBeenCalledWith(
				"https://github.com/demo-owner/demo-repo/tree/main/template",
			),
		);
		expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["templates"] });
		expect(
			screen.getByText(/refreshed from github and kept official/i),
		).toBeInTheDocument();
	});

	it("disables github refresh for templates the admin does not own", () => {
		const template = createTemplate({
			id: "template-4",
			owner_id: "other-user-id",
			config: {
				metadata: {
					displayName: "Community Template",
				},
			},
		});
		vi.mocked(useTemplates).mockReturnValue({
			templates: [template],
			isLoading: false,
			isError: false,
		});

		renderWithQueryClient(<AdminTemplatesPage />);

		expect(
			screen.getByRole("button", {
				name: /github refresh unavailable for community template/i,
			}),
		).toBeDisabled();
	});

	it("opens a version picker and updates a specific older version", async () => {
		const latest = createTemplate({
			id: "template-latest",
			name: "demo-repo",
			version: "0.3.0",
			versionCount: 3,
			official: true,
			config: {
				metadata: {
					displayName: "Demo Template",
				},
			},
		});
		const olderVersion = createTemplate({
			id: "template-older",
			name: "demo-repo",
			version: "0.2.0",
			official: false,
			config: {
				metadata: {
					displayName: "Demo Template",
				},
			},
		});

		vi.mocked(useTemplates).mockReturnValue({
			templates: [latest],
			isLoading: false,
			isError: false,
		});
		vi.mocked(useTemplateVersions).mockReturnValue({
			versions: [latest, olderVersion],
			isLoading: false,
			isError: false,
		});
		vi.mocked(updateTemplateOfficialStatus).mockResolvedValueOnce(undefined);

		const { queryClient } = renderWithQueryClient(<AdminTemplatesPage />);
		const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

		fireEvent.click(
			screen.getByRole("button", { name: /manage versions for demo template/i }),
		);

		expect(screen.getByText(/choose the exact published version/i)).toBeInTheDocument();
		expect(screen.getByText("v0.2.0")).toBeInTheDocument();

		fireEvent.click(
			screen.getByRole("button", { name: /mark version 0\.2\.0 as official/i }),
		);

		await waitFor(() =>
			expect(updateTemplateOfficialStatus).toHaveBeenCalledWith(
				"template-older",
				true,
			),
		);
		expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["templates"] });
		expect(
			screen.getByText(/demo template v0\.2\.0 is now marked as official/i),
		).toBeInTheDocument();
	});

	it("deletes a template through the admin dialog", async () => {
		const template = createTemplate({
			id: "template-2",
			name: "demo-repo",
			version: "1.2.3",
			config: {
				metadata: {
					displayName: "Admin Template 2",
				},
			},
		});
		vi.mocked(useTemplates).mockReturnValue({
			templates: [template],
			isLoading: false,
			isError: false,
		});
		vi.mocked(deleteTemplate).mockResolvedValueOnce(undefined);

		const { queryClient } = renderWithQueryClient(<AdminTemplatesPage />);
		const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

		fireEvent.click(
			screen.getByRole("button", {
				name: /delete admin template 2/i,
			}),
		);

		expect(screen.getByText(/demo-repo@1.2.3/i)).toBeInTheDocument();

		fireEvent.click(
			screen.getByRole("button", {
				name: /delete template/i,
			}),
		);

		await waitFor(() =>
			expect(deleteTemplate).toHaveBeenCalledWith("demo-repo@1.2.3"),
		);
		expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["templates"] });
		expect(screen.getByText(/was deleted from the registry/i)).toBeInTheDocument();
	});
});
