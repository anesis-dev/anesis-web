vi.mock("@/api/client", () => ({
    api: {
        get: vi.fn(),
        post: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
    },
}));

import { api } from "@/api/client";
import {
    deleteStack,
    fetchAllStacks,
    fetchMyStacks,
    fetchStack,
    fetchStacks,
    fetchStarredStacks,
    publishStack,
    starStack,
    updateStackOfficialStatus,
    updateStackVisibility,
} from "@/services/stack";

function sampleStack(overrides: Record<string, unknown> = {}) {
    return {
        id: "stack-uuid-1",
        owner_id: "owner-uuid-1",
        url: "https://github.com/anesis-dev/my-stack",
        stack_id: "acme/my-stack",
        name: "My Stack",
        description: "A template plus a curated set of addons.",
        commit_sha: "deadbeef",
        official: false,
        config: {
            schema_version: "1",
            id: "acme/my-stack",
            name: "My Stack",
            description: "A template plus a curated set of addons.",
            version: "1.0.0",
            author: { name: "Anesis", github: "anesis-dev" },
            template: "react-vite-ts",
            addons: [{ id: "drizzle", command: "install", inputs: {} }],
        },
        version: "1.0.0",
        versionCount: 1,
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-01T00:00:00Z",
        download_count: 10,
        unique_downloaders: 4,
        star_count: 2,
        is_starred: false,
        visibility: "public",
        ...overrides,
    };
}

describe("stack services", () => {
    it("fetches the public stack catalog page", async () => {
        vi.mocked(api.get).mockResolvedValueOnce({
            data: [sampleStack()],
            total: 1,
            page: 1,
            page_size: 20,
            total_pages: 1,
        });

        const result = await fetchStacks({ page: 1, pageSize: 20 });

        expect(api.get).toHaveBeenCalledWith("/stack/all?page=1&page_size=20");
        expect(result.data).toHaveLength(1);
        expect(result.data[0]?.stack_id).toBe("acme/my-stack");
        expect(result.data[0]?.config.addons[0]?.id).toBe("drizzle");
        expect(result.totalPages).toBe(1);
    });

    it("fetches the authenticated user's stacks", async () => {
        vi.mocked(api.get).mockResolvedValueOnce({
            data: [sampleStack()],
            total: 1,
            page: 1,
            page_size: 20,
            total_pages: 1,
        });

        const result = await fetchMyStacks();
        expect(api.get).toHaveBeenCalledWith("/stack/my?page=1&page_size=20");
        expect(result.data[0]?.owner_id).toBe("owner-uuid-1");
    });

    it("fetches starred stacks", async () => {
        vi.mocked(api.get).mockResolvedValueOnce({
            data: [sampleStack()],
            total: 1,
            page: 1,
            page_size: 20,
            total_pages: 1,
        });

        const result = await fetchStarredStacks();
        expect(api.get).toHaveBeenCalledWith(
            "/stack/starred?page=1&page_size=20",
        );
        expect(result.data[0]?.is_starred).toBe(false);
    });

    it("fetches every stack page for profile filtering", async () => {
        vi.mocked(api.get)
            .mockResolvedValueOnce({
                data: [sampleStack({ stack_id: "acme/one" })],
                total: 2,
                page: 1,
                page_size: 100,
                total_pages: 2,
            })
            .mockResolvedValueOnce({
                data: [sampleStack({ stack_id: "acme/two" })],
                total: 2,
                page: 2,
                page_size: 100,
                total_pages: 2,
            });

        const all = await fetchAllStacks();

        expect(all.map((s) => s.stack_id)).toEqual(["acme/one", "acme/two"]);
        expect(api.get).toHaveBeenNthCalledWith(
            1,
            "/stack/all?page=1&page_size=100",
        );
        expect(api.get).toHaveBeenNthCalledWith(
            2,
            "/stack/all?page=2&page_size=100",
        );
    });

    it("fetches a single stack by ref", async () => {
        vi.mocked(api.get).mockResolvedValueOnce(sampleStack());

        const stack = await fetchStack("acme/my-stack");
        expect(api.get).toHaveBeenCalledWith("/stack/acme%2Fmy-stack");
        expect(stack.name).toBe("My Stack");
        expect(stack.config.template).toBe("react-vite-ts");
    });

    it("rejects a stack payload missing a required field instead of returning undefined", async () => {
        const broken = sampleStack();
        delete (broken as Record<string, unknown>).stack_id;
        vi.mocked(api.get).mockResolvedValueOnce(broken);

        await expect(fetchStack("acme/my-stack")).rejects.toThrow(/stack_id/);
    });

    it("publishes a stack url", async () => {
        vi.mocked(api.post).mockResolvedValueOnce({
            message: "Published",
            stack_id: "acme/my-stack",
        });

        await expect(
            publishStack("https://github.com/anesis-dev/my-stack"),
        ).resolves.toEqual({ message: "Published", stack_id: "acme/my-stack" });
        expect(api.post).toHaveBeenCalledWith("/stack/publish", {
            url: "https://github.com/anesis-dev/my-stack",
            visibility: "public",
        });
    });

    it("stars a stack", async () => {
        vi.mocked(api.post).mockResolvedValueOnce({
            is_starred: true,
            star_count: 3,
        });

        await expect(starStack("acme/my-stack")).resolves.toEqual({
            is_starred: true,
            star_count: 3,
        });
        expect(api.post).toHaveBeenCalledWith(
            "/stack/acme%2Fmy-stack/star",
            {},
        );
    });

    it("updates official status", async () => {
        vi.mocked(api.patch).mockResolvedValueOnce(undefined);

        await updateStackOfficialStatus("stack-uuid-1", true);
        expect(api.patch).toHaveBeenCalledWith(
            "/stack/stack-uuid-1/official?official=true",
        );
    });

    it("updates visibility", async () => {
        vi.mocked(api.patch).mockResolvedValueOnce(undefined);

        await updateStackVisibility("stack-uuid-1", "private");
        expect(api.patch).toHaveBeenCalledWith(
            "/stack/stack-uuid-1/visibility",
            {
                visibility: "private",
            },
        );
    });

    it("deletes a stack by id and version", async () => {
        vi.mocked(api.delete).mockResolvedValueOnce(undefined);

        await deleteStack("acme/my-stack", "1.0.0");
        expect(api.delete).toHaveBeenCalledWith("/stack/acme%2Fmy-stack/1.0.0");
    });
});
