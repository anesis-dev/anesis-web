import { NextRequest } from "next/server";
import { GET } from "@/app/api/template-readme/route";

vi.mock("@/config/env", () => ({
	env: {
		apiUrl: "http://api.example.test",
	},
}));

describe("GET /api/template-readme", () => {
	it("returns 400 when template url is missing", async () => {
		const response = await GET(
			new NextRequest("http://localhost/api/template-readme"),
		);

		expect(response.status).toBe(400);
		await expect(response.json()).resolves.toEqual({
			message: "Missing template URL.",
		});
	});

	it("returns readme content when github exposes it", async () => {
		vi.spyOn(global, "fetch")
			.mockResolvedValueOnce(
				new Response(
					JSON.stringify([
						{
							name: "README.md",
							path: "template/README.md",
							download_url: "https://raw.githubusercontent.com/demo/readme.md",
							url: "https://api.github.com/repos/demo-owner/demo-repo/contents/template/README.md?ref=main",
							type: "file",
						},
					]),
					{ status: 200 },
				),
			)
			.mockResolvedValueOnce(
				new Response(
					JSON.stringify({
						name: "README.md",
						path: "template/README.md",
						type: "file",
						encoding: "base64",
						content: Buffer.from("# Demo README", "utf8").toString("base64"),
						download_url: "https://raw.githubusercontent.com/demo/readme.md",
					}),
					{ status: 200 },
				),
			);

		const response = await GET(
			new NextRequest(
				"http://localhost/api/template-readme?url=https://github.com/demo-owner/demo-repo/tree/main/template",
			),
		);

		expect(response.status).toBe(200);
		await expect(response.json()).resolves.toEqual({
			content: "# Demo README",
			fileName: "README.md",
			path: "template/README.md",
		});
		expect(global.fetch).toHaveBeenNthCalledWith(
			2,
			"https://api.github.com/repos/demo-owner/demo-repo/contents/template/README.md?ref=main",
			expect.objectContaining({
				headers: expect.objectContaining({
					Accept: "application/vnd.github+json",
					"User-Agent": "anesis-web",
				}),
			}),
		);
	});

	it("returns content:null when no readme exists", async () => {
		vi.spyOn(global, "fetch").mockResolvedValueOnce(
			new Response(
				JSON.stringify([
					{
						name: "package.json",
						path: "template/package.json",
						download_url: "https://example.com/package.json",
						type: "file",
					},
				]),
				{ status: 200 },
			),
		);

		const response = await GET(
			new NextRequest(
				"http://localhost/api/template-readme?url=https://github.com/demo-owner/demo-repo/tree/main/template",
			),
		);

		expect(response.status).toBe(200);
		await expect(response.json()).resolves.toEqual({ content: null });
	});

	it("loads templated readmes when the template ships README.md.tera", async () => {
		vi.spyOn(global, "fetch")
			.mockResolvedValueOnce(
				new Response(
					JSON.stringify([
						{
							name: "README.md.tera",
							path: "template/README.md.tera",
							download_url: "https://raw.githubusercontent.com/demo/readme.md.tera",
							type: "file",
						},
					]),
					{ status: 200 },
				),
			)
			.mockResolvedValueOnce(
				new Response("# {{ project_name }}", { status: 200 }),
			);

		const response = await GET(
			new NextRequest(
				"http://localhost/api/template-readme?url=https://github.com/demo-owner/demo-repo/tree/main/template",
			),
		);

		expect(response.status).toBe(200);
		await expect(response.json()).resolves.toEqual({
			content: "# {{ project_name }}",
			fileName: "README.md.tera",
			path: "template/README.md.tera",
		});
	});

	it("passes through github contents errors", async () => {
		vi.spyOn(global, "fetch").mockResolvedValueOnce(
			new Response(null, { status: 502 }),
		);

		const response = await GET(
			new NextRequest(
				"http://localhost/api/template-readme?url=https://github.com/demo-owner/demo-repo/tree/main/template",
			),
		);

		expect(response.status).toBe(502);
		await expect(response.json()).resolves.toEqual({
			message: "Failed to load template contents from GitHub.",
		});
	});
});
