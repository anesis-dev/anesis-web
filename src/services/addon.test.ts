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
  parseAddonsResponse: vi.fn(),
  parsePublishAddonResponse: vi.fn(),
}));

import { api } from "@/api/client";
import {
  parseAddonUrlResponse,
  parseAddonsResponse,
  parsePublishAddonResponse,
} from "@/lib/api-contracts";
import {
  deleteAddon,
  fetchAddon,
  fetchAddonUrl,
  fetchAddons,
  publishAddon,
  updateAddon,
  updateAddonOfficialStatus,
} from "@/services/addon";

describe("addon services", () => {
  it("fetches all addons through the public endpoint", async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: [] });
    vi.mocked(parseAddonsResponse).mockReturnValueOnce([
      { id: "addon-1" },
    ] as never);

    await expect(fetchAddons()).resolves.toEqual([{ id: "addon-1" }]);
    expect(api.get).toHaveBeenCalledWith("/addon/all");
    expect(parseAddonsResponse).toHaveBeenCalledWith({ data: [] });
  });

  it("fetches a single addon by ref from the public endpoint", async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: [] });
    vi.mocked(parseAddonsResponse).mockReturnValueOnce([
      { addon_id: "drizzle", version: "1.0.0", id: "addon-1" },
      { addon_id: "nest-drizzle", version: "1.1.0", id: "addon-2" },
    ] as never);

    await expect(fetchAddon("drizzle@1.0.0")).resolves.toEqual({
      addon_id: "drizzle",
      version: "1.0.0",
      id: "addon-1",
    });
    expect(api.get).toHaveBeenCalledWith("/addon/all");
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
      publishAddon("https://github.com/oxide-addons/drizzle/tree/main"),
    ).resolves.toEqual({
      message: "ok",
      addon_id: "drizzle",
    });
    expect(api.post).toHaveBeenCalledWith("/addon/publish", {
      url: "https://github.com/oxide-addons/drizzle/tree/main",
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
      updateAddon("https://github.com/oxide-addons/nest-drizzle/tree/main"),
    ).resolves.toBeUndefined();
    expect(api.patch).toHaveBeenCalledWith("/addon", {
      url: "https://github.com/oxide-addons/nest-drizzle/tree/main",
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
    vi.mocked(parseAddonsResponse).mockReturnValueOnce([] as never);

    await expect(fetchAddon("missing@1.0.0")).rejects.toThrow(
      'Addon "missing@1.0.0" was not found.',
    );
  });
});
