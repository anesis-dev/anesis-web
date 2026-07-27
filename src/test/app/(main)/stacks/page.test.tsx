import { generateMetadata } from "@/app/(main)/stacks/[stackRef]/page";
import { metadata as stacksMetadata } from "@/app/(main)/stacks/page";
import { metadata as builderMetadata } from "@/app/(main)/builder/page";
import { createStack } from "@/test/fixtures";

vi.mock("@/services/stack", () => ({
	fetchStack: vi.fn(),
	fetchStacks: vi.fn(),
}));

import { fetchStack } from "@/services/stack";

describe("stacks route metadata", () => {
	it("gives the listing a title, description and canonical URL", () => {
		expect(stacksMetadata.title).toBe("Stacks");
		expect(stacksMetadata.description).toBeTruthy();
		expect(stacksMetadata.alternates?.canonical).toBe("/stacks");
	});

	it("gives the builder its own title", () => {
		expect(builderMetadata.title).toBe("Stack builder");
		expect(builderMetadata.description).toBeTruthy();
	});

	it("builds per-stack metadata from the fetched stack", async () => {
		vi.mocked(fetchStack).mockResolvedValue(createStack());

		const metadata = await generateMetadata({
			params: Promise.resolve({ stackRef: "nest-saas" }),
		});

		expect(metadata.title).toBe("Nest SaaS — Anesis stack");
		expect(metadata.description).toBe("NestJS + Prisma + Docker, wired together.");
		expect(metadata.alternates?.canonical).toBe("/stacks/nest-saas");
	});

	it("decodes an encoded stack reference before fetching it", async () => {
		vi.mocked(fetchStack).mockResolvedValue(createStack());

		await generateMetadata({
			params: Promise.resolve({ stackRef: "nest%2Fsaas" }),
		});

		expect(fetchStack).toHaveBeenCalledWith("nest/saas");
	});

	it("falls back to a description when the stack has none", async () => {
		vi.mocked(fetchStack).mockResolvedValue(createStack({ description: "" }));

		const metadata = await generateMetadata({
			params: Promise.resolve({ stackRef: "nest-saas" }),
		});

		expect(metadata.description).toContain("Nest SaaS");
	});

	it("returns an unresolved-metadata fallback when the fetch fails", async () => {
		vi.mocked(fetchStack).mockRejectedValue(new Error("registry down"));

		const metadata = await generateMetadata({
			params: Promise.resolve({ stackRef: "nest-saas" }),
		});

		expect(metadata.title).toBeTruthy();
		expect(metadata.robots).toMatchObject({ index: false });
	});
});
