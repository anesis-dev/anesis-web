import { NextRequest } from "next/server";
import { GET } from "@/app/api/addon-manifest/route";

vi.mock("@/config/env", () => ({
  env: {
    apiUrl: "http://api.example.test",
  },
}));

describe("GET /api/addon-manifest", () => {
  it("returns 400 when addon url is missing", async () => {
    const response = await GET(
      new NextRequest("http://localhost/api/addon-manifest"),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      message: "Missing addon URL.",
    });
  });

  it("returns parsed manifest content when github exposes anesis.addon.json", async () => {
    vi.spyOn(global, "fetch")
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            name: "anesis.addon.json",
            path: "addons/drizzle/anesis.addon.json",
            download_url:
              "https://raw.githubusercontent.com/demo/anesis.addon.json",
            type: "file",
          }),
          { status: 200 },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            schema_version: "1.0",
            id: "drizzle",
            name: "Drizzle ORM",
            version: "1.0.0",
            description: "Adds Drizzle ORM scaffolding helpers.",
            author: "anesis-addons",
            requires: [],
            inputs: [],
            detect: [],
            variants: [
              {
                when: null,
                commands: [
                  {
                    name: "install",
                    description: "Install Drizzle support.",
                    once: false,
                    requires_commands: [],
                    inputs: [],
                    steps: [{ type: "run" }],
                  },
                ],
              },
            ],
          }),
          { status: 200 },
        ),
      );

    const response = await GET(
      new NextRequest(
        "http://localhost/api/addon-manifest?url=https://github.com/anesis-addons/drizzle/tree/main/addons/drizzle",
      ),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      id: "drizzle",
      name: "Drizzle ORM",
      variants: [
        {
          commands: [
            {
              name: "install",
              description: "Install Drizzle support.",
            },
          ],
        },
      ],
    });
  });

  it("passes through github manifest lookup errors", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce(
      new Response(null, { status: 502 }),
    );

    const response = await GET(
      new NextRequest(
        "http://localhost/api/addon-manifest?url=https://github.com/anesis-addons/drizzle/tree/main/addons/drizzle",
      ),
    );

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toEqual({
      message: "Failed to load addon manifest from GitHub.",
    });
  });
});
