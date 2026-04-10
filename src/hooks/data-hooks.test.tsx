import { renderHook, waitFor } from "@testing-library/react";
import { createQueryClientWrapper, createTestQueryClient } from "@/test/render";
import {
  createAddon,
  mockGitHubUser,
  mockTemplate,
  mockUser,
} from "@/test/fixtures";

vi.mock("@/services/template", () => ({
  fetchTemplates: vi.fn(),
  fetchMyTemplates: vi.fn(),
  fetchTemplate: vi.fn(),
}));

vi.mock("@/services/addon", () => ({
  fetchAddons: vi.fn(),
  fetchAddon: vi.fn(),
  fetchMyAddons: vi.fn(),
}));

vi.mock("@/services/user", () => ({
  fetchAllUsers: vi.fn(),
}));

vi.mock("@/services/github", () => ({
  fetchTemplateReadme: vi.fn(),
  fetchGitHubUser: vi.fn(),
}));

import { fetchGitHubUser, fetchTemplateReadme } from "@/services/github";
import { fetchAddon, fetchAddons, fetchMyAddons } from "@/services/addon";
import { useAddon } from "@/hooks/useAddon";
import {
  fetchMyTemplates,
  fetchTemplate,
  fetchTemplates,
} from "@/services/template";
import { fetchAllUsers } from "@/services/user";
import { useAddons } from "@/hooks/useAddons";
import { useGitHubUser } from "@/hooks/useGitHubUser";
import { useMyAddons } from "@/hooks/useMyAddons";
import { useMyTemplates } from "@/hooks/useMyTemplates";
import { useTemplate } from "@/hooks/useTemplate";
import { useTemplateReadme } from "@/hooks/useTemplateReadme";
import { useTemplates } from "@/hooks/useTemplates";
import { useUsers } from "@/hooks/useUsers";

function getWrapper() {
  return createQueryClientWrapper(createTestQueryClient());
}

describe("data hooks", () => {
  it("loads templates", async () => {
    vi.mocked(fetchTemplates).mockResolvedValueOnce([mockTemplate]);

    const { result } = renderHook(() => useTemplates(), {
      wrapper: getWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.templates).toEqual([mockTemplate]);
    expect(fetchTemplates).toHaveBeenCalledTimes(1);
  });

  it("loads addons", async () => {
    const addon = createAddon();
    vi.mocked(fetchAddons).mockResolvedValueOnce([addon]);

    const { result } = renderHook(() => useAddons(), {
      wrapper: getWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.addons).toEqual([addon]);
    expect(fetchAddons).toHaveBeenCalledTimes(1);
  });

  it("loads a single addon by ref when a ref is provided", async () => {
    const addon = createAddon();
    vi.mocked(fetchAddon).mockResolvedValueOnce(addon);

    const { result } = renderHook(() => useAddon("drizzle@1.0.0"), {
      wrapper: getWrapper(),
    });

    await waitFor(() => expect(result.current.addon).toEqual(addon));
    expect(fetchAddon).toHaveBeenCalledWith("drizzle@1.0.0");
  });

  it("surfaces user loading failures", async () => {
    vi.mocked(fetchAllUsers).mockRejectedValueOnce(new Error("boom"));

    const { result } = renderHook(() => useUsers(), {
      wrapper: getWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.users).toEqual([]);
  });

  it("does not load my templates when disabled", async () => {
    const { result } = renderHook(() => useMyTemplates(false), {
      wrapper: getWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.templates).toEqual([]);
    expect(fetchMyTemplates).not.toHaveBeenCalled();
  });

  it("loads addons for the current user from the server", async () => {
    const owned = createAddon();
    vi.mocked(fetchMyAddons).mockResolvedValueOnce([owned]);

    const { result } = renderHook(() => useMyAddons(true), {
      wrapper: getWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.addons).toEqual([owned]);
    expect(fetchMyAddons).toHaveBeenCalledTimes(1);
  });

  it("loads a template by ref when a ref is provided", async () => {
    vi.mocked(fetchTemplate).mockResolvedValueOnce(mockTemplate);

    const { result } = renderHook(() => useTemplate("demo-repo@0.1.0"), {
      wrapper: getWrapper(),
    });

    await waitFor(() => expect(result.current.template).toEqual(mockTemplate));
    expect(fetchTemplate).toHaveBeenCalledWith("demo-repo@0.1.0");
  });

  it("maps readme payloads into the template readme shape", async () => {
    vi.mocked(fetchTemplateReadme).mockResolvedValueOnce({
      content: "# Demo",
      fileName: "README.md",
      path: "template/README.md",
    });

    const { result } = renderHook(
      () =>
        useTemplateReadme(
          "https://github.com/demo-owner/demo-repo/tree/main/template",
        ),
      {
        wrapper: getWrapper(),
      },
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.readme).toBe("# Demo");
    expect(result.current.fileName).toBe("README.md");
    expect(result.current.path).toBe("template/README.md");
  });

  it("loads github users on demand", async () => {
    vi.mocked(fetchGitHubUser).mockResolvedValueOnce(mockGitHubUser);

    const { result } = renderHook(() => useGitHubUser(mockUser.login), {
      wrapper: getWrapper(),
    });

    await waitFor(() =>
      expect(result.current.githubUser).toEqual(mockGitHubUser),
    );
    expect(fetchGitHubUser).toHaveBeenCalledWith("octocat");
  });
});
