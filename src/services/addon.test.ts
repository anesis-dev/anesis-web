vi.mock("@/api/client", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("@/lib/api-contracts", () => ({
  parseAddonUrlResponse: vi.fn(),
  parseAddonsPageResponse: vi.fn(),
  parsePublishAddonResponse: vi.fn(),
}));

import { api } from "@/api/client";
import {
  parseAddonUrlResponse,
  parseAddonsPageResponse,
  parsePublishAddonResponse,
} from "@/lib/api-contracts";
import {
  deleteAddon,
  fetchAddon,
  fetchAddonUrl,
  fetchAllAddons,
  fetchAddons,
  fetchMyAddons,
  publishAddon,
  updateAddon,
  updateAddonOfficialStatus,
} from "@/services/addon";

describe("addon services", () => {
  it("fetches all addons through the public endpoint", async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: [] });
    vi.mocked(parseAddonsPageResponse).mockReturnValueOnce({
      data: [{ id: "addon-1" }],
      total: 18,
      page: 2,
      pageSize: 9,
      totalPages: 2,
    } as never);

    await expect(fetchAddons({ page: 2, pageSize: 9 })).resolves.toEqual({
      data: [{ id: "addon-1" }],
      total: 18,
      page: 2,
      pageSize: 9,
      totalPages: 2,
    });
    expect(api.get).toHaveBeenCalledWith("/addon/all?page=2&page_size=9");
    expect(parseAddonsPageResponse).toHaveBeenCalledWith({ data: [] });
  });

  it("fetches every public addon page for profile filtering", async () => {
    vi.mocked(api.get)
      .mockResolvedValueOnce({ data: ["page-1"] })
      .mockResolvedValueOnce({ data: ["page-2"] });
    vi.mocked(parseAddonsPageResponse)
      .mockReturnValueOnce({
        data: [{ id: "addon-1" }],
        total: 2,
        page: 1,
        pageSize: 100,
        totalPages: 2,
      } as never)
      .mockReturnValueOnce({
        data: [{ id: "addon-2" }],
        total: 2,
        page: 2,
        pageSize: 100,
        totalPages: 2,
      } as never);

    await expect(fetchAllAddons()).resolves.toEqual([
      { id: "addon-1" },
      { id: "addon-2" },
    ]);
    expect(api.get).toHaveBeenNthCalledWith(1, "/addon/all?page=1&page_size=100");
    expect(api.get).toHaveBeenNthCalledWith(2, "/addon/all?page=2&page_size=100");
  });

  it("fetches the authenticated user's addons", async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: [] });
    vi.mocked(parseAddonsPageResponse).mockReturnValueOnce({
      data: [{ id: "owned-addon" }],
      total: 1,
      page: 1,
      pageSize: 6,
      totalPages: 1,
    } as never);

    await expect(fetchMyAddons({ page: 1, pageSize: 6 })).resolves.toEqual({
      data: [{ id: "owned-addon" }],
      total: 1,
      page: 1,
      pageSize: 6,
      totalPages: 1,
    });
    expect(api.get).toHaveBeenCalledWith("/addon/my?page=1&page_size=6");
  });

  it("fetches a single addon by ref from the public endpoint", async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: [] });
    vi.mocked(parseAddonsPageResponse).mockReturnValueOnce({
      data: [
        { addon_id: "drizzle", version: "1.0.0", id: "addon-1" },
        { addon_id: "nest-drizzle", version: "1.1.0", id: "addon-2" },
      ],
      total: 2,
      page: 1,
      pageSize: 100,
      totalPages: 1,
    } as never);

    await expect(fetchAddon("drizzle@1.0.0")).resolves.toEqual({
      addon_id: "drizzle",
      version: "1.0.0",
      id: "addon-1",
    });
    expect(api.get).toHaveBeenCalledWith("/addon/all?page=1&page_size=100");
  });

  it("fetches the authenticated addon archive url", async () => {
    vi.mocked(api.get).mockResolvedValueOnce({
      archive_url: "https://api.example.test/addon.tar.gz",
      commit_sha: "abc123",
    });
    vi.mocked(parseAddonUrlResponse).mockReturnValueOnce({
      archive_url: "https://api.example.test/addon.tar.gz",
      commit_sha: "abc123",
    });

    await expect(fetchAddonUrl("drizzle")).resolves.toEqual({
      archive_url: "https://api.example.test/addon.tar.gz",
      commit_sha: "abc123",
    });
    expect(api.get).toHaveBeenCalledWith("/addon/drizzle/url");
  });

  it("publishes addon urls through the publish endpoint", async () => {
    vi.mocked(api.post).mockResolvedValueOnce({ message: "ok" });
    vi.mocked(parsePublishAddonResponse).mockReturnValueOnce({
      message: "ok",
      addon_id: "drizzle",
    });

    await expect(
      publishAddon("https://github.com/anesis-addons/drizzle/tree/main"),
    ).resolves.toEqual({
      message: "ok",
      addon_id: "drizzle",
    });
    expect(api.post).toHaveBeenCalledWith("/addon/publish", {
      url: "https://github.com/anesis-addons/drizzle/tree/main",
      organization_id: null,
      visibility: "public",
    });
  });

  it("deletes an addon by id and version", async () => {
    vi.mocked(api.delete).mockResolvedValueOnce(undefined);

    await expect(deleteAddon("drizzle", "1.0.0")).resolves.toBeUndefined();
    expect(api.delete).toHaveBeenCalledWith("/addon/drizzle/1.0.0");
  });

  it("updates addon metadata through the patch endpoint", async () => {
    vi.mocked(api.patch).mockResolvedValueOnce(undefined);

    await expect(
      updateAddon("https://github.com/anesis-addons/nest-drizzle/tree/main"),
    ).resolves.toBeUndefined();
    expect(api.patch).toHaveBeenCalledWith("/addon", {
      url: "https://github.com/anesis-addons/nest-drizzle/tree/main",
      organization_id: null,
    });
  });

  it("updates addon official status through the admin endpoint", async () => {
    vi.mocked(api.patch).mockResolvedValueOnce(undefined);

    await expect(
      updateAddonOfficialStatus("addon-uuid", true),
    ).resolves.toBeUndefined();
    expect(api.patch).toHaveBeenCalledWith(
      "/addon/addon-uuid/official?official=true",
    );
  });

  it("throws when an addon ref is not found in the public list", async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: [] });
    vi.mocked(parseAddonsPageResponse).mockReturnValueOnce({
      data: [],
      total: 0,
      page: 1,
      pageSize: 100,
      totalPages: 0,
    } as never);

    await expect(fetchAddon("missing@1.0.0")).rejects.toThrow(
      'Addon "missing@1.0.0" was not found.',
    );
  });
});
