import { act, renderHook, waitFor } from "@testing-library/react";
import { createQueryClientWrapper, createTestQueryClient } from "@/test/render";
import { createTemplate, mockUser } from "@/test/fixtures";

vi.mock("@/hooks/useAuth", () => ({
	useAuth: vi.fn(),
}));

vi.mock("@/services/sessions", () => ({
	fetchSessions: vi.fn(),
}));

vi.mock("@/services/auth", () => ({
	switchAccountRequest: vi.fn(),
	removeSessionRequest: vi.fn(),
}));

vi.mock("@/services/template", () => ({
	fetchStarredTemplates: vi.fn(),
	fetchTemplateVersions: vi.fn(),
}));

vi.mock("@/services/addon", () => ({
	fetchStarredAddons: vi.fn(),
}));

vi.mock("@/services/addon-manifest", () => ({
	fetchAddonManifest: vi.fn(),
}));

import { useAuth } from "@/hooks/useAuth";
import { fetchSessions } from "@/services/sessions";
import { removeSessionRequest } from "@/services/auth";
import {
	fetchStarredTemplates,
	fetchTemplateVersions,
} from "@/services/template";
import { fetchStarredAddons } from "@/services/addon";
import { fetchAddonManifest } from "@/services/addon-manifest";
import { useSessions } from "@/hooks/useSessions";
import { useStarredTemplates } from "@/hooks/useStarredTemplates";
import { useStarredAddons } from "@/hooks/useStarredAddons";
import { useTemplateVersions } from "@/hooks/useTemplateVersions";
import { useAddonManifest } from "@/hooks/useAddonManifest";

function getWrapper() {
	return createQueryClientWrapper(createTestQueryClient());
}

function asLoggedIn() {
	vi.mocked(useAuth).mockReturnValue({
		user: mockUser,
		isLoading: false,
		login: vi.fn(),
		logout: vi.fn(),
	} as unknown as ReturnType<typeof useAuth>);
}

function asGuest() {
	vi.mocked(useAuth).mockReturnValue({
		user: undefined,
		isLoading: false,
		login: vi.fn(),
		logout: vi.fn(),
	} as unknown as ReturnType<typeof useAuth>);
}

describe("sessions hook", () => {
	it("loads sessions for a logged-in user", async () => {
		asLoggedIn();
		vi.mocked(fetchSessions).mockResolvedValueOnce([{ id: "s-1" }] as never);

		const { result } = renderHook(() => useSessions(), {
			wrapper: getWrapper(),
		});

		await waitFor(() => expect(result.current.isLoading).toBe(false));
		expect(result.current.sessions).toEqual([{ id: "s-1" }]);
	});

	it("does not load sessions for a guest", async () => {
		asGuest();

		const { result } = renderHook(() => useSessions(), {
			wrapper: getWrapper(),
		});

		await waitFor(() => expect(result.current.isLoading).toBe(false));
		expect(result.current.sessions).toEqual([]);
		expect(fetchSessions).not.toHaveBeenCalled();
	});

	it("removes a session through the service", async () => {
		asLoggedIn();
		vi.mocked(fetchSessions).mockResolvedValue([] as never);
		vi.mocked(removeSessionRequest).mockResolvedValue(undefined as never);

		const { result } = renderHook(() => useSessions(), {
			wrapper: getWrapper(),
		});

		await waitFor(() => expect(result.current.isLoading).toBe(false));

		await act(async () => {
			result.current.removeSession("octocat");
		});
		await waitFor(() =>
			expect(removeSessionRequest).toHaveBeenCalledWith("octocat"),
		);
	});
});

describe("starred hooks", () => {
	it("loads starred templates with pagination", async () => {
		vi.mocked(fetchStarredTemplates).mockResolvedValueOnce({
			data: [createTemplate()],
			total: 1,
			page: 1,
			pageSize: 12,
			totalPages: 1,
		});

		const { result } = renderHook(() => useStarredTemplates(), {
			wrapper: getWrapper(),
		});

		await waitFor(() => expect(result.current.isLoading).toBe(false));
		expect(result.current.templates).toHaveLength(1);
		expect(result.current.pagination.total).toBe(1);
	});

	it("does not load starred addons when disabled", async () => {
		const { result } = renderHook(() => useStarredAddons(false), {
			wrapper: getWrapper(),
		});

		await waitFor(() => expect(result.current.isLoading).toBe(false));
		expect(result.current.addons).toEqual([]);
		expect(fetchStarredAddons).not.toHaveBeenCalled();
	});
});

describe("template versions hook", () => {
	it("returns versions sorted in descending semver order", async () => {
		vi.mocked(fetchTemplateVersions).mockResolvedValueOnce([
			createTemplate({ id: "v1", version: "0.1.0" }),
			createTemplate({ id: "v3", version: "1.2.0" }),
			createTemplate({ id: "v2", version: "0.9.0" }),
		]);

		const { result } = renderHook(() => useTemplateVersions("demo-repo"), {
			wrapper: getWrapper(),
		});

		await waitFor(() => expect(result.current.versions).toHaveLength(3));
		expect(result.current.versions.map((t) => t.version)).toEqual([
			"1.2.0",
			"0.9.0",
			"0.1.0",
		]);
		expect(fetchTemplateVersions).toHaveBeenCalledWith("demo-repo");
	});

	it("does not fetch versions without a template name", async () => {
		const { result } = renderHook(() => useTemplateVersions(""), {
			wrapper: getWrapper(),
		});

		await waitFor(() => expect(result.current.isLoading).toBe(false));
		expect(fetchTemplateVersions).not.toHaveBeenCalled();
	});
});

describe("addon manifest hook", () => {
	it("loads the manifest for a repository url", async () => {
		const manifest = { id: "drizzle", name: "Drizzle" };
		vi.mocked(fetchAddonManifest).mockResolvedValueOnce(manifest as never);

		const { result } = renderHook(
			() => useAddonManifest("https://github.com/owner/repo"),
			{ wrapper: getWrapper() },
		);

		await waitFor(() => expect(result.current.manifest).toEqual(manifest));
		expect(fetchAddonManifest).toHaveBeenCalledWith(
			"https://github.com/owner/repo",
		);
	});

	it("does not load the manifest without a url", async () => {
		const { result } = renderHook(() => useAddonManifest(""), {
			wrapper: getWrapper(),
		});

		await waitFor(() => expect(result.current.isLoading).toBe(false));
		expect(fetchAddonManifest).not.toHaveBeenCalled();
	});
});
